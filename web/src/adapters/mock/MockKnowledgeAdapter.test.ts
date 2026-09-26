import { describe, expect, test } from "vitest";

import { KNOWLEDGE_RELATION_TYPES } from "../../features/knowledge-explorer/model/knowledge";

import { MockKnowledgeAdapter } from "./MockKnowledgeAdapter";
import { PREPARED_TARGET_ID } from "./mockFixtures";
import {
  knowledgeGraphMockNodes,
  knowledgeGraphMockRelations,
} from "./mockKnowledgeGraphFixture";
import {
  donorKnowledgeNodes,
  donorKnowledgeRelations,
} from "./mockPaymentKnowledgeFixture";

describe("MockKnowledgeAdapter", () => {
  test("searches through the consumer-owned port inside an explicit target scope", async () => {
    const adapter = new MockKnowledgeAdapter();

    const outcome = await adapter.list(
      { kind: "target", targetId: PREPARED_TARGET_ID },
      { search: "cgroups" },
    );

    expect(outcome.status).toBe("success");
    if (outcome.status === "success") {
      expect(outcome.value.totalCount).toBeGreaterThan(0);
      expect(outcome.value.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "linux-cgroups",
            semanticKind: "concept",
          }),
        ]),
      );
      expect(
        outcome.value.items.some((node) => node.id === "linux-server-hardening"),
      ).toBe(false);
    }
  });

  test("keeps the existing payment corpus and adds two real Knowledge Graph groups in global scope", async () => {
    const adapter = new MockKnowledgeAdapter();

    expect(donorKnowledgeNodes.length).toBeGreaterThanOrEqual(35);
    expect(
      donorKnowledgeRelations.every((relation) =>
        new Set(donorKnowledgeNodes.map((node) => node.id)).has(relation.sourceId) &&
        new Set(donorKnowledgeNodes.map((node) => node.id)).has(relation.targetId),
      ),
    ).toBe(true);

    expect(KNOWLEDGE_RELATION_TYPES).toEqual([
      "addresses",
      "uses",
      "specializes",
      "part_of",
      "depends_on",
      "realizes",
      "produces",
      "derives_from",
      "enables",
    ]);

    expect(knowledgeGraphMockNodes).toHaveLength(35);
    expect(new Set(knowledgeGraphMockNodes.map((node) => node.id)).size).toBe(
      knowledgeGraphMockNodes.length,
    );

    const fixtureIds = new Set(knowledgeGraphMockNodes.map((node) => node.id));
    expect(
      knowledgeGraphMockRelations.every(
        (relation) =>
          fixtureIds.has(relation.sourceId) && fixtureIds.has(relation.targetId),
      ),
    ).toBe(true);
    expect(
      knowledgeGraphMockRelations.some((relation) => relation.type === "uses"),
    ).toBe(true);
    for (const relationType of [
      "uses",
      "specializes",
      "depends_on",
      "realizes",
      "produces",
      "enables",
    ] as const) {
      expect(
        knowledgeGraphMockRelations.some(
          (relation) => relation.type === relationType,
        ),
      ).toBe(true);
    }

    const global = await adapter.graph({ kind: "global" });
    expect(global.status).toBe("success");
    if (global.status === "success") {
      expect(global.value.nodes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "demo-payment-payments", title: "Payments" }),
          expect.objectContaining({ title: "Asynchronous Programming" }),
          expect.objectContaining({ title: "asyncio" }),
          expect.objectContaining({ title: "Access Control Policy" }),
          expect.objectContaining({ title: "Attribute-Based Access Control" }),
          expect.objectContaining({ title: "Future" }),
          expect.objectContaining({ title: "Structured Concurrency" }),
          expect.objectContaining({ title: "Relationship-Based Access Control" }),
          expect.objectContaining({ title: "Zanzibar" }),
          expect.objectContaining({ title: "Policy Decision Point" }),
          expect.objectContaining({ title: "XACML" }),
          expect.objectContaining({ title: "Deny-overrides" }),
        ]),
      );
    }

    const target = await adapter.graph({
      kind: "target",
      targetId: PREPARED_TARGET_ID,
    });
    expect(target.status).toBe("success");
    if (target.status === "success") {
      expect(
        target.value.nodes.some((node) => fixtureIds.has(node.id)),
      ).toBe(false);
    }
  });

  test("keeps unavailable provider state out of Knowledge models", async () => {
    const adapter = new MockKnowledgeAdapter("unavailable");

    await expect(adapter.graph({ kind: "global" })).resolves.toEqual({
      status: "unavailable",
      message: "Knowledge data is temporarily unavailable.",
    });
  });
});
