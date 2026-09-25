import { describe, expect, test } from "vitest";

import { MockKnowledgeAdapter } from "./MockKnowledgeAdapter";
import { PREPARED_TARGET_ID } from "./mockFixtures";

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

  test("keeps unavailable provider state out of Knowledge models", async () => {
    const adapter = new MockKnowledgeAdapter("unavailable");

    await expect(adapter.graph({ kind: "global" })).resolves.toEqual({
      status: "unavailable",
      message: "Knowledge data is temporarily unavailable.",
    });
  });
});
