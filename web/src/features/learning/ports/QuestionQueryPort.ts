import type { QuestionModel } from "../model/question";
import type { LearningOutcome } from "./learningOutcome";

export interface QuestionCollection {
  readonly items: readonly QuestionModel[];
  readonly totalCount: number;
}

export interface QuestionQueryPort {
  list(
    targetId: string,
    query: { readonly search?: string },
  ): Promise<LearningOutcome<QuestionCollection>>;
}
