import assert from "node:assert/strict";
import test from "node:test";

import { checkImport, extractImportSpecifiers } from "./check-boundaries.mjs";

test("extracts static and dynamic imports", () => {
  assert.deepEqual(
    extractImportSpecifiers(`
      import thing from "./thing";
      export { other } from "../other";
      const lazy = import("three");
    `).sort(),
    ["../other", "./thing", "three"],
  );
});

test("rejects feature to concrete adapter dependencies", () => {
  assert.ok(
    checkImport("src/features/learning/ui/view.tsx", "../../../adapters/mock/client").length > 0,
  );
});

test("rejects direct Learning to Curation internals", () => {
  assert.ok(
    checkImport("src/features/learning/ui/view.tsx", "../../curation/editor").length > 0,
  );
});

test("keeps renderer providers inside graph-rfg3d", () => {
  assert.ok(checkImport("src/features/knowledge-explorer/ui/Graph.tsx", "three").length > 0);
  assert.deepEqual(checkImport("src/adapters/graph-rfg3d/renderer.ts", "three"), []);
});

test("keeps UI providers out of semantic model boundaries", () => {
  assert.ok(
    checkImport("src/features/knowledge-explorer/model/Knowledge.ts", "@mui/material").length > 0,
  );
});

test("keeps shared UI patterns independent of features", () => {
  assert.ok(
    checkImport("src/ui/patterns/FailurePanel.tsx", "../../features/learning/state").length > 0,
  );
});
