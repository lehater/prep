import type {
  LearningStatisticsModel,
  ReviewSyncSummaryModel,
} from "../../features/learning/model/learningStatistics";
import type { LearningStatisticsPort } from "../../features/learning/ports/LearningStatisticsPort";
import type { LearningOutcome } from "../../features/learning/ports/learningOutcome";
import { mockStatistics, PREPARED_TARGET_ID } from "./mockFixtures";

export type MockStatisticsMode = "success" | "unavailable" | "failure";

export class MockLearningStatisticsAdapter implements LearningStatisticsPort {
  constructor(
    private readonly getMode: MockStatisticsMode = "success",
    private readonly syncMode: MockStatisticsMode = "success",
  ) {}

  async get(targetId: string): Promise<LearningOutcome<LearningStatisticsModel>> {
    const problem = this.problem<LearningStatisticsModel>(
      this.getMode,
      "Learning statistics",
    );
    if (problem) {
      return problem;
    }
    if (targetId !== PREPARED_TARGET_ID) {
      return {
        status: "success",
        value: {
          aggregates: { total: 0, again: 0, hard: 0, good: 0, easy: 0 },
          observations: [],
        },
      };
    }
    return { status: "success", value: mockStatistics };
  }

  async sync(): Promise<LearningOutcome<ReviewSyncSummaryModel>> {
    const problem = this.problem<ReviewSyncSummaryModel>(
      this.syncMode,
      "Review sync",
    );
    if (problem) {
      return problem;
    }
    return { status: "success", value: { imported: 0, rejected: 0 } };
  }

  private problem<T>(
    mode: MockStatisticsMode,
    subject: string,
  ): LearningOutcome<T> | null {
    if (mode === "unavailable") {
      return {
        status: "unavailable",
        message: `${subject} is temporarily unavailable.`,
      };
    }
    if (mode === "failure") {
      return {
        status: "failure",
        message: `${subject} failed. Retry the operation.`,
      };
    }
    return null;
  }
}
