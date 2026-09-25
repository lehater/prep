import type { ComponentType } from "react";

import type { GraphScene } from "../projection/graphScene";

export interface GraphViewportSnapshot {
  readonly rendererFamily: string;
  readonly value: unknown;
}

export interface GraphRendererProps {
  readonly scene: GraphScene;
  readonly viewport?: GraphViewportSnapshot;
  readonly onNodeActivate: (knowledgeId: string) => void;
  readonly onViewportChange?: (snapshot: GraphViewportSnapshot) => void;
  readonly onUnavailable?: (message: string) => void;
}

export type GraphRenderer = ComponentType<GraphRendererProps>;
