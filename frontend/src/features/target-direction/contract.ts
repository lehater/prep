import type {
  CapabilityRef,
  EvidenceRef,
  GapRef,
  Limitation,
  RequirementRef,
  SemanticBasisRef,
  SemanticOutcome,
  TargetRef,
} from "../contracts";

export interface CandidateTargetOption {
  readonly targetRef: TargetRef;
  readonly label: string;
  readonly purpose: string;
  readonly uncertainty: readonly string[];
}

export interface CapabilityStateSummary {
  readonly capabilityRef: CapabilityRef;
  readonly capabilityLabel: string;
  readonly state: "demonstrated" | "challenged" | "unknown";
  readonly evidenceRefs: readonly EvidenceRef[];
  readonly limitations: readonly Limitation[];
}

export interface GapSummary {
  readonly gapRef: GapRef;
  readonly capabilityRef: CapabilityRef;
  readonly status: "satisfied" | "challenged" | "unresolved";
}

export interface ComparedTargetModel {
  readonly targetRef: TargetRef;
  readonly label: string;
  readonly purpose: string;
  readonly requirementRefs: readonly RequirementRef[];
  readonly sharedCapabilityRefs: readonly CapabilityRef[];
  readonly targetSpecificCapabilityRefs: readonly CapabilityRef[];
  readonly currentState: readonly CapabilityStateSummary[];
  readonly gaps: readonly GapSummary[];
  readonly uncertainty: readonly string[];
}

export interface TargetComparisonModel {
  readonly evidenceBasisRef: SemanticBasisRef;
  readonly candidates: readonly [ComparedTargetModel, ComparedTargetModel, ...ComparedTargetModel[]];
  readonly limitations: readonly Limitation[];
}

export interface CompareTargetsInput {
  readonly candidateTargetRefs: readonly [TargetRef, TargetRef, ...TargetRef[]];
}

export interface TargetDirectionPort {
  compareTargets(input: CompareTargetsInput): Promise<SemanticOutcome<TargetComparisonModel>>;
}
