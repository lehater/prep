import { describe, expect, test } from "vitest";

import { graphPreferencesForProfile } from "./graphPresentation";

describe("graph presentation profiles", () => {
  test("quality preserves richer effects", () => {
    expect(graphPreferencesForProfile("quality")).toEqual({
      labels: "normal",
      arrowheads: true,
      particles: true,
      physics: "on",
      nodeDetail: "normal",
    });
  });

  test("performance removes expensive decoration without semantic settings", () => {
    expect(graphPreferencesForProfile("performance")).toEqual({
      labels: "focused-only",
      arrowheads: false,
      particles: false,
      physics: "settle-and-pause",
      nodeDetail: "reduced",
    });
  });
});
