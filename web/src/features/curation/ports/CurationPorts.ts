import type {
  KnowledgeRelationDraft,
  KnowledgeDraft,
  CurationCollection,
  CurationKnowledgeDetailModel,
  CurationOutcome,
  CurationQuestionModel,
  CurationRequirementEntity,
  CurationTargetModel,
  ImportDataKind,
  ImportResultModel,
} from "../model/curationModels";

export interface TargetCurationPort {
  list(query: { readonly search?: string }): Promise<CurationOutcome<CurationCollection<CurationTargetModel>>>;
  get(targetId: string): Promise<CurationOutcome<CurationTargetModel>>;
  create(input: { readonly name: string; readonly definition: string }): Promise<CurationOutcome<CurationTargetModel>>;
  update(targetId: string, input: { readonly name: string; readonly definition: string }): Promise<CurationOutcome<CurationTargetModel>>;
  addScope(targetId: string, scopeItemId: string): Promise<CurationOutcome<CurationTargetModel>>;
  removeScope(targetId: string, scopeItemId: string): Promise<CurationOutcome<CurationTargetModel>>;
}

export interface KnowledgeCurationPort {
  get(knowledgeId: string): Promise<CurationOutcome<CurationKnowledgeDetailModel>>;
  create(input: KnowledgeDraft): Promise<CurationOutcome<CurationKnowledgeDetailModel>>;
  update(knowledgeId: string, input: KnowledgeDraft): Promise<CurationOutcome<CurationKnowledgeDetailModel>>;
  addRelation(input: KnowledgeRelationDraft): Promise<CurationOutcome<CurationKnowledgeDetailModel>>;
  removeRelation(relationId: string): Promise<CurationOutcome<null>>;
}

export type RequirementAlignmentFilter = "all" | "aligned" | "unaligned";

export interface RequirementCurationPort {
  list(query: { readonly search?: string }): Promise<CurationOutcome<CurationCollection<CurationRequirementEntity>>>;
  get(requirementId: string): Promise<CurationOutcome<CurationRequirementEntity>>;
  createRequirement(input: { readonly title: string; readonly definition: string }): Promise<CurationOutcome<CurationRequirementEntity>>;
  createSet(input: { readonly title: string; readonly definition: string }): Promise<CurationOutcome<CurationRequirementEntity>>;
  updateRequirement(requirementId: string, input: { readonly title: string; readonly definition: string }): Promise<CurationOutcome<CurationRequirementEntity>>;
  updateSet(requirementSetId: string, input: { readonly title: string; readonly definition: string }): Promise<CurationOutcome<CurationRequirementEntity>>;
  addMember(requirementSetId: string, memberId: string): Promise<CurationOutcome<CurationRequirementEntity>>;
  removeMember(requirementSetId: string, memberId: string): Promise<CurationOutcome<CurationRequirementEntity>>;
  alignKnowledge(requirementId: string, knowledgeId: string): Promise<CurationOutcome<CurationRequirementEntity>>;
  unalignKnowledge(requirementId: string, knowledgeId: string): Promise<CurationOutcome<CurationRequirementEntity>>;
}

export type QuestionAlignmentFilter = "all" | "aligned" | "unaligned";

export interface QuestionCurationPort {
  list(query: {
    readonly search?: string;
    readonly alignment?: QuestionAlignmentFilter;
  }): Promise<CurationOutcome<CurationCollection<CurationQuestionModel>>>;
  get(questionId: string): Promise<CurationOutcome<CurationQuestionModel>>;
  create(input: { readonly questionText: string; readonly answerText: string }): Promise<CurationOutcome<CurationQuestionModel>>;
  update(questionId: string, input: { readonly questionText: string; readonly answerText: string }): Promise<CurationOutcome<CurationQuestionModel>>;
  alignKnowledge(questionId: string, knowledgeId: string): Promise<CurationOutcome<CurationQuestionModel>>;
  unalignKnowledge(questionId: string, knowledgeId: string): Promise<CurationOutcome<CurationQuestionModel>>;
}

export interface CurationImportPort {
  apply(
    documentText: string,
    expectedKind?: ImportDataKind,
  ): Promise<CurationOutcome<ImportResultModel>>;
}
