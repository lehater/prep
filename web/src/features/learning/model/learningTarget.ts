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

export interface LearningTargetModel {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  readonly scopeSummary: string;
  readonly capabilities: readonly TargetCapabilityModel[];

  /**
   * Compatibility projection retained for the existing Study/legacy curation donor code.
   * Target Work presentation must use capabilities instead.
   */
  readonly scopeItems: readonly TargetScopeItemModel[];
}
