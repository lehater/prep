export type TargetScopeItemKind = "requirement" | "requirement-set";

export interface TargetScopeItemModel {
  readonly id: string;
  readonly kind: TargetScopeItemKind;
  readonly title: string;
  readonly summary: string;
}

export interface LearningTargetModel {
  readonly id: string;
  readonly name: string;
  readonly definition: string;
  readonly scopeSummary: string;
  readonly scopeItems: readonly TargetScopeItemModel[];
}
