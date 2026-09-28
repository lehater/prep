import type { CurationCollection, CurationOutcome } from "./curationModels";

export interface TargetProfileModel {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  readonly capabilityIds: readonly string[];
}

export interface CapabilityCurationModel {
  readonly id: string;
  readonly title: string;
  readonly performanceExpectation: string;
  readonly conditionSummary: string;
  readonly criterionSummary: string;
  readonly knowledgeIds: readonly string[];
}

export type LearningSupportKind = "material" | "practice";

export interface LearningSupportCurationModel {
  readonly id: string;
  readonly title: string;
  readonly kind: LearningSupportKind;
  readonly summary: string;
  readonly capabilityIds: readonly string[];
  readonly knowledgeIds: readonly string[];
}

export interface AssessmentCurationModel {
  readonly id: string;
  readonly title: string;
  readonly capabilityIds: readonly string[];
  readonly taskSummary: string;
  readonly observationSummary: string;
  readonly evidenceRuleSummary: string;
  readonly evidenceBearing: "supports" | "challenges";
}

export interface CorpusDiagnosticModel {
  readonly id: string;
  readonly severity: "info" | "warning";
  readonly area: "targets" | "capabilities" | "knowledge" | "learning-support" | "assessment";
  readonly summary: string;
  readonly ownerSection: string;
}

export type UserCenteredCurationOutcome<T> = CurationOutcome<T>;
export type UserCenteredCurationCollection<T> = CurationCollection<T>;
