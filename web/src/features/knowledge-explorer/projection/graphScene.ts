import type {
  KnowledgeGraphModel,
  KnowledgeRelationType,
  KnowledgeSemanticKind,
} from "../model/knowledge";

export interface GraphSceneNode {
  readonly knowledgeId: string;
  readonly label: string;
  readonly semanticKind: KnowledgeSemanticKind;
  readonly selected: boolean;
  readonly focused: boolean;
  readonly highlighted: boolean;
}

export interface GraphSceneEdge {
  readonly relationId: string;
  readonly sourceKnowledgeId: string;
  readonly targetKnowledgeId: string;
  readonly relationType: KnowledgeRelationType;
}

export interface GraphScene {
  readonly nodes: readonly GraphSceneNode[];
  readonly edges: readonly GraphSceneEdge[];
}

export interface GraphProjectionIntent {
  readonly selectedKnowledgeId?: string;
  readonly focusedKnowledgeIds?: readonly string[];
  readonly semanticKinds?: readonly KnowledgeSemanticKind[];
  readonly relationTypes?: readonly KnowledgeRelationType[];
}

export function buildGraphScene(
  graph: KnowledgeGraphModel,
  intent: GraphProjectionIntent,
): GraphScene {
  const allowedKinds = new Set(intent.semanticKinds ?? []);
  const allowedRelations = new Set(intent.relationTypes ?? []);
  const kindFiltered = graph.nodes.filter(
    (node) => allowedKinds.size === 0 || allowedKinds.has(node.semanticKind),
  );
  const kindFilteredIds = new Set(kindFiltered.map((node) => node.id));

  const relationFiltered = graph.relations.filter(
    (relation) =>
      kindFilteredIds.has(relation.sourceId) &&
      kindFilteredIds.has(relation.targetId) &&
      (allowedRelations.size === 0 || allowedRelations.has(relation.type)),
  );

  const focusIds = new Set(intent.focusedKnowledgeIds ?? []);
  let visibleIds = kindFilteredIds;

  if (focusIds.size > 0) {
    visibleIds = new Set(
      [...focusIds].filter((knowledgeId) => kindFilteredIds.has(knowledgeId)),
    );
    for (const relation of relationFiltered) {
      if (focusIds.has(relation.sourceId) || focusIds.has(relation.targetId)) {
        visibleIds.add(relation.sourceId);
        visibleIds.add(relation.targetId);
      }
    }
  }

  return {
    nodes: kindFiltered
      .filter((node) => visibleIds.has(node.id))
      .map((node) => ({
        knowledgeId: node.id,
        label: node.title,
        semanticKind: node.semanticKind,
        selected: node.id === intent.selectedKnowledgeId,
        focused: focusIds.has(node.id),
        highlighted: focusIds.has(node.id),
      })),
    edges: relationFiltered
      .filter(
        (relation) =>
          visibleIds.has(relation.sourceId) && visibleIds.has(relation.targetId),
      )
      .map((relation) => ({
        relationId: relation.id,
        sourceKnowledgeId: relation.sourceId,
        targetKnowledgeId: relation.targetId,
        relationType: relation.type,
      })),
  };
}
