import type {
  CapabilityRef,
  EvidenceRef,
  FocusRef,
  GapRef,
  Limitation,
  Provenance,
  RequirementRef,
  SemanticBasisRef,
  SemanticOutcome,
  TargetRef,
} from "../contracts";

export interface CapabilityStateModel {
  readonly capabilityRef: CapabilityRef;
  readonly capabilityLabel: string;
  readonly state: "demonstrated" | "challenged" | "unknown";
  readonly evidenceRefs: readonly EvidenceRef[];
  readonly limitations: readonly Limitation[];
}

export interface CurrentStateModel {
  readonly targetRef: TargetRef;
  readonly capabilities: readonly CapabilityStateModel[];
}

export interface EvidenceFactModel {
  readonly evidenceRef: EvidenceRef;
  readonly kind: "performance" | "observation";
  readonly summary: string;
  readonly provenance: readonly Provenance[];
  readonly supportsCapabilityRefs: readonly CapabilityRef[];
  readonly challengesCapabilityRefs: readonly CapabilityRef[];
  readonly limitations: readonly Limitation[];
}

export interface EvidenceModel {
  readonly targetRef: TargetRef;
  readonly facts: readonly EvidenceFactModel[];
}

export interface GapModel {
  readonly gapRef: GapRef;
  readonly requirementRef: RequirementRef;
  readonly capabilityRef: CapabilityRef;
  readonly status: "satisfied" | "challenged" | "unresolved";
  readonly rationale: string;
}

export interface FocusCandidateContextModel {
  readonly gapRef: GapRef;
  readonly capabilityRef: CapabilityRef;
  readonly targetRelevance: string;
  readonly priorityRationale: string;
  readonly supportAvailability: "available" | "limited" | "missing";
}

export interface FocusDecisionContextModel {
  readonly targetRef: TargetRef;
  readonly candidates: readonly FocusCandidateContextModel[];
  readonly externalConstraints: readonly string[];
}

export interface FocusModel {
  readonly focusRef: FocusRef;
  readonly targetRef: TargetRef;
  readonly purpose: string;
  readonly capabilityRefs: readonly CapabilityRef[];
  readonly gapRefs: readonly GapRef[];
  readonly rationale: string;
}

export interface GapProjectionModel {
  readonly gaps: readonly GapModel[];
  readonly decisionContext: FocusDecisionContextModel;
}

export interface SetFocusInput {
  readonly targetRef: TargetRef;
  readonly selectedGapRefs: readonly GapRef[];
  readonly selectedCapabilityRefs: readonly CapabilityRef[];
  readonly purpose: string;
  readonly rationale: string;
  readonly semanticBasisRef: SemanticBasisRef;
}

export interface CurrentPositionPort {
  getCurrentState(targetRef: TargetRef): Promise<SemanticOutcome<CurrentStateModel>>;
  getEvidence(targetRef: TargetRef, evidenceRef?: EvidenceRef): Promise<SemanticOutcome<EvidenceModel>>;
  getGaps(targetRef: TargetRef): Promise<SemanticOutcome<GapProjectionModel>>;
  setFocus(input: SetFocusInput): Promise<SemanticOutcome<FocusModel>>;
}
