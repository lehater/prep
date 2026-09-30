export type TargetScopeItemKind = "requirement" | "requirement-set";

export interface TargetScopeItemModel {
  readonly id: string;
  readonly kind: TargetScopeItemKind;
  readonly title: string;
  readonly summary: string;
}

export interface TargetCapabilityModel {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
}

export type TargetPurpose = "role-capability" | "selection-interview" | "other";

export interface RelatedTargetModel {
  readonly id: string;
  readonly name: string;
  readonly purpose: TargetPurpose;
}

export interface LearningTargetModel {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  readonly targetPurpose?: TargetPurpose;
  readonly provenance?: readonly string[];
  readonly unresolvedExpectations?: readonly string[];
  readonly relatedTargets?: readonly RelatedTargetModel[];
  readonly scopeSummary: string;
  readonly capabilities: readonly TargetCapabilityModel[];

  /**
   * Compatibility projection retained for the existing Study/legacy curation donor code.
   * Target Work presentation must use capabilities instead.
   */
  readonly scopeItems: readonly TargetScopeItemModel[];
}
