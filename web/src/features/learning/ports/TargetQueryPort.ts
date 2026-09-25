import type { LearningTargetModel } from "../model/learningTarget";
import type { LearningOutcome } from "./learningOutcome";

export interface TargetCollection {
  readonly items: readonly LearningTargetModel[];
  readonly totalCount: number;
}

export interface TargetQueryPort {
  list(query: { readonly search?: string }): Promise<LearningOutcome<TargetCollection>>;
  get(targetId: string): Promise<LearningOutcome<LearningTargetModel>>;
}
