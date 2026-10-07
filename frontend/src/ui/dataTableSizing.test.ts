import { describe, expect, it } from "vitest";

import { resolveDataTableWidths } from "./dataTableSizing";

describe("resolveDataTableWidths", () => {
  const columns = [
    { minWidth: 180, maxWidth: 1600, flex: 1 },
    { minWidth: 100, maxWidth: 320 },
    { minWidth: 52, maxWidth: 140 },
  ] as const;

  it("lets the flex column consume remaining grid width", () => {
    expect(resolveDataTableWidths(columns, [420, 140, 80], 1000)).toEqual([
      780,
      140,
      80,
    ]);
  });

  it("returns space to the flex column when a fixed column shrinks", () => {
    const before = resolveDataTableWidths(columns, [420, 180, 100], 1000);
    const after = resolveDataTableWidths(columns, [420, 120, 100], 1000);

    expect(before).toEqual([720, 180, 100]);
    expect(after).toEqual([780, 120, 100]);
  });

  it("takes space from the flex column when a fixed column grows", () => {
    expect(resolveDataTableWidths(columns, [420, 280, 140], 1000)).toEqual([
      580,
      280,
      140,
    ]);
  });

  it("stops shrinking the flex column at minWidth and allows overflow", () => {
    expect(resolveDataTableWidths(columns, [420, 320, 140], 500)).toEqual([
      180,
      320,
      140,
    ]);
  });

  it("stops growing the flex column at maxWidth", () => {
    expect(resolveDataTableWidths(columns, [420, 100, 52], 2000)).toEqual([
      1600,
      100,
      52,
    ]);
  });
});
