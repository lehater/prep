import type {
  GraphScene,
  GraphSceneEdge,
  GraphSceneNode,
} from "../../features/knowledge-explorer/projection/graphScene";

export interface Rfg3dNode {
  readonly id: string;
  readonly label: string;
  readonly semanticKind: GraphSceneNode["semanticKind"];
  x?: number;
  y?: number;
  z?: number;
  fx?: number;
  fy?: number;
  fz?: number;
}

export interface Rfg3dLink {
  readonly id: string;
  source: string | Rfg3dNode;
  target: string | Rfg3dNode;
  readonly relationType: GraphSceneEdge["relationType"];
}

export interface Rfg3dGraphData {
  readonly nodes: Rfg3dNode[];
  readonly links: Rfg3dLink[];
}

export function rendererNodeDataKey(scene: GraphScene): string {
  return scene.nodes
    .map((node) => `${node.knowledgeId}\u0000${node.label}\u0000${node.semanticKind}`)
    .join("\u0001");
}

export function rendererLinkDataKey(scene: GraphScene): string {
  return scene.edges
    .map(
      (edge) =>
        `${edge.relationId}\u0000${edge.sourceKnowledgeId}\u0000${edge.targetKnowledgeId}\u0000${edge.relationType}`,
    )
    .join("\u0001");
}

export function rendererGraphDataKey(scene: GraphScene): string {
  return `${rendererNodeDataKey(scene)}\u0002${rendererLinkDataKey(scene)}`;
}

function initialPosition(index: number, count: number) {
  const normalized = count <= 1 ? 0 : index / (count - 1);
  const y = 1 - normalized * 2;
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = index * Math.PI * (3 - Math.sqrt(5));
  const radius = 28 + Math.cbrt(Math.max(1, count)) * 8;
  return {
    x: Math.cos(theta) * radiusAtY * radius,
    y: y * radius,
    z: Math.sin(theta) * radiusAtY * radius,
  };
}

export function toRendererNodes(scene: GraphScene): Rfg3dNode[] {
  return scene.nodes.map((node, index) => ({
    id: node.knowledgeId,
    label: node.label,
    semanticKind: node.semanticKind,
    ...initialPosition(index, scene.nodes.length),
  }));
}

export function toRendererLinks(scene: GraphScene): Rfg3dLink[] {
  return scene.edges.map((edge) => ({
    id: edge.relationId,
    source: edge.sourceKnowledgeId,
    target: edge.targetKnowledgeId,
    relationType: edge.relationType,
  }));
}

export function toRendererGraphData(scene: GraphScene): Rfg3dGraphData {
  return {
    nodes: toRendererNodes(scene),
    links: toRendererLinks(scene),
  };
}
