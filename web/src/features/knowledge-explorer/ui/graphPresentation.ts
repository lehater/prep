import type {
  GraphPerformanceProfile,
  GraphRenderPreferences,
} from "../ports/GraphRenderer";

export const GRAPH_PERFORMANCE_PROFILES = [
  "auto",
  "quality",
  "performance",
] as const satisfies readonly GraphPerformanceProfile[];

export function graphPreferencesForProfile(
  profile: GraphPerformanceProfile,
): GraphRenderPreferences {
  if (profile === "quality") {
    return {
      labels: "normal",
      arrowheads: true,
      particles: true,
      physics: "on",
      nodeDetail: "normal",
    };
  }
  if (profile === "performance") {
    return {
      labels: "focused-only",
      arrowheads: false,
      particles: false,
      physics: "settle-and-pause",
      nodeDetail: "reduced",
    };
  }
  return {
    labels: "normal",
    arrowheads: true,
    particles: false,
    physics: "on",
    nodeDetail: "normal",
  };
}
