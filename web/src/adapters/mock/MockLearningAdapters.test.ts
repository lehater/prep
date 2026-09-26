import { describe, expect, test } from "vitest";

import { MockQuestionAdapter } from "./MockQuestionAdapter";
import { MockStudyAdapter } from "./MockStudyAdapter";
import { MockTargetAdapter } from "./MockTargetAdapter";
import { PREPARED_TARGET_ID } from "./mockFixtures";

describe("Learning mock adapters", () => {
  test("target and Question collection results preserve exact total counts", async () => {
    const targets = await new MockTargetAdapter().list({ search: "Linux" });
    const questions = await new MockQuestionAdapter().list(PREPARED_TARGET_ID, {});

    expect(targets.status).toBe("success");
    expect(questions.status).toBe("success");
    if (targets.status === "success" && questions.status === "success") {
      expect(targets.value.totalCount).toBe(targets.value.items.length);
      expect(questions.value.totalCount).toBe(questions.value.items.length);
      expect(questions.value.totalCount).toBe(3);
    }
  });

  test("Study Set export detects a stale inspected materialization", async () => {
    const adapter = new MockStudyAdapter();
    const outcome = await adapter.export(PREPARED_TARGET_ID, "stale-token");

    expect(outcome).toEqual({
      status: "conflict",
      message:
        "The inspected Study Set is stale. Rebuild and inspect it before export.",
    });
  });

  test("recoverable runtime unavailability remains an export outcome", async () => {
    const adapter = new MockStudyAdapter("success", "unavailable");
    const preview = await adapter.build(PREPARED_TARGET_ID);
    expect(preview.status).toBe("success");
    if (preview.status !== "success") {
      return;
    }

    const outcome = await adapter.export(
      PREPARED_TARGET_ID,
      preview.value.materializationToken,
    );

    expect(outcome.status).toBe("unavailable");
  });
});
