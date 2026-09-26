import { describe, expect, test } from "vitest";

import type { GraphScene } from "../../features/knowledge-explorer/projection/graphScene";
import { createGraphStressScene } from "../../test-support/graphStressScene";
import {
  DEFAULT_GRAPH_RENDER_PREFERENCES,
  resolveGraphRenderStrategy,
} from "./graphRenderStrategy";

const smallScene: GraphScene = {
  nodes: [
    {
      knowledgeId: "a",
      label: "A",
      semanticKind: "concept",
      selected: false,
      focused: false,
      highlighted: false,
    },
    {
      knowledgeId: "b",
      label: "B",
      semanticKind: "concept",
      selected: false,
      focused: false,
      highlighted: false,
    },
  ],
  edges: [
    {
      relationId: "r",
      sourceKnowledgeId: "a",
      targetKnowledgeId: "b",
      relationType: "addresses",
    },
  ],
};

describe("graph render strategy", () => {
  test("keeps a small auto graph on the standard path", () => {
    expect(
      resolveGraphRenderStrategy(
        smallScene,
        "auto",
        DEFAULT_GRAPH_RENDER_PREFERENCES,
      ),
    ).toMatchObject({
      family: "standard",
      useInstancedNodes: false,
      useBatchedLinks: false,
      arrowheads: true,
      particles: false,
      physics: "on",
    });
  });

  test("degrades a large auto graph without changing GraphScene", () => {
    const scene = createGraphStressScene(2_000, 10_000);
    const before = JSON.stringify(scene);
    const strategy = resolveGraphRenderStrategy(
      scene,
      "auto",
      DEFAULT_GRAPH_RENDER_PREFERENCES,
    );

    expect(strategy).toMatchObject({
      family: "optimized",
      useInstancedNodes: true,
      useBatchedLinks: true,
      labels: "focused-only",
      arrowheads: false,
      particles: false,
      physics: "on",
      maxPixelRatio: 1,
    });
    expect(JSON.stringify(scene)).toBe(before);
  });

  test("quality and performance profiles are explicit and renderer-only", () => {
    const quality = resolveGraphRenderStrategy(
      smallScene,
      "quality",
      {
        ...DEFAULT_GRAPH_RENDER_PREFERENCES,
        particles: true,
        physics: "on",
      },
    );
    const performance = resolveGraphRenderStrategy(
      smallScene,
      "performance",
      {
        ...DEFAULT_GRAPH_RENDER_PREFERENCES,
        particles: true,
        physics: "on",
      },
    );

    expect(quality.family).toBe("standard");
    expect(quality.particles).toBe(true);
    expect(quality.physics).toBe("on");
    expect(performance.family).toBe("optimized");
    expect(performance.particles).toBe(false);
    expect(performance.physics).toBe("on");
  });

  test("preserves an explicitly requested settle-and-pause policy", () => {
    const strategy = resolveGraphRenderStrategy(
      smallScene,
      "performance",
      {
        ...DEFAULT_GRAPH_RENDER_PREFERENCES,
        physics: "settle-and-pause",
      },
    );
    expect(strategy.physics).toBe("settle-and-pause");
  });
});
