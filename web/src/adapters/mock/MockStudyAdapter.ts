import type {
  StudyExportOutcome,
  StudySetPreviewModel,
} from "../../features/learning/model/study";
import type { LearningOutcome } from "../../features/learning/ports/learningOutcome";
import type { StudyPort } from "../../features/learning/ports/StudyPort";
import { createMockCurationStore, type MockCurationStore } from "./MockCurationStore";

export type MockStudyBuildMode = "success" | "unavailable" | "failure";
export type MockStudyExportMode =
  | "success"
  | "partial"
  | "unavailable"
  | "failure";

export class MockStudyAdapter implements StudyPort {
  constructor(
    private readonly buildMode: MockStudyBuildMode = "success",
    private readonly exportMode: MockStudyExportMode = "success",
    private readonly store: MockCurationStore = createMockCurationStore(),
  ) {}

  async build(
    targetId: string,
  ): Promise<LearningOutcome<StudySetPreviewModel>> {
    if (this.buildMode === "unavailable") {
      return {
        status: "unavailable",
        message: "Study Set materialization is temporarily unavailable.",
      };
    }
    if (this.buildMode === "failure") {
      return {
        status: "failure",
        message: "Study Set could not be built. Retry the operation.",
      };
    }

    const ids = new Set(this.store.targetQuestionIds[targetId] ?? []);
    const questions = this.store.questions.filter((question) => ids.has(question.id));
    return {
      status: "success",
      value: {
        targetId,
        questions,
        materializationToken: this.token(targetId, questions.map((question) => question.id)),
      },
    };
  }

  async export(
    targetId: string,
    materializationToken: string,
  ): Promise<StudyExportOutcome> {
    const ids = this.store.targetQuestionIds[targetId] ?? [];
    const expectedToken = this.token(targetId, ids);
    if (materializationToken !== expectedToken) {
      return {
        status: "conflict",
        message: "The inspected Study Set is stale. Rebuild and inspect it before export.",
      };
    }
    if (this.exportMode === "unavailable") {
      return {
        status: "unavailable",
        message: "The external study runtime is unavailable. Retry when it is reachable.",
      };
    }
    if (this.exportMode === "failure") {
      return {
        status: "failure",
        message: "Study material export failed. The inspected preview is preserved for retry.",
      };
    }

    const items = ids.map((questionId, index) => ({
      questionId,
      status:
        this.exportMode === "partial" && index === ids.length - 1
          ? ("rejected" as const)
          : ("success" as const),
      message:
        this.exportMode === "partial" && index === ids.length - 1
          ? "External runtime rejected this item."
          : "Exported or reconciled successfully.",
    }));

    return {
      status: this.exportMode === "partial" ? "partial" : "success",
      value: { items },
    };
  }

  private token(targetId: string, questionIds: readonly string[]): string {
    return `mock:${targetId}:${questionIds.join(",")}`;
  }
}
