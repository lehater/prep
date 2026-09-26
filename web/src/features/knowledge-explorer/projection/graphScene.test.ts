import { describe, expect, test } from "vitest";

import type { KnowledgeGraphModel } from "../model/knowledge";
import { buildGraphScene } from "./graphScene";

const graph: KnowledgeGraphModel = {
  scope: { kind: "target", targetId: "target-1" },
  nodes: [
    {
      id: "problem",
      semanticKind: "concept",
      title: "Resource contention",
      summary: "A problem.",
    },
    {
      id: "idea",
      semanticKind: "concept",
      title: "Resource isolation",
      summary: "An idea.",
    },
    {
      id: "implementation",
      semanticKind: "concept",
      title: "Linux cgroups",
      summary: "A realization.",
    },
  ],
  relations: [
    {
      id: "r1",
      sourceId: "idea",
      targetId: "problem",
      type: "addresses",
    },
    {
      id: "r2",
      sourceId: "implementation",
      targetId: "idea",
      type: "realizes",
    },
  ],
};

describe("buildGraphScene", () => {
  test("preserves canonical identity and relation direction without renderer geometry", () => {
    const scene = buildGraphScene(graph, { selectedKnowledgeId: "idea" });

    expect(scene.edges).toEqual([
      {
        relationId: "r1",
        sourceKnowledgeId: "idea",
        targetKnowledgeId: "problem",
        relationType: "addresses",
      },
      {
        relationId: "r2",
        sourceKnowledgeId: "implementation",
        targetKnowledgeId: "idea",
        relationType: "realizes",
      },
    ]);
    expect(scene.nodes.find((node) => node.knowledgeId === "idea")?.selected).toBe(
      true,
    );
    expect(scene.nodes[0]).not.toHaveProperty("x");
    expect(scene.nodes[0]).not.toHaveProperty("y");
    expect(scene.nodes[0]).not.toHaveProperty("z");
  });

  test("focus is a bounded one-hop projection and relation filters remain semantic", () => {
    const scene = buildGraphScene(graph, {
      focusedKnowledgeIds: ["idea"],
      relationTypes: ["addresses"],
    });

    expect(scene.nodes.map((node) => node.knowledgeId).sort()).toEqual([
      "idea",
      "problem",
    ]);
    expect(scene.edges.map((edge) => edge.relationType)).toEqual(["addresses"]);
  });
});
