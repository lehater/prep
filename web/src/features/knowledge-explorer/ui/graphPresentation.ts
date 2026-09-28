import type { KnowledgeRelationType } from "../model/knowledge";

import type {
  GraphPerformanceProfile,
  GraphPhysicsTuning,
  GraphRenderPreferences,
} from "../ports/GraphRenderer";

export const DEFAULT_GRAPH_PHYSICS_TUNING: GraphPhysicsTuning = {
  centerForce: 1,
  repelForce: 90,
  linkForce: 1,
  linkDistance: 38,
};

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

export const KNOWLEDGE_RELATION_COLORS: Readonly<Record<KnowledgeRelationType, string>> = {
  addresses: "#78b7ff",
  uses: "#f6c177",
  specializes: "#c4a7e7",
  part_of: "#9ccfd8",
  depends_on: "#eb6f92",
  realizes: "#7fd3a5",
  produces: "#f2a272",
  derives_from: "#b7c7e3",
  enables: "#a6da95",
};

export const KNOWLEDGE_RELATION_DESCRIPTIONS: Readonly<Record<KnowledgeRelationType, string>> = {
  addresses: "The source addresses, mitigates or handles the problem represented by the target.",
  uses: "The source functionally uses the target as a mechanism, tool, technology or method.",
  specializes: "The source is a more specific kind or specialization of the target.",
  part_of: "The source is a constituent part of the target.",
  depends_on: "The source requires the target as a dependency or prerequisite.",
  realizes: "The source concretely realizes or represents the more abstract target.",
  produces: "The source produces the target as an output or result.",
  derives_from: "The source is semantically derived from the target.",
  enables: "The source enables the target without asserting a strict mandatory dependency.",
};

export function applyReducedMotionPreferences(
  preferences: GraphRenderPreferences,
): GraphRenderPreferences {
  return {
    ...preferences,
    particles: false,
    physics: "off",
  };
}
