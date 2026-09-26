import { describe, expect, test } from "vitest";

import { MockKnowledgeAdapter } from "./MockKnowledgeAdapter";
import { PREPARED_TARGET_ID } from "./mockFixtures";
import { donorKnowledgeNodes, donorKnowledgeRelations } from "./mockPaymentKnowledgeFixture";

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

  test("exposes a semantically valid donor corpus only in global mock scope", async () => {
    const adapter = new MockKnowledgeAdapter();

    expect(donorKnowledgeNodes.length).toBeGreaterThanOrEqual(35);
    expect(new Set(donorKnowledgeNodes.map((node) => node.id)).size).toBe(
      donorKnowledgeNodes.length,
    );

    const donorIds = new Set(donorKnowledgeNodes.map((node) => node.id));
    expect(
      donorKnowledgeRelations.every(
        (relation) =>
          donorIds.has(relation.sourceId) && donorIds.has(relation.targetId),
      ),
    ).toBe(true);

    const global = await adapter.graph({ kind: "global" });
    expect(global.status).toBe("success");
    if (global.status === "success") {
      expect(global.value.nodes.length).toBeGreaterThanOrEqual(40);
      expect(
        global.value.nodes.some((node) => node.id === "demo-payment-payments"),
      ).toBe(true);
    }

    const target = await adapter.graph({
      kind: "target",
      targetId: PREPARED_TARGET_ID,
    });
    expect(target.status).toBe("success");
    if (target.status === "success") {
      expect(
        target.value.nodes.some((node) => node.id.startsWith("demo-payment-")),
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
