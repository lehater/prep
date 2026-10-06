import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { knowledgeKindLabel } from "../../ui/presentationLabels";
import type { CapabilityRef, FocusRef, KnowledgeRef, TargetRef } from "../contracts";
import type {
  KnowledgeItemModel,
  KnowledgePort,
  KnowledgeProjectionModel,
} from "./contract";
import type {
  KnowledgeRelationshipEdgeModel,
  KnowledgeRelationshipOverviewModel,
  KnowledgeRelationshipRenderer,
} from "./relationship-renderer";
import { useKnowledgeExplorerState } from "./state";

const TABLE_GRAPH_SPLIT_KEY = "prep.knowledge.table-graph-ratio";
const TOP_DETAILS_SPLIT_KEY = "prep.knowledge.top-details-ratio";
const DEFAULT_TABLE_GRAPH_RATIO = 72;
const DEFAULT_TOP_DETAILS_RATIO = 66;

export interface KnowledgeExplorerFeatureProps {
  readonly port: KnowledgePort;
  readonly activeTargetRef: TargetRef;
  readonly activeFocusRef: FocusRef | null;
  readonly incomingRequiredCapabilityRef?: CapabilityRef | undefined;
  readonly relationshipRenderer?: KnowledgeRelationshipRenderer | undefined;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readStoredRatio(key: string, fallback: number): number {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = Number(window.localStorage.getItem(key));
  return Number.isFinite(stored) ? stored : fallback;
}

function matchesRelationFilter(
  item: KnowledgeItemModel,
  filter: "all" | "two-plus" | "three-plus",
): boolean {
  if (filter === "two-plus") {
    return item.related.length >= 2;
  }
  if (filter === "three-plus") {
    return item.related.length >= 3;
  }
  return true;
}

function buildRelationshipOverview(
  items: readonly KnowledgeItemModel[],
  selectedKnowledgeRef: KnowledgeRef | null,
): KnowledgeRelationshipOverviewModel {
  const visibleRefs = new Set(items.map((item) => item.knowledgeRef));
  const edges: KnowledgeRelationshipEdgeModel[] = [];
  const seenEdges = new Set<string>();

  for (const item of items) {
    for (const related of item.related) {
      if (!visibleRefs.has(related.knowledgeRef)) {
        continue;
      }

      const pair = [String(item.knowledgeRef), String(related.knowledgeRef)].sort();
      const edgeKey = pair.join("::");
      if (seenEdges.has(edgeKey)) {
        continue;
      }

      seenEdges.add(edgeKey);
      edges.push({
        sourceRef: item.knowledgeRef,
        targetRef: related.knowledgeRef,
      });
    }
  }

  return {
    nodes: items.map((item) => ({
      knowledgeRef: item.knowledgeRef,
      kind: item.kind,
      label: item.label,
      relationCount: item.related.length,
      selected: item.knowledgeRef === selectedKnowledgeRef,
    })),
    edges,
    selectedKnowledgeRef,
  };
}

export function KnowledgeExplorerFeature({
  port,
  activeTargetRef,
  activeFocusRef,
  incomingRequiredCapabilityRef,
  relationshipRenderer: RelationshipRenderer,
}: KnowledgeExplorerFeatureProps) {
  const {
    queryDraft,
    appliedQuery,
    scope,
    requiredCapabilityRef,
    kindFilter,
    relationsFilter,
    selectedKnowledgeRef,
    setQueryDraft,
    setScope,
    setRequiredCapabilityRef,
    setKindFilter,
    setRelationsFilter,
    setSelectedKnowledgeRef,
  } = useKnowledgeExplorerState();

  const [projection, setProjection] =
    useState<KnowledgeProjectionModel | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [tableGraphRatio, setTableGraphRatio] = useState(() =>
    clamp(readStoredRatio(TABLE_GRAPH_SPLIT_KEY, DEFAULT_TABLE_GRAPH_RATIO), 45, 82),
  );
  const [topDetailsRatio, setTopDetailsRatio] = useState(() =>
    clamp(readStoredRatio(TOP_DETAILS_SPLIT_KEY, DEFAULT_TOP_DETAILS_RATIO), 48, 78),
  );

  const upperPaneRef = useRef<HTMLDivElement | null>(null);
  const workbenchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (incomingRequiredCapabilityRef) {
      setRequiredCapabilityRef(incomingRequiredCapabilityRef);
    }
  }, [incomingRequiredCapabilityRef, setRequiredCapabilityRef]);

  useEffect(() => {
    window.localStorage.setItem(
      TABLE_GRAPH_SPLIT_KEY,
      String(Math.round(tableGraphRatio * 10) / 10),
    );
  }, [tableGraphRatio]);

  useEffect(() => {
    window.localStorage.setItem(
      TOP_DETAILS_SPLIT_KEY,
      String(Math.round(topDetailsRatio * 10) / 10),
    );
  }, [topDetailsRatio]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setMessage(null);

    void port
      .queryKnowledge({
        targetRef: activeTargetRef,
        ...(activeFocusRef ? { focusRef: activeFocusRef } : {}),
        ...(requiredCapabilityRef ? { requiredCapabilityRef } : {}),
        scope,
        ...(appliedQuery.trim().length > 0 ? { query: appliedQuery } : {}),
      })
      .then((outcome) => {
        if (cancelled) {
          return;
        }

        setStatus("ready");
        if (outcome.status === "accepted") {
          setProjection(outcome.projection.value);
          return;
        }

        setProjection(null);
        setMessage(outcome.message);
      });

    return () => {
      cancelled = true;
    };
  }, [
    activeFocusRef,
    activeTargetRef,
    appliedQuery,
    port,
    requiredCapabilityRef,
    scope,
  ]);

  const visibleItems = useMemo(
    () =>
      projection?.items.filter(
        (item) =>
          (kindFilter === "all" || item.kind === kindFilter) &&
          matchesRelationFilter(item, relationsFilter),
      ) ?? [],
    [kindFilter, projection, relationsFilter],
  );

  useEffect(() => {
    if (
      selectedKnowledgeRef &&
      !visibleItems.some((item) => item.knowledgeRef === selectedKnowledgeRef)
    ) {
      setSelectedKnowledgeRef(null);
    }
  }, [selectedKnowledgeRef, setSelectedKnowledgeRef, visibleItems]);

  const selectedItem = useMemo(
    () =>
      visibleItems.find(
        (item) => item.knowledgeRef === selectedKnowledgeRef,
      ) ?? null,
    [selectedKnowledgeRef, visibleItems],
  );

  const relationshipOverview = useMemo(
    () => buildRelationshipOverview(visibleItems, selectedKnowledgeRef),
    [selectedKnowledgeRef, visibleItems],
  );

  function chooseItem(knowledgeRef: KnowledgeRef) {
    if (
      visibleItems.some((item) => item.knowledgeRef === knowledgeRef)
    ) {
      setSelectedKnowledgeRef(knowledgeRef);
      setScope("detail");
    }
  }

  function resetFilters() {
    setQueryDraft("");
    setKindFilter("all");
    setRelationsFilter("all");
    setRequiredCapabilityRef(null);
    setScope("overview");
    setSelectedKnowledgeRef(null);
  }

  function updateTableGraphRatio(clientX: number) {
    const rect = upperPaneRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) {
      return;
    }

    const minTable = Math.min(520, rect.width * 0.6);
    const minGraph = Math.min(260, rect.width * 0.32);
    const minRatio = (minTable / rect.width) * 100;
    const maxRatio = ((rect.width - minGraph) / rect.width) * 100;

    setTableGraphRatio(
      clamp(((clientX - rect.left) / rect.width) * 100, minRatio, maxRatio),
    );
  }

  function updateTopDetailsRatio(clientY: number) {
    const rect = workbenchRef.current?.getBoundingClientRect();
    if (!rect || rect.height <= 0) {
      return;
    }

    const minTop = Math.min(260, rect.height * 0.58);
    const minDetails = Math.min(150, rect.height * 0.34);
    const minRatio = (minTop / rect.height) * 100;
    const maxRatio = ((rect.height - minDetails) / rect.height) * 100;

    setTopDetailsRatio(
      clamp(((clientY - rect.top) / rect.height) * 100, minRatio, maxRatio),
    );
  }

  function startPointerResize(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function stopPointerResize(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleVerticalDividerKey(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setTableGraphRatio((value) => clamp(value - 2, 45, 82));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setTableGraphRatio((value) => clamp(value + 2, 45, 82));
    } else if (event.key === "Home") {
      event.preventDefault();
      setTableGraphRatio(45);
    } else if (event.key === "End") {
      event.preventDefault();
      setTableGraphRatio(82);
    }
  }

  function handleHorizontalDividerKey(
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setTopDetailsRatio((value) => clamp(value - 2, 48, 78));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setTopDetailsRatio((value) => clamp(value + 2, 48, 78));
    } else if (event.key === "Home") {
      event.preventDefault();
      setTopDetailsRatio(48);
    } else if (event.key === "End") {
      event.preventDefault();
      setTopDetailsRatio(78);
    }
  }

  const localFiltersActive =
    kindFilter !== "all" || relationsFilter !== "all";
  const filtersActive =
    queryDraft.length > 0 || requiredCapabilityRef !== null || localFiltersActive;

  const workbenchStyle = {
    "--knowledge-table-ratio": `${tableGraphRatio}%`,
    "--knowledge-top-ratio": `${topDetailsRatio}%`,
  } as CSSProperties;

  return (
    <section
      className="knowledge-explorer-view"
      data-view="knowledge"
      data-renderer="nonspatial-primary"
      data-spatial-overview={RelationshipRenderer ? "available" : "unavailable"}
      aria-label="Знания текущей цели"
    >
      <header className="knowledge-workspace-toolbar">
        <div className="knowledge-workspace-title">
          <h1>Знания</h1>
          {projection ? (
            <span className="knowledge-result-count" role="status">
              {visibleItems.length}/{projection.items.length}
            </span>
          ) : null}
        </div>

        <div className="knowledge-filter-toolbar">
          <input
            className="knowledge-filter-control knowledge-search-control"
            aria-label="Поиск"
            value={queryDraft}
            onChange={(event) => setQueryDraft(event.currentTarget.value)}
            placeholder="Поиск по знаниям"
          />

          <select
            className="knowledge-filter-control"
            aria-label="Тип"
            value={kindFilter}
            onChange={(event) =>
              setKindFilter(
                event.currentTarget.value as
                  | "all"
                  | "object"
                  | "proposition",
              )
            }
          >
            <option value="all">Все типы</option>
            <option value="object">Объекты</option>
            <option value="proposition">Утверждения</option>
          </select>

          <select
            className="knowledge-filter-control"
            aria-label="Связность"
            value={relationsFilter}
            onChange={(event) =>
              setRelationsFilter(
                event.currentTarget.value as
                  | "all"
                  | "two-plus"
                  | "three-plus",
              )
            }
          >
            <option value="all">Любая связность</option>
            <option value="two-plus">2+ связи</option>
            <option value="three-plus">3+ связи</option>
          </select>

          <select
            className="knowledge-filter-control"
            aria-label="Глубина"
            value={scope}
            onChange={(event) =>
              setScope(event.currentTarget.value as "overview" | "detail")
            }
          >
            <option value="overview">Обзор</option>
            <option value="detail">Подробно</option>
          </select>

          {requiredCapabilityRef ? (
            <span className="knowledge-capability-scope">
              {projection?.requiredCapabilityLabel ?? "Компетенция"}
            </span>
          ) : null}

          {filtersActive ? (
            <button
              type="button"
              className="knowledge-reset-action"
              onClick={resetFilters}
            >
              Сбросить
            </button>
          ) : null}
        </div>
      </header>

      {message ? (
        <p className="outcome-message knowledge-outcome-message" role="status">
          {message}
        </p>
      ) : null}

      <section className="knowledge-workspace-body" aria-label="Найденные знания">
        {status === "loading" ? (
          <p className="knowledge-loading" role="status">
            Загрузка знаний…
          </p>
        ) : null}

        {status === "ready" && visibleItems.length === 0 ? (
          <div className="knowledge-empty">
            <strong>По текущим фильтрам ничего не найдено.</strong>
            <p className="knowledge-empty-copy">
              Измените поиск или один из фильтров.
            </p>
          </div>
        ) : null}

        {projection && visibleItems.length > 0 ? (
          <div
            ref={workbenchRef}
            className="knowledge-workbench"
            style={workbenchStyle}
          >
            <div
              ref={upperPaneRef}
              className="knowledge-upper-pane"
              data-has-graph={RelationshipRenderer ? "true" : "false"}
            >
              <div className="knowledge-table-region">
                <div className="knowledge-table-scroll">
                  <table className="knowledge-table">
                    <thead>
                      <tr>
                        <th scope="col">Знание</th>
                        <th scope="col">Тип</th>
                        <th scope="col">Связи</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleItems.map((item) => (
                        <tr
                          key={item.knowledgeRef}
                          data-selected={
                            item.knowledgeRef === selectedKnowledgeRef
                              ? "true"
                              : "false"
                          }
                        >
                          <td>
                            <button
                              type="button"
                              className="knowledge-row-select"
                              aria-pressed={
                                item.knowledgeRef === selectedKnowledgeRef
                              }
                              onClick={() => chooseItem(item.knowledgeRef)}
                            >
                              <strong>{item.label}</strong>
                              {item.predicate ? (
                                <small>{item.predicate}</small>
                              ) : null}
                            </button>
                          </td>
                          <td>
                            <span className="knowledge-kind">
                              {knowledgeKindLabel(item.kind)}
                            </span>
                          </td>
                          <td className="knowledge-relation-count">
                            {item.related.length}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {RelationshipRenderer ? (
                <>
                  <div
                    className="workspace-divider workspace-divider--vertical"
                    role="separator"
                    aria-label="Изменить ширину таблицы и графа"
                    aria-orientation="vertical"
                    aria-valuemin={45}
                    aria-valuemax={82}
                    aria-valuenow={Math.round(tableGraphRatio)}
                    tabIndex={0}
                    onDoubleClick={() =>
                      setTableGraphRatio(DEFAULT_TABLE_GRAPH_RATIO)
                    }
                    onPointerDown={startPointerResize}
                    onPointerMove={(event) => {
                      if (
                        event.currentTarget.hasPointerCapture(event.pointerId)
                      ) {
                        updateTableGraphRatio(event.clientX);
                      }
                    }}
                    onPointerUp={stopPointerResize}
                    onPointerCancel={stopPointerResize}
                    onKeyDown={handleVerticalDividerKey}
                  />

                  <aside
                    className="knowledge-relationship-region"
                    aria-label="Связи знаний"
                  >
                    <div className="knowledge-pane-heading">
                      <strong>Связи</strong>
                      <span>{relationshipOverview.edges.length}</span>
                    </div>
                    <RelationshipRenderer
                      model={relationshipOverview}
                      onSelectKnowledge={chooseItem}
                    />
                    <p className="supporting-text knowledge-relationship-caption">
                      Текущая отфильтрованная выборка.
                    </p>
                  </aside>
                </>
              ) : null}
            </div>

            <div
              className="workspace-divider workspace-divider--horizontal"
              role="separator"
              aria-label="Изменить высоту таблицы и деталей"
              aria-orientation="horizontal"
              aria-valuemin={48}
              aria-valuemax={78}
              aria-valuenow={Math.round(topDetailsRatio)}
              tabIndex={0}
              onDoubleClick={() =>
                setTopDetailsRatio(DEFAULT_TOP_DETAILS_RATIO)
              }
              onPointerDown={startPointerResize}
              onPointerMove={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  updateTopDetailsRatio(event.clientY);
                }
              }}
              onPointerUp={stopPointerResize}
              onPointerCancel={stopPointerResize}
              onKeyDown={handleHorizontalDividerKey}
            />

            <aside className="knowledge-detail-region" aria-label="Детали знания">
              <div className="knowledge-pane-heading">
                <strong>Детали</strong>
                {selectedItem ? (
                  <span>{knowledgeKindLabel(selectedItem.kind)}</span>
                ) : null}
              </div>

              {selectedItem ? (
                <div className="knowledge-detail-content">
                  <div className="knowledge-detail-primary">
                    <h2 className="knowledge-panel-title">
                      {selectedItem.label}
                    </h2>
                    {selectedItem.predicate ? (
                      <p>{selectedItem.predicate}</p>
                    ) : (
                      <p className="supporting-text">
                        Объект знания без отдельного утверждения.
                      </p>
                    )}
                  </div>

                  <div className="knowledge-detail-relations">
                    <span className="knowledge-detail-label">Связанные знания</span>
                    {selectedItem.related.length > 0 ? (
                      <ul>
                        {selectedItem.related.map((related) => (
                          <li key={related.knowledgeRef}>
                            <button
                              type="button"
                              className="knowledge-relation-link"
                              onClick={() => chooseItem(related.knowledgeRef)}
                              disabled={
                                !visibleItems.some(
                                  (item) =>
                                    item.knowledgeRef === related.knowledgeRef,
                                )
                              }
                            >
                              {related.label}
                            </button>
                            <span>{knowledgeKindLabel(related.kind)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>В текущей области связанных знаний нет.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="knowledge-detail-placeholder">
                  <h2 className="knowledge-detail-placeholder-title">
                    Выберите строку
                  </h2>
                  <p className="knowledge-detail-placeholder-copy">
                    Детали выбранного знания появятся здесь, а граф справа
                    останется доступен одновременно.
                  </p>
                </div>
              )}
            </aside>
          </div>
        ) : null}
      </section>
    </section>
  );
}
