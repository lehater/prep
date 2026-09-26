import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(SCRIPT_DIR, "..");
const SRC_ROOT = path.join(WEB_ROOT, "src");
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".mts", ".ts", ".tsx"]);
const RENDERER_PACKAGES = ["react-force-graph-3d", "three", "three-spritetext"];
const PROVIDER_PREFIXES = ["@mui/", "@emotion/"];

function normalize(value) {
  return value.split(path.sep).join("/");
}

function sourceFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...sourceFiles(absolute));
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(absolute);
    }
  }
  return files;
}

export function extractImportSpecifiers(source) {
  const specifiers = new Set();
  const patterns = [
    /\b(?:import|export)\s+(?:[^"'();]*?\s+from\s+)?["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
    /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      specifiers.add(match[1]);
    }
  }
  return [...specifiers];
}

function targetPath(importerRelative, specifier) {
  if (!specifier.startsWith(".")) {
    return null;
  }
  const importerAbsolute = path.join(WEB_ROOT, importerRelative);
  return normalize(
    path.relative(WEB_ROOT, path.resolve(path.dirname(importerAbsolute), specifier)),
  );
}

function isUnder(value, root) {
  return value === root || value.startsWith(`${root}/`);
}

function isProviderImport(specifier) {
  return PROVIDER_PREFIXES.some((prefix) => specifier.startsWith(prefix));
}

function isRendererPackage(specifier) {
  return RENDERER_PACKAGES.some(
    (packageName) => specifier === packageName || specifier.startsWith(`${packageName}/`),
  );
}

export function checkImport(importerRelative, specifier) {
  const importer = normalize(importerRelative);
  const target = targetPath(importer, specifier);
  const violations = [];

  if (
    isUnder(importer, "src/features") &&
    target !== null &&
    isUnder(target, "src/adapters")
  ) {
    violations.push("features must depend on frontend-owned ports, not concrete adapters");
  }

  const crossFeature = [
    ["src/features/learning", "src/features/curation"],
    ["src/features/curation", "src/features/learning"],
  ];
  for (const [from, to] of crossFeature) {
    if (isUnder(importer, from) && target !== null && isUnder(target, to)) {
      violations.push("Learning and Curation internals must not import each other");
    }
  }

  if (
    isRendererPackage(specifier) &&
    !isUnder(importer, "src/adapters/graph-rfg3d")
  ) {
    violations.push("renderer packages are private to adapters/graph-rfg3d");
  }

  if (
    target !== null &&
    isUnder(target, "src/adapters/http") &&
    /(?:^|\/)(?:dto|dtos|transport)(?:\/|\.|$)/i.test(target) &&
    !isUnder(importer, "src/adapters/http")
  ) {
    violations.push("raw HTTP DTO modules are private to adapters/http");
  }

  if (
    isUnder(importer, "src/adapters/graph-rfg3d") &&
    target !== null &&
    isUnder(target, "src/adapters/http")
  ) {
    violations.push("renderer adapter must not depend on transport adapter modules");
  }

  if (
    /\/(?:model|ports|projection)(?:\/|$)/.test(`/${importer}`) &&
    isProviderImport(specifier)
  ) {
    violations.push("frontend model/port/projection modules must not import UI providers");
  }

  if (
    isUnder(importer, "src/ui/patterns") &&
    target !== null &&
    isUnder(target, "src/features")
  ) {
    violations.push("shared UI patterns must not import feature-owned state or internals");
  }

  return violations;
}

export function checkSourceTree() {
  const violations = [];
  for (const absolute of sourceFiles(SRC_ROOT)) {
    const importer = normalize(path.relative(WEB_ROOT, absolute));
    const source = fs.readFileSync(absolute, "utf8");
    for (const specifier of extractImportSpecifiers(source)) {
      for (const reason of checkImport(importer, specifier)) {
        violations.push({ importer, specifier, reason });
      }
    }
  }
  return violations;
}

function main() {
  const violations = checkSourceTree();
  if (violations.length > 0) {
    for (const violation of violations) {
      console.error(`${violation.importer}: ${violation.specifier} -> ${violation.reason}`);
    }
    process.exitCode = 1;
    return;
  }
  console.log("Frontend boundary check PASS");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
