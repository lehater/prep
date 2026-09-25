import type {
  LearningStatisticsModel,
  ReviewSyncSummaryModel,
} from "../model/learningStatistics";
import type { LearningOutcome } from "./learningOutcome";

export interface LearningStatisticsPort {
  get(targetId: string): Promise<LearningOutcome<LearningStatisticsModel>>;
  sync(): Promise<LearningOutcome<ReviewSyncSummaryModel>>;
}
