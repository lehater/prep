import type {
  KnowledgeDraft,
  KnowledgeRelationDraft,
} from "../../features/curation/model/curationModels";
import type {
  CurationImportPort,
  KnowledgeCurationPort,
  QuestionCurationPort,
  RequirementCurationPort,
  TargetCurationPort,
} from "../../features/curation/ports/CurationPorts";
import { HttpOperationClient } from "./HttpOperationClient";
import {
  mapCurationQuestion,
  mapCurationQuestionCollection,
  mapCurationTarget,
  mapCurationTargetCollection,
  mapImportResult,
  mapKnowledgeDetail,
  mapRequirement,
  mapRequirementCollection,
} from "./mappers";
import { toCurationOutcome } from "./outcomes";

function input(values: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  );
}

export class HttpCurationTargetAdapter implements TargetCurationPort {
  constructor(private readonly client: HttpOperationClient) {}

  async list(query: { readonly search?: string }) {
    const envelope = await this.client.query(
      "curation.targets.list",
      input({ text_query: query.search }),
    );
    return toCurationOutcome(envelope, mapCurationTargetCollection);
  }

  async get(targetId: string) {
    const envelope = await this.client.query("curation.targets.get", {
      target_id: targetId,
    });
    return toCurationOutcome(envelope, mapCurationTarget);
  }

  async create(value: { readonly name: string; readonly definition: string }) {
    const envelope = await this.client.mutate("curation.targets.create", value);
    return toCurationOutcome(envelope, mapCurationTarget);
  }

  async update(
    targetId: string,
    value: { readonly name: string; readonly definition: string },
  ) {
    const envelope = await this.client.mutate("curation.targets.update", {
      target_id: targetId,
      ...value,
    });
    return toCurationOutcome(envelope, mapCurationTarget);
  }

  async addScope(targetId: string, scopeItemId: string) {
    const envelope = await this.client.mutate("curation.targets.scope.add", {
      target_id: targetId,
      scope_item_id: scopeItemId,
    });
    return toCurationOutcome(envelope, mapCurationTarget);
  }

  async removeScope(targetId: string, scopeItemId: string) {
    const envelope = await this.client.mutate("curation.targets.scope.remove", {
      target_id: targetId,
      scope_item_id: scopeItemId,
    });
    return toCurationOutcome(envelope, mapCurationTarget);
  }
}

export class HttpCurationKnowledgeAdapter implements KnowledgeCurationPort {
  constructor(private readonly client: HttpOperationClient) {}

  async get(knowledgeId: string) {
    const envelope = await this.client.query("curation.knowledge.get", {
      knowledge_id: knowledgeId,
    });
    return toCurationOutcome(envelope, mapKnowledgeDetail);
  }

  async create(value: KnowledgeDraft) {
    const envelope = await this.client.mutate("curation.knowledge.create", {
      semantic_kind: value.semanticKind,
      content: value.content,
    });
    return toCurationOutcome(envelope, mapKnowledgeDetail);
  }

  async update(knowledgeId: string, value: KnowledgeDraft) {
    const envelope = await this.client.mutate("curation.knowledge.update", {
      knowledge_id: knowledgeId,
      semantic_kind: value.semanticKind,
      content: value.content,
    });
    return toCurationOutcome(envelope, mapKnowledgeDetail);
  }

  async addRelation(value: KnowledgeRelationDraft) {
    const envelope = await this.client.mutate(
      "curation.knowledge.relation.add",
      {
        source_id: value.sourceId,
        target_id: value.targetId,
        relation_type: value.type,
      },
    );
    return toCurationOutcome(envelope, mapKnowledgeDetail);
  }

  async removeRelation(relationId: string) {
    const envelope = await this.client.mutate(
      "curation.knowledge.relation.remove",
      { relation_id: relationId },
    );
    return toCurationOutcome(envelope, () => null);
  }
}

export class HttpRequirementAdapter implements RequirementCurationPort {
  constructor(private readonly client: HttpOperationClient) {}

  async list(query: { readonly search?: string }) {
    const envelope = await this.client.query(
      "curation.requirements.list",
      input({ text_query: query.search }),
    );
    return toCurationOutcome(envelope, mapRequirementCollection);
  }

  async get(requirementId: string) {
    const envelope = await this.client.query("curation.requirements.get", {
      requirement_id: requirementId,
    });
    if (envelope.outcome === "not_found") {
      const setEnvelope = await this.client.query(
        "curation.requirement_sets.get",
        { requirement_set_id: requirementId },
      );
      return toCurationOutcome(setEnvelope, mapRequirement);
    }
    return toCurationOutcome(envelope, mapRequirement);
  }

  async createRequirement(value: { readonly definition: string }) {
    const envelope = await this.client.mutate(
      "curation.requirements.create",
      { content: value.definition },
    );
    return toCurationOutcome(envelope, mapRequirement);
  }

  async createSet(value: { readonly definition: string }) {
    const envelope = await this.client.mutate(
      "curation.requirement_sets.create",
      { content: value.definition },
    );
    return toCurationOutcome(envelope, mapRequirement);
  }

  async updateRequirement(
    requirementId: string,
    value: { readonly definition: string },
  ) {
    const envelope = await this.client.mutate(
      "curation.requirements.update",
      {
        requirement_id: requirementId,
        content: value.definition,
      },
    );
    return toCurationOutcome(envelope, mapRequirement);
  }

  async updateSet(
    requirementSetId: string,
    value: { readonly definition: string },
  ) {
    const envelope = await this.client.mutate(
      "curation.requirement_sets.update",
      {
        requirement_set_id: requirementSetId,
        content: value.definition,
      },
    );
    return toCurationOutcome(envelope, mapRequirement);
  }

  async addMember(requirementSetId: string, memberId: string) {
    const envelope = await this.client.mutate(
      "curation.requirement_sets.member.add",
      {
        requirement_set_id: requirementSetId,
        member_id: memberId,
      },
    );
    return toCurationOutcome(envelope, mapRequirement);
  }

  async removeMember(requirementSetId: string, memberId: string) {
    const envelope = await this.client.mutate(
      "curation.requirement_sets.member.remove",
      {
        requirement_set_id: requirementSetId,
        member_id: memberId,
      },
    );
    return toCurationOutcome(envelope, mapRequirement);
  }

  async alignKnowledge(requirementId: string, knowledgeId: string) {
    const envelope = await this.client.mutate(
      "curation.requirements.knowledge.align",
      {
        requirement_id: requirementId,
        knowledge_id: knowledgeId,
      },
    );
    return toCurationOutcome(envelope, mapRequirement);
  }

  async unalignKnowledge(requirementId: string, knowledgeId: string) {
    const envelope = await this.client.mutate(
      "curation.requirements.knowledge.unalign",
      {
        requirement_id: requirementId,
        knowledge_id: knowledgeId,
      },
    );
    return toCurationOutcome(envelope, mapRequirement);
  }
}

export class HttpCurationQuestionAdapter implements QuestionCurationPort {
  constructor(private readonly client: HttpOperationClient) {}

  async list(query: {
    readonly search?: string;
    readonly alignment?: "all" | "aligned" | "unaligned";
  }) {
    const envelope = await this.client.query(
      "curation.questions.list",
      input({
        text_query: query.search,
        alignment:
          query.alignment && query.alignment !== "all"
            ? query.alignment
            : undefined,
      }),
    );
    return toCurationOutcome(envelope, mapCurationQuestionCollection);
  }

  async get(questionId: string) {
    const envelope = await this.client.query("curation.questions.get", {
      question_id: questionId,
    });
    return toCurationOutcome(envelope, mapCurationQuestion);
  }

  async create(value: {
    readonly questionText: string;
    readonly answerText: string;
  }) {
    const envelope = await this.client.mutate("curation.questions.create", {
      question_text: value.questionText,
      answer_text: value.answerText,
    });
    return toCurationOutcome(envelope, mapCurationQuestion);
  }

  async update(
    questionId: string,
    value: {
      readonly questionText: string;
      readonly answerText: string;
    },
  ) {
    const envelope = await this.client.mutate("curation.questions.update", {
      question_id: questionId,
      question_text: value.questionText,
      answer_text: value.answerText,
    });
    return toCurationOutcome(envelope, mapCurationQuestion);
  }

  async alignKnowledge(questionId: string, knowledgeId: string) {
    const envelope = await this.client.mutate(
      "curation.questions.knowledge.align",
      {
        question_id: questionId,
        knowledge_id: knowledgeId,
      },
    );
    return toCurationOutcome(envelope, mapCurationQuestion);
  }

  async unalignKnowledge(questionId: string, knowledgeId: string) {
    const envelope = await this.client.mutate(
      "curation.questions.knowledge.unalign",
      {
        question_id: questionId,
        knowledge_id: knowledgeId,
      },
    );
    return toCurationOutcome(envelope, mapCurationQuestion);
  }
}

export class HttpImportAdapter implements CurationImportPort {
  constructor(private readonly client: HttpOperationClient) {}

  async apply(documentText: string, expectedKind?: string) {
    let document: unknown;
    try {
      document = JSON.parse(documentText);
    } catch {
      return {
        status: "validation_rejected" as const,
        message: "Prepared-data document is not valid JSON.",
      };
    }

    const envelope = await this.client.mutate("curation.import.apply", {
      document,
      expected_data_kind: expectedKind,
    });
    return toCurationOutcome(envelope, mapImportResult);
  }
}
