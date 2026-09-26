import { describe, expect, test } from "vitest";

import type { GraphScene } from "../../features/knowledge-explorer/projection/graphScene";
import { toRendererGraphData } from "./rendererGraphData";

const scene: GraphScene = {
  nodes: [
    {
      knowledgeId: "isolation",
      label: "Resource isolation",
      semanticKind: "concept",
      selected: true,
      focused: false,
      highlighted: false,
    },
    {
      knowledgeId: "contention",
      label: "Resource contention",
      semanticKind: "concept",
      selected: false,
      focused: false,
      highlighted: false,
    },
  ],
  edges: [
    {
      relationId: "r1",
      sourceKnowledgeId: "isolation",
      targetKnowledgeId: "contention",
      relationType: "addresses",
    },
  ],
};

describe("RFG3D graph data mapping", () => {
  test("copies semantic identity and direction into adapter-private objects", () => {
    const data = toRendererGraphData(scene);

    expect(data.nodes.map((node) => node.id)).toEqual([
      "isolation",
      "contention",
    ]);
    expect(data.links[0]).toMatchObject({
      id: "r1",
      source: "isolation",
      target: "contention",
      relationType: "addresses",
    });
  });

  test("renderer geometry mutations cannot enter GraphScene", () => {
    const data = toRendererGraphData(scene);

    data.nodes[0].x = 42;
    data.nodes[0].y = -7;
    data.nodes[0].z = 3;

    expect(scene.nodes[0]).not.toHaveProperty("x");
    expect(scene.nodes[0]).not.toHaveProperty("y");
    expect(scene.nodes[0]).not.toHaveProperty("z");
  });
});
