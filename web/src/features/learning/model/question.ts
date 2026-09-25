export interface QuestionModel {
  readonly id: string;
  readonly questionText: string;
  readonly answerText: string;
  readonly knowledgeIds: readonly string[];
}
