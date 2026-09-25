import type {
  KnowledgeNodeModel,
  KnowledgeRelationModel,
  KnowledgeRelationType,
  KnowledgeSemanticKind,
} from "../../knowledge-explorer/model/knowledge";

export type CurationOutcome<T> =
  | { readonly status: "success"; readonly value: T }
  | { readonly status: "not_found"; readonly message: string }
  | { readonly status: "validation_rejected"; readonly message: string }
  | { readonly status: "conflict"; readonly message: string }
  | { readonly status: "unavailable"; readonly message: string }
  | { readonly status: "failure"; readonly message: string };

export interface CurationCollection<T> {
  readonly items: readonly T[];
  readonly totalCount: number;
}

export type CurationScopeItemKind = "requirement" | "requirement-set";

export interface CurationScopeItemModel {
  readonly id: string;
  readonly kind: CurationScopeItemKind;
  readonly title: string;
}

export interface CurationTargetModel {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  readonly scopeItems: readonly CurationScopeItemModel[];
}

export interface CurationRequirementModel {
  readonly id: string;
  readonly kind: "requirement";
  readonly title: string;
  readonly definition: string;
  readonly knowledgeIds: readonly string[];
}

export interface CurationRequirementSetModel {
  readonly id: string;
  readonly kind: "requirement-set";
  readonly title: string;
  readonly definition: string;
  readonly memberIds: readonly string[];
}

export type CurationRequirementEntity =
  | CurationRequirementModel
  | CurationRequirementSetModel;

export interface CurationQuestionModel {
  readonly id: string;
  readonly questionText: string;
  readonly answerText: string;
  readonly knowledgeIds: readonly string[];
}

export interface CurationKnowledgeDetailModel {
  readonly node: KnowledgeNodeModel;
  readonly incomingRelations: readonly KnowledgeRelationModel[];
  readonly outgoingRelations: readonly KnowledgeRelationModel[];
}

export interface KnowledgeDraft {
  readonly semanticKind: KnowledgeSemanticKind;
  readonly content: string;
}

export interface KnowledgeRelationDraft {
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: KnowledgeRelationType;
}

export type ImportDataKind = "knowledge" | "requirements" | "questions" | "targets";

export type ImportItemStatus =
  | "created"
  | "updated"
  | "duplicate_skipped"
  | "rejected";

export interface ImportItemOutcomeModel {
  readonly item: string;
  readonly status: ImportItemStatus;
  readonly reason?: string;
}

export interface ImportResultModel {
  readonly total: number;
  readonly applied: number;
  readonly rejected: number;
  readonly items: readonly ImportItemOutcomeModel[];
}
