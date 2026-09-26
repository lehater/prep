import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import {
  KNOWLEDGE_RELATION_TYPES,
  KNOWLEDGE_SEMANTIC_KINDS,
  type KnowledgeGraphModel,
  type KnowledgeNodeModel,
  type KnowledgeRelationType,
  type KnowledgeScope,
} from "../model/knowledge";
import type {
  GraphPerformanceProfile,
  GraphPhysicsTuning,
  GraphRenderPreferences,
  GraphRenderer,
  GraphRendererCommand,
} from "../ports/GraphRenderer";
import type {
  KnowledgeQueryOutcome,
  KnowledgeQueryPort,
} from "../ports/KnowledgeQueryPort";
import { buildGraphScene } from "../projection/graphScene";
import {
  DEFAULT_GRAPH_PHYSICS_TUNING,
  graphPreferencesForProfile,
  KNOWLEDGE_RELATION_COLORS,
  KNOWLEDGE_RELATION_DESCRIPTIONS_RU,
} from "./graphPresentation";
import {
  parseExplorerRouteState,
  serializeExplorerRouteState,
  type ExplorerRouteState,
} from "./explorerRouteState";

interface KnowledgeExplorerProps {
  readonly scope: KnowledgeScope;
  readonly queryPort: KnowledgeQueryPort;
  readonly Renderer: GraphRenderer;
  readonly detailPanel?: ReactNode;
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

function relationSet(
  relationTypes: readonly KnowledgeRelationType[],
): Set<KnowledgeRelationType> {
  return new Set(relationTypes);
}

export function KnowledgeExplorer({
  scope,
  queryPort,
  Renderer,
  detailPanel,
}: KnowledgeExplorerProps) {
  const [params, setParams] = useSearchParams();
  const routeState = useMemo(() => parseExplorerRouteState(params), [params]);
  const targetScopeId = scope.kind === "target" ? scope.targetId : undefined;
  const stableScope = useMemo<KnowledgeScope>(
    () =>
      targetScopeId === undefined
        ? { kind: "global" }
        : { kind: "target", targetId: targetScopeId },
    [targetScopeId],
  );
  const [searchDraft, setSearchDraft] = useState(routeState.query);
  const [showList, setShowList] = useState(scope.kind === "target");
  const [listState, setListState] = useState<
    AsyncValue<{
      readonly items: readonly KnowledgeNodeModel[];
      readonly totalCount: number;
    }>
  >({ status: "loading" });
  const [graphState, setGraphState] = useState<AsyncValue<KnowledgeGraphModel>>({
    status: "loading",
  });
  const [detailState, setDetailState] = useState<
    AsyncValue<KnowledgeNodeModel | null>
  >({ status: "ready", value: null });
  const [reloadVersion, setReloadVersion] = useState(0);
  const [relationsAnchor, setRelationsAnchor] =
    useState<HTMLButtonElement | null>(null);
  const [settingsAnchor, setSettingsAnchor] =
    useState<HTMLButtonElement | null>(null);
  const [performanceProfile, setPerformanceProfile] =
    useState<GraphPerformanceProfile>("auto");
  const [renderPreferences, setRenderPreferences] =
    useState<GraphRenderPreferences>(() => graphPreferencesForProfile("auto"));
  const [physicsTuning, setPhysicsTuning] = useState<GraphPhysicsTuning>(
    DEFAULT_GRAPH_PHYSICS_TUNING,
  );
  const [rendererCommand, setRendererCommand] =
    useState<GraphRendererCommand>();
  const commandSequence = useRef(0);

  useEffect(() => {
    setSearchDraft(routeState.query);
    if (routeState.query || routeState.semanticKind) {
      setShowList(true);
    }
  }, [routeState.query, routeState.semanticKind]);

  useEffect(() => {
    let active = true;
    setListState({ status: "loading" });
    void queryPort
      .list(stableScope, {
        search: routeState.query || undefined,
        semanticKind: routeState.semanticKind,
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
    stableScope,
  ]);

  useEffect(() => {
    let active = true;
    setGraphState({ status: "loading" });
    void queryPort.graph(stableScope).then((outcome) => {
      if (active) {
        setGraphState(outcomeToState(outcome));
      }
    });
    return () => {
      active = false;
    };
  }, [queryPort, reloadVersion, stableScope]);

  useEffect(() => {
    if (!routeState.selectedKnowledgeId) {
      setDetailState({ status: "ready", value: null });
      return;
    }

    let active = true;
    setDetailState({ status: "loading" });
    void queryPort.get(stableScope, routeState.selectedKnowledgeId).then((outcome) => {
      if (active) {
        setDetailState(outcomeToState(outcome));
      }
    });
    return () => {
      active = false;
    };
  }, [queryPort, reloadVersion, routeState.selectedKnowledgeId, stableScope]);

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
            relationTypes: routeState.relationTypes,
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

  const issueRendererCommand = (
    command:
      | Exclude<GraphRendererCommand["type"], "focus-node">
      | { readonly type: "focus-node"; readonly knowledgeId: string },
  ) => {
    commandSequence.current += 1;
    if (typeof command === "string") {
      setRendererCommand({ id: commandSequence.current, type: command });
      return;
    }
    setRendererCommand({
      id: commandSequence.current,
      type: command.type,
      knowledgeId: command.knowledgeId,
    });
  };

  const toggleRelationType = (relationType: KnowledgeRelationType) => {
    const selected =
      routeState.relationTypes === undefined
        ? new Set<KnowledgeRelationType>(KNOWLEDGE_RELATION_TYPES)
        : relationSet(routeState.relationTypes);
    if (selected.has(relationType)) {
      selected.delete(relationType);
    } else {
      selected.add(relationType);
    }
    const next = KNOWLEDGE_RELATION_TYPES.filter((type) => selected.has(type));
    updateRouteState({
      ...routeState,
      relationTypes:
        next.length === KNOWLEDGE_RELATION_TYPES.length ? undefined : next,
    });
  };

  const updatePreference = <K extends keyof GraphRenderPreferences>(
    key: K,
    value: GraphRenderPreferences[K],
  ) => {
    setRenderPreferences((current) => ({ ...current, [key]: value }));
  };

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
    <Stack spacing={1} sx={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
      <Paper
        component="form"
        variant="outlined"
        onSubmit={submitSearch}
        sx={{
          px: 1,
          py: 0.75,
          display: "flex",
          alignItems: { md: "center" },
          flexDirection: { xs: "column", md: "row" },
          flexWrap: "wrap",
          gap: 0.5,
          minWidth: 0,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <TextField
          placeholder="Search Knowledge"
          aria-label="Search Knowledge"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          size="small"
          sx={{ width: { xs: "100%", md: 220, xl: 260 } }}
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
        <Button
          size="small"
          variant={showList ? "outlined" : "text"}
          aria-expanded={showList}
          onClick={() => setShowList((value) => !value)}
        >
          {showList ? "Hide results" : "Browse"}
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

      </Paper>

      <Box
        sx={{
          "--knowledge-workspace-height":
            "clamp(520px, calc(100dvh - 178px), 920px)",
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: showList
              ? "minmax(180px, 210px) minmax(0, 1fr)"
              : "minmax(0, 1fr)",
            lg: showList
              ? "280px 160px minmax(0, 1fr)"
              : "280px minmax(0, 1fr)",
            xl: showList
              ? "280px 180px minmax(0, 1fr)"
              : "280px minmax(0, 1fr)",
          },
          gridTemplateAreas: {
            xs: showList ? `"graph" "list" "detail"` : `"graph" "detail"`,
            md: showList
              ? `"list graph" "detail detail"`
              : `"graph" "detail"`,
            lg: showList ? `"detail list graph"` : `"detail graph"`,
          },
          gap: 1,
          minWidth: 0,
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        {showList ? (
                  <Paper
                    component="section"
                    aria-label="Knowledge list"
                    variant="outlined"
                    sx={{
                      gridArea: "list",
                      p: 1,
                      minWidth: 0,
                      height: { md: "var(--knowledge-workspace-height)" },
                      overflow: "auto",
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{ alignItems: "baseline", justifyContent: "space-between", gap: 1 }}
                    >
                      <Typography component="h3" variant="h6" gutterBottom>
                        Knowledge results
                      </Typography>
                      {listState.status === "ready" ? (
                        <Typography variant="caption" color="text.secondary">
                          {Math.min(listState.value.items.length, 40)} / {listState.value.totalCount}
                        </Typography>
                      ) : null}
                    </Stack>
                    {listState.status === "loading" ? (
                      <LoadingState label="Loading Knowledge list" />
                    ) : listState.status === "ready" && listState.value.items.length === 0 ? (
                      <StateNotice
                        title="No Knowledge found"
                        message="Change the current search or semantic-kind filter."
                      />
                    ) : listState.status === "ready" ? (
                      <Stack
                        component="ul"
                        spacing={0.25}
                        sx={{ listStyle: "none", p: 0, m: 0 }}
                      >
                        {listState.value.items.slice(0, 40).map((node) => (
                          <li key={node.id}>
                            <Button
                              onClick={() => openDetail(node.id)}
                              fullWidth
                              aria-current={
                                routeState.selectedKnowledgeId === node.id
                                  ? "true"
                                  : undefined
                              }
                              sx={{
                                justifyContent: "flex-start",
                                textAlign: "left",
                                px: 0.75,
                                py: 0.5,
                                borderRadius: 1,
                                backgroundColor:
                                  routeState.selectedKnowledgeId === node.id
                                    ? "rgba(37, 99, 235, 0.10)"
                                    : "transparent",
                                color:
                                  routeState.selectedKnowledgeId === node.id
                                    ? "primary.main"
                                    : "text.primary",
                              }}
                            >
                              <Stack sx={{ alignItems: "flex-start" }}>
                                <span>{node.title}</span>
                                <Chip label={node.semanticKind} size="small" />
                              </Stack>
                            </Button>
                          </li>
                        ))}
                      </Stack>
                    ) : null}
                    {listState.status === "ready" && listState.value.items.length > 40 ? (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                        Showing the first 40 matches. Refine search or semantic kind to narrow the result set.
                      </Typography>
                    ) : null}
                  </Paper>
                  ) : null}


        <Paper
          component="section"
          aria-label="Knowledge graph"
          variant="outlined"
          sx={{
            gridArea: "graph",
            p: 0,
            minWidth: 0,
            height: {
              xs: "clamp(420px, 62dvh, 680px)",
              md: "var(--knowledge-workspace-height)",
            },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: "#0b1220",
            borderColor: "#172033",
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              position: "relative",
              backgroundColor: "#0b1220",
            }}
          >
            <Stack
              direction="row"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                right: 8,
                zIndex: 3,
                alignItems: "center",
                justifyContent: "space-between",
                pointerEvents: "none",
              }}
            >
              <Typography
                component="h3"
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.88)",
                  fontWeight: 700,
                  px: 0.75,
                  py: 0.4,
                  borderRadius: 1,
                  backgroundColor: "rgba(11,18,32,0.72)",
                  backdropFilter: "blur(6px)",
                }}
              >
                Knowledge graph
              </Typography>
              {scene ? (
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.78)",
                    px: 0.75,
                    py: 0.4,
                    borderRadius: 1,
                    backgroundColor: "rgba(11,18,32,0.72)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {scene.nodes.length} nodes · {scene.edges.length} relations ·{" "}
                  {performanceProfile}
                </Typography>
              ) : null}
            </Stack>
            <Button
              size="small"
              aria-label="Relation filters"
              aria-haspopup="dialog"
              aria-expanded={Boolean(relationsAnchor)}
              onClick={(event) => setRelationsAnchor(event.currentTarget)}
              sx={{
                position: "absolute",
                top: 42,
                right: 8,
                zIndex: 4,
                minWidth: 34,
                width: 34,
                height: 34,
                p: 0,
                color: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.18)",
                backgroundColor: "rgba(11,18,32,0.78)",
                backdropFilter: "blur(6px)",
                "&:hover": {
                  backgroundColor: "rgba(18,28,48,0.92)",
                },
              }}
            >
              <Box sx={{ width: 18, display: "grid", gap: "3px" }}>
                {[4, 10, 7].map((offset) => (
                  <Box
                    key={offset}
                    sx={{
                      height: 2,
                      borderRadius: 1,
                      backgroundColor: "currentColor",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: -2,
                        left: offset,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "currentColor",
                      },
                    }}
                  />
                ))}
              </Box>
            </Button>
            <Popover
              open={Boolean(relationsAnchor)}
              anchorEl={relationsAnchor}
              onClose={() => setRelationsAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Stack spacing={0.5} sx={{ p: 1.5, minWidth: 220 }}>
                <Typography variant="subtitle2">Visible relation types</Typography>
                {KNOWLEDGE_RELATION_TYPES.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        size="small"
                        checked={
                          routeState.relationTypes === undefined ||
                          routeState.relationTypes.includes(type)
                        }
                        onChange={() => toggleRelationType(type)}
                      />
                    }
                    label={
                      <Tooltip
                        title={KNOWLEDGE_RELATION_DESCRIPTIONS_RU[type]}
                        placement="right"
                        arrow
                      >
                        <Stack
                          component="span"
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: "center" }}
                        >
                          <Box
                            component="span"
                            aria-hidden="true"
                            sx={{
                              width: 18,
                              height: 3,
                              borderRadius: 999,
                              flexShrink: 0,
                              backgroundColor: KNOWLEDGE_RELATION_COLORS[type],
                            }}
                          />
                          <Box component="span">{type}</Box>
                        </Stack>
                      </Tooltip>
                    }
                  />
                ))}
                <Stack direction="row" spacing={0.5}>
                  <Button
                    size="small"
                    onClick={() =>
                      updateRouteState({
                        ...routeState,
                        relationTypes: undefined,
                      })
                    }
                  >
                    Show all
                  </Button>
                  <Button
                    size="small"
                    onClick={() =>
                      updateRouteState({ ...routeState, relationTypes: [] })
                    }
                  >
                    Hide all
                  </Button>
                </Stack>
              </Stack>
            </Popover>

            <Stack
              spacing={0.5}
              sx={{
                position: "absolute",
                top: 84,
                right: 8,
                zIndex: 4,
              }}
            >
              <Tooltip title="Вписать граф" placement="left">
                <Button
                  size="small"
                  aria-label="Fit graph"
                  onClick={() => issueRendererCommand("fit")}
                  sx={{
                    minWidth: 34,
                    width: 34,
                    height: 34,
                    p: 0,
                    color: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    backgroundColor: "rgba(11,18,32,0.58)",
                    backdropFilter: "blur(6px)",
                    "&:hover": { backgroundColor: "rgba(18,28,48,0.88)" },
                  }}
                >
                  ⛶
                </Button>
              </Tooltip>
              <Tooltip title="Сбросить камеру" placement="left">
                <Button
                  size="small"
                  aria-label="Reset camera"
                  onClick={() => issueRendererCommand("reset-camera")}
                  sx={{
                    minWidth: 34,
                    width: 34,
                    height: 34,
                    p: 0,
                    color: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    backgroundColor: "rgba(11,18,32,0.58)",
                    backdropFilter: "blur(6px)",
                    "&:hover": { backgroundColor: "rgba(18,28,48,0.88)" },
                  }}
                >
                  ↶
                </Button>
              </Tooltip>
              {routeState.selectedKnowledgeId ? (
                <Tooltip title="Фокус камеры на выбранной ноде" placement="left">
                  <Button
                    size="small"
                    aria-label="Focus camera on selected node"
                    onClick={() =>
                      issueRendererCommand({
                        type: "focus-node",
                        knowledgeId: routeState.selectedKnowledgeId!,
                      })
                    }
                    sx={{
                      minWidth: 34,
                      width: 34,
                      height: 34,
                      p: 0,
                      color: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      backgroundColor: "rgba(11,18,32,0.58)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    ◎
                  </Button>
                </Tooltip>
              ) : null}
              {routeState.selectedKnowledgeId &&
              routeState.focusedKnowledgeIds.length === 0 ? (
                <Tooltip title="Показать выбранную ноду и её соседей" placement="left">
                  <Button
                    size="small"
                    aria-label="Show selected neighborhood"
                    onClick={() =>
                      updateRouteState({
                        ...routeState,
                        focusedKnowledgeIds: [routeState.selectedKnowledgeId!],
                      })
                    }
                    sx={{
                      minWidth: 34,
                      width: 34,
                      height: 34,
                      p: 0,
                      color: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      backgroundColor: "rgba(11,18,32,0.58)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    ⎔
                  </Button>
                </Tooltip>
              ) : null}
              {routeState.focusedKnowledgeIds.length > 0 ? (
                <Tooltip title="Вернуть полный граф" placement="left">
                  <Button
                    size="small"
                    aria-label="Clear neighborhood"
                    onClick={() =>
                      updateRouteState({ ...routeState, focusedKnowledgeIds: [] })
                    }
                    sx={{
                      minWidth: 34,
                      width: 34,
                      height: 34,
                      p: 0,
                      color: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      backgroundColor: "rgba(11,18,32,0.58)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    ×
                  </Button>
                </Tooltip>
              ) : null}
              <Tooltip title="Настройки графа" placement="left">
                <Button
                  size="small"
                  aria-label="Graph settings"
                  aria-haspopup="dialog"
                  aria-expanded={Boolean(settingsAnchor)}
                  onClick={(event) => setSettingsAnchor(event.currentTarget)}
                  sx={{
                    minWidth: 34,
                    width: 34,
                    height: 34,
                    p: 0,
                    color: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    backgroundColor: "rgba(11,18,32,0.58)",
                    backdropFilter: "blur(6px)",
                    "&:hover": { backgroundColor: "rgba(18,28,48,0.88)" },
                  }}
                >
                  ⚙
                </Button>
              </Tooltip>
            </Stack>

            <Popover
              open={Boolean(settingsAnchor)}
              anchorEl={settingsAnchor}
              onClose={() => setSettingsAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Stack spacing={1.25} sx={{ p: 1.5, width: 300 }}>
                <Typography variant="subtitle2">Настройки графа</Typography>
                <label>
                  Профиль{" "}
                  <select
                    aria-label="Graph performance profile"
                    value={performanceProfile}
                    onChange={(event) => {
                      const next = event.target.value as GraphPerformanceProfile;
                      setPerformanceProfile(next);
                      setRenderPreferences(graphPreferencesForProfile(next));
                    }}
                  >
                    <option value="auto">Auto</option>
                    <option value="quality">Quality</option>
                    <option value="performance">Performance</option>
                  </select>
                </label>
                <label>
                  Подписи{" "}
                  <select
                    aria-label="Graph labels"
                    value={renderPreferences.labels}
                    onChange={(event) =>
                      updatePreference(
                        "labels",
                        event.target.value as GraphRenderPreferences["labels"],
                      )
                    }
                  >
                    <option value="normal">Normal</option>
                    <option value="focused-only">Focused only</option>
                    <option value="off">Off</option>
                  </select>
                </label>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={renderPreferences.arrowheads}
                      inputProps={{ "aria-label": "Directional arrowheads" }}
                      onChange={(event) =>
                        updatePreference("arrowheads", event.target.checked)
                      }
                    />
                  }
                  label="Стрелки"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={renderPreferences.particles}
                      inputProps={{ "aria-label": "Decorative particles" }}
                      onChange={(event) =>
                        updatePreference("particles", event.target.checked)
                      }
                    />
                  }
                  label="Частицы"
                />
                <label>
                  Физика{" "}
                  <select
                    aria-label="Graph live physics"
                    value={renderPreferences.physics}
                    onChange={(event) =>
                      updatePreference(
                        "physics",
                        event.target.value as GraphRenderPreferences["physics"],
                      )
                    }
                  >
                    <option value="on">On</option>
                    <option value="settle-and-pause">Settle and pause</option>
                    <option value="off">Off</option>
                  </select>
                </label>
                {([
                  ["centerForce", "Притяжение к центру", 0, 2, 0.1],
                  ["repelForce", "Отталкивание узлов", 0, 240, 10],
                  ["linkForce", "Сила связей", 0, 2, 0.1],
                  ["linkDistance", "Длина связей", 10, 120, 5],
                ] as const).map(([key, label, min, max, step]) => (
                  <Box key={key}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", alignItems: "center" }}
                    >
                      <Typography variant="caption">{label}</Typography>
                      <Typography variant="caption">{physicsTuning[key]}</Typography>
                    </Stack>
                    <Slider
                      size="small"
                      aria-label={label}
                      value={physicsTuning[key]}
                      min={min}
                      max={max}
                      step={step}
                      onChange={(_, value) =>
                        setPhysicsTuning((current) => ({
                          ...current,
                          [key]: value as number,
                        }))
                      }
                    />
                  </Box>
                ))}
                <Button
                  size="small"
                  onClick={() => setPhysicsTuning(DEFAULT_GRAPH_PHYSICS_TUNING)}
                >
                  Сбросить физику
                </Button>
              </Stack>
            </Popover>

            {graphState.status === "loading" || scene === null ? (
              <LoadingState label="Loading Knowledge graph" />
            ) : (
              <Renderer
                scene={scene}
                performanceProfile={performanceProfile}
                renderPreferences={renderPreferences}
                physicsTuning={physicsTuning}
                command={rendererCommand}
                onNodeActivate={(knowledgeId) => openDetail(knowledgeId)}
              />
            )}
          </Box>
        </Paper>

        <Paper
          component="aside"
          aria-label="Knowledge detail"
          variant="outlined"
          sx={{
            gridArea: "detail",
            p: 1.25,
            minWidth: 0,
            backgroundColor: "background.paper",
            height: { lg: "var(--knowledge-workspace-height)" },
            overflow: "auto",
          }}
        >
          {detailPanel !== undefined ? (
            detailPanel
          ) : (
            <>
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
                                <Stack
                                  component="ul"
                                  sx={{ pl: 2, minWidth: 0, overflowWrap: "anywhere" }}
                                >
                                  {graphState.value.relations
                                    .filter(
                                      (relation) =>
                                        relation.sourceId === detailState.value?.id ||
                                        relation.targetId === detailState.value?.id,
                                    )
                                    .map((relation) => (
                                      <li key={relation.id}>
                                        {relation.sourceId} —{relation.type}→{" "}
                                        {relation.targetId}
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
              
            </>
          )}
        </Paper>
      </Box>
    </Stack>
  );
}
