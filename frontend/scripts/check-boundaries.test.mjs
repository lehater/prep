import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { validateSourceTree } from "./check-boundaries.mjs";

const roots = [];

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "prep-boundary-"));
  roots.push(root);

  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, "utf8");
  }

  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe("frontend dependency boundaries", () => {
  it("allows a feature to depend on its own modules and shared presentation", () => {
    const root = fixture({
      "features/target/index.ts": 'import "./private"; import "../../ui/Text";',
      "features/target/private.ts": "export const value = 1;",
      "ui/Text.ts": "export const Text = 1;",
    });

    expect(validateSourceTree(root)).toEqual([]);
  });

  it("rejects feature imports of adapters and other feature private modules", () => {
    const root = fixture({
      "features/target/index.ts":
        'import "../../adapters/mock"; import "../activity/private";',
      "features/activity/private.ts": "export const value = 1;",
      "adapters/mock.ts": "export const value = 1;",
    });

    expect(validateSourceTree(root)).toEqual([
      'features/target/index.ts: "../../adapters/mock" violates boundary: task feature must not import a concrete adapter',
      'features/target/index.ts: "../activity/private" violates boundary: task feature must not import another feature\'s private module',
    ]);
  });

  it("rejects shared presentation importing task state", () => {
    const root = fixture({
      "ui/Text.ts": 'import "../features/target/private";',
      "features/target/private.ts": "export const value = 1;",
    });

    expect(validateSourceTree(root)).toEqual([
      'ui/Text.ts: "../features/target/private" violates boundary: shared presentation must not depend on task/application/provider state',
    ]);
  });
});
