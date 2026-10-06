import type { ComponentType } from "react";

import type { KnowledgeRef } from "../contracts";

export interface KnowledgeRelationshipNodeModel {
  readonly knowledgeRef: KnowledgeRef;
  readonly kind: "object" | "proposition";
  readonly label: string;
  readonly relationCount: number;
  readonly selected: boolean;
}

export interface KnowledgeRelationshipEdgeModel {
  readonly propositionRef: KnowledgeRef;
  readonly sourceRef: KnowledgeRef;
  readonly targetRef: KnowledgeRef;
  readonly family: string;
  readonly predicate: string;
  readonly label: string;
}

export interface KnowledgeRelationshipOverviewModel {
  readonly nodes: readonly KnowledgeRelationshipNodeModel[];
  readonly edges: readonly KnowledgeRelationshipEdgeModel[];
  readonly selectedKnowledgeRef: KnowledgeRef | null;
}

export interface KnowledgeRelationshipRendererProps {
  readonly model: KnowledgeRelationshipOverviewModel;
  readonly onSelectKnowledge: (knowledgeRef: KnowledgeRef) => void;
}

export type KnowledgeRelationshipRenderer =
  ComponentType<KnowledgeRelationshipRendererProps>;
