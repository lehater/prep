import type {
  KnowledgeNodeModel,
  KnowledgeRelationModel,
} from "../../features/knowledge-explorer/model/knowledge";
import type { LearningTargetModel } from "../../features/learning/model/learningTarget";

export const PREPARED_TARGET_ID = "linux-backend-interview";

export const mockTargets: readonly LearningTargetModel[] = [
  {
    id: PREPARED_TARGET_ID,
    name: "Linux backend interview",
    definition:
      "Prepared target context for backend interview knowledge about Linux systems.",
    scopeSummary: "Representative reusable Knowledge aligned to the prepared target.",
  },
];

export const mockKnowledgeNodes: readonly KnowledgeNodeModel[] = [
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

export const mockKnowledgeRelations: readonly KnowledgeRelationModel[] = [
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

export const mockTargetKnowledgeIds: Readonly<Record<string, readonly string[]>> = {
  [PREPARED_TARGET_ID]: [
    "resource-contention",
    "resource-isolation",
    "linux-cgroups",
    "cgroups-enforcement",
    "configure-cpu-limits",
  ],
};
