import type { KnowledgeScope } from "../../features/knowledge-explorer/model/knowledge";
import type {
  KnowledgeListQuery,
  KnowledgeQueryPort,
} from "../../features/knowledge-explorer/ports/KnowledgeQueryPort";
import type { LearningStatisticsPort } from "../../features/learning/ports/LearningStatisticsPort";
import type { QuestionQueryPort } from "../../features/learning/ports/QuestionQueryPort";
import type { StudyPort } from "../../features/learning/ports/StudyPort";
import type { TargetQueryPort } from "../../features/learning/ports/TargetQueryPort";
import { HttpOperationClient } from "./HttpOperationClient";
import {
  mapKnowledgeCollection,
  mapKnowledgeDetail,
  mapKnowledgeGraph,
  mapLearningStatistics,
  mapLearningTarget,
  mapQuestionCollection,
  mapReviewSyncSummary,
  mapStudyExportResult,
  mapStudySetPreview,
  mapTargetCollection,
} from "./mappers";
import {
  toKnowledgeOutcome,
  toLearningOutcome,
  toStudyExportOutcome,
} from "./outcomes";

function queryInput(values: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  );
}

export class HttpTargetAdapter implements TargetQueryPort {
  constructor(private readonly client: HttpOperationClient) {}

  async list(query: { readonly search?: string }) {
    const envelope = await this.client.query(
      "learning.targets.list",
      queryInput({ text_query: query.search }),
    );
    return toLearningOutcome(envelope, mapTargetCollection);
  }

  async get(targetId: string) {
    const envelope = await this.client.query("learning.targets.get", {
      target_id: targetId,
    });
    return toLearningOutcome(envelope, mapLearningTarget);
  }
}

export class HttpKnowledgeAdapter implements KnowledgeQueryPort {
  constructor(private readonly client: HttpOperationClient) {}

  async list(scope: KnowledgeScope, query: KnowledgeListQuery) {
    const operation =
      scope.kind === "global"
        ? "curation.knowledge.list"
        : "learning.target.knowledge.list";
    const envelope = await this.client.query(
      operation,
      queryInput({
        target_id: scope.kind === "target" ? scope.targetId : undefined,
        text_query: query.search,
        semantic_kind: query.semanticKind,
      }),
    );
    return toKnowledgeOutcome(envelope, mapKnowledgeCollection);
  }

  async get(scope: KnowledgeScope, knowledgeId: string) {
    if (scope.kind === "target") {
      const graph = await this.graph(scope);
      return graph.status === "success"
        ? {
            status: "success" as const,
            value:
              graph.value.nodes.find((node) => node.id === knowledgeId) ?? null,
          }
        : graph;
    }

    const envelope = await this.client.query("curation.knowledge.get", {
      knowledge_id: knowledgeId,
    });
    if (envelope.outcome === "not_found") {
      return { status: "success" as const, value: null };
    }
    return toKnowledgeOutcome(envelope, (value) => mapKnowledgeDetail(value).node);
  }

  async graph(scope: KnowledgeScope) {
    const operation =
      scope.kind === "global"
        ? "curation.knowledge.graph"
        : "learning.target.knowledge.graph";
    const envelope = await this.client.query(
      operation,
      scope.kind === "target" ? { target_id: scope.targetId } : {},
    );
    return toKnowledgeOutcome(envelope, (value) =>
      mapKnowledgeGraph(scope, value),
    );
  }
}

export class HttpQuestionAdapter implements QuestionQueryPort {
  constructor(private readonly client: HttpOperationClient) {}

  async list(targetId: string, query: { readonly search?: string }) {
    const envelope = await this.client.query(
      "learning.target.questions.list",
      queryInput({
        target_id: targetId,
        text_query: query.search,
      }),
    );
    return toLearningOutcome(envelope, mapQuestionCollection);
  }
}

export class HttpStudyAdapter implements StudyPort {
  constructor(private readonly client: HttpOperationClient) {}

  async build(targetId: string) {
    const envelope = await this.client.query("learning.target.study_set.build", {
      target_id: targetId,
    });
    return toLearningOutcome(envelope, mapStudySetPreview);
  }

  async export(targetId: string, materializationToken: string) {
    const envelope = await this.client.mutate(
      "learning.target.study_set.export",
      {
        target_id: targetId,
        materialization_token: materializationToken,
      },
    );
    return toStudyExportOutcome(envelope, mapStudyExportResult);
  }
}

export class HttpLearningStatisticsAdapter implements LearningStatisticsPort {
  constructor(private readonly client: HttpOperationClient) {}

  async get(targetId: string) {
    const envelope = await this.client.query(
      "learning.target.statistics.get",
      { target_id: targetId },
    );
    return toLearningOutcome(envelope, mapLearningStatistics);
  }

  async sync() {
    const envelope = await this.client.mutate("learning.reviews.sync");
    return toLearningOutcome(envelope, mapReviewSyncSummary);
  }
}
