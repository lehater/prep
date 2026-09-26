import type { KnowledgeRelationType, KnowledgeSemanticKind } from "../features/knowledge-explorer/model/knowledge";
import type { GraphScene } from "../features/knowledge-explorer/projection/graphScene";

const KINDS: readonly KnowledgeSemanticKind[] = [
  "concept",
  "mechanism",
  "procedure",
  "strategy",
];
const RELATIONS: readonly KnowledgeRelationType[] = ["addresses", "realizes"];

export function createGraphStressScene(
  nodeCount: number,
  edgeCount = nodeCount * 5,
): GraphScene {
  if (nodeCount < 2) {
    throw new Error("Graph stress scene requires at least two nodes.");
  }

  const nodes = Array.from({ length: nodeCount }, (_, index) => ({
    knowledgeId: `stress-node-${index}`,
    label: `Stress node ${index}`,
    semanticKind: KINDS[index % KINDS.length],
    selected: index === 0,
    focused: index === 0,
    highlighted: index === 0,
  }));

  const edges = Array.from({ length: edgeCount }, (_, index) => {
    const sourceIndex = index % nodeCount;
    const stride = 1 + (index % 17);
    const targetIndex = (sourceIndex + stride) % nodeCount;
    return {
      relationId: `stress-edge-${index}`,
      sourceKnowledgeId: nodes[sourceIndex].knowledgeId,
      targetKnowledgeId: nodes[targetIndex].knowledgeId,
      relationType: RELATIONS[index % RELATIONS.length],
    };
  });

  return { nodes, edges };
}
