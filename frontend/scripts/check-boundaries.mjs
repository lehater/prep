import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as ts from "typescript";

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

const ACCEPTED_FEATURE_OWNERS = new Set([
  "target-direction",
  "target",
  "current-position",
  "knowledge-explorer",
  "activity",
  "evidence-change",
  "preparation-support",
]);

const FORBIDDEN_EXTERNAL_IMPORTS = [
  "three",
  "react-force-graph-3d",
];

const SHARED_PRESENTATION_CLASS_TOKENS = new Set([
  "task-heading",
  "section-heading",
  "primary-action",
  "secondary-action",
  "text-action",
  "action-row",
  "field",
  "outcome-message",
  "data-table-column-resizer",
  "resizable-split-handle",
  "workspace-divider",
  "knowledge-column-resizer",
]);

function isForbiddenExternalImport(specifier) {
  return FORBIDDEN_EXTERNAL_IMPORTS.some(
    (packageName) =>
      specifier === packageName || specifier.startsWith(`${packageName}/`),
  );
}

function walkFiles(root) {
  const files = [];

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const absolute = path.join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(absolute));
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(absolute);
    }
  }

  return files;
}

function moduleSpecifiers(sourceText, fileName) {
  const source = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith(".tsx") || fileName.endsWith(".jsx")
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.TS,
  );
  const values = [];

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      values.push(node.moduleSpecifier.text);
    }

    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      values.push(node.arguments[0].text);
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
  return values;
}

function sharedPresentationViolations(sourceText, relativePath, module) {
  if (module.layer !== "feature") {
    return [];
  }

  const violations = [];

  if (/<table(?:\s|>)/u.test(sourceText)) {
    violations.push(
      `${relativePath}: task feature must compose shared DataTable instead of declaring a raw <table>`,
    );
  }

  const literalClassTokens = new Set(
    Array.from(
      sourceText.matchAll(/className\\s*=\\s*["']([^"']*)["']/gu),
      (match) => match[1]?.split(/\\s+/u).filter(Boolean) ?? [],
    ).flat(),
  );

  for (const token of SHARED_PRESENTATION_CLASS_TOKENS) {
    if (literalClassTokens.has(token)) {
      violations.push(
        `${relativePath}: shared presentation class "${token}" must be owned through its ui primitive`,
      );
    }
  }

  return violations;
}

function describeModule(relativePath) {
  const parts = relativePath.split(path.sep).filter(Boolean);
  const root = parts[0] ?? "";

  if (root === "features") {
    const owner = parts[1] ?? "";
    if (owner === "contracts" || owner === "contracts.ts") {
      return { layer: "feature-contracts", owner: "", publicContract: true };
    }

    const leaf = parts[2] ?? "";
    return {
      layer: "feature",
      owner,
      publicContract:
        leaf === "contract" ||
        leaf === "contract.ts" ||
        leaf === "contract.tsx",
    };
  }

  if (root === "app" || root === "adapters" || root === "ui" || root === "test-support") {
    return { layer: root, owner: "", publicContract: false };
  }

  return { layer: "unknown", owner: "", publicContract: false };
}

function normalizeInternalTarget(sourceRoot, fromFile, specifier) {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const absolute = path.resolve(path.dirname(fromFile), specifier);
  const relative = path.relative(sourceRoot, absolute);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return { escaped: true, relative };
  }

  return { escaped: false, relative };
}

function edgeViolation(from, to) {
  if (from.layer === "feature") {
    if (to.layer === "adapters") {
      return "task feature must not import a concrete adapter";
    }
    if (to.layer === "app") {
      return "task feature must not depend on application composition";
    }
    if (
      to.layer === "feature" &&
      from.owner !== to.owner &&
      !to.publicContract
    ) {
      return "task feature may depend on another feature only through its public contract";
    }
  }

  if (from.layer === "feature-contracts") {
    if (to.layer !== "unknown" && to.layer !== "feature-contracts") {
      return "shared semantic contracts must remain dependency-free from app, feature, adapter, or UI ownership";
    }
  }

  if (
    from.layer === "ui" &&
    ["app", "feature", "feature-contracts", "adapters"].includes(to.layer)
  ) {
    return "shared presentation must not depend on task/application/provider state";
  }

  if (from.layer === "adapters") {
    if (to.layer === "app" || to.layer === "ui") {
      return "adapter must depend on consumer contracts rather than composition/presentation";
    }
    if (to.layer === "feature" && !to.publicContract) {
      return "adapter may depend on task features only through their public contracts";
    }
  }

  return null;
}

export function validateSourceTree(sourceRoot) {
  const violations = [];

  if (!fs.existsSync(sourceRoot)) {
    return violations;
  }

  for (const file of walkFiles(sourceRoot)) {
    const fromRelative = path.relative(sourceRoot, file);
    const from = describeModule(fromRelative);
    const sourceText = fs.readFileSync(file, "utf8");

    violations.push(
      ...sharedPresentationViolations(sourceText, fromRelative, from),
    );

    if (
      from.layer === "feature" &&
      from.owner &&
      !ACCEPTED_FEATURE_OWNERS.has(from.owner)
    ) {
      violations.push(
        `${fromRelative}: feature owner "${from.owner}" is not an accepted task-feature root`,
      );
    }

    for (const specifier of moduleSpecifiers(sourceText, file)) {
      if (isForbiddenExternalImport(specifier)) {
        violations.push(
          `${fromRelative}: external import "${specifier}" is forbidden in the nonspatial prototype baseline`,
        );
        continue;
      }

      const target = normalizeInternalTarget(sourceRoot, file, specifier);
      if (!target) {
        continue;
      }

      if (target.escaped) {
        violations.push(
          `${fromRelative}: relative import "${specifier}" escapes the frontend source root`,
        );
        continue;
      }

      const to = describeModule(target.relative);
      const reason = edgeViolation(from, to);

      if (reason) {
        violations.push(
          `${fromRelative}: "${specifier}" violates boundary: ${reason}`,
        );
      }
    }
  }

  return violations;
}

function main() {
  const sourceRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../src",
  );
  const violations = validateSourceTree(sourceRoot);

  if (violations.length > 0) {
    console.error("Frontend dependency boundary violations:");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Frontend dependency boundaries PASS");
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  main();
}
