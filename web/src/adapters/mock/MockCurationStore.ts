import type {
  KnowledgeNodeModel,
  KnowledgeRelationModel,
} from "../../features/knowledge-explorer/model/knowledge";
import type {
  CurationQuestionModel,
  CurationRequirementEntity,
  CurationTargetModel,
  ImportDataKind,
} from "../../features/curation/model/curationModels";
import {
  mockKnowledgeNodes,
  mockKnowledgeRelations,
  mockQuestions,
  mockTargets,
} from "./mockFixtures";

export class MockCurationStore {
  readonly knowledgeNodes: KnowledgeNodeModel[];
  readonly knowledgeRelations: KnowledgeRelationModel[];
  readonly targets: CurationTargetModel[];
  readonly requirements: CurationRequirementEntity[];
  readonly questions: CurationQuestionModel[];
  readonly importIdentityByKey = new Map<string, string>();
  readonly importFingerprints = new Set<string>();
  private sequence = 100;

  constructor() {
    this.knowledgeNodes = mockKnowledgeNodes.map((item) => ({ ...item }));
    this.knowledgeRelations = mockKnowledgeRelations.map((item) => ({ ...item }));
    this.requirements = [
      {
        id: "python-backend-core",
        kind: "requirement",
        label: "Build and reason about Python backend services",
        definition: "Design, implement and explain production Python backend behavior.",
        knowledgeIds: [],
      },
      {
        id: "card-payment-processing",
        kind: "requirement",
        label: "Explain the card-payment processing chain",
        definition: "Explain gateway, processor, acquiring, clearing and settlement responsibilities.",
        knowledgeIds: [
          "demo-payment-card-processing",
          "demo-payment-payment-gateway",
          "demo-payment-payment-processor",
          "demo-payment-merchant-acquiring",
          "demo-payment-payment-clearing",
          "demo-payment-payment-settlement",
        ],
      },
      {
        id: "reliable-payment-commands",
        kind: "requirement",
        label: "Design reliable payment commands",
        definition: "Handle retries, duplicate delivery and idempotent payment-side effects.",
        knowledgeIds: [
          "demo-payment-duplicate-payment-processing",
          "demo-payment-idempotency-key",
          "demo-payment-transient-payment-failure",
          "demo-payment-retry-policy",
        ],
      },
      {
        id: "payment-reconciliation",
        kind: "requirement",
        label: "Reason about payment reconciliation",
        definition: "Detect and resolve mismatches between internal and external financial records.",
        knowledgeIds: [
          "demo-payment-reconciliation-gap",
          "demo-payment-reconciliation-service",
        ],
      },
      {
        id: "python-fintech-profile",
        kind: "requirement-set",
        label: "Python backend + card payments profile",
        definition: "Combined capability profile for backend engineering in a card-payments context.",
        memberIds: [
          "python-backend-core",
          "card-payment-processing",
          "reliable-payment-commands",
          "payment-reconciliation",
        ],
      },
    ];
    this.targets = mockTargets.map((target) => ({
      id: target.id,
      name: target.name,
      definition: target.definition,
      scopeItems: target.scopeItems.map((item) => ({
        id: item.id,
        kind: item.kind,
        label: item.title,
      })),
    }));
    this.questions = mockQuestions.map((question) => ({ ...question }));
  }

  nextId(prefix: string): string {
    this.sequence += 1;
    return `${prefix}-${this.sequence}`;
  }

  scopeItem(scopeItemId: string) {
    const item = this.requirements.find((candidate) => candidate.id === scopeItemId);
    return item ? { id: item.id, kind: item.kind, label: item.label } : undefined;
  }

  knowledgeIdsForTarget(targetId: string): readonly string[] {
    const target = this.targets.find((candidate) => candidate.id === targetId);
    if (!target) return [];

    const requirementIds = new Set<string>();
    const visited = new Set<string>();
    const visit = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const item = this.requirements.find((candidate) => candidate.id === id);
      if (!item) return;
      if (item.kind === "requirement") {
        requirementIds.add(item.id);
        return;
      }
      item.memberIds.forEach(visit);
    };
    target.scopeItems.forEach((item) => visit(item.id));

    const knowledgeIds = new Set<string>();
    for (const requirementId of requirementIds) {
      const item = this.requirements.find((candidate) => candidate.id === requirementId);
      if (item?.kind === "requirement") {
        item.knowledgeIds.forEach((id) => knowledgeIds.add(id));
      }
    }
    return [...knowledgeIds];
  }

  questionIdsForTarget(targetId: string): readonly string[] {
    const knowledgeIds = new Set(this.knowledgeIdsForTarget(targetId));
    if (knowledgeIds.size === 0) return [];
    return this.questions
      .filter((question) =>
        question.knowledgeIds.some((knowledgeId) => knowledgeIds.has(knowledgeId)),
      )
      .map((question) => question.id);
  }

  resolveKnowledgeReference(reference: string): string | undefined {
    if (this.knowledgeNodes.some((node) => node.id === reference)) return reference;
    return this.importIdentityByKey.get(this.importKey("knowledge", reference));
  }

  importKey(kind: ImportDataKind, key: string): string {
    return `${kind}:${key}`;
  }
}

export function createMockCurationStore(): MockCurationStore {
  return new MockCurationStore();
}
