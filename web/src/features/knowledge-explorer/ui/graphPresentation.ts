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

export const KNOWLEDGE_RELATION_DESCRIPTIONS_RU: Readonly<Record<KnowledgeRelationType, string>> = {
  addresses: "Источник решает, смягчает или обрабатывает проблему, указанную целью.",
  uses: "Источник функционально использует цель как механизм, инструмент, технологию или метод.",
  specializes: "Источник является более частным видом или специализацией цели.",
  part_of: "Источник является составной частью цели.",
  depends_on: "Источник требует цель как необходимую зависимость или предпосылку.",
  realizes: "Источник конкретно реализует, воплощает или представляет более абстрактную цель.",
  produces: "Источник производит цель как результат или выход.",
  derives_from: "Источник семантически происходит или выводится из цели.",
  enables: "Источник делает цель возможной или практически достижимой, не утверждая жёсткую обязательную зависимость.",
};
