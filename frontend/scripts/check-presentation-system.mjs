import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GOVERNED_STYLESHEETS = [
  "src/app/styles.css",
  "src/ui/primitives.css",
];

const RAW_COLOR_PATTERN =
  /(?:#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\))/gu;
const FONT_SIZE_PATTERN = /font-size\s*:\s*([^;]+);/gu;

export function validatePresentationSystem(projectRoot) {
  const violations = [];

  for (const relativePath of GOVERNED_STYLESHEETS) {
    const absolutePath = path.join(projectRoot, relativePath);
    if (!fs.existsSync(absolutePath)) {
      violations.push(`${relativePath}: governed stylesheet is missing`);
      continue;
    }

    const source = fs.readFileSync(absolutePath, "utf8");

    for (const match of source.matchAll(RAW_COLOR_PATTERN)) {
      violations.push(
        `${relativePath}: raw color "${match[0]}" must be defined in presentation/tokens.css`,
      );
    }

    for (const match of source.matchAll(FONT_SIZE_PATTERN)) {
      const value = match[1]?.trim() ?? "";
      if (
        value !== "inherit" &&
        !/^var\(--prep-type-[a-z0-9-]+\)$/u.test(value)
      ) {
        violations.push(
          `${relativePath}: font-size "${value}" must use a --prep-type-* token`,
        );
      }
    }
  }

  return violations;
}

function main() {
  const projectRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  const violations = validatePresentationSystem(projectRoot);

  if (violations.length > 0) {
    console.error("Presentation system violations:");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Presentation system PASS");
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  main();
}
