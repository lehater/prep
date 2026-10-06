import type {
  CapabilityRef,
  FocusRef,
  KnowledgeRef,
  SemanticOutcome,
  TargetRef,
} from "../contracts";

export interface KnowledgeItemModel {
  readonly knowledgeRef: KnowledgeRef;
  readonly kind: "object" | "proposition";
  readonly label: string;
  readonly predicate?: string;
  readonly relatedRefs: readonly KnowledgeRef[];
}

export interface KnowledgeProjectionModel {
  readonly targetRef: TargetRef;
  readonly focusRef?: FocusRef;
  readonly requiredCapabilityRef?: CapabilityRef;
  readonly scope: "overview" | "detail";
  readonly query?: string;
  readonly anchorRefs: readonly KnowledgeRef[];
  readonly items: readonly KnowledgeItemModel[];
}

export interface KnowledgeQueryInput {
  readonly targetRef: TargetRef;
  readonly focusRef?: FocusRef;
  readonly requiredCapabilityRef?: CapabilityRef;
  readonly scope: "overview" | "detail";
  readonly query?: string;
}

export interface KnowledgePort {
  queryKnowledge(input: KnowledgeQueryInput): Promise<SemanticOutcome<KnowledgeProjectionModel>>;
}
