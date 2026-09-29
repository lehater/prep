import { describe, expect, test } from "vitest";

import { buildGraphScene } from "../../features/knowledge-explorer/projection/graphScene";
import { MockCurationStore } from "./MockCurationStore";
import { MockKnowledgeAdapter } from "./MockKnowledgeAdapter";
import {
  HARNESS_KNOWLEDGE_REVISION,
  harnessKnowledgeFixtureNodes,
  harnessKnowledgeFixtureRelations,
  harnessKnowledgeProjectedNodes,
  harnessKnowledgeProjectedRelations,
  harnessKnowledgeProjectionLosses,
} from "./mockHarnessKnowledgeFixture";

function harnessStore(): MockCurationStore {
  const store = new MockCurationStore("empty");
  store.knowledgeNodes.push(...harnessKnowledgeProjectedNodes);
  store.knowledgeRelations.push(...harnessKnowledgeProjectedRelations);
  store.targets.push({
    id: "harness-study",
    name: "Understand Harness",
    definition:
      "Understand Harness engineering-knowledge ownership, production and assurance mechanisms.",
    scopeItems: [],
  });
  store.capabilities.push({
    id: "cap-harness-semantic-assurance",
    title: "Harness semantic assurance",
    performanceExpectation:
      "Explain how Harness preserves and evaluates engineering semantics across source, admission and derivation boundaries.",
    conditionSummary:
      "Given the current Harness semantic-assurance architecture and its explicit trust boundaries.",
    criterionSummary:
      "Distinguish deterministic accounting from local semantic judgement and preserve provenance/currentness boundaries.",
    knowledgeIds: [
      "harness.semantic.acceptance",
      "harness.semantic.admission",
      "harness.semantic.assertion",
      "harness.semantic.surface-admission",
      "harness.semantic.derivation",
      "harness.semantic.judgement",
      "harness.lifecycle.capability-currentness",
      "harness.semantic.closure",
      "harness.source.set",
      "harness.source.boundary",
      "harness.source.statement-enumeration-review",
      "harness.source.coverage",
    ],
  });
  store.targetCapabilityIds.set("harness-study", [
    "cap-harness-semantic-assurance",
  ]);
  return store;
}

describe("Harness Knowledge corpus spike", () => {
  test("pins one real Harness revision and preserves source-backed semantic identities", () => {
    expect(HARNESS_KNOWLEDGE_REVISION).toBe(
      "bdec95ddf2e5fb9f4a5359c93ceb285917237f3b",
    );
    expect(harnessKnowledgeFixtureNodes).toHaveLength(36);
    expect(
      new Set(harnessKnowledgeFixtureNodes.map((node) => node.id)).size,
    ).toBe(harnessKnowledgeFixtureNodes.length);
    expect(
      harnessKnowledgeFixtureNodes.every(
        (node) => node.sources.length > 0 && node.summary.trim().length > 0,
      ),
    ).toBe(true);
  });

  test("keeps every relation source-backed and inside the selected node corpus", () => {
    const nodeIds = new Set(harnessKnowledgeFixtureNodes.map((node) => node.id));

    expect(harnessKnowledgeFixtureRelations).toHaveLength(64);
    expect(
      new Set(harnessKnowledgeFixtureRelations.map((relation) => relation.id))
        .size,
    ).toBe(harnessKnowledgeFixtureRelations.length);
    expect(
      harnessKnowledgeFixtureRelations.every(
        (relation) =>
          nodeIds.has(relation.sourceId) &&
          nodeIds.has(relation.targetId) &&
          relation.sources.length > 0,
      ),
    ).toBe(true);
    expect(
      harnessKnowledgeFixtureRelations.some(
        (relation) => relation.evidenceMode === "extracted",
      ),
    ).toBe(true);
    expect(
      harnessKnowledgeFixtureRelations.some(
        (relation) => relation.evidenceMode === "curated",
      ),
    ).toBe(true);
  });

  test("projects only semantics the current frontend relation model can represent honestly", () => {
    expect(harnessKnowledgeProjectedRelations).toHaveLength(15);
    expect(harnessKnowledgeProjectionLosses).toHaveLength(49);

    expect(
      new Set(harnessKnowledgeProjectedRelations.map((relation) => relation.type)),
    ).toEqual(new Set(["part_of", "realizes", "produces"]));

    for (const predicate of [
      "requires",
      "evaluates",
      "represents",
      "owns",
      "blocks",
      "addressed_to",
      "tests",
    ]) {
      expect(
        harnessKnowledgeProjectionLosses.some(
          (relation) => relation.predicate === predicate,
        ),
      ).toBe(true);
    }

    expect(
      harnessKnowledgeProjectionLosses.some(
        (relation) => relation.condition !== undefined,
      ),
    ).toBe(true);
  });

  test("works end-to-end through the existing global list/search/detail/graph port", async () => {
    const adapter = new MockKnowledgeAdapter("success", harnessStore());

    const list = await adapter.list(
      { kind: "global" },
      { search: "semantic" },
    );
    expect(list.status).toBe("success");
    if (list.status === "success") {
      expect(list.value.totalCount).toBeGreaterThanOrEqual(6);
      expect(list.value.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "harness.semantic.derivation" }),
          expect.objectContaining({ id: "harness.semantic.acceptance" }),
        ]),
      );
    }

    const detail = await adapter.get(
      { kind: "global" },
      "harness.semantic.derivation",
    );
    expect(detail).toEqual({
      status: "success",
      value: expect.objectContaining({
        id: "harness.semantic.derivation",
        title: "Semantic Derivation",
      }),
    });

    const graph = await adapter.graph({ kind: "global" });
    expect(graph.status).toBe("success");
    if (graph.status === "success") {
      expect(graph.value.nodes).toHaveLength(36);
      expect(graph.value.relations).toHaveLength(15);

      const scene = buildGraphScene(graph.value, {
        selectedKnowledgeId: "harness.semantic.derivation",
        focusedKnowledgeIds: ["harness.semantic.derivation"],
      });
      expect(scene.nodes.some((node) => node.focused)).toBe(true);
      expect(
        scene.edges.every(
          (edge) =>
            ["part_of", "realizes", "produces"].includes(edge.relationType),
        ),
      ).toBe(true);
    }
  });

  test("supports target/focus scoped exploration without confusing Harness CapabilityId with Prep learner capability", async () => {
    const adapter = new MockKnowledgeAdapter("success", harnessStore());

    const targetGraph = await adapter.graph({
      kind: "target",
      targetId: "harness-study",
    });
    expect(targetGraph.status).toBe("success");
    if (targetGraph.status === "success") {
      expect(targetGraph.value.nodes).toHaveLength(12);
      expect(
        targetGraph.value.nodes.some(
          (node) => node.id === "harness.core.capability-id",
        ),
      ).toBe(false);
    }

    const focusGraph = await adapter.graph({
      kind: "target",
      targetId: "harness-study",
      focusId: "focus-cap-harness-semantic-assurance",
    });
    expect(focusGraph.status).toBe("success");
    if (focusGraph.status === "success") {
      expect(focusGraph.value.nodes).toHaveLength(12);
      expect(
        focusGraph.value.nodes.some(
          (node) => node.id === "harness.semantic.derivation",
        ),
      ).toBe(true);
    }
  });
});
