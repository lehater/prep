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
import type {
  AssessmentCurationModel,
  CapabilityCurationModel,
  LearningSupportCurationModel,
} from "../../features/curation/model/userCenteredCurationModels";
import {
  mockKnowledgeNodes,
  mockKnowledgeRelations,
  mockQuestions,
  mockTargets,
} from "./mockFixtures";

export type MockCurationSeed = "prepared" | "empty";

export class MockCurationStore {
  readonly knowledgeNodes: KnowledgeNodeModel[];
  readonly knowledgeRelations: KnowledgeRelationModel[];
  readonly targets: CurationTargetModel[];
  readonly requirements: CurationRequirementEntity[];
  readonly questions: CurationQuestionModel[];
  readonly capabilities: CapabilityCurationModel[];
  readonly learningSupport: LearningSupportCurationModel[];
  readonly assessmentDesigns: AssessmentCurationModel[];
  readonly targetCapabilityIds = new Map<string, string[]>();
  readonly importIdentityByKey = new Map<string, string>();
  readonly importFingerprints = new Set<string>();
  private sequence = 100;

  constructor(seed: MockCurationSeed = "prepared") {
    if (seed === "empty") {
      this.knowledgeNodes = [];
      this.knowledgeRelations = [];
      this.requirements = [];
      this.targets = [];
      this.questions = [];
      this.capabilities = [];
      this.learningSupport = [];
      this.assessmentDesigns = [];
      return;
    }

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
      targetPurpose: target.targetPurpose,
      provenance: target.provenance,
      unresolvedExpectations: target.unresolvedExpectations,
      relatedTargetRefs: target.relatedTargets?.map((item) => item.id),
      scopeItems: target.scopeItems.map((item) => ({
        id: item.id,
        kind: item.kind,
        label: item.title,
      })),
    }));
    this.questions = mockQuestions.map((question) => ({ ...question }));
    this.capabilities = [
      {
        id: "cap-python-backend",
        title: "Python backend engineering",
        performanceExpectation: "Design, implement and explain production Python backend services.",
        conditionSummary: "Production service constraints, ordinary operational tooling and incomplete information.",
        criterionSummary: "Correctness, maintainability, failure handling and reasoning quality.",
        knowledgeIds: [],
      },
      {
        id: "cap-distributed-systems",
        title: "Distributed backend systems",
        performanceExpectation:
          "Reason about distributed service behavior, partial failure, concurrency and asynchronous coordination.",
        conditionSummary:
          "Multiple services, asynchronous work, partial failures and independently failing dependencies.",
        criterionSummary:
          "Explicit failure modes, bounded coordination assumptions and safe behavior under concurrency.",
        knowledgeIds: [],
      },
      {
        id: "cap-data-persistence",
        title: "Databases and transactional persistence",
        performanceExpectation:
          "Design and reason about persistent data access, transactions, consistency and schema evolution for backend services.",
        conditionSummary:
          "Concurrent service workloads with persistent state and production data-change constraints.",
        criterionSummary:
          "Correct transactional boundaries, consistency reasoning and safe data evolution.",
        knowledgeIds: [],
      },
      {
        id: "cap-backend-security",
        title: "Backend security and access control",
        performanceExpectation:
          "Design backend authorization and access-control behavior without conflating authentication, policy and enforcement.",
        conditionSummary:
          "Protected service resources with multiple principals, roles or policy attributes.",
        criterionSummary:
          "Correct trust boundaries, explicit authorization decisions and least-privilege reasoning.",
        knowledgeIds: [],
      },
      {
        id: "cap-observability",
        title: "Production observability",
        performanceExpectation:
          "Diagnose backend failures using logs, metrics and traces while preserving evidence and correlation context.",
        conditionSummary:
          "Distributed production failures with incomplete information and multiple observable signals.",
        criterionSummary:
          "Evidence-backed localization, useful correlation and explicit uncertainty.",
        knowledgeIds: [],
      },
      {
        id: "cap-card-processing",
        title: "Card-payment processing",
        performanceExpectation: "Explain responsibilities and message flow across the card-payment processing chain.",
        conditionSummary: "Merchant-side card payment from acceptance through clearing and settlement.",
        criterionSummary: "Correct participant responsibilities, direction of flow and operational boundaries.",
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
        id: "cap-payment-reliability",
        title: "Reliable payment commands",
        performanceExpectation: "Design payment commands that remain safe under retries and duplicate delivery.",
        conditionSummary: "Transient failures, client retries and at-least-once delivery.",
        criterionSummary: "No duplicate logical side effect; bounded retries; explicit non-retryable failures.",
        knowledgeIds: [
          "demo-payment-duplicate-payment-processing",
          "demo-payment-idempotency-key",
          "demo-payment-transient-payment-failure",
          "demo-payment-retry-policy",
        ],
      },
      {
        id: "cap-reconciliation",
        title: "Payment reconciliation",
        performanceExpectation: "Detect, explain and resolve mismatches between internal and external payment records.",
        conditionSummary: "Processor, bank or settlement records may arrive late or disagree with internal state.",
        criterionSummary: "Correct mismatch identification, traceability and safe resolution.",
        knowledgeIds: [
          "demo-payment-reconciliation-gap",
          "demo-payment-reconciliation-service",
        ],
      },
    ];
    this.learningSupport = [
      {
        id: "support-idempotency-material",
        title: "Idempotency and retry safety",
        kind: "material",
        summary: "Explanation of idempotency keys, duplicate delivery and bounded retry policy.",
        capabilityIds: ["cap-payment-reliability"],
        knowledgeIds: [
          "demo-payment-idempotency-key",
          "demo-payment-duplicate-payment-processing",
          "demo-payment-retry-policy",
        ],
      },
      {
        id: "support-card-processing-material",
        title: "Card processing responsibility map",
        kind: "material",
        summary: "Reference material for gateway, processor, acquiring, clearing and settlement responsibilities.",
        capabilityIds: ["cap-card-processing"],
        knowledgeIds: [
          "demo-payment-payment-gateway",
          "demo-payment-payment-processor",
          "demo-payment-merchant-acquiring",
          "demo-payment-payment-clearing",
          "demo-payment-payment-settlement",
        ],
      },
      {
        id: "support-retry-practice",
        title: "Retry-safe payment endpoint",
        kind: "practice",
        summary: "Practice task requiring a retry-safe payment command design.",
        capabilityIds: ["cap-payment-reliability"],
        knowledgeIds: ["demo-payment-idempotency-key", "demo-payment-retry-policy"],
      },
    ];
    this.assessmentDesigns = [
      {
        id: "assessment-python-backend-confirmation",
        title: "Python backend confirmation diagnostic",
        capabilityIds: ["cap-python-backend"],
        taskSummary:
          "Explain a representative production backend design while preserving failure and maintainability reasoning.",
        observationSummary:
          "Observe whether the already-established backend capability remains supported under the represented conditions.",
        evidenceRuleSummary:
          "A conforming observation may add current supporting evidence without changing target satisfaction that is already established.",
        evidenceBearing: "supports",
      },
      {
        id: "assessment-python-backend-challenge",
        title: "Python backend uncertainty diagnostic",
        capabilityIds: ["cap-python-backend"],
        taskSummary:
          "Probe a production backend scenario designed to expose a potentially material weakness in the previously established capability.",
        observationSummary:
          "Observe whether the learner misses a required failure-handling or reasoning constraint under the represented conditions.",
        evidenceRuleSummary:
          "A conforming adverse observation challenges the current positive claim but does not itself establish a negative capability claim.",
        evidenceBearing: "challenges",
      },
      {
        id: "assessment-payment-reliability",
        title: "Payment reliability diagnostic",
        capabilityIds: ["cap-payment-reliability"],
        taskSummary: "Explain and design retry-safe payment command handling under duplicate delivery.",
        observationSummary: "Observe whether idempotency and retry constraints are correctly identified and applied.",
        evidenceRuleSummary: "A supported positive claim requires correct reasoning across the retry/idempotency scenario; one raw answer is not broad mastery.",
        evidenceBearing: "supports",
      },
      {
        id: "assessment-card-chain",
        title: "Card processing chain diagnostic",
        capabilityIds: ["cap-card-processing"],
        taskSummary: "Place payment participants and processing stages into their correct responsibility chain.",
        observationSummary: "Observe participant-role and flow correctness.",
        evidenceRuleSummary: "Evidence is scoped to the represented processing conditions.",
        evidenceBearing: "supports",
      },
    ];
    this.targetCapabilityIds.set("python-backend-fintech", [
      "cap-python-backend",
      "cap-distributed-systems",
      "cap-data-persistence",
      "cap-card-processing",
      "cap-payment-reliability",
      "cap-reconciliation",
      "cap-backend-security",
      "cap-observability",
    ]);
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

    const knowledgeIds = new Set<string>();

    for (const capabilityId of this.targetCapabilityIds.get(targetId) ?? []) {
      const capability = this.capabilities.find(
        (candidate) => candidate.id === capabilityId,
      );
      capability?.knowledgeIds.forEach((id) => knowledgeIds.add(id));
    }

    // Compatibility path for legacy Requirement/RequirementSet-backed donor flows.
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
    if (this.knowledgeNodes.some((node) => node.id === reference)) return reference;
    return this.importIdentityByKey.get(this.importKey("knowledge", reference));
  }

  importKey(kind: ImportDataKind, key: string): string {
    return `${kind}:${key}`;
  }
}

export function createMockCurationStore(
  seed: MockCurationSeed = "prepared",
): MockCurationStore {
  return new MockCurationStore(seed);
}
