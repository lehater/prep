export const KNOWLEDGE_SEMANTIC_KINDS = [
  "concept",
  "mechanism",
  "procedure",
  "strategy",
] as const;

export type KnowledgeSemanticKind = (typeof KNOWLEDGE_SEMANTIC_KINDS)[number];

export const KNOWLEDGE_RELATION_TYPES = [
  "addresses",
  "uses",
  "specializes",
  "part_of",
  "depends_on",
  "realizes",
  "produces",
  "derives_from",
  "enables",
] as const;

export type KnowledgeRelationType = (typeof KNOWLEDGE_RELATION_TYPES)[number];

export interface KnowledgeNodeModel {
  readonly id: string;
  readonly semanticKind: KnowledgeSemanticKind;
  readonly title: string;
  readonly summary: string;
}

export interface KnowledgeRelationModel {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: KnowledgeRelationType;
}

export type KnowledgeScope =
  | { readonly kind: "global" }
  | { readonly kind: "target"; readonly targetId: string };

export interface KnowledgeGraphModel {
  readonly scope: KnowledgeScope;
  readonly nodes: readonly KnowledgeNodeModel[];
  readonly relations: readonly KnowledgeRelationModel[];
}

export function knowledgeScopeKey(scope: KnowledgeScope): string {
  return scope.kind === "global" ? "global" : `target:${scope.targetId}`;
}
