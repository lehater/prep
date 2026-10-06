import type {
  ActivityAttemptRef,
  SemanticBasisRef,
  SemanticOutcome,
  TargetRef,
} from "../contracts";
import type {
  CurrentStateModel,
  EvidenceModel,
} from "../current-position/contract";

export interface ChangeModel {
  readonly targetRef: TargetRef;
  readonly activityAttemptRef?: ActivityAttemptRef;
  readonly previousBasisRef: SemanticBasisRef;
  readonly currentBasisRef: SemanticBasisRef;
  readonly learnerEvidenceChange:
    | "changed"
    | "no-change"
    | "challenged"
    | "increased-uncertainty"
    | "unresolved";
  readonly targetInformationChange: "changed" | "no-change" | "unresolved";
  readonly explanation: string;
}

export interface GetChangeInput {
  readonly targetRef: TargetRef;
  readonly activityAttemptRef?: ActivityAttemptRef;
  readonly priorBasisRef?: SemanticBasisRef;
}

export interface EvidenceChangePort {
  getEvidence(targetRef: TargetRef): Promise<SemanticOutcome<EvidenceModel>>;
  getChange(input: GetChangeInput): Promise<SemanticOutcome<ChangeModel>>;
  getCurrentState(targetRef: TargetRef): Promise<SemanticOutcome<CurrentStateModel>>;
}
