import type { GraphRendererProps } from "../../features/knowledge-explorer/ports/GraphRenderer";

export function PlaceholderGraphRenderer({
  scene,
  onNodeActivate,
}: GraphRendererProps) {
  return (
    <section aria-label="Knowledge graph placeholder">
      <p>
        Renderer-neutral graph placeholder. Production 3D rendering is introduced
        in FI-03.
      </p>
      <ul aria-label="Graph nodes">
        {scene.nodes.map((node) => (
          <li key={node.knowledgeId}>
            <button type="button" onClick={() => onNodeActivate(node.knowledgeId)}>
              {node.label}
              {node.focused ? " — focused" : ""}
              {node.selected ? " — selected" : ""}
            </button>
          </li>
        ))}
      </ul>
      <ul aria-label="Graph relations">
        {scene.edges.map((edge) => (
          <li key={edge.relationId}>
            {edge.sourceKnowledgeId} —{edge.relationType}→ {edge.targetKnowledgeId}
          </li>
        ))}
      </ul>
    </section>
  );
}
