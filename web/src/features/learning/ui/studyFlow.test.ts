import { describe, expect, test } from "vitest";

import type { StudySetPreviewModel } from "../model/study";
import { initialStudyFlowState, studyFlowReducer } from "./studyFlow";

const preview: StudySetPreviewModel = {
  targetId: "target-1",
  questions: [
    {
      id: "question-1",
      questionText: "Question?",
      answerText: "Answer.",
      knowledgeIds: ["knowledge-1"],
    },
  ],
  materializationToken: "token-1",
};

describe("studyFlowReducer", () => {
  test("preserves the inspected preview after recoverable export failure", () => {
    const withPreview = studyFlowReducer(initialStudyFlowState, {
      type: "build-success",
      preview,
    });
    const failed = studyFlowReducer(withPreview, {
      type: "export-result",
      outcome: {
        status: "unavailable",
        message: "Runtime unavailable.",
      },
    });
    const retrying = studyFlowReducer(failed, { type: "export-start" });

    expect(failed.preview).toBe(preview);
    expect(retrying.preview).toBe(preview);
    expect(retrying.exportStatus).toBe("loading");
  });

  test("stale preview can be replaced only by an explicit rebuild result", () => {
    const conflicted = studyFlowReducer(
      studyFlowReducer(initialStudyFlowState, {
        type: "build-success",
        preview,
      }),
      {
        type: "export-result",
        outcome: { status: "conflict", message: "Stale preview." },
      },
    );
    const rebuilt: StudySetPreviewModel = {
      ...preview,
      materializationToken: "token-2",
    };

    const resolved = studyFlowReducer(conflicted, {
      type: "build-success",
      preview: rebuilt,
    });

    expect(conflicted.preview?.materializationToken).toBe("token-1");
    expect(resolved.preview?.materializationToken).toBe("token-2");
    expect(resolved.exportStatus).toBe("idle");
  });
});
