import type { GraphScene } from "../../features/knowledge-explorer/projection/graphScene";
import type {
  GraphPerformanceProfile,
  GraphRenderPreferences,
} from "../../features/knowledge-explorer/ports/GraphRenderer";

export const DEFAULT_GRAPH_RENDER_PREFERENCES: GraphRenderPreferences = {
  labels: "normal",
  arrowheads: true,
  particles: false,
  physics: "on",
  nodeDetail: "normal",
};

export interface GraphRenderStrategy {
  readonly family: "standard" | "optimized";
  readonly useInstancedNodes: boolean;
  readonly useBatchedLinks: boolean;
  readonly nodeResolution: number;
  readonly maxPixelRatio: number;
  readonly labels: GraphRenderPreferences["labels"];
  readonly arrowheads: boolean;
  readonly particles: boolean;
  readonly physics: GraphRenderPreferences["physics"];
}

function autoNeedsOptimization(scene: GraphScene): boolean {
  return scene.nodes.length >= 1_000 || scene.edges.length >= 5_000;
}

export function resolveGraphRenderStrategy(
  scene: GraphScene,
  profile: GraphPerformanceProfile,
  preferences: GraphRenderPreferences = DEFAULT_GRAPH_RENDER_PREFERENCES,
): GraphRenderStrategy {
  const optimized =
    profile === "performance" ||
    (profile === "auto" && autoNeedsOptimization(scene));

  const labels =
    optimized && preferences.labels === "normal"
      ? "focused-only"
      : preferences.labels;
  const arrowheads = optimized ? false : preferences.arrowheads;
  const particles = optimized ? false : preferences.particles;
  const physics =
    optimized && preferences.physics === "on"
      ? "settle-and-pause"
      : preferences.physics;

  return {
    family: optimized ? "optimized" : "standard",
    useInstancedNodes: optimized,
    useBatchedLinks: optimized,
    nodeResolution:
      optimized || preferences.nodeDetail === "reduced" ? 6 : 16,
    maxPixelRatio: optimized ? 1 : profile === "quality" ? 2 : 1.5,
    labels,
    arrowheads,
    particles,
    physics,
  };
}
