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

  function chooseItem(item: KnowledgeItemModel) {
    setSelectedKnowledgeRef(item.knowledgeRef);
    setScope("detail");
  }

  function chooseItemByRef(knowledgeRef: KnowledgeRef) {
    const item = visibleItems.find(
      (candidate) => candidate.knowledgeRef === knowledgeRef,
    );
    if (item) {
      chooseItem(item);
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

  const localFiltersActive =
    kindFilter !== "all" || relationsFilter !== "all";
  const filtersActive =
    queryDraft.length > 0 || requiredCapabilityRef !== null || localFiltersActive;

  return (
    <section
      className="task-view knowledge-explorer-view"
      data-view="knowledge"
      data-renderer="nonspatial-primary"
      data-spatial-overview={RelationshipRenderer ? "available" : "unavailable"}
      aria-labelledby="knowledge-heading"
    >
      <header className="task-heading knowledge-task-heading">
        <p className="eyebrow">Знания</p>
        <h1 id="knowledge-heading">Знания текущей цели</h1>
        <p>
          Фильтруйте набор, выбирайте строку для деталей и используйте обзор
          связей как дополнительную навигацию по той же выборке.
        </p>
      </header>

      <section
        className="knowledge-query-region"
        aria-labelledby="knowledge-query-heading"
      >
        <div className="knowledge-toolbar-heading">
          <div>
            <p className="eyebrow">Фильтры</p>
            <h2 id="knowledge-query-heading" className="knowledge-section-title">Смысловая область</h2>
          </div>
          <div className="knowledge-scope-summary">
            <span>Цель: текущая</span>
            <span>Фокус: {activeFocusRef ? "учтён" : "не выбран"}</span>
            <span>
              Компетенция:{" "}
              {projection?.requiredCapabilityLabel ??
                (requiredCapabilityRef ? "ограничено" : "без фильтра")}
            </span>
          </div>
        </div>

        <div className="knowledge-filter-toolbar">
          <label className="field knowledge-filter-field knowledge-search-field">
            <span className="knowledge-filter-label">Поиск</span>
            <input
              className="knowledge-filter-control"
              value={queryDraft}
              onChange={(event) => setQueryDraft(event.currentTarget.value)}
              placeholder="Название или смысл утверждения"
            />
          </label>

          <label className="field knowledge-filter-field">
            <span className="knowledge-filter-label">Тип</span>
            <select
              className="knowledge-filter-control"
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
          </label>

          <label className="field knowledge-filter-field">
            <span className="knowledge-filter-label">Связность</span>
            <select
              className="knowledge-filter-control"
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
              <option value="all">Любая</option>
              <option value="two-plus">2+ связи</option>
              <option value="three-plus">3+ связи</option>
            </select>
          </label>

          <label className="field knowledge-filter-field">
            <span className="knowledge-filter-label">Глубина</span>
            <select
              className="knowledge-filter-control"
              value={scope}
              onChange={(event) =>
                setScope(event.currentTarget.value as "overview" | "detail")
              }
            >
              <option value="overview">Обзор</option>
              <option value="detail">Подробно</option>
            </select>
          </label>

          <div className="knowledge-filter-actions">
            {filtersActive ? (
              <button
                type="button"
                className="secondary-action"
                onClick={resetFilters}
              >
                Сбросить фильтры
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      <section
        className="knowledge-results-region"
        aria-labelledby="knowledge-results-heading"
      >
        <div className="knowledge-results-heading">
          <div>
            <p className="eyebrow">Результаты</p>
            <h2 id="knowledge-results-heading" className="knowledge-section-title">Найденные знания</h2>
          </div>
          {projection ? (
            <p className="knowledge-result-count" role="status">
              Показано {visibleItems.length} из {projection.items.length}
            </p>
          ) : null}
        </div>

        {status === "loading" ? <p role="status">Загрузка знаний…</p> : null}

        {status === "ready" && visibleItems.length === 0 ? (
          <div className="knowledge-empty">
            <strong>По текущим фильтрам ничего не найдено.</strong>
            <p className="knowledge-empty-copy">
              Измените поиск или один из фильтров. Контекст цели и выбранного
              фокуса сохранится.
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
                            onClick={() => chooseItem(item)}
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

            <div className="knowledge-inspector-column">
              {RelationshipRenderer ? (
                <section
                  className="knowledge-relationship-region"
                  aria-labelledby="knowledge-relationship-heading"
                >
                  <div className="knowledge-panel-heading">
                    <div>
                      <p className="eyebrow">Обзор</p>
                      <h3 id="knowledge-relationship-heading" className="knowledge-panel-title">Связи</h3>
                    </div>
                    <span className="knowledge-panel-badge">{relationshipOverview.edges.length} реб.</span>
                  </div>
                  <RelationshipRenderer
                    model={relationshipOverview}
                    onSelectKnowledge={chooseItemByRef}
                  />
                  <p className="supporting-text knowledge-relationship-caption">
                    Граф показывает только текущую отфильтрованную выборку.
                  </p>
                </section>
              ) : null}

              <aside
                className="knowledge-detail-region"
                aria-labelledby="knowledge-detail-heading"
              >
                {selectedItem ? (
                  <>
                    <div className="knowledge-panel-heading">
                      <div>
                        <p className="eyebrow">Выбранное знание</p>
                        <h3
                          id="knowledge-detail-heading"
                          className="knowledge-panel-title"
                        >
                          {selectedItem.label}
                        </h3>
                      </div>
                      <span className="knowledge-panel-badge">{knowledgeKindLabel(selectedItem.kind)}</span>
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
                                      chooseItemByRef(related.knowledgeRef)
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
                    <p className="eyebrow">Детали</p>
                    <h3 id="knowledge-detail-heading" className="knowledge-detail-placeholder-title">Выберите строку</h3>
                    <p className="knowledge-detail-placeholder-copy">
                      Детали и подсветка связей обновятся для выбранного знания.
                    </p>
                  </div>
                )}
              </aside>
            </div>
          </div>
        ) : null}
      </section>

      <p className="supporting-text knowledge-renderer-note">
        Таблица и детали остаются полным способом работы со знаниями. Граф —
        дополнительный обзор связей и не определяет смысл Knowledge.
      </p>
    </section>
  );
}
