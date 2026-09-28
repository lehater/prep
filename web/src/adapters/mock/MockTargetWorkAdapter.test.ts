import { describe, expect, test } from "vitest";

import { MockTargetWorkAdapter } from "./MockTargetWorkAdapter";
import { PREPARED_TARGET_ID } from "./mockFixtures";

describe("MockTargetWorkAdapter", () => {
  test("changes target-relative state only after explicit accepted diagnostic evidence", async () => {
    const adapter = new MockTargetWorkAdapter();

    const before = await adapter.getState(PREPARED_TARGET_ID);
    expect(before.status).toBe("success");
    if (before.status !== "success") return;

    expect(
      before.value.items.find(
        (item) => item.requirementId === "cap-payment-reliability",
      )?.state,
    ).toBe("challenged");

    const accepted = await adapter.acceptDiagnosticEvidence(
      PREPARED_TARGET_ID,
      "diagnostic-assessment-payment-reliability",
      "cap-payment-reliability",
    );
    expect(accepted.status).toBe("success");
    if (accepted.status !== "success") return;

    expect(accepted.value.observation.provenance).toBe("Prep mock diagnostic");
    expect(accepted.value.evidenceArgument.capabilityId).toBe(
      "cap-payment-reliability",
    );
    expect(accepted.value.evidenceArgument.bearing).toBe("supports");
    expect(
      accepted.value.state.items.find(
        (item) => item.requirementId === "cap-payment-reliability",
      )?.state,
    ).toBe("satisfied");

    const progress = await adapter.getProgress(PREPARED_TARGET_ID);
    expect(progress.status).toBe("success");
    if (progress.status === "success") {
      expect(progress.value.changes).toEqual([
        expect.objectContaining({
          requirementId: "cap-payment-reliability",
          before: "challenged",
          after: "satisfied",
        }),
      ]);
    }
  });

  test("represents increased uncertainty when accepted evidence challenges prior satisfaction", async () => {
    const adapter = new MockTargetWorkAdapter();

    const accepted = await adapter.acceptDiagnosticEvidence(
      PREPARED_TARGET_ID,
      "diagnostic-assessment-python-backend-challenge",
      "cap-python-backend",
    );
    expect(accepted.status).toBe("success");
    if (accepted.status !== "success") return;

    expect(
      accepted.value.state.items.find(
        (item) => item.requirementId === "cap-python-backend",
      )?.state,
    ).toBe("challenged");
    expect(accepted.value.evidenceArgument.bearing).toBe("challenges");
    expect(accepted.value.evidenceArgument.summary).toMatch(/challenge/i);
    expect(accepted.value.claimProjection.summary).toMatch(/prevents.*satisfaction/i);

    const progress = await adapter.getProgress(PREPARED_TARGET_ID);
    expect(progress.status).toBe("success");
    if (progress.status === "success") {
      expect(progress.value.changes).toEqual([
        expect.objectContaining({
          requirementId: "cap-python-backend",
          before: "satisfied",
          after: "challenged",
        }),
      ]);
    }
  });

  test("accepts new evidence without inventing progress when satisfaction was already established", async () => {
    const adapter = new MockTargetWorkAdapter();

    const accepted = await adapter.acceptDiagnosticEvidence(
      PREPARED_TARGET_ID,
      "diagnostic-assessment-python-backend-confirmation",
      "cap-python-backend",
    );
    expect(accepted.status).toBe("success");

    const progress = await adapter.getProgress(PREPARED_TARGET_ID);
    expect(progress.status).toBe("success");
    if (progress.status === "success") {
      expect(progress.value.changes).toEqual([]);
      expect(progress.value.summary).toBe(
        "No target-relative state change is established yet.",
      );
    }
  });
});
