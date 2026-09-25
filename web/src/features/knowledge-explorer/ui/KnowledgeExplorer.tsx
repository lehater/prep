import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import {
  KNOWLEDGE_RELATION_TYPES,
  KNOWLEDGE_SEMANTIC_KINDS,
  type KnowledgeGraphModel,
  type KnowledgeNodeModel,
  type KnowledgeScope,
} from "../model/knowledge";
import type { GraphRenderer } from "../ports/GraphRenderer";
import type {
  KnowledgeQueryOutcome,
  KnowledgeQueryPort,
} from "../ports/KnowledgeQueryPort";
import { buildGraphScene } from "../projection/graphScene";
import {
  parseExplorerRouteState,
  serializeExplorerRouteState,
  type ExplorerRouteState,
} from "./explorerRouteState";

interface KnowledgeExplorerProps {
  readonly scope: KnowledgeScope;
  readonly queryPort: KnowledgeQueryPort;
  readonly Renderer: GraphRenderer;
}

type AsyncValue<T> =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly value: T }
  | { readonly status: "unavailable"; readonly message: string }
  | { readonly status: "failure"; readonly message: string };

function outcomeToState<T>(outcome: KnowledgeQueryOutcome<T>): AsyncValue<T> {
  return outcome.status === "success"
    ? { status: "ready", value: outcome.value }
    : outcome;
}

export function KnowledgeExplorer({
  scope,
  queryPort,
  Renderer,
}: KnowledgeExplorerProps) {
  const [params, setParams] = useSearchParams();
  const routeState = useMemo(() => parseExplorerRouteState(params), [params]);
  const [searchDraft, setSearchDraft] = useState(routeState.query);
  const [listState, setListState] = useState<
    AsyncValue<readonly KnowledgeNodeModel[]>
  >({ status: "loading" });
  const [graphState, setGraphState] = useState<AsyncValue<KnowledgeGraphModel>>({
    status: "loading",
  });
  const [detailState, setDetailState] = useState<
    AsyncValue<KnowledgeNodeModel | null>
  >({ status: "ready", value: null });
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    setSearchDraft(routeState.query);
  }, [routeState.query]);

  useEffect(() => {
    let active = true;
    setListState({ status: "loading" });
    void queryPort
      .list(scope, {
        search: routeState.query || undefined,
        semanticKinds: routeState.semanticKind
          ? [routeState.semanticKind]
          : undefined,
      })
      .then((outcome) => {
        if (active) {
          setListState(outcomeToState(outcome));
        }
      });
    return () => {
      active = false;
    };
  }, [
    queryPort,
    reloadVersion,
    routeState.query,
    routeState.semanticKind,
    scope,
  ]);

  useEffect(() => {
    let active = true;
    setGraphState({ status: "loading" });
    void queryPort.graph(scope).then((outcome) => {
      if (active) {
        setGraphState(outcomeToState(outcome));
      }
    });
    return () => {
      active = false;
    };
  }, [queryPort, reloadVersion, scope]);

  useEffect(() => {
    if (!routeState.selectedKnowledgeId) {
      setDetailState({ status: "ready", value: null });
      return;
    }

    let active = true;
    setDetailState({ status: "loading" });
    void queryPort.get(scope, routeState.selectedKnowledgeId).then((outcome) => {
      if (active) {
        setDetailState(outcomeToState(outcome));
      }
    });
    return () => {
      active = false;
    };
  }, [queryPort, reloadVersion, routeState.selectedKnowledgeId, scope]);

  const updateRouteState = (next: ExplorerRouteState) => {
    setParams(serializeExplorerRouteState(next));
  };

  const scene = useMemo(
    () =>
      graphState.status === "ready"
        ? buildGraphScene(graphState.value, {
            selectedKnowledgeId: routeState.selectedKnowledgeId,
            focusedKnowledgeIds: routeState.focusedKnowledgeIds,
            semanticKinds: routeState.semanticKind
              ? [routeState.semanticKind]
              : undefined,
            relationTypes: routeState.relationType
              ? [routeState.relationType]
              : undefined,
          })
        : null,
    [graphState, routeState],
  );

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    updateRouteState({ ...routeState, query: searchDraft.trim() });
  };

  const openDetail = (knowledgeId: string, focus = false) => {
    updateRouteState({
      ...routeState,
      selectedKnowledgeId: knowledgeId,
      focusedKnowledgeIds: focus
        ? [knowledgeId]
        : routeState.focusedKnowledgeIds,
    });
  };

  const retry = () => setReloadVersion((value) => value + 1);

  const blockingState = [listState, graphState].find(
    (state) => state.status === "unavailable" || state.status === "failure",
  );
  if (blockingState?.status === "unavailable") {
    return (
      <StateNotice
        title="Knowledge unavailable"
        message={blockingState.message}
        severity="warning"
        retryLabel="Retry"
        onRetry={retry}
      />
    );
  }
  if (blockingState?.status === "failure") {
    return (
      <StateNotice
        title="Knowledge could not be loaded"
        message={blockingState.message}
        severity="error"
        retryLabel="Retry"
        onRetry={retry}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        component="form"
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        onSubmit={submitSearch}
      >
        <TextField
          label="Search Knowledge"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
        <label>
          Semantic kind{" "}
          <select
            aria-label="Semantic kind"
            value={routeState.semanticKind ?? ""}
            onChange={(event) =>
              updateRouteState({
                ...routeState,
                semanticKind:
                  KNOWLEDGE_SEMANTIC_KINDS.find(
                    (value) => value === event.target.value,
                  ) ?? undefined,
              })
            }
          >
            <option value="">All</option>
            {KNOWLEDGE_SEMANTIC_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </select>
        </label>
        <label>
          Relation type{" "}
          <select
            aria-label="Relation type"
            value={routeState.relationType ?? ""}
            onChange={(event) =>
              updateRouteState({
                ...routeState,
                relationType:
                  KNOWLEDGE_RELATION_TYPES.find(
                    (value) => value === event.target.value,
                  ) ?? undefined,
              })
            }
          >
            <option value="">All</option>
            {KNOWLEDGE_RELATION_TYPES.map((relation) => (
              <option key={relation} value={relation}>
                {relation}
              </option>
            ))}
          </select>
        </label>
        {routeState.focusedKnowledgeIds.length > 0 ? (
          <Button
            onClick={() =>
              updateRouteState({ ...routeState, focusedKnowledgeIds: [] })
            }
          >
            Clear focus
          </Button>
        ) : null}
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper component="section" variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6" gutterBottom>
            Knowledge list
          </Typography>
          {listState.status === "loading" ? (
            <LoadingState label="Loading Knowledge list" />
          ) : listState.status === "ready" && listState.value.length === 0 ? (
            <StateNotice
              title="No Knowledge found"
              message="Change the current search or semantic-kind filter."
            />
          ) : listState.status === "ready" ? (
            <Stack component="ul" spacing={1} sx={{ listStyle: "none", p: 0 }}>
              {listState.value.map((node) => (
                <li key={node.id}>
                  <Button
                    onClick={() => openDetail(node.id)}
                    sx={{ justifyContent: "flex-start", textAlign: "left" }}
                  >
                    <Stack alignItems="flex-start">
                      <span>{node.title}</span>
                      <Chip label={node.semanticKind} size="small" />
                    </Stack>
                  </Button>
                </li>
              ))}
            </Stack>
          ) : null}
        </Paper>

        <Paper component="section" variant="outlined" sx={{ p: 2, flex: 2 }}>
          <Typography component="h3" variant="h6" gutterBottom>
            Knowledge graph
          </Typography>
          {graphState.status === "loading" || scene === null ? (
            <LoadingState label="Loading Knowledge graph" />
          ) : (
            <Renderer
              scene={scene}
              onNodeActivate={(knowledgeId) => openDetail(knowledgeId, true)}
            />
          )}
        </Paper>

        <Paper
          component="aside"
          variant="outlined"
          sx={{ p: 2, flex: 1, minWidth: 260 }}
        >
          <Typography component="h3" variant="h6" gutterBottom>
            Knowledge detail
          </Typography>
          {detailState.status === "loading" ? (
            <LoadingState label="Loading Knowledge detail" />
          ) : detailState.status === "unavailable" ? (
            <StateNotice
              title="Knowledge detail unavailable"
              message={detailState.message}
              severity="warning"
              retryLabel="Retry"
              onRetry={retry}
            />
          ) : detailState.status === "failure" ? (
            <StateNotice
              title="Knowledge detail could not be loaded"
              message={detailState.message}
              severity="error"
              retryLabel="Retry"
              onRetry={retry}
            />
          ) : detailState.value === null ? (
            <Typography color="text.secondary">
              Select a Knowledge item from the list or graph.
            </Typography>
          ) : (
            <Stack spacing={1}>
              <Typography component="h4" variant="subtitle1">
                {detailState.value.title}
              </Typography>
              <Chip
                label={detailState.value.semanticKind}
                size="small"
                sx={{ alignSelf: "flex-start" }}
              />
              <Typography>{detailState.value.summary}</Typography>
              {graphState.status === "ready" ? (
                <>
                  <Divider />
                  <Typography component="h5" variant="subtitle2">
                    Relations
                  </Typography>
                  <Stack component="ul" sx={{ pl: 2 }}>
                    {graphState.value.relations
                      .filter(
                        (relation) =>
                          relation.sourceId === detailState.value?.id ||
                          relation.targetId === detailState.value?.id,
                      )
                      .map((relation) => (
                        <li key={relation.id}>
                          {relation.sourceId} —{relation.type}→ {relation.targetId}
                        </li>
                      ))}
                  </Stack>
                </>
              ) : null}
              <Button
                onClick={() =>
                  updateRouteState({
                    ...routeState,
                    selectedKnowledgeId: undefined,
                  })
                }
              >
                Close detail
              </Button>
            </Stack>
          )}
        </Paper>
      </Stack>
    </Stack>
  );
}
