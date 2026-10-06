export type Ref<Kind extends string> = string & { readonly __refKind: Kind };

export type SemanticBasisRef = Ref<"semantic-basis">;
export type TargetRef = Ref<"target">;
export type RequirementRef = Ref<"requirement">;
export type CapabilityRef = Ref<"capability">;
export type EvidenceRef = Ref<"evidence">;
export type GapRef = Ref<"gap">;
export type FocusRef = Ref<"focus">;
export type KnowledgeRef = Ref<"knowledge">;
export type SupportRef = Ref<"support">;
export type ActivityAttemptRef = Ref<"activity-attempt">;
export type PreparationRequestRef = Ref<"preparation-request">;
export type SourceRef = Ref<"source">;

export interface Provenance {
  readonly label: string;
  readonly sourceRef?: SourceRef;
  readonly observedAt?: string;
}

export interface Limitation {
  readonly kind:
    | "time"
    | "condition"
    | "coverage"
    | "transfer"
    | "dependence"
    | "target-uncertainty"
    | "other";
  readonly detail: string;
}

export interface CurrentProjection<Value> {
  readonly value: Value;
  readonly basisRef: SemanticBasisRef;
  readonly currentness: "current" | "stale";
}

export type SemanticFailureStatus =
  | "unresolved"
  | "rejected"
  | "dependency-unavailable"
  | "stale-basis"
  | "operational-failure";

export type SemanticOutcome<Value> =
  | {
      readonly status: "accepted";
      readonly projection: CurrentProjection<Value>;
    }
  | {
      readonly status: SemanticFailureStatus;
      readonly message: string;
      readonly currentBasisRef?: SemanticBasisRef;
    };

export function ref<Kind extends string>(value: string): Ref<Kind> {
  return value as Ref<Kind>;
}
