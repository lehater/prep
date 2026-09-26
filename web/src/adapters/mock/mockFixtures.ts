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

export const PREPARED_TARGET_ID = "linux-backend-interview";

export const mockTargets: readonly LearningTargetModel[] = [
  {
    id: PREPARED_TARGET_ID,
    name: "Linux backend interview",
    definition:
      "Prepared target context for backend interview knowledge about Linux systems.",
    scopeSummary:
      "Linux resource-management concepts and operating procedures required by the prepared target.",
    scopeItems: [
      {
        id: "linux-resource-management",
        kind: "requirement-set",
        title: "Linux resource management",
        summary: "Explain isolation mechanisms and apply bounded resource controls.",
      },
      {
        id: "explain-resource-isolation",
        kind: "requirement",
        title: "Explain resource isolation",
        summary: "Explain why resource isolation is needed and how Linux can realize it.",
      },
    ],
  },
];

const coreMockKnowledgeNodes: readonly KnowledgeNodeModel[] = [
  {
    id: "resource-contention",
    semanticKind: "concept",
    title: "Resource contention",
    summary:
      "Uncontrolled competition for finite resources can degrade isolation and service behavior.",
  },
  {
    id: "resource-isolation",
    semanticKind: "concept",
    title: "Resource isolation",
    summary:
      "A system property that separates resource consumption between workloads.",
  },
  {
    id: "linux-cgroups",
    semanticKind: "concept",
    title: "Linux cgroups",
    summary:
      "A Linux mechanism family for organizing processes and controlling resource usage.",
  },
  {
    id: "cgroups-enforcement",
    semanticKind: "mechanism",
    title: "How cgroups enforce resource limits",
    summary:
      "Controllers account for and constrain resource usage for processes grouped in cgroups.",
  },
  {
    id: "configure-cpu-limits",
    semanticKind: "procedure",
    title: "Configure CPU limits with cgroups",
    summary:
      "A bounded procedure for applying and verifying CPU resource constraints.",
  },
  {
    id: "linux-server-hardening",
    semanticKind: "strategy",
    title: "Linux server hardening",
    summary:
      "A strategy for selecting and organizing controls that reduce server exposure.",
  },
];

export const mockKnowledgeNodes: readonly KnowledgeNodeModel[] = [
  ...coreMockKnowledgeNodes,
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
  ...knowledgeGraphMockRelations,
];

export const mockTargetKnowledgeIds: Readonly<Record<string, readonly string[]>> = {
  [PREPARED_TARGET_ID]: [
    "resource-contention",
    "resource-isolation",
    "linux-cgroups",
    "cgroups-enforcement",
    "configure-cpu-limits",
  ],
};

export const mockQuestions: readonly QuestionModel[] = [
  {
    id: "question-cgroups-purpose",
    questionText: "What problem do Linux cgroups help address?",
    answerText:
      "They help isolate and control resource consumption between groups of processes.",
    knowledgeIds: ["resource-contention", "resource-isolation", "linux-cgroups"],
  },
  {
    id: "question-cgroups-enforcement",
    questionText: "How do cgroup controllers enforce resource limits?",
    answerText:
      "Controllers account for resource usage and constrain processes within configured cgroups.",
    knowledgeIds: ["linux-cgroups", "cgroups-enforcement"],
  },
  {
    id: "question-cpu-limit",
    questionText: "What should be verified after applying a cgroup CPU limit?",
    answerText:
      "Verify that the intended processes are in the cgroup and that observed CPU use follows the configured constraint.",
    knowledgeIds: ["configure-cpu-limits", "linux-cgroups"],
  },
];

export const mockTargetQuestionIds: Readonly<Record<string, readonly string[]>> = {
  [PREPARED_TARGET_ID]: mockQuestions.map((question) => question.id),
};

export const mockStatistics: LearningStatisticsModel = {
  aggregates: {
    total: 4,
    again: 1,
    hard: 1,
    good: 2,
    easy: 0,
  },
  observations: [
    {
      id: "review-1",
      questionId: "question-cgroups-purpose",
      occurredAt: "2026-09-20T08:30:00Z",
      rating: "Good",
      previousInterval: "1 day",
      nextInterval: "3 days",
      duration: "8 seconds",
      reviewPhase: "Review",
    },
    {
      id: "review-2",
      questionId: "question-cgroups-enforcement",
      occurredAt: "2026-09-21T09:15:00Z",
      rating: "Again",
      previousInterval: "2 days",
      nextInterval: "10 minutes",
      duration: "14 seconds",
      reviewPhase: "Relearning",
    },
    {
      id: "review-3",
      questionId: "question-cgroups-enforcement",
      occurredAt: "2026-09-21T09:27:00Z",
      rating: "Hard",
      previousInterval: "10 minutes",
      nextInterval: "1 day",
      duration: "11 seconds",
      reviewPhase: "Relearning",
    },
    {
      id: "review-4",
      questionId: "question-cpu-limit",
      occurredAt: "2026-09-22T18:05:00Z",
      rating: "Good",
      previousInterval: "1 day",
      nextInterval: "4 days",
      duration: "9 seconds",
      reviewPhase: "Review",
    },
  ],
};
