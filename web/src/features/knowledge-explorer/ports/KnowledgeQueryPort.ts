import type {
  KnowledgeGraphModel,
  KnowledgeNodeModel,
  KnowledgeScope,
  KnowledgeSemanticKind,
} from "../model/knowledge";

export interface KnowledgeListQuery {
  readonly search?: string;
  readonly semanticKinds?: readonly KnowledgeSemanticKind[];
}

export type KnowledgeQueryOutcome<T> =
  | { readonly status: "success"; readonly value: T }
  | { readonly status: "unavailable"; readonly message: string }
  | { readonly status: "failure"; readonly message: string };

export interface KnowledgeQueryPort {
  list(
    scope: KnowledgeScope,
    query: KnowledgeListQuery,
  ): Promise<KnowledgeQueryOutcome<readonly KnowledgeNodeModel[]>>;

  get(
    scope: KnowledgeScope,
    knowledgeId: string,
  ): Promise<KnowledgeQueryOutcome<KnowledgeNodeModel | null>>;

  graph(
    scope: KnowledgeScope,
  ): Promise<KnowledgeQueryOutcome<KnowledgeGraphModel>>;
}
