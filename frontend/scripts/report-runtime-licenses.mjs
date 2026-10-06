import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lock = JSON.parse(
  fs.readFileSync(path.join(root, "package-lock.json"), "utf8"),
);

const runtimePackages = Object.entries(lock.packages ?? {})
  .filter(([packagePath, metadata]) => packagePath.startsWith("node_modules/") && metadata.dev !== true)
  .map(([packagePath, metadata]) => ({
    name: packagePath.slice("node_modules/".length),
    version: metadata.version ?? "UNKNOWN",
    license: metadata.license ?? "UNKNOWN",
  }))
  .sort((left, right) => left.name.localeCompare(right.name));

const missing = runtimePackages.filter((item) => item.license === "UNKNOWN");

console.log("Frontend runtime dependency license evidence:");
for (const item of runtimePackages) {
  console.log(`- ${item.name}@${item.version}: ${item.license}`);
}

if (missing.length > 0) {
  console.error("Runtime dependency license metadata is incomplete.");
  process.exitCode = 1;
}
