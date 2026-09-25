import type {
  QuestionCollection,
  QuestionQueryPort,
} from "../../features/learning/ports/QuestionQueryPort";
import type { LearningOutcome } from "../../features/learning/ports/learningOutcome";
import { mockQuestions, mockTargetQuestionIds } from "./mockFixtures";

export type MockQuestionMode = "success" | "unavailable" | "failure";

export class MockQuestionAdapter implements QuestionQueryPort {
  constructor(private readonly mode: MockQuestionMode = "success") {}

  async list(
    targetId: string,
    query: { readonly search?: string },
  ): Promise<LearningOutcome<QuestionCollection>> {
    const problem = this.problem<QuestionCollection>();
    if (problem) {
      return problem;
    }

    const ids = new Set(mockTargetQuestionIds[targetId] ?? []);
    const search = query.search?.trim().toLocaleLowerCase() ?? "";
    const items = mockQuestions.filter(
      (question) =>
        ids.has(question.id) &&
        (search.length === 0 ||
          question.questionText.toLocaleLowerCase().includes(search) ||
          question.answerText.toLocaleLowerCase().includes(search)),
    );

    return { status: "success", value: { items, totalCount: items.length } };
  }

  private problem<T>(): LearningOutcome<T> | null {
    if (this.mode === "unavailable") {
      return {
        status: "unavailable",
        message: "Questions are temporarily unavailable.",
      };
    }
    if (this.mode === "failure") {
      return {
        status: "failure",
        message: "Questions could not be loaded. Retry the operation.",
      };
    }
    return null;
  }
}
