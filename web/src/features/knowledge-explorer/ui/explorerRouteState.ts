import {
  KNOWLEDGE_RELATION_TYPES,
  KNOWLEDGE_SEMANTIC_KINDS,
  type KnowledgeRelationType,
  type KnowledgeSemanticKind,
} from "../model/knowledge";

export interface ExplorerRouteState {
  readonly query: string;
  readonly semanticKind?: KnowledgeSemanticKind;
  readonly relationType?: KnowledgeRelationType;
  readonly selectedKnowledgeId?: string;
  readonly focusedKnowledgeIds: readonly string[];
}

export function parseExplorerRouteState(
  params: URLSearchParams,
): ExplorerRouteState {
  const kind = params.get("kind");
  const relation = params.get("relation");
  const focused = params
    .get("focus")
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return {
    query: params.get("q") ?? "",
    semanticKind: KNOWLEDGE_SEMANTIC_KINDS.find((value) => value === kind),
    relationType: KNOWLEDGE_RELATION_TYPES.find((value) => value === relation),
    selectedKnowledgeId: params.get("selected") || undefined,
    focusedKnowledgeIds: focused ?? [],
  };
}

export function serializeExplorerRouteState(
  state: ExplorerRouteState,
): URLSearchParams {
  const params = new URLSearchParams();
  if (state.query) {
    params.set("q", state.query);
  }
  if (state.semanticKind) {
    params.set("kind", state.semanticKind);
  }
  if (state.relationType) {
    params.set("relation", state.relationType);
  }
  if (state.selectedKnowledgeId) {
    params.set("selected", state.selectedKnowledgeId);
  }
  if (state.focusedKnowledgeIds.length > 0) {
    params.set("focus", state.focusedKnowledgeIds.join(","));
  }
  return params;
}
