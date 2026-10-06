import type {
  CapabilityRef,
  FocusRef,
  KnowledgeRef,
  SemanticOutcome,
  TargetRef,
} from "../contracts";

export type KnowledgeKind = "object" | "proposition";

export interface RelatedKnowledgeModel {
  readonly knowledgeRef: KnowledgeRef;
  readonly kind: KnowledgeKind;
  readonly label: string;
  readonly propositionRef: KnowledgeRef;
  readonly relationFamily: string;
  readonly predicate: string;
  readonly inversePredicate?: string;
  readonly direction: "outgoing" | "incoming";
}

export interface KnowledgeItemModel {
  readonly knowledgeRef: KnowledgeRef;
  readonly kind: KnowledgeKind;
  readonly knowledgeForm?: string;
  readonly label: string;
  readonly predicate?: string;
  readonly related: readonly RelatedKnowledgeModel[];
}

export interface KnowledgeRelationshipProjectionModel {
  readonly propositionRef: KnowledgeRef;
  readonly family: string;
  readonly predicate: string;
  readonly inversePredicate?: string;
  readonly sourceRef: KnowledgeRef;
  readonly targetRef: KnowledgeRef;
  readonly statement: string;
}

export interface KnowledgeProjectionModel {
  readonly targetRef: TargetRef;
  readonly focusRef?: FocusRef;
  readonly requiredCapabilityRef?: CapabilityRef;
  readonly requiredCapabilityLabel?: string;
  readonly scope: "overview" | "detail";
  readonly query?: string;
  readonly anchorRefs: readonly KnowledgeRef[];
  readonly items: readonly KnowledgeItemModel[];
  readonly relationships: readonly KnowledgeRelationshipProjectionModel[];
}

export interface KnowledgeQueryInput {
  readonly targetRef: TargetRef;
  readonly focusRef?: FocusRef;
  readonly requiredCapabilityRef?: CapabilityRef;
  readonly scope: "overview" | "detail";
  readonly query?: string;
}

export interface KnowledgePort {
  queryKnowledge(
    input: KnowledgeQueryInput,
  ): Promise<SemanticOutcome<KnowledgeProjectionModel>>;
}
