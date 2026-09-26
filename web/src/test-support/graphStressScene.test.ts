import { describe, expect, test } from "vitest";

import { createGraphStressScene } from "./graphStressScene";

describe("graph stress fixtures", () => {
  test.each([
    [1_000, 5_000],
    [2_000, 10_000],
    [5_000, 25_000],
  ])("creates %i nodes and %i typed edges", (nodes, edges) => {
    const scene = createGraphStressScene(nodes, edges);

    expect(scene.nodes).toHaveLength(nodes);
    expect(scene.edges).toHaveLength(edges);
    expect(
      scene.edges.every(
        (edge) =>
          edge.relationType === "addresses" || edge.relationType === "realizes",
      ),
    ).toBe(true);
  });
});
