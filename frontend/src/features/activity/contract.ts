import type {
  ActivityAttemptRef,
  CapabilityRef,
  EvidenceRef,
  FocusRef,
  Limitation,
  SemanticBasisRef,
  SemanticOutcome,
  SupportRef,
  TargetRef,
} from "../contracts";

export interface SupportModel {
  readonly supportRef: SupportRef;
  readonly label: string;
  readonly kind:
    | "learning-material"
    | "learning-support-requirement"
    | "task-specification"
    | "observation-specification";
  readonly intendedCapabilityRef: CapabilityRef;
  readonly expectedConditions: readonly string[];
  readonly fitBasis: string;
  readonly limitations: readonly Limitation[];
}

export interface ActivityAttemptModel {
  readonly activityAttemptRef: ActivityAttemptRef;
  readonly targetRef: TargetRef;
  readonly focusRef: FocusRef;
  readonly supportRef: SupportRef;
  readonly semanticBasisRef: SemanticBasisRef;
  readonly state: "active" | "submitted" | "evidence-processing" | "reviewable";
}

export interface ActivityCompletionModel {
  readonly activityAttemptRef: ActivityAttemptRef;
  readonly outcome:
    | "reviewable"
    | "no-change"
    | "challenged"
    | "increased-uncertainty"
    | "unresolved";
  readonly historicalFactsAccepted: boolean;
  readonly evidenceRef?: EvidenceRef;
}

export interface ListSupportInput {
  readonly targetRef: TargetRef;
  readonly focusRef: FocusRef;
}

export interface StartActivityInput {
  readonly targetRef: TargetRef;
  readonly focusRef: FocusRef;
  readonly supportRef: SupportRef;
  readonly semanticBasisRef: SemanticBasisRef;
}

export interface CompleteActivityInput {
  readonly activityAttemptRef: ActivityAttemptRef;
  readonly resultSummary: string;
  readonly provenance: string;
  readonly semanticBasisRef: SemanticBasisRef;
}

export interface ActivityPort {
  listSupport(input: ListSupportInput): Promise<SemanticOutcome<readonly SupportModel[]>>;
  startActivity(input: StartActivityInput): Promise<SemanticOutcome<ActivityAttemptModel>>;
  completeActivity(input: CompleteActivityInput): Promise<SemanticOutcome<ActivityCompletionModel>>;
}
