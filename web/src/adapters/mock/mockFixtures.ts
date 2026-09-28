import type {
  KnowledgeNodeModel,
  KnowledgeRelationModel,
} from "../../features/knowledge-explorer/model/knowledge";
import type { LearningStatisticsModel } from "../../features/learning/model/learningStatistics";
import type { LearningTargetModel } from "../../features/learning/model/learningTarget";
import type { QuestionModel } from "../../features/learning/model/question";
import {
  knowledgeGraphMockNodes,
  knowledgeGraphMockRelations,
} from "./mockKnowledgeGraphFixture";
import {
  donorKnowledgeNodes,
  donorKnowledgeRelations,
} from "./mockPaymentKnowledgeFixture";

export const PREPARED_TARGET_ID = "python-backend-fintech";

export const mockTargets: readonly LearningTargetModel[] = [
  {
    id: PREPARED_TARGET_ID,
    name: "Middle Python Backend — Fintech / Card Payments",
    definition:
      "Prepare for a Python backend role where reliable card-payment processing, distributed-system behavior and operational reasoning matter.",
    scopeSummary:
      "Python backend fundamentals plus payment processing, retry/idempotency safety and reconciliation capability.",
    scopeItems: [
      {
        id: "python-fintech-profile",
        kind: "requirement-set",
        title: "Python backend + card payments profile",
        summary: "Combined capability profile for backend engineering in a card-payments context.",
      },
      {
        id: "python-backend-core",
        kind: "requirement",
        title: "Build and reason about Python backend services",
        summary: "Design, implement and explain production Python backend behavior.",
      },
      {
        id: "card-payment-processing",
        kind: "requirement",
        title: "Explain the card-payment processing chain",
        summary: "Explain gateway, processor, acquiring, clearing and settlement responsibilities.",
      },
      {
        id: "reliable-payment-commands",
        kind: "requirement",
        title: "Design reliable payment commands",
        summary: "Handle retries, duplicate delivery and idempotent payment-side effects.",
      },
      {
        id: "payment-reconciliation",
        kind: "requirement",
        title: "Reason about payment reconciliation",
        summary: "Detect and resolve mismatches between internal and external financial records.",
      },
    ],
  },
];

const coreMockKnowledgeNodes: readonly KnowledgeNodeModel[] = [
  {
    id: "resource-contention",
    semanticKind: "concept",
    title: "Resource contention",
    summary: "Uncontrolled competition for finite resources can degrade isolation and service behavior.",
  },
  {
    id: "resource-isolation",
    semanticKind: "concept",
    title: "Resource isolation",
    summary: "A system property that separates resource consumption between workloads.",
  },
  {
    id: "linux-cgroups",
    semanticKind: "concept",
    title: "Linux cgroups",
    summary: "A Linux mechanism family for organizing processes and controlling resource usage.",
  },
  {
    id: "cgroups-enforcement",
    semanticKind: "mechanism",
    title: "How cgroups enforce resource limits",
    summary: "Controllers account for and constrain resource usage for processes grouped in cgroups.",
  },
  {
    id: "configure-cpu-limits",
    semanticKind: "procedure",
    title: "Configure CPU limits with cgroups",
    summary: "A bounded procedure for applying and verifying CPU resource constraints.",
  },
  {
    id: "linux-server-hardening",
    semanticKind: "strategy",
    title: "Linux server hardening",
    summary: "A strategy for selecting and organizing controls that reduce server exposure.",
  },
];

export const mockKnowledgeNodes: readonly KnowledgeNodeModel[] = [
  ...coreMockKnowledgeNodes,
  ...donorKnowledgeNodes,
  ...knowledgeGraphMockNodes,
];

const coreMockKnowledgeRelations: readonly KnowledgeRelationModel[] = [
  {
    id: "relation-isolation-addresses-contention",
    sourceId: "resource-isolation",
    targetId: "resource-contention",
    type: "addresses",
  },
  {
    id: "relation-cgroups-realizes-isolation",
    sourceId: "linux-cgroups",
    targetId: "resource-isolation",
    type: "realizes",
  },
];

export const mockKnowledgeRelations: readonly KnowledgeRelationModel[] = [
  ...coreMockKnowledgeRelations,
  ...donorKnowledgeRelations,
  ...knowledgeGraphMockRelations,
];

export const mockTargetKnowledgeIds: Readonly<Record<string, readonly string[]>> = {
  [PREPARED_TARGET_ID]: [
    "demo-payment-card-processing",
    "demo-payment-payment-gateway",
    "demo-payment-payment-processor",
    "demo-payment-merchant-acquiring",
    "demo-payment-payment-clearing",
    "demo-payment-payment-settlement",
    "demo-payment-duplicate-payment-processing",
    "demo-payment-idempotency-key",
    "demo-payment-transient-payment-failure",
    "demo-payment-retry-policy",
    "demo-payment-reconciliation-gap",
    "demo-payment-reconciliation-service",
  ],
};

export const mockQuestions: readonly QuestionModel[] = [
  {
    id: "question-idempotency",
    questionText: "Why does a payment API need an idempotency key?",
    answerText:
      "A stable idempotency key lets retried commands resolve to one logical payment operation instead of producing duplicate side effects.",
    knowledgeIds: [
      "demo-payment-idempotency-key",
      "demo-payment-duplicate-payment-processing",
      "demo-payment-retry-policy",
    ],
  },
  {
    id: "question-card-chain",
    questionText: "How do gateway, processor and acquirer differ in card processing?",
    answerText:
      "They occupy different responsibilities in merchant-side acceptance, message processing/routing and acquiring connectivity.",
    knowledgeIds: [
      "demo-payment-payment-gateway",
      "demo-payment-payment-processor",
      "demo-payment-merchant-acquiring",
      "demo-payment-card-processing",
    ],
  },
  {
    id: "question-reconciliation",
    questionText: "What problem does payment reconciliation solve?",
    answerText:
      "It detects and resolves mismatches between internal payment records and external processor, bank or settlement records.",
    knowledgeIds: [
      "demo-payment-reconciliation-gap",
      "demo-payment-reconciliation-service",
    ],
  },
];

export const mockTargetQuestionIds: Readonly<Record<string, readonly string[]>> = {
  [PREPARED_TARGET_ID]: mockQuestions.map((question) => question.id),
};

export const mockStatistics: LearningStatisticsModel = {
  aggregates: { total: 3, again: 1, hard: 0, good: 2, easy: 0 },
  observations: [
    {
      id: "review-1",
      questionId: "question-idempotency",
      occurredAt: "2026-09-20T08:30:00Z",
      rating: "Again",
      previousInterval: "1 day",
      nextInterval: "10 minutes",
      duration: "18 seconds",
      reviewPhase: "Relearning",
    },
    {
      id: "review-2",
      questionId: "question-card-chain",
      occurredAt: "2026-09-21T09:15:00Z",
      rating: "Good",
      previousInterval: "2 days",
      nextInterval: "5 days",
      duration: "12 seconds",
      reviewPhase: "Review",
    },
    {
      id: "review-3",
      questionId: "question-reconciliation",
      occurredAt: "2026-09-22T18:05:00Z",
      rating: "Good",
      previousInterval: "1 day",
      nextInterval: "4 days",
      duration: "11 seconds",
      reviewPhase: "Review",
    },
  ],
};
