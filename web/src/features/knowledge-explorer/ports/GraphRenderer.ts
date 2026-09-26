import type { ComponentType } from "react";

import type { GraphScene } from "../projection/graphScene";

export type GraphPerformanceProfile = "auto" | "quality" | "performance";
export type GraphLabelMode = "normal" | "focused-only" | "off";
export type GraphPhysicsMode = "on" | "settle-and-pause" | "off";
export type GraphNodeVisualDetail = "normal" | "reduced";

export interface GraphRenderPreferences {
  readonly labels: GraphLabelMode;
  readonly arrowheads: boolean;
  readonly particles: boolean;
  readonly physics: GraphPhysicsMode;
  readonly nodeDetail: GraphNodeVisualDetail;
}

export interface GraphPhysicsTuning {
  readonly centerForce: number;
  readonly repelForce: number;
  readonly linkForce: number;
  readonly linkDistance: number;
}

export type GraphRendererCommand =
  | {
      readonly id: number;
      readonly type: "fit" | "reset-camera" | "diagnostics";
    }
  | {
      readonly id: number;
      readonly type: "focus-node";
      readonly knowledgeId: string;
    };

export interface GraphRendererDiagnostics {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly strategy: "standard" | "optimized";
  readonly animationPaused: boolean;
  readonly drawCalls?: number;
  readonly triangles?: number;
  readonly pixelRatio?: number;
  readonly renderFrame?: number;
  readonly engineSettledMs?: number;
  readonly webglVendor?: string;
  readonly webglRenderer?: string;
}

export interface GraphViewportSnapshot {
  readonly rendererFamily: string;
  readonly value: unknown;
}

export interface GraphRendererProps {
  readonly scene: GraphScene;
  readonly viewport?: GraphViewportSnapshot;
  readonly performanceProfile?: GraphPerformanceProfile;
  readonly renderPreferences?: GraphRenderPreferences;
  readonly physicsTuning?: GraphPhysicsTuning;
  readonly command?: GraphRendererCommand;
  readonly onNodeActivate: (knowledgeId: string) => void;
  readonly onViewportChange?: (snapshot: GraphViewportSnapshot) => void;
  readonly onDiagnostics?: (diagnostics: GraphRendererDiagnostics) => void;
  readonly onUnavailable?: (message: string) => void;
}

export type GraphRenderer = ComponentType<GraphRendererProps>;
