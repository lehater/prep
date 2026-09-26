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
        id: "explain-resource-isolation",
        kind: "requirement",
        label: "Explain resource isolation",
        definition:
          "Explain why resource isolation is needed and how Linux can realize it.",
        knowledgeIds: [
          "resource-contention",
          "resource-isolation",
          "linux-cgroups",
          "cgroups-enforcement",
        ],
      },
      {
        id: "configure-resource-limits",
        kind: "requirement",
        label: "Configure bounded resource limits",
        definition:
          "Apply and verify bounded resource controls for a Linux workload.",
        knowledgeIds: ["configure-cpu-limits", "linux-cgroups"],
      },
      {
        id: "linux-resource-management",
        kind: "requirement-set",
        label: "Linux resource management",
        definition:
          "Explain isolation mechanisms and apply bounded resource controls.",
        memberIds: ["explain-resource-isolation", "configure-resource-limits"],
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
    return item
      ? { id: item.id, kind: item.kind, label: item.label }
      : undefined;
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
      const item = this.requirements.find(
        (candidate) => candidate.id === requirementId,
      );
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
    if (this.knowledgeNodes.some((node) => node.id === reference)) {
      return reference;
    }
    return this.importIdentityByKey.get(this.importKey("knowledge", reference));
  }

  importKey(kind: ImportDataKind, key: string): string {
    return `${kind}:${key}`;
  }
}

export function createMockCurationStore(): MockCurationStore {
  return new MockCurationStore();
}
