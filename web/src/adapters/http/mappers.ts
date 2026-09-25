import {
  KNOWLEDGE_RELATION_TYPES,
  KNOWLEDGE_SEMANTIC_KINDS,
  type KnowledgeGraphModel,
  type KnowledgeNodeModel,
  type KnowledgeRelationModel,
  type KnowledgeScope,
} from "../../features/knowledge-explorer/model/knowledge";
import type { KnowledgeCollection } from "../../features/knowledge-explorer/ports/KnowledgeQueryPort";
import type {
  LearningStatisticsModel,
  ReviewObservationModel,
  ReviewPhase,
  ReviewRating,
  ReviewSyncSummaryModel,
} from "../../features/learning/model/learningStatistics";
import type { LearningTargetModel } from "../../features/learning/model/learningTarget";
import type { QuestionModel } from "../../features/learning/model/question";
import type {
  StudyExportResultModel,
  StudySetPreviewModel,
} from "../../features/learning/model/study";
import type { TargetCollection } from "../../features/learning/ports/TargetQueryPort";
import type { QuestionCollection } from "../../features/learning/ports/QuestionQueryPort";
import type {
  CurationCollection,
  CurationKnowledgeDetailModel,
  CurationQuestionModel,
  CurationRequirementEntity,
  CurationTargetModel,
  ImportResultModel,
} from "../../features/curation/model/curationModels";
import type { RuntimeStatusModel } from "../../app/shell/RuntimeStatusPort";

export class DtoMappingError extends Error {}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new DtoMappingError(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function stringField(
  value: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const field = value[key];
  if (typeof field !== "string") {
    throw new DtoMappingError(`${label}.${key} must be a string.`);
  }
  return field;
}

function optionalStringField(
  value: Record<string, unknown>,
  key: string,
  label: string,
): string | undefined {
  const field = value[key];
  if (field === undefined || field === null) return undefined;
  if (typeof field !== "string") {
    throw new DtoMappingError(`${label}.${key} must be a string.`);
  }
  return field;
}

function numberField(
  value: Record<string, unknown>,
  key: string,
  label: string,
): number {
  const field = value[key];
  if (typeof field !== "number" || !Number.isFinite(field)) {
    throw new DtoMappingError(`${label}.${key} must be a finite number.`);
  }
  return field;
}

function booleanField(
  value: Record<string, unknown>,
  key: string,
  label: string,
): boolean {
  const field = value[key];
  if (typeof field !== "boolean") {
    throw new DtoMappingError(`${label}.${key} must be a boolean.`);
  }
  return field;
}

function arrayField(
  value: Record<string, unknown>,
  key: string,
  label: string,
): readonly unknown[] {
  const field = value[key];
  if (!Array.isArray(field)) {
    throw new DtoMappingError(`${label}.${key} must be an array.`);
  }
  return field;
}

function stringArray(
  value: Record<string, unknown>,
  key: string,
  label: string,
): readonly string[] {
  const values = arrayField(value, key, label);
  if (!values.every((item) => typeof item === "string")) {
    throw new DtoMappingError(`${label}.${key} must contain strings.`);
  }
  return values as readonly string[];
}

function titleFromContent(content: string): string {
  const title =
    content
      .split(/\n+/)
      .map((item) => item.trim())
      .find(Boolean) ?? "Knowledge";
  return title.length <= 80 ? title : `${title.slice(0, 77)}...`;
}

function mapCollection<T>(
  value: unknown,
  itemMapper: (item: unknown) => T,
): { readonly items: readonly T[]; readonly totalCount: number } {
  const dto = record(value, "collection");
  const items = arrayField(dto, "items", "collection").map(itemMapper);
  const totalCount = numberField(dto, "total_count", "collection");
  optionalStringField(dto, "next_cursor", "collection");
  return { items, totalCount };
}

export function mapKnowledgeNode(value: unknown): KnowledgeNodeModel {
  const dto = record(value, "KnowledgeNode");
  const semanticKind = stringField(dto, "semantic_kind", "KnowledgeNode");
  if (!KNOWLEDGE_SEMANTIC_KINDS.includes(semanticKind as never)) {
    throw new DtoMappingError("KnowledgeNode.semantic_kind is not accepted.");
  }
  const content = stringField(dto, "content", "KnowledgeNode");
  return {
    id: stringField(dto, "id", "KnowledgeNode"),
    semanticKind: semanticKind as KnowledgeNodeModel["semanticKind"],
    title:
      optionalStringField(dto, "display_content", "KnowledgeNode") ??
      titleFromContent(content),
    summary: content,
  };
}

export function mapKnowledgeRelation(value: unknown): KnowledgeRelationModel {
  const dto = record(value, "KnowledgeRelation");
  const relationType = stringField(dto, "relation_type", "KnowledgeRelation");
  if (!KNOWLEDGE_RELATION_TYPES.includes(relationType as never)) {
    throw new DtoMappingError("KnowledgeRelation.relation_type is not accepted.");
  }
  return {
    id: stringField(dto, "id", "KnowledgeRelation"),
    sourceId: stringField(dto, "source_id", "KnowledgeRelation"),
    targetId: stringField(dto, "target_id", "KnowledgeRelation"),
    type: relationType as KnowledgeRelationModel["type"],
  };
}

export function mapKnowledgeCollection(value: unknown): KnowledgeCollection {
  return mapCollection(value, mapKnowledgeNode);
}

export function mapKnowledgeGraph(
  scope: KnowledgeScope,
  value: unknown,
): KnowledgeGraphModel {
  const dto = record(value, "KnowledgeGraph");
  return {
    scope,
    nodes: arrayField(dto, "nodes", "KnowledgeGraph").map(mapKnowledgeNode),
    relations: arrayField(dto, "relations", "KnowledgeGraph").map(
      mapKnowledgeRelation,
    ),
  };
}

export function mapKnowledgeDetail(value: unknown): CurationKnowledgeDetailModel {
  const dto = record(value, "KnowledgeDetail");
  return {
    node: mapKnowledgeNode(dto.node),
    incomingRelations: arrayField(
      dto,
      "incoming_relations",
      "KnowledgeDetail",
    ).map(mapKnowledgeRelation),
    outgoingRelations: arrayField(
      dto,
      "outgoing_relations",
      "KnowledgeDetail",
    ).map(mapKnowledgeRelation),
  };
}

function mapScopeItem(value: unknown) {
  const dto = record(value, "TargetScopeItem");
  const kind = stringField(dto, "kind", "TargetScopeItem");
  if (kind !== "requirement" && kind !== "requirement-set") {
    throw new DtoMappingError("TargetScopeItem.kind is not accepted.");
  }
  const content = stringField(dto, "content", "TargetScopeItem");
  return {
    id: stringField(dto, "id", "TargetScopeItem"),
    kind,
    label:
      optionalStringField(dto, "display_content", "TargetScopeItem") ??
      titleFromContent(content),
    content,
  } as const;
}

export function mapLearningTarget(value: unknown): LearningTargetModel {
  const dto = record(value, "LearningTarget");
  const scopeItems = arrayField(dto, "scope_items", "LearningTarget").map(
    mapScopeItem,
  );
  return {
    id: stringField(dto, "id", "LearningTarget"),
    name: stringField(dto, "name", "LearningTarget"),
    definition: stringField(dto, "definition", "LearningTarget"),
    scopeSummary: `${scopeItems.length} curated scope item(s)`,
    scopeItems: scopeItems.map((item) => ({
      id: item.id,
      kind: item.kind,
      title: item.label,
      summary: item.content,
    })),
  };
}

export function mapTargetCollection(value: unknown): TargetCollection {
  return mapCollection(value, mapLearningTarget);
}

export function mapCurationTarget(value: unknown): CurationTargetModel {
  const dto = record(value, "LearningTarget");
  const scopeItems = arrayField(dto, "scope_items", "LearningTarget").map(
    mapScopeItem,
  );
  return {
    id: stringField(dto, "id", "LearningTarget"),
    name: stringField(dto, "name", "LearningTarget"),
    definition: stringField(dto, "definition", "LearningTarget"),
    scopeItems: scopeItems.map((item) => ({
      id: item.id,
      kind: item.kind,
      label: item.label,
    })),
  };
}

export function mapCurationTargetCollection(
  value: unknown,
): CurationCollection<CurationTargetModel> {
  return mapCollection(value, mapCurationTarget);
}

export function mapQuestion(value: unknown): QuestionModel {
  const dto = record(value, "Question");
  return {
    id: stringField(dto, "id", "Question"),
    questionText: stringField(dto, "question_text", "Question"),
    answerText: stringField(dto, "answer_text", "Question"),
    knowledgeIds: stringArray(dto, "knowledge_ids", "Question"),
  };
}

export function mapQuestionCollection(value: unknown): QuestionCollection {
  return mapCollection(value, mapQuestion);
}

export function mapCurationQuestion(value: unknown): CurationQuestionModel {
  return mapQuestion(value);
}

export function mapCurationQuestionCollection(
  value: unknown,
): CurationCollection<CurationQuestionModel> {
  return mapCollection(value, mapCurationQuestion);
}

export function mapRequirement(value: unknown): CurationRequirementEntity {
  const dto = record(value, "Requirement");
  const kind = stringField(dto, "kind", "Requirement");
  const definition = stringField(dto, "content", "Requirement");
  const base = {
    id: stringField(dto, "id", "Requirement"),
    label: titleFromContent(definition),
    definition,
  };
  if (kind === "requirement") {
    return {
      ...base,
      kind,
      knowledgeIds: stringArray(dto, "knowledge_ids", "Requirement"),
    };
  }
  if (kind === "requirement-set") {
    return {
      ...base,
      kind,
      memberIds: stringArray(dto, "member_ids", "Requirement"),
    };
  }
  throw new DtoMappingError("Requirement.kind is not accepted.");
}

export function mapRequirementCollection(
  value: unknown,
): CurationCollection<CurationRequirementEntity> {
  return mapCollection(value, mapRequirement);
}

export function mapStudySetPreview(value: unknown): StudySetPreviewModel {
  const dto = record(value, "StudySetPreview");
  return {
    targetId: stringField(dto, "target_id", "StudySetPreview"),
    questions: arrayField(dto, "questions", "StudySetPreview").map(mapQuestion),
    materializationToken: stringField(
      dto,
      "materialization_token",
      "StudySetPreview",
    ),
  };
}

export function mapStudyExportResult(value: unknown): StudyExportResultModel {
  const dto = record(value, "StudyExportResult");
  return {
    items: arrayField(dto, "items", "StudyExportResult").map((raw) => {
      const item = record(raw, "StudyExportItem");
      const status = stringField(item, "status", "StudyExportItem");
      if (status !== "success" && status !== "rejected") {
        throw new DtoMappingError("StudyExportItem.status is not accepted.");
      }
      return {
        questionId: stringField(item, "question_id", "StudyExportItem"),
        status,
        message: optionalStringField(item, "message", "StudyExportItem"),
      };
    }),
  };
}

const REVIEW_RATINGS: readonly ReviewRating[] = ["Again", "Hard", "Good", "Easy"];
const REVIEW_PHASES: readonly ReviewPhase[] = [
  "Learning",
  "Review",
  "Relearning",
  "Early",
];

function mapReviewObservation(value: unknown): ReviewObservationModel {
  const dto = record(value, "ReviewObservation");
  const rating = stringField(dto, "rating", "ReviewObservation");
  const reviewPhase = stringField(dto, "review_phase", "ReviewObservation");
  if (!REVIEW_RATINGS.includes(rating as ReviewRating)) {
    throw new DtoMappingError("ReviewObservation.rating is not accepted.");
  }
  if (!REVIEW_PHASES.includes(reviewPhase as ReviewPhase)) {
    throw new DtoMappingError("ReviewObservation.review_phase is not accepted.");
  }
  return {
    id: stringField(dto, "id", "ReviewObservation"),
    questionId: stringField(dto, "question_id", "ReviewObservation"),
    occurredAt: stringField(dto, "occurred_at", "ReviewObservation"),
    rating: rating as ReviewRating,
    previousInterval: stringField(
      dto,
      "previous_interval",
      "ReviewObservation",
    ),
    nextInterval: stringField(dto, "next_interval", "ReviewObservation"),
    duration: stringField(dto, "duration", "ReviewObservation"),
    reviewPhase: reviewPhase as ReviewPhase,
  };
}

export function mapLearningStatistics(value: unknown): LearningStatisticsModel {
  const dto = record(value, "LearningStatistics");
  const aggregates = record(dto.aggregates, "LearningStatistics.aggregates");
  return {
    aggregates: {
      total: numberField(aggregates, "total", "LearningStatistics.aggregates"),
      again: numberField(aggregates, "again", "LearningStatistics.aggregates"),
      hard: numberField(aggregates, "hard", "LearningStatistics.aggregates"),
      good: numberField(aggregates, "good", "LearningStatistics.aggregates"),
      easy: numberField(aggregates, "easy", "LearningStatistics.aggregates"),
    },
    observations: arrayField(
      dto,
      "observations",
      "LearningStatistics",
    ).map(mapReviewObservation),
  };
}

export function mapReviewSyncSummary(value: unknown): ReviewSyncSummaryModel {
  const dto = record(value, "ReviewSyncSummary");
  return {
    imported: numberField(dto, "imported", "ReviewSyncSummary"),
    rejected: numberField(dto, "rejected", "ReviewSyncSummary"),
  };
}

export function mapImportResult(value: unknown): ImportResultModel {
  const dto = record(value, "ImportResult");
  return {
    total: numberField(dto, "total", "ImportResult"),
    applied: numberField(dto, "applied", "ImportResult"),
    rejected: numberField(dto, "rejected", "ImportResult"),
    items: arrayField(dto, "items", "ImportResult").map((raw) => {
      const item = record(raw, "ImportItem");
      const status = stringField(item, "status", "ImportItem");
      if (
        status !== "created" &&
        status !== "updated" &&
        status !== "duplicate_skipped" &&
        status !== "rejected"
      ) {
        throw new DtoMappingError("ImportItem.status is not accepted.");
      }
      return {
        item: stringField(item, "item", "ImportItem"),
        status,
        reason: optionalStringField(item, "reason", "ImportItem"),
      };
    }),
  };
}

export function mapRuntimeStatus(value: unknown): RuntimeStatusModel {
  const dto = record(value, "RuntimeStatus");
  return {
    reachable: booleanField(dto, "reachable", "RuntimeStatus"),
    compatible: booleanField(dto, "compatible", "RuntimeStatus"),
    endpointSummary: optionalStringField(
      dto,
      "endpoint_summary",
      "RuntimeStatus",
    ),
    profileSummary: optionalStringField(
      dto,
      "profile_summary",
      "RuntimeStatus",
    ),
  };
}
