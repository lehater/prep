import {
  KNOWLEDGE_RELATION_TYPES,
  KNOWLEDGE_SEMANTIC_KINDS,
  type KnowledgeNodeModel,
} from "../../features/knowledge-explorer/model/knowledge";
import type {
  CurationKnowledgeDetailModel,
  CurationOutcome,
  CurationQuestionModel,
  CurationRequirementEntity,
  CurationRequirementSetModel,
  CurationTargetModel,
  ImportDataKind,
  ImportItemOutcomeModel,
  ImportResultModel,
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
import type { MockCurationStore } from "./MockCurationStore";

export type MockCurationMode = "success" | "unavailable" | "failure";

function problem<T>(
  mode: MockCurationMode,
  subject: string,
): CurationOutcome<T> | null {
  if (mode === "unavailable") {
    return { status: "unavailable", message: `${subject} is temporarily unavailable.` };
  }
  if (mode === "failure") {
    return { status: "failure", message: `${subject} failed. Retry the operation.` };
  }
  return null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function titleFromContent(content: string): string {
  const firstLine = content
    .split(/\n+/)
    .map((value) => value.trim())
    .find(Boolean);
  const title = firstLine || "Knowledge";
  return title.length <= 80 ? title : `${title.slice(0, 77)}...`;
}

export class MockCurationTargetAdapter implements TargetCurationPort {
  constructor(
    private readonly store: MockCurationStore,
    private readonly mode: MockCurationMode = "success",
  ) {}

  async list(query: { readonly search?: string }) {
    const issue = problem<{ items: readonly CurationTargetModel[]; totalCount: number }>(
      this.mode,
      "Curation targets",
    );
    if (issue) return issue;

    const search = query.search?.trim().toLocaleLowerCase() ?? "";
    const items = this.store.targets.filter(
      (target) =>
        search.length === 0 ||
        target.name.toLocaleLowerCase().includes(search) ||
        target.definition.toLocaleLowerCase().includes(search),
    );
    return { status: "success" as const, value: { items, totalCount: items.length } };
  }

  async get(targetId: string): Promise<CurationOutcome<CurationTargetModel>> {
    const issue = problem<CurationTargetModel>(this.mode, "Curation target");
    if (issue) return issue;
    const target = this.store.targets.find((item) => item.id === targetId);
    return target
      ? { status: "success", value: target }
      : { status: "not_found", message: "LearningTarget not found." };
  }

  async create(input: { readonly name: string; readonly definition: string }) {
    const issue = problem<CurationTargetModel>(this.mode, "Target creation");
    if (issue) return issue;
    if (!input.name.trim() || !input.definition.trim()) {
      return {
        status: "validation_rejected" as const,
        message: "Target name and definition are required.",
      };
    }
    const target: CurationTargetModel = {
      id: this.store.nextId("target"),
      name: input.name.trim(),
      definition: input.definition.trim(),
      scopeItems: [],
    };
    this.store.targets.push(target);
    return { status: "success" as const, value: target };
  }

  async update(
    targetId: string,
    input: { readonly name: string; readonly definition: string },
  ) {
    const issue = problem<CurationTargetModel>(this.mode, "Target update");
    if (issue) return issue;
    if (!input.name.trim() || !input.definition.trim()) {
      return {
        status: "validation_rejected" as const,
        message: "Target name and definition are required.",
      };
    }
    const index = this.store.targets.findIndex((item) => item.id === targetId);
    if (index < 0) {
      return { status: "not_found" as const, message: "LearningTarget not found." };
    }
    const current = this.store.targets[index];
    const updated: CurationTargetModel = {
      ...current,
      name: input.name.trim(),
      definition: input.definition.trim(),
    };
    this.store.targets[index] = updated;
    return { status: "success" as const, value: updated };
  }

  async addScope(targetId: string, scopeItemId: string) {
    const issue = problem<CurationTargetModel>(this.mode, "Target scope update");
    if (issue) return issue;
    const index = this.store.targets.findIndex((item) => item.id === targetId);
    const scopeItem = this.store.scopeItem(scopeItemId);
    if (index < 0) {
      return { status: "not_found" as const, message: "LearningTarget not found." };
    }
    if (!scopeItem) {
      return {
        status: "validation_rejected" as const,
        message: "Selected Requirement or RequirementSet does not exist.",
      };
    }
    const current = this.store.targets[index];
    if (current.scopeItems.some((item) => item.id === scopeItemId)) {
      return { status: "success" as const, value: current };
    }
    const updated = { ...current, scopeItems: [...current.scopeItems, scopeItem] };
    this.store.targets[index] = updated;
    return { status: "success" as const, value: updated };
  }

  async removeScope(targetId: string, scopeItemId: string) {
    const issue = problem<CurationTargetModel>(this.mode, "Target scope update");
    if (issue) return issue;
    const index = this.store.targets.findIndex((item) => item.id === targetId);
    if (index < 0) {
      return { status: "not_found" as const, message: "LearningTarget not found." };
    }
    const current = this.store.targets[index];
    const updated = {
      ...current,
      scopeItems: current.scopeItems.filter((item) => item.id !== scopeItemId),
    };
    this.store.targets[index] = updated;
    return { status: "success" as const, value: updated };
  }
}

export class MockCurationKnowledgeAdapter implements KnowledgeCurationPort {
  constructor(
    private readonly store: MockCurationStore,
    private readonly mode: MockCurationMode = "success",
  ) {}

  async get(knowledgeId: string) {
    const issue = problem<CurationKnowledgeDetailModel>(this.mode, "Knowledge editor");
    if (issue) return issue;
    return this.detail(knowledgeId);
  }

  async create(input: KnowledgeDraft) {
    const issue = problem<CurationKnowledgeDetailModel>(this.mode, "Knowledge creation");
    if (issue) return issue;
    if (!input.content.trim() || !KNOWLEDGE_SEMANTIC_KINDS.includes(input.semanticKind)) {
      return {
        status: "validation_rejected" as const,
        message: "Knowledge semantic kind and content are required.",
      };
    }
    const content = input.content.trim();
    const node: KnowledgeNodeModel = {
      id: this.store.nextId("knowledge"),
      semanticKind: input.semanticKind,
      title: titleFromContent(content),
      summary: content,
    };
    this.store.knowledgeNodes.push(node);
    return this.detail(node.id);
  }

  async update(knowledgeId: string, input: KnowledgeDraft) {
    const issue = problem<CurationKnowledgeDetailModel>(this.mode, "Knowledge update");
    if (issue) return issue;
    if (!input.content.trim() || !KNOWLEDGE_SEMANTIC_KINDS.includes(input.semanticKind)) {
      return {
        status: "validation_rejected" as const,
        message: "Knowledge semantic kind and content are required.",
      };
    }
    const index = this.store.knowledgeNodes.findIndex((node) => node.id === knowledgeId);
    if (index < 0) {
      return { status: "not_found" as const, message: "KnowledgeNode not found." };
    }
    const content = input.content.trim();
    this.store.knowledgeNodes[index] = {
      ...this.store.knowledgeNodes[index],
      semanticKind: input.semanticKind,
      title: titleFromContent(content),
      summary: content,
    };
    return this.detail(knowledgeId);
  }

  async addRelation(input: KnowledgeRelationDraft) {
    const issue = problem<CurationKnowledgeDetailModel>(this.mode, "Knowledge relation update");
    if (issue) return issue;
    if (
      !this.store.knowledgeNodes.some((node) => node.id === input.sourceId) ||
      !this.store.knowledgeNodes.some((node) => node.id === input.targetId) ||
      !KNOWLEDGE_RELATION_TYPES.includes(input.type)
    ) {
      return {
        status: "validation_rejected" as const,
        message: "Relation source, target and accepted relation type must resolve.",
      };
    }
    const existing = this.store.knowledgeRelations.find(
      (relation) =>
        relation.sourceId === input.sourceId &&
        relation.targetId === input.targetId &&
        relation.type === input.type,
    );
    if (!existing) {
      this.store.knowledgeRelations.push({
        id: this.store.nextId("relation"),
        ...input,
      });
    }
    return this.detail(input.sourceId);
  }

  async removeRelation(relationId: string) {
    const issue = problem<null>(this.mode, "Knowledge relation removal");
    if (issue) return issue;
    const index = this.store.knowledgeRelations.findIndex(
      (relation) => relation.id === relationId,
    );
    if (index < 0) {
      return { status: "not_found" as const, message: "KnowledgeRelation not found." };
    }
    this.store.knowledgeRelations.splice(index, 1);
    return { status: "success" as const, value: null };
  }

  private detail(knowledgeId: string): CurationOutcome<CurationKnowledgeDetailModel> {
    const node = this.store.knowledgeNodes.find((item) => item.id === knowledgeId);
    if (!node) {
      return { status: "not_found", message: "KnowledgeNode not found." };
    }
    return {
      status: "success",
      value: {
        node,
        incomingRelations: this.store.knowledgeRelations.filter(
          (relation) => relation.targetId === knowledgeId,
        ),
        outgoingRelations: this.store.knowledgeRelations.filter(
          (relation) => relation.sourceId === knowledgeId,
        ),
      },
    };
  }
}

export class MockRequirementAdapter implements RequirementCurationPort {
  constructor(
    private readonly store: MockCurationStore,
    private readonly mode: MockCurationMode = "success",
  ) {}

  async list(query: { readonly search?: string }) {
    const issue = problem<{ items: readonly CurationRequirementEntity[]; totalCount: number }>(
      this.mode,
      "Requirements",
    );
    if (issue) return issue;
    const search = query.search?.trim().toLocaleLowerCase() ?? "";
    const items = this.store.requirements.filter(
      (item) =>
        search.length === 0 ||
        item.label.toLocaleLowerCase().includes(search) ||
        item.definition.toLocaleLowerCase().includes(search),
    );
    return { status: "success" as const, value: { items, totalCount: items.length } };
  }

  async get(requirementId: string) {
    const issue = problem<CurationRequirementEntity>(this.mode, "Requirement");
    if (issue) return issue;
    const item = this.store.requirements.find((candidate) => candidate.id === requirementId);
    return item
      ? { status: "success" as const, value: item }
      : { status: "not_found" as const, message: "Requirement or RequirementSet not found." };
  }

  async createRequirement(input: { readonly definition: string }) {
    return this.create("requirement", input);
  }

  async createSet(input: { readonly definition: string }) {
    return this.create("requirement-set", input);
  }

  async updateRequirement(
    requirementId: string,
    input: { readonly definition: string },
  ) {
    return this.update(requirementId, "requirement", input);
  }

  async updateSet(
    requirementSetId: string,
    input: { readonly definition: string },
  ) {
    return this.update(requirementSetId, "requirement-set", input);
  }

  async addMember(requirementSetId: string, memberId: string) {
    const issue = problem<CurationRequirementEntity>(this.mode, "RequirementSet membership");
    if (issue) return issue;
    const set = this.requirementSet(requirementSetId);
    const member = this.store.requirements.find((item) => item.id === memberId);
    if (!set || !member) {
      return {
        status: "validation_rejected" as const,
        message: "RequirementSet and member must both resolve.",
      };
    }
    if (set.memberIds.includes(memberId)) {
      return { status: "success" as const, value: set };
    }
    if (memberId === requirementSetId || this.setContains(memberId, requirementSetId)) {
      return {
        status: "validation_rejected" as const,
        message: "RequirementSet membership would create a cycle.",
      };
    }
    const updated = { ...set, memberIds: [...set.memberIds, memberId] };
    this.replace(updated);
    return { status: "success" as const, value: updated };
  }

  async removeMember(requirementSetId: string, memberId: string) {
    const issue = problem<CurationRequirementEntity>(this.mode, "RequirementSet membership");
    if (issue) return issue;
    const set = this.requirementSet(requirementSetId);
    if (!set) {
      return { status: "not_found" as const, message: "RequirementSet not found." };
    }
    const updated = {
      ...set,
      memberIds: set.memberIds.filter((id) => id !== memberId),
    };
    this.replace(updated);
    return { status: "success" as const, value: updated };
  }

  async alignKnowledge(requirementId: string, knowledgeId: string) {
    const issue = problem<CurationRequirementEntity>(this.mode, "Requirement alignment");
    if (issue) return issue;
    const item = this.store.requirements.find((candidate) => candidate.id === requirementId);
    if (!item || item.kind !== "requirement") {
      return { status: "not_found" as const, message: "Requirement not found." };
    }
    if (!this.store.knowledgeNodes.some((node) => node.id === knowledgeId)) {
      return {
        status: "validation_rejected" as const,
        message: "Selected KnowledgeNode does not exist.",
      };
    }
    if (item.knowledgeIds.includes(knowledgeId)) {
      return { status: "success" as const, value: item };
    }
    const updated = { ...item, knowledgeIds: [...item.knowledgeIds, knowledgeId] };
    this.replace(updated);
    return { status: "success" as const, value: updated };
  }

  async unalignKnowledge(requirementId: string, knowledgeId: string) {
    const issue = problem<CurationRequirementEntity>(this.mode, "Requirement alignment");
    if (issue) return issue;
    const item = this.store.requirements.find((candidate) => candidate.id === requirementId);
    if (!item || item.kind !== "requirement") {
      return { status: "not_found" as const, message: "Requirement not found." };
    }
    const updated = {
      ...item,
      knowledgeIds: item.knowledgeIds.filter((id) => id !== knowledgeId),
    };
    this.replace(updated);
    return { status: "success" as const, value: updated };
  }

  private create(
    kind: "requirement" | "requirement-set",
    input: { readonly definition: string },
  ): Promise<CurationOutcome<CurationRequirementEntity>> {
    const issue = problem<CurationRequirementEntity>(this.mode, "Requirement creation");
    if (issue) return Promise.resolve(issue);
    if (!input.definition.trim()) {
      return Promise.resolve({
        status: "validation_rejected",
        message: "Requirement definition is required.",
      });
    }
    const definition = input.definition.trim();
    const base = {
      id: this.store.nextId(kind === "requirement" ? "requirement" : "requirement-set"),
      label: titleFromContent(definition),
      definition,
    };
    const entity: CurationRequirementEntity =
      kind === "requirement"
        ? { ...base, kind, knowledgeIds: [] }
        : { ...base, kind, memberIds: [] };
    this.store.requirements.push(entity);
    return Promise.resolve({ status: "success", value: entity });
  }

  private update(
    id: string,
    kind: "requirement" | "requirement-set",
    input: { readonly definition: string },
  ): Promise<CurationOutcome<CurationRequirementEntity>> {
    const issue = problem<CurationRequirementEntity>(this.mode, "Requirement update");
    if (issue) return Promise.resolve(issue);
    if (!input.definition.trim()) {
      return Promise.resolve({
        status: "validation_rejected",
        message: "Requirement definition is required.",
      });
    }
    const item = this.store.requirements.find((candidate) => candidate.id === id);
    if (!item || item.kind !== kind) {
      return Promise.resolve({
        status: "not_found",
        message: "Requirement or RequirementSet not found.",
      });
    }
    const definition = input.definition.trim();
    const updated = {
      ...item,
      label: titleFromContent(definition),
      definition,
    };
    this.replace(updated);
    return Promise.resolve({ status: "success", value: updated });
  }

  private replace(updated: CurationRequirementEntity) {
    const index = this.store.requirements.findIndex((item) => item.id === updated.id);
    this.store.requirements[index] = updated;
  }

  private requirementSet(id: string): CurationRequirementSetModel | undefined {
    const item = this.store.requirements.find((candidate) => candidate.id === id);
    return item?.kind === "requirement-set" ? item : undefined;
  }

  private setContains(startId: string, soughtId: string, visited = new Set<string>()): boolean {
    if (startId === soughtId) return true;
    if (visited.has(startId)) return false;
    visited.add(startId);
    const set = this.requirementSet(startId);
    return set
      ? set.memberIds.some((memberId) => this.setContains(memberId, soughtId, visited))
      : false;
  }
}

export class MockCurationQuestionAdapter implements QuestionCurationPort {
  constructor(
    private readonly store: MockCurationStore,
    private readonly mode: MockCurationMode = "success",
  ) {}

  async list(query: {
    readonly search?: string;
    readonly alignment?: "all" | "aligned" | "unaligned";
  }) {
    const issue = problem<{ items: readonly CurationQuestionModel[]; totalCount: number }>(
      this.mode,
      "Questions",
    );
    if (issue) return issue;
    const search = query.search?.trim().toLocaleLowerCase() ?? "";
    const alignment = query.alignment ?? "all";
    const items = this.store.questions.filter(
      (question) =>
        (search.length === 0 ||
          question.questionText.toLocaleLowerCase().includes(search) ||
          question.answerText.toLocaleLowerCase().includes(search)) &&
        (alignment === "all" ||
          (alignment === "aligned"
            ? question.knowledgeIds.length > 0
            : question.knowledgeIds.length === 0)),
    );
    return { status: "success" as const, value: { items, totalCount: items.length } };
  }

  async get(questionId: string) {
    const issue = problem<CurationQuestionModel>(this.mode, "Question");
    if (issue) return issue;
    const question = this.store.questions.find((item) => item.id === questionId);
    return question
      ? { status: "success" as const, value: question }
      : { status: "not_found" as const, message: "Question not found." };
  }

  async create(input: { readonly questionText: string; readonly answerText: string }) {
    const issue = problem<CurationQuestionModel>(this.mode, "Question creation");
    if (issue) return issue;
    if (!input.questionText.trim() || !input.answerText.trim()) {
      return {
        status: "validation_rejected" as const,
        message: "Question text and direct answer are required.",
      };
    }
    const question: CurationQuestionModel = {
      id: this.store.nextId("question"),
      questionText: input.questionText.trim(),
      answerText: input.answerText.trim(),
      knowledgeIds: [],
    };
    this.store.questions.push(question);
    return { status: "success" as const, value: question };
  }

  async update(
    questionId: string,
    input: { readonly questionText: string; readonly answerText: string },
  ) {
    const issue = problem<CurationQuestionModel>(this.mode, "Question update");
    if (issue) return issue;
    if (!input.questionText.trim() || !input.answerText.trim()) {
      return {
        status: "validation_rejected" as const,
        message: "Question text and direct answer are required.",
      };
    }
    const index = this.store.questions.findIndex((item) => item.id === questionId);
    if (index < 0) {
      return { status: "not_found" as const, message: "Question not found." };
    }
    const updated = {
      ...this.store.questions[index],
      questionText: input.questionText.trim(),
      answerText: input.answerText.trim(),
    };
    this.store.questions[index] = updated;
    return { status: "success" as const, value: updated };
  }

  async alignKnowledge(questionId: string, knowledgeId: string) {
    return this.setAlignment(questionId, knowledgeId, true);
  }

  async unalignKnowledge(questionId: string, knowledgeId: string) {
    return this.setAlignment(questionId, knowledgeId, false);
  }

  private async setAlignment(
    questionId: string,
    knowledgeId: string,
    aligned: boolean,
  ): Promise<CurationOutcome<CurationQuestionModel>> {
    const issue = problem<CurationQuestionModel>(this.mode, "Question alignment");
    if (issue) return issue;
    const index = this.store.questions.findIndex((item) => item.id === questionId);
    if (index < 0) {
      return { status: "not_found", message: "Question not found." };
    }
    if (!this.store.knowledgeNodes.some((node) => node.id === knowledgeId)) {
      return {
        status: "validation_rejected",
        message: "Selected KnowledgeNode does not exist.",
      };
    }
    const current = this.store.questions[index];
    const knowledgeIds = aligned
      ? current.knowledgeIds.includes(knowledgeId)
        ? current.knowledgeIds
        : [...current.knowledgeIds, knowledgeId]
      : current.knowledgeIds.filter((id) => id !== knowledgeId);
    const updated = { ...current, knowledgeIds };
    this.store.questions[index] = updated;
    return { status: "success", value: updated };
  }
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export class MockImportAdapter implements CurationImportPort {
  constructor(
    private readonly store: MockCurationStore,
    private readonly targets: MockCurationTargetAdapter,
    private readonly knowledge: MockCurationKnowledgeAdapter,
    private readonly requirements: MockRequirementAdapter,
    private readonly questions: MockCurationQuestionAdapter,
    private readonly mode: MockCurationMode = "success",
  ) {}

  async apply(documentText: string, expectedKind?: ImportDataKind) {
    const issue = problem<ImportResultModel>(this.mode, "Prepared-data import");
    if (issue) return issue;

    let document: unknown;
    try {
      document = JSON.parse(documentText);
    } catch {
      return {
        status: "validation_rejected" as const,
        message: "Prepared-data document is not valid JSON.",
      };
    }
    if (!document || typeof document !== "object" || Array.isArray(document)) {
      return {
        status: "validation_rejected" as const,
        message: "Prepared-data envelope must be an object.",
      };
    }
    const envelope = document as Record<string, unknown>;
    const kind = envelope.data_kind;
    const supported = ["knowledge", "requirements", "questions", "targets"] as const;
    if (
      !text(envelope.schema_version) ||
      typeof kind !== "string" ||
      !supported.includes(kind as ImportDataKind) ||
      !Array.isArray(envelope.items)
    ) {
      return {
        status: "validation_rejected" as const,
        message: "Envelope requires schema_version, supported data_kind and items[].",
      };
    }
    const dataKind = kind as ImportDataKind;
    if (expectedKind && dataKind !== expectedKind) {
      return {
        status: "validation_rejected" as const,
        message: `Expected a ${expectedKind} document, received ${dataKind}.`,
      };
    }

    const outcomes: ImportItemOutcomeModel[] = [];
    for (let index = 0; index < envelope.items.length; index += 1) {
      outcomes.push(await this.applyItem(dataKind, envelope.items[index], index));
    }
    const rejected = outcomes.filter((item) => item.status === "rejected").length;
    const applied = outcomes.length - rejected;
    const value: ImportResultModel = {
      total: outcomes.length,
      applied,
      rejected,
      items: outcomes,
    };
    return { status: "success" as const, value };
  }

  private async applyItem(
    kind: ImportDataKind,
    raw: unknown,
    index: number,
  ): Promise<ImportItemOutcomeModel> {
    const itemLabel = `item ${index + 1}`;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return { item: itemLabel, status: "rejected", reason: "representation/schema rejection" };
    }
    const item = raw as Record<string, unknown>;
    const stableKey = text(item.key);
    const id = text(item.id);
    const identityKey = stableKey ? this.store.importKey(kind, stableKey) : "";
    const knownId = identityKey ? this.store.importIdentityByKey.get(identityKey) : undefined;
    const fingerprint = stableStringify(item);
    if (!stableKey && !id && this.store.importFingerprints.has(`${kind}:${fingerprint}`)) {
      return { item: itemLabel, status: "duplicate_skipped" };
    }

    const updateId = id || knownId;
    let outcome: CurationOutcome<unknown>;
    if (kind === "knowledge") {
      const relationType = text(item.relation_type);
      const sourceReference = text(item.source);
      const targetReference = text(item.target);
      if (relationType || sourceReference || targetReference) {
        const type = KNOWLEDGE_RELATION_TYPES.find((value) => value === relationType);
        const sourceId = this.store.resolveKnowledgeReference(sourceReference);
        const targetId = this.store.resolveKnowledgeReference(targetReference);
        if (!type || !sourceId || !targetId) {
          return {
            item: stableKey || id || itemLabel,
            status: "rejected",
            reason: !sourceId || !targetId
              ? "unresolved reference"
              : "representation/schema rejection",
          };
        }
        const duplicate = this.store.knowledgeRelations.some(
          (relation) =>
            relation.sourceId === sourceId &&
            relation.targetId === targetId &&
            relation.type === type,
        );
        if (duplicate) {
          return {
            item: stableKey || id || itemLabel,
            status: "duplicate_skipped",
          };
        }
        const relationOutcome = await this.knowledge.addRelation({
          sourceId,
          targetId,
          type,
        });
        return relationOutcome.status === "success"
          ? { item: stableKey || id || itemLabel, status: "created" }
          : {
              item: stableKey || id || itemLabel,
              status: "rejected",
              reason: relationOutcome.message,
            };
      }

      const semanticKind = text(item.semantic_kind);
      const content = text(item.content);
      const acceptedKind = KNOWLEDGE_SEMANTIC_KINDS.find(
        (value) => value === semanticKind,
      );
      if (!acceptedKind || !content) {
        return {
          item: stableKey || id || itemLabel,
          status: "rejected",
          reason: "representation/schema rejection",
        };
      }
      const draft = { semanticKind: acceptedKind, content };
      outcome = updateId
        ? await this.knowledge.update(updateId, draft)
        : await this.knowledge.create(draft);
    } else if (kind === "questions") {
      const input = {
        questionText: text(item.question_text),
        answerText: text(item.answer_text),
      };
      outcome = updateId
        ? await this.questions.update(updateId, input)
        : await this.questions.create(input);
      if (outcome.status === "success" && Array.isArray(item.knowledge)) {
        for (const knowledgeId of item.knowledge.map(text).filter(Boolean)) {
          const aligned = await this.questions.alignKnowledge(
            (outcome.value as CurationQuestionModel).id,
            knowledgeId,
          );
          if (aligned.status !== "success") {
            return { item: itemLabel, status: "rejected", reason: aligned.message };
          }
        }
      }
    } else if (kind === "targets") {
      const definition = text(item.definition) || text(item.content);
      const input = {
        name: text(item.name) || titleFromContent(definition),
        definition,
      };
      outcome = updateId
        ? await this.targets.update(updateId, input)
        : await this.targets.create(input);
    } else {
      const definition = text(item.definition) || text(item.content);
      const input = { definition };
      const entityKind = text(item.kind);
      if (updateId) {
        const current = await this.requirements.get(updateId);
        outcome =
          current.status === "success" && current.value.kind === "requirement-set"
            ? await this.requirements.updateSet(updateId, input)
            : await this.requirements.updateRequirement(updateId, input);
      } else {
        outcome =
          entityKind === "requirement-set"
            ? await this.requirements.createSet(input)
            : await this.requirements.createRequirement(input);
      }
    }

    if (outcome.status !== "success") {
      return { item: stableKey || id || itemLabel, status: "rejected", reason: outcome.message };
    }

    const createdId =
      typeof outcome.value === "object" &&
      outcome.value !== null &&
      "id" in outcome.value &&
      typeof (outcome.value as { id?: unknown }).id === "string"
        ? (outcome.value as { id: string }).id
        : typeof outcome.value === "object" &&
            outcome.value !== null &&
            "node" in outcome.value
          ? (outcome.value as CurationKnowledgeDetailModel).node.id
          : updateId;

    if (identityKey && createdId) {
      this.store.importIdentityByKey.set(identityKey, createdId);
    }
    if (!stableKey && !id) {
      this.store.importFingerprints.add(`${kind}:${fingerprint}`);
    }
    return {
      item: stableKey || id || createdId || itemLabel,
      status: updateId ? "updated" : "created",
    };
  }
}
