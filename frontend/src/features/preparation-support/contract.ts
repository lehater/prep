import type {
  FocusRef,
  PreparationRequestRef,
  Provenance,
  SemanticBasisRef,
  SemanticOutcome,
  TargetRef,
} from "../contracts";
import type { SupportModel } from "../activity/contract";

export interface PreparationRemainderItemModel {
  readonly subject: string;
  readonly status: "unresolved" | "rejected";
  readonly reason: string;
}

export interface PreparationRequestModel {
  readonly preparationRequestRef: PreparationRequestRef;
  readonly targetRef: TargetRef;
  readonly focusRef?: FocusRef;
  readonly sourceContext: string;
  readonly sourceProvenance: readonly Provenance[];
  readonly acceptedSupport: readonly SupportModel[];
  readonly remainder: readonly PreparationRemainderItemModel[];
  readonly state: "partial" | "complete" | "unresolved";
}

export interface RequestPreparationInput {
  readonly targetRef: TargetRef;
  readonly focusRef?: FocusRef;
  readonly sourceContext: string;
  readonly sourceProvenance: readonly Provenance[];
  readonly semanticBasisRef: SemanticBasisRef;
}

export interface PreparationSupportPort {
  requestPreparation(input: RequestPreparationInput): Promise<SemanticOutcome<PreparationRequestModel>>;
  getPreparation(
    preparationRequestRef: PreparationRequestRef,
  ): Promise<SemanticOutcome<PreparationRequestModel>>;
}
