import type { CSSProperties } from "react";

import type {
  KnowledgeRelationshipRendererProps,
} from "../../features/knowledge-explorer/relationship-renderer";

interface PositionedNode {
  readonly node: KnowledgeRelationshipRendererProps["model"]["nodes"][number];
  readonly x: number;
  readonly y: number;
}

function nodePositions(
  nodes: KnowledgeRelationshipRendererProps["model"]["nodes"],
): readonly PositionedNode[] {
  if (nodes.length === 0) {
    return [];
  }

  const radius = nodes.length <= 6 ? 36 : 42;

  return nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2;
    return {
      node,
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
    };
  });
}

export function BasicKnowledgeRelationshipOverview({
  model,
  onSelectKnowledge,
}: KnowledgeRelationshipRendererProps) {
  const positioned = nodePositions(model.nodes);
  const byRef = new Map(
    positioned.map((entry) => [entry.node.knowledgeRef, entry]),
  );

  return (
    <div
      className="knowledge-relationship-canvas"
      data-relationship-renderer="basic-2d"
    >
      {positioned.length > 0 ? (
        <>
          <svg
            className="knowledge-relationship-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {model.edges.map((edge) => {
              const source = byRef.get(edge.sourceRef);
              const target = byRef.get(edge.targetRef);
              if (!source || !target) {
                return null;
              }

              const selected =
                edge.sourceRef === model.selectedKnowledgeRef ||
                edge.targetRef === model.selectedKnowledgeRef;
              const showLabel = selected || model.edges.length <= 6;

              return (
                <g
                  key={edge.propositionRef}
                  data-family={edge.family}
                  data-predicate={edge.predicate}
                >
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    data-selected={selected ? "true" : "false"}
                  />
                  <title>{`${edge.label}: ${edge.statement}`}</title>
                  {showLabel ? (
                    <text
                      className="knowledge-relationship-edge-label"
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {edge.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>

          {positioned.map(({ node, x, y }) => (
            <button
              key={node.knowledgeRef}
              type="button"
              className="knowledge-relationship-node"
              data-kind={node.kind}
              data-selected={node.selected ? "true" : "false"}
              style={
                {
                  "--knowledge-node-x": `${x}%`,
                  "--knowledge-node-y": `${y}%`,
                } as CSSProperties
              }
              title={node.label}
              aria-label={`${node.label}. Связей: ${node.relationCount}`}
              onClick={() => onSelectKnowledge(node.knowledgeRef)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </>
      ) : (
        <p className="supporting-text">Нет данных для обзора связей.</p>
      )}
    </div>
  );
}
