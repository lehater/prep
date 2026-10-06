import { useEffect, useMemo, useState } from "react";

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

export interface KnowledgeExplorerFeatureProps {
  readonly port: KnowledgePort;
  readonly activeTargetRef: TargetRef;
  readonly activeFocusRef: FocusRef | null;
  readonly incomingRequiredCapabilityRef?: CapabilityRef | undefined;
  readonly relationshipRenderer?: KnowledgeRelationshipRenderer | undefined;
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
  const [inspectorView, setInspectorView] =
    useState<"details" | "relations">("relations");

  useEffect(() => {
    if (incomingRequiredCapabilityRef) {
      setRequiredCapabilityRef(incomingRequiredCapabilityRef);
    }
  }, [incomingRequiredCapabilityRef, setRequiredCapabilityRef]);

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

  function chooseTableItem(item: KnowledgeItemModel) {
    setSelectedKnowledgeRef(item.knowledgeRef);
    setScope("detail");
    setInspectorView("details");
  }

  function chooseGraphItem(knowledgeRef: KnowledgeRef) {
    if (
      visibleItems.some((item) => item.knowledgeRef === knowledgeRef)
    ) {
      setSelectedKnowledgeRef(knowledgeRef);
      setScope("detail");
    }
  }

  function chooseRelatedItem(knowledgeRef: KnowledgeRef) {
    if (
      visibleItems.some((item) => item.knowledgeRef === knowledgeRef)
    ) {
      setSelectedKnowledgeRef(knowledgeRef);
      setScope("detail");
      setInspectorView("details");
    }
  }

  function resetFilters() {
    setQueryDraft("");
    setKindFilter("all");
    setRelationsFilter("all");
    setRequiredCapabilityRef(null);
    setScope("overview");
    setSelectedKnowledgeRef(null);
    setInspectorView("relations");
  }

  const localFiltersActive =
    kindFilter !== "all" || relationsFilter !== "all";
  const filtersActive =
    queryDraft.length > 0 || requiredCapabilityRef !== null || localFiltersActive;

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

        <div className="knowledge-filter-toolbar" aria-label="Фильтры знаний">
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
          <div className="knowledge-workbench">
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
                            onClick={() => chooseTableItem(item)}
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

            <aside className="knowledge-inspector" aria-label="Инспектор знаний">
              <div className="knowledge-inspector-tabs" role="tablist">
                <button
                  id="knowledge-details-tab"
                  type="button"
                  role="tab"
                  aria-selected={inspectorView === "details"}
                  aria-controls="knowledge-details-panel"
                  onClick={() => setInspectorView("details")}
                >
                  Детали
                </button>
                {RelationshipRenderer ? (
                  <button
                    id="knowledge-relations-tab"
                    type="button"
                    role="tab"
                    aria-selected={inspectorView === "relations"}
                    aria-controls="knowledge-relations-panel"
                    onClick={() => setInspectorView("relations")}
                  >
                    Связи
                    <span>{relationshipOverview.edges.length}</span>
                  </button>
                ) : null}
              </div>

              <div className="knowledge-inspector-panel">
                {inspectorView === "relations" && RelationshipRenderer ? (
                  <section
                    id="knowledge-relations-panel"
                    className="knowledge-relationship-region"
                    role="tabpanel"
                    aria-labelledby="knowledge-relations-tab"
                  >
                    <RelationshipRenderer
                      model={relationshipOverview}
                      onSelectKnowledge={chooseGraphItem}
                    />
                    <p className="supporting-text knowledge-relationship-caption">
                      Текущая отфильтрованная выборка.
                    </p>
                  </section>
                ) : (
                  <section
                    id="knowledge-details-panel"
                    className="knowledge-detail-region"
                    role="tabpanel"
                    aria-labelledby="knowledge-details-tab"
                  >
                    {selectedItem ? (
                      <>
                        <div className="knowledge-panel-heading">
                          <h2 className="knowledge-panel-title">
                            {selectedItem.label}
                          </h2>
                          <span className="knowledge-panel-badge">
                            {knowledgeKindLabel(selectedItem.kind)}
                          </span>
                        </div>

                        <dl className="knowledge-detail-list">
                          {selectedItem.predicate ? (
                            <div>
                              <dt>Смысл утверждения</dt>
                              <dd>{selectedItem.predicate}</dd>
                            </div>
                          ) : null}
                          <div>
                            <dt>Связи</dt>
                            <dd>
                              {selectedItem.related.length > 0 ? (
                                <ul>
                                  {selectedItem.related.map((related) => (
                                    <li key={related.knowledgeRef}>
                                      <button
                                        type="button"
                                        className="knowledge-relation-link"
                                        onClick={() =>
                                          chooseRelatedItem(related.knowledgeRef)
                                        }
                                        disabled={
                                          !visibleItems.some(
                                            (item) =>
                                              item.knowledgeRef ===
                                              related.knowledgeRef,
                                          )
                                        }
                                      >
                                        {related.label}
                                      </button>{" "}
                                      <span>
                                        ({knowledgeKindLabel(related.kind)})
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                "В текущей области связанных знаний нет."
                              )}
                            </dd>
                          </div>
                        </dl>
                      </>
                    ) : (
                      <div className="knowledge-detail-placeholder">
                        <h2 className="knowledge-detail-placeholder-title">
                          Выберите строку
                        </h2>
                        <p className="knowledge-detail-placeholder-copy">
                          Здесь появятся свойства и связанные знания.
                        </p>
                      </div>
                    )}
                  </section>
                )}
              </div>
            </aside>
          </div>
        ) : null}
      </section>
    </section>
  );
}
