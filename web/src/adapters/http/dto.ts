export type MachineOutcomeDto =
  | "success"
  | "not_found"
  | "validation_rejected"
  | "conflict"
  | "external_runtime_unavailable"
  | "partial_external_failure"
  | "operational_failure";

export interface MachineEnvelopeDto {
  readonly outcome: MachineOutcomeDto;
  readonly result?: unknown;
  readonly message?: string;
}

export interface CollectionDto<T> {
  readonly items: readonly T[];
  readonly next_cursor?: string | null;
  readonly total_count: number;
}

export interface KnowledgeNodeDto {
  readonly id: string;
  readonly semantic_kind: string;
  readonly content: string;
}

export interface KnowledgeRelationDto {
  readonly id: string;
  readonly source_id: string;
  readonly target_id: string;
  readonly relation_type: string;
}

export interface KnowledgeGraphDto {
  readonly nodes: readonly KnowledgeNodeDto[];
  readonly relations: readonly KnowledgeRelationDto[];
}

export interface KnowledgeDetailDto {
  readonly node: KnowledgeNodeDto;
  readonly incoming_relations: readonly KnowledgeRelationDto[];
  readonly outgoing_relations: readonly KnowledgeRelationDto[];
}

export interface TargetScopeItemDto {
  readonly id: string;
  readonly kind: string;
  readonly content: string;
}

export interface LearningTargetDto {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  readonly scope_items: readonly TargetScopeItemDto[];
}

export interface QuestionDto {
  readonly id: string;
  readonly question_text: string;
  readonly answer_text: string;
  readonly knowledge_ids: readonly string[];
}

export interface RequirementDto {
  readonly id: string;
  readonly kind: string;
  readonly content: string;
  readonly knowledge_ids?: readonly string[];
  readonly member_ids?: readonly string[];
}

export interface StudySetPreviewDto {
  readonly target_id: string;
  readonly questions: readonly QuestionDto[];
  readonly materialization_token: string;
}

export interface StudyExportItemDto {
  readonly question_id: string;
  readonly status: string;
  readonly message?: string;
}

export interface StudyExportResultDto {
  readonly items: readonly StudyExportItemDto[];
}

export interface ReviewObservationDto {
  readonly id: string;
  readonly question_id: string;
  readonly occurred_at: string;
  readonly rating: string;
  readonly previous_interval: string;
  readonly next_interval: string;
  readonly duration: string;
  readonly review_phase: string;
}

export interface LearningStatisticsDto {
  readonly aggregates: {
    readonly total: number;
    readonly again: number;
    readonly hard: number;
    readonly good: number;
    readonly easy: number;
  };
  readonly observations: readonly ReviewObservationDto[];
}

export interface ReviewSyncSummaryDto {
  readonly imported: number;
  readonly rejected: number;
}

export interface ImportResultDto {
  readonly total: number;
  readonly applied: number;
  readonly rejected: number;
  readonly items: readonly {
    readonly item: string;
    readonly status: string;
    readonly reason?: string;
  }[];
}

export interface RuntimeStatusDto {
  readonly reachable: boolean;
  readonly compatible: boolean;
  readonly endpoint_summary?: string;
  readonly profile_summary?: string;
}
