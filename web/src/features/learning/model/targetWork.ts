export type TargetRequirementState = "satisfied" | "unresolved" | "challenged";

export interface EvidenceBasisModel {
  readonly id: string;
  readonly summary: string;
  readonly provenance: string;
}

export interface TargetStateItemModel {
  readonly requirementId: string;
  readonly title: string;
  readonly summary: string;
  readonly state: TargetRequirementState;
  readonly basis: readonly EvidenceBasisModel[];
}

export interface TargetStateModel {
  readonly targetId: string;
  readonly projectionId: string;
  readonly items: readonly TargetStateItemModel[];
}

export interface GapModel {
  readonly id: string;
  readonly requirementId: string;
  readonly title: string;
  readonly kind: "unresolved" | "challenged";
  readonly summary: string;
  readonly basis: string;
  readonly support: "available" | "missing";
}

export interface LearningFocusModel {
  readonly id: string;
  readonly gapId: string;
  readonly title: string;
  readonly intentKind: "learning" | "diagnostic";
  readonly rationale: string;
}

export interface LearningSupportModel {
  readonly id: string;
  readonly title: string;
  readonly kind: "material" | "practice" | "question-compatible";
  readonly summary: string;
}

export interface DiagnosticOpportunityModel {
  readonly id: string;
  readonly gapId: string;
  readonly capabilityId: string;
  readonly title: string;
  readonly summary: string;
}

export interface DiagnosticEvidenceAcceptanceModel {
  readonly diagnosticId: string;
  readonly observation: {
    readonly id: string;
    readonly summary: string;
    readonly provenance: string;
  };
  readonly derivedClaim: {
    readonly capabilityId: string;
    readonly summary: string;
  };
  readonly state: TargetStateModel;
}

export interface ProgressChangeModel {
  readonly requirementId: string;
  readonly title: string;
  readonly before: TargetRequirementState;
  readonly after: TargetRequirementState;
  readonly evidenceSummary: string;
}

export interface ProgressComparisonModel {
  readonly targetId: string;
  readonly fromProjectionId: string;
  readonly toProjectionId: string;
  readonly changes: readonly ProgressChangeModel[];
  readonly summary: string;
}
