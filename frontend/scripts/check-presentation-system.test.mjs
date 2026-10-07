import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { validatePresentationSystem } from "./check-presentation-system.mjs";

const roots = [];

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "prep-presentation-"));
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

describe("presentation system enforcement", () => {
  it("accepts tokenized colors and typography", () => {
    const root = fixture({
      "src/app/styles.css":
        ".view { color: var(--prep-color-text); font-size: var(--prep-type-body); }",
      "src/ui/primitives.css":
        ".button { background: var(--prep-color-accent); font-size: inherit; }",
    });

    expect(validatePresentationSystem(root)).toEqual([]);
  });

  it("rejects local color and font-size literals", () => {
    const root = fixture({
      "src/app/styles.css":
        ".view { color: #123456; font-size: 14px; }",
      "src/ui/primitives.css":
        ".button { background: rgb(1 2 3 / 20%); font-size: 0.75rem; }",
    });

    expect(validatePresentationSystem(root)).toEqual([
      'src/app/styles.css: raw color "#123456" must be defined in presentation/tokens.css',
      'src/app/styles.css: font-size "14px" must use a --prep-type-* token',
      'src/ui/primitives.css: raw color "rgb(1 2 3 / 20%)" must be defined in presentation/tokens.css',
      'src/ui/primitives.css: font-size "0.75rem" must use a --prep-type-* token',
    ]);
  });
});
