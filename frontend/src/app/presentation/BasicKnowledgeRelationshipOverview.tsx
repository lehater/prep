import { type CSSProperties, useState } from "react";

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
  const [hoveredEdgeRef, setHoveredEdgeRef] = useState<string | null>(null);
  const [hoveredNodeRef, setHoveredNodeRef] = useState<string | null>(null);
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
              const hovered = edge.propositionRef === hoveredEdgeRef;

              return (
                <g
                  key={edge.propositionRef}
                  data-family={edge.family}
                  data-predicate={edge.predicate}
                  data-hovered={hovered ? "true" : "false"}
                >
                  <line
                    className="knowledge-relationship-edge-line"
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    data-selected={selected ? "true" : "false"}
                  />
                  <line
                    className="knowledge-relationship-edge-hit"
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    tabIndex={0}
                    aria-label={`${edge.label}: ${edge.statement}`}
                    onPointerEnter={() => setHoveredEdgeRef(edge.propositionRef)}
                    onPointerLeave={() => setHoveredEdgeRef(null)}
                    onFocus={() => setHoveredEdgeRef(edge.propositionRef)}
                    onBlur={() => setHoveredEdgeRef(null)}
                  />
                  {hovered ? (
                    <text
                      className="knowledge-relationship-edge-label"
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      pointerEvents="none"
                    >
                      {edge.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>

          {positioned.map(({ node, x, y }) => {
            const hovered = node.knowledgeRef === hoveredNodeRef;

            return (
              <div
                key={node.knowledgeRef}
                className="knowledge-relationship-node-anchor"
                style={
                  {
                    "--knowledge-node-x": `${x}%`,
                    "--knowledge-node-y": `${y}%`,
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  className="knowledge-relationship-node"
                  data-kind={node.kind}
                  data-selected={node.selected ? "true" : "false"}
                  aria-label={`${node.label}. Связей: ${node.relationCount}`}
                  onPointerEnter={() => setHoveredNodeRef(node.knowledgeRef)}
                  onPointerLeave={() => setHoveredNodeRef(null)}
                  onFocus={() => setHoveredNodeRef(node.knowledgeRef)}
                  onBlur={() => setHoveredNodeRef(null)}
                  onClick={() => onSelectKnowledge(node.knowledgeRef)}
                >
                  <span aria-hidden="true" />
                </button>
                {hovered ? (
                  <span
                    className="knowledge-relationship-tooltip"
                    role="tooltip"
                  >
                    {node.label}
                  </span>
                ) : null}
              </div>
            );
          })}
        </>
      ) : (
        <p className="supporting-text">Нет данных для обзора связей.</p>
      )}
    </div>
  );
}
