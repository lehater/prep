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
  mockTargetKnowledgeIds,
  mockTargetQuestionIds,
  mockTargets,
} from "./mockFixtures";

export class MockCurationStore {
  readonly knowledgeNodes: KnowledgeNodeModel[];
  readonly knowledgeRelations: KnowledgeRelationModel[];
  readonly targetKnowledgeIds: Record<string, string[]>;
  readonly targetQuestionIds: Record<string, string[]>;
  readonly targets: CurationTargetModel[];
  readonly requirements: CurationRequirementEntity[];
  readonly questions: CurationQuestionModel[];
  readonly importIdentityByKey = new Map<string, string>();
  readonly importFingerprints = new Set<string>();
  private sequence = 100;

  constructor() {
    this.knowledgeNodes = mockKnowledgeNodes.map((item) => ({ ...item }));
    this.knowledgeRelations = mockKnowledgeRelations.map((item) => ({ ...item }));
    this.targetKnowledgeIds = Object.fromEntries(
      Object.entries(mockTargetKnowledgeIds).map(([key, ids]) => [key, [...ids]]),
    );
    this.targetQuestionIds = Object.fromEntries(
      Object.entries(mockTargetQuestionIds).map(([key, ids]) => [key, [...ids]]),
    );
    this.requirements = [
      {
        id: "explain-resource-isolation",
        kind: "requirement",
        title: "Explain resource isolation",
        definition:
          "Explain why resource isolation is needed and how Linux can realize it.",
        knowledgeIds: ["resource-contention", "resource-isolation", "linux-cgroups"],
      },
      {
        id: "configure-resource-limits",
        kind: "requirement",
        title: "Configure bounded resource limits",
        definition:
          "Apply and verify bounded resource controls for a Linux workload.",
        knowledgeIds: ["configure-cpu-limits", "linux-cgroups"],
      },
      {
        id: "linux-resource-management",
        kind: "requirement-set",
        title: "Linux resource management",
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
        title: item.title,
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
      ? { id: item.id, kind: item.kind, title: item.title }
      : undefined;
  }

  importKey(kind: ImportDataKind, key: string): string {
    return `${kind}:${key}`;
  }
}

export function createMockCurationStore(): MockCurationStore {
  return new MockCurationStore();
}
