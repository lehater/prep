import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { DataTable, type DataTableColumn } from "../../ui/DataTable";
import {
  knowledgeFormLabel,
  knowledgeKindLabel,
  knowledgePredicateLabel,
  knowledgeRelationFamilyLabel,
} from "../../ui/presentationLabels";
import type { CapabilityRef, FocusRef, KnowledgeRef, TargetRef } from "../contracts";
import type {
  KnowledgeItemModel,
  KnowledgePort,
  KnowledgeProjectionModel,
  KnowledgeRelationshipProjectionModel,
} from "./contract";
import type {
  KnowledgeRelationshipOverviewModel,
  KnowledgeRelationshipRenderer,
} from "./relationship-renderer";
import { useKnowledgeExplorerState } from "./state";

const TABLE_GRAPH_SPLIT_KEY = "prep.knowledge.table-graph-ratio.v2";
const TOP_DETAILS_SPLIT_KEY = "prep.knowledge.top-details-ratio.v2";
const KNOWLEDGE_COLUMN_WIDTHS_KEY = "prep.knowledge.column-widths.v2";
const DEFAULT_TABLE_GRAPH_RATIO = 70;
const DEFAULT_TOP_DETAILS_RATIO = 50;
const TABLE_RATIO_MIN = 45;
const TABLE_RATIO_MAX = 82;
const TOP_RATIO_MIN = 30;
const TOP_RATIO_MAX = 80;
const SPLITTER_SIZE = 3;
const MIN_TABLE_WIDTH = 520;
const MIN_GRAPH_SIZE = 260;
const MIN_DETAILS_HEIGHT = 150;
export interface KnowledgeExplorerFeatureProps {
  readonly port: KnowledgePort;
  readonly activeTargetRef: TargetRef;
  readonly activeFocusRef: FocusRef | null;
  readonly incomingRequiredCapabilityRef?: CapabilityRef | undefined;
  readonly relationshipRenderer?: KnowledgeRelationshipRenderer | undefined;
  readonly returnLabel?: string | undefined;
  readonly onReturn?: (() => void) | undefined;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readStoredRatio(key: string, fallback: number): number {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (raw === null) {
    return fallback;
  }

  const stored = Number(raw);
  return Number.isFinite(stored) ? stored : fallback;
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function buildRelationshipOverview(
  items: readonly KnowledgeItemModel[],
  relationships: readonly KnowledgeRelationshipProjectionModel[],
  selectedKnowledgeRef: KnowledgeRef | null,
): KnowledgeRelationshipOverviewModel {
  const visibleRefs = new Set(items.map((item) => item.knowledgeRef));
  const visibleRelationships = relationships.filter(
    (relationship) =>
      visibleRefs.has(relationship.sourceRef) &&
      visibleRefs.has(relationship.targetRef),
  );

  const relationCounts = new Map<KnowledgeRef, number>();
  for (const relationship of visibleRelationships) {
    relationCounts.set(
      relationship.sourceRef,
      (relationCounts.get(relationship.sourceRef) ?? 0) + 1,
    );
    relationCounts.set(
      relationship.targetRef,
      (relationCounts.get(relationship.targetRef) ?? 0) + 1,
    );
  }

  return {
    nodes: items.map((item) => ({
      knowledgeRef: item.knowledgeRef,
      kind: item.kind,
      label: item.label,
      relationCount: relationCounts.get(item.knowledgeRef) ?? 0,
      selected: item.knowledgeRef === selectedKnowledgeRef,
    })),
    edges: visibleRelationships.map((relationship) => ({
      propositionRef: relationship.propositionRef,
      sourceRef: relationship.sourceRef,
      targetRef: relationship.targetRef,
      family: relationship.family,
      predicate: relationship.predicate,
      label: knowledgePredicateLabel(relationship.predicate),
      statement: relationship.statement,
    })),
    selectedKnowledgeRef,
  };
}

interface KnowledgeResultsTableProps {
  readonly items: readonly KnowledgeItemModel[];
  readonly relationCounts: ReadonlyMap<KnowledgeRef, number>;
  readonly selectedKnowledgeRef: KnowledgeRef | null;
  readonly onSelect: (knowledgeRef: KnowledgeRef) => void;
}

function KnowledgeResultsTable({
  items,
  relationCounts,
  selectedKnowledgeRef,
  onSelect,
}: KnowledgeResultsTableProps) {
  const columns: readonly DataTableColumn<KnowledgeItemModel>[] = [
    {
      id: "knowledge",
      header: "Знание",
      minWidth: 180,
      maxWidth: 760,
      render: (item) => (
        <button
          type="button"
          className="knowledge-row-select"
          aria-pressed={item.knowledgeRef === selectedKnowledgeRef}
          onClick={() => onSelect(item.knowledgeRef)}
        >
          <strong>{item.label}</strong>
          {item.predicate ? <small>{item.predicate}</small> : null}
        </button>
      ),
    },
    {
      id: "kind",
      header: "Тип / форма",
      minWidth: 100,
      maxWidth: 320,
      render: (item) => (
        <span className="knowledge-kind">
          {knowledgeKindLabel(item.kind)}
          {item.knowledgeForm
            ? ` · ${knowledgeFormLabel(item.knowledgeForm)}`
            : ""}
        </span>
      ),
    },
    {
      id: "relations",
      header: "Связи",
      minWidth: 52,
      maxWidth: 140,
      align: "right",
      render: (item) => (
        <span className="knowledge-relation-count">
          {relationCounts.get(item.knowledgeRef) ?? 0}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={items}
      getRowKey={(item) => item.knowledgeRef}
      selectedRowKey={selectedKnowledgeRef}
      storageKey={KNOWLEDGE_COLUMN_WIDTHS_KEY}
      className="knowledge-table-scroll"
      tableClassName="knowledge-table"
      ariaLabel="Знания"
    />
  );
}

export function KnowledgeExplorerFeature({
  port,
  activeTargetRef,
  activeFocusRef,
  incomingRequiredCapabilityRef,
  relationshipRenderer: RelationshipRenderer,
  returnLabel,
  onReturn,
}: KnowledgeExplorerFeatureProps) {
  const {
    queryDraft,
    appliedQuery,
    scope,
    requiredCapabilityRef,
    kindFilter,
    knowledgeFormFilter,
    relationFamilyFilter,
    relationPredicateFilter,
    selectedKnowledgeRef,
    setQueryDraft,
    setScope,
    setRequiredCapabilityRef,
    setKindFilter,
    setKnowledgeFormFilter,
    setRelationFamilyFilter,
    setRelationPredicateFilter,
    setSelectedKnowledgeRef,
  } = useKnowledgeExplorerState();

  const [projection, setProjection] =
    useState<KnowledgeProjectionModel | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const hadStoredLayoutRef = useRef(
    typeof window !== "undefined" &&
      window.localStorage.getItem(TABLE_GRAPH_SPLIT_KEY) !== null &&
      window.localStorage.getItem(TOP_DETAILS_SPLIT_KEY) !== null,
  );
  const [tableGraphRatio, setTableGraphRatio] = useState(() =>
    clamp(
      readStoredRatio(TABLE_GRAPH_SPLIT_KEY, DEFAULT_TABLE_GRAPH_RATIO),
      TABLE_RATIO_MIN,
      TABLE_RATIO_MAX,
    ),
  );
  const [topDetailsRatio, setTopDetailsRatio] = useState(() =>
    clamp(
      readStoredRatio(TOP_DETAILS_SPLIT_KEY, DEFAULT_TOP_DETAILS_RATIO),
      TOP_RATIO_MIN,
      TOP_RATIO_MAX,
    ),
  );

  const upperPaneRef = useRef<HTMLDivElement | null>(null);
  const workbenchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (incomingRequiredCapabilityRef) {
      setRequiredCapabilityRef(incomingRequiredCapabilityRef);
    }
  }, [incomingRequiredCapabilityRef, setRequiredCapabilityRef]);

  useLayoutEffect(() => {
    if (hadStoredLayoutRef.current || !projection) {
      return;
    }

    const rect = workbenchRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const maxGraphByWidth = rect.width - MIN_TABLE_WIDTH - SPLITTER_SIZE;
    const maxGraphByHeight = rect.height - MIN_DETAILS_HEIGHT - SPLITTER_SIZE;
    const maxGraphSize = Math.max(
      MIN_GRAPH_SIZE,
      Math.min(maxGraphByWidth, maxGraphByHeight),
    );
    const preferredGraphSize = Math.min(rect.width * 0.3, rect.height * 0.58);
    const graphSize = clamp(
      preferredGraphSize,
      MIN_GRAPH_SIZE,
      maxGraphSize,
    );

    setTableGraphRatio(
      clamp(
        ((rect.width - graphSize - SPLITTER_SIZE) / rect.width) * 100,
        TABLE_RATIO_MIN,
        TABLE_RATIO_MAX,
      ),
    );
    setTopDetailsRatio(
      clamp(
        (graphSize / rect.height) * 100,
        TOP_RATIO_MIN,
        TOP_RATIO_MAX,
      ),
    );
  }, [projection]);

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

  const knowledgeFormOptions = useMemo(
    () =>
      uniqueSorted(
        projection?.items.flatMap((item) =>
          item.knowledgeForm ? [item.knowledgeForm] : [],
        ) ?? [],
      ),
    [projection],
  );

  const relationFamilyOptions = useMemo(
    () =>
      uniqueSorted(
        projection?.relationships.map((relationship) => relationship.family) ?? [],
      ),
    [projection],
  );

  const relationPredicateOptions = useMemo(
    () =>
      uniqueSorted(
        projection?.relationships
          .filter(
            (relationship) =>
              relationFamilyFilter === "all" ||
              relationship.family === relationFamilyFilter,
          )
          .map((relationship) => relationship.predicate) ?? [],
      ),
    [projection, relationFamilyFilter],
  );

  useEffect(() => {
    if (
      relationPredicateFilter !== "all" &&
      !relationPredicateOptions.includes(relationPredicateFilter)
    ) {
      setRelationPredicateFilter("all");
    }
  }, [
    relationPredicateFilter,
    relationPredicateOptions,
    setRelationPredicateFilter,
  ]);

  const matchingRelationships = useMemo(
    () =>
      projection?.relationships.filter(
        (relationship) =>
          (relationFamilyFilter === "all" ||
            relationship.family === relationFamilyFilter) &&
          (relationPredicateFilter === "all" ||
            relationship.predicate === relationPredicateFilter),
      ) ?? [],
    [projection, relationFamilyFilter, relationPredicateFilter],
  );

  const relationFilterActive =
    relationFamilyFilter !== "all" || relationPredicateFilter !== "all";

  const visibleItems = useMemo(() => {
    const relationParticipantRefs = new Set<KnowledgeRef>();
    if (relationFilterActive) {
      for (const relationship of matchingRelationships) {
        relationParticipantRefs.add(relationship.sourceRef);
        relationParticipantRefs.add(relationship.targetRef);
      }
    }

    return (
      projection?.items.filter(
        (item) =>
          (kindFilter === "all" || item.kind === kindFilter) &&
          (knowledgeFormFilter === "all" ||
            item.knowledgeForm === knowledgeFormFilter) &&
          (!relationFilterActive ||
            relationParticipantRefs.has(item.knowledgeRef)),
      ) ?? []
    );
  }, [
    kindFilter,
    knowledgeFormFilter,
    matchingRelationships,
    projection,
    relationFilterActive,
  ]);

  const visibleRelationships = useMemo(() => {
    const visibleRefs = new Set(visibleItems.map((item) => item.knowledgeRef));
    return matchingRelationships.filter(
      (relationship) =>
        visibleRefs.has(relationship.sourceRef) &&
        visibleRefs.has(relationship.targetRef),
    );
  }, [matchingRelationships, visibleItems]);

  const relationCounts = useMemo(() => {
    const counts = new Map<KnowledgeRef, number>();
    for (const relationship of visibleRelationships) {
      counts.set(
        relationship.sourceRef,
        (counts.get(relationship.sourceRef) ?? 0) + 1,
      );
      counts.set(
        relationship.targetRef,
        (counts.get(relationship.targetRef) ?? 0) + 1,
      );
    }
    return counts;
  }, [visibleRelationships]);

  useEffect(() => {
    if (status !== "ready" || !projection) {
      return;
    }

    if (
      selectedKnowledgeRef &&
      !visibleItems.some((item) => item.knowledgeRef === selectedKnowledgeRef)
    ) {
      setSelectedKnowledgeRef(null);
    }
  }, [
    projection,
    selectedKnowledgeRef,
    setSelectedKnowledgeRef,
    status,
    visibleItems,
  ]);

  const selectedItem = useMemo(
    () =>
      visibleItems.find(
        (item) => item.knowledgeRef === selectedKnowledgeRef,
      ) ?? null,
    [selectedKnowledgeRef, visibleItems],
  );

  const selectedRelations = useMemo(() => {
    if (!selectedItem || !projection) {
      return [];
    }

    return visibleRelationships.flatMap((relationship) => {
      const outgoing = relationship.sourceRef === selectedItem.knowledgeRef;
      const incoming = relationship.targetRef === selectedItem.knowledgeRef;
      if (!outgoing && !incoming) {
        return [];
      }

      const counterpartRef = outgoing
        ? relationship.targetRef
        : relationship.sourceRef;
      const counterpart = projection.items.find(
        (item) => item.knowledgeRef === counterpartRef,
      );
      if (!counterpart) {
        return [];
      }

      return [
        {
          relationship,
          counterpart,
          displayPredicate:
            outgoing || !relationship.inversePredicate
              ? relationship.predicate
              : relationship.inversePredicate,
        },
      ];
    });
  }, [projection, selectedItem, visibleRelationships]);

  const relationshipOverview = useMemo(
    () =>
      buildRelationshipOverview(
        visibleItems,
        visibleRelationships,
        selectedKnowledgeRef,
      ),
    [selectedKnowledgeRef, visibleItems, visibleRelationships],
  );

  function chooseItem(knowledgeRef: KnowledgeRef) {
    if (visibleItems.some((item) => item.knowledgeRef === knowledgeRef)) {
      setSelectedKnowledgeRef(knowledgeRef);
      setScope("detail");
    }
  }

  function resetFilters() {
    setQueryDraft("");
    setKindFilter("all");
    setKnowledgeFormFilter("all");
    setRelationFamilyFilter("all");
    setRelationPredicateFilter("all");
    setRequiredCapabilityRef(null);
    setScope("overview");
    setSelectedKnowledgeRef(null);
  }

  function updateTableGraphRatio(clientX: number) {
    const rect = upperPaneRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) {
      return;
    }

    const minTable = Math.min(MIN_TABLE_WIDTH, rect.width * 0.6);
    const minGraph = Math.min(MIN_GRAPH_SIZE, rect.width * 0.32);
    const minRatio = (minTable / rect.width) * 100;
    const maxRatio = ((rect.width - minGraph) / rect.width) * 100;

    setTableGraphRatio(
      clamp(
        ((clientX - rect.left) / rect.width) * 100,
        Math.max(TABLE_RATIO_MIN, minRatio),
        Math.min(TABLE_RATIO_MAX, maxRatio),
      ),
    );
  }

  function updateTopDetailsRatio(clientY: number) {
    const rect = workbenchRef.current?.getBoundingClientRect();
    if (!rect || rect.height <= 0) {
      return;
    }

    const minTop = Math.min(MIN_GRAPH_SIZE, rect.height * 0.58);
    const minDetails = Math.min(MIN_DETAILS_HEIGHT, rect.height * 0.34);
    const minRatio = (minTop / rect.height) * 100;
    const maxRatio = ((rect.height - minDetails) / rect.height) * 100;

    setTopDetailsRatio(
      clamp(
        ((clientY - rect.top) / rect.height) * 100,
        Math.max(TOP_RATIO_MIN, minRatio),
        Math.min(TOP_RATIO_MAX, maxRatio),
      ),
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
      setTableGraphRatio((value) =>
        clamp(value - 2, TABLE_RATIO_MIN, TABLE_RATIO_MAX),
      );
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setTableGraphRatio((value) =>
        clamp(value + 2, TABLE_RATIO_MIN, TABLE_RATIO_MAX),
      );
    } else if (event.key === "Home") {
      event.preventDefault();
      setTableGraphRatio(TABLE_RATIO_MIN);
    } else if (event.key === "End") {
      event.preventDefault();
      setTableGraphRatio(TABLE_RATIO_MAX);
    }
  }

  function handleHorizontalDividerKey(
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setTopDetailsRatio((value) =>
        clamp(value - 2, TOP_RATIO_MIN, TOP_RATIO_MAX),
      );
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setTopDetailsRatio((value) =>
        clamp(value + 2, TOP_RATIO_MIN, TOP_RATIO_MAX),
      );
    } else if (event.key === "Home") {
      event.preventDefault();
      setTopDetailsRatio(TOP_RATIO_MIN);
    } else if (event.key === "End") {
      event.preventDefault();
      setTopDetailsRatio(TOP_RATIO_MAX);
    }
  }

  const localFiltersActive =
    kindFilter !== "all" ||
    knowledgeFormFilter !== "all" ||
    relationFamilyFilter !== "all" ||
    relationPredicateFilter !== "all";
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
          {onReturn ? (
            <button
              type="button"
              className="secondary-action"
              onClick={onReturn}
            >
              {returnLabel ?? "Вернуться"}
            </button>
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
            aria-label="Тип знания"
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
            <option value="all">Все виды</option>
            <option value="object">{knowledgeKindLabel("object")}</option>
            <option value="proposition">
              {knowledgeKindLabel("proposition")}
            </option>
          </select>

          <select
            className="knowledge-filter-control"
            aria-label="Форма знания"
            value={knowledgeFormFilter}
            onChange={(event) =>
              setKnowledgeFormFilter(event.currentTarget.value)
            }
          >
            <option value="all">Все формы</option>
            {knowledgeFormOptions.map((form) => (
              <option key={form} value={form}>
                {knowledgeFormLabel(form)}
              </option>
            ))}
          </select>

          <select
            className="knowledge-filter-control"
            aria-label="Семейство связи"
            value={relationFamilyFilter}
            onChange={(event) =>
              setRelationFamilyFilter(event.currentTarget.value)
            }
          >
            <option value="all">Все семейства связей</option>
            {relationFamilyOptions.map((family) => (
              <option key={family} value={family}>
                {knowledgeRelationFamilyLabel(family)}
              </option>
            ))}
          </select>

          <select
            className="knowledge-filter-control"
            aria-label="Тип связи"
            value={relationPredicateFilter}
            onChange={(event) =>
              setRelationPredicateFilter(event.currentTarget.value)
            }
          >
            <option value="all">Все типы связей</option>
            {relationPredicateOptions.map((predicate) => (
              <option key={predicate} value={predicate}>
                {knowledgePredicateLabel(predicate)}
              </option>
            ))}
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

      <div className="knowledge-message-slot">
        {message ? (
          <p className="outcome-message knowledge-outcome-message" role="status">
            {message}
          </p>
        ) : null}
      </div>

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
                <KnowledgeResultsTable
                  items={visibleItems}
                  relationCounts={relationCounts}
                  selectedKnowledgeRef={selectedKnowledgeRef}
                  onSelect={chooseItem}
                />
              </div>

              {RelationshipRenderer ? (
                <>
                  <hr
                    className="workspace-divider workspace-divider--vertical"
                    aria-label="Изменить ширину таблицы и графа"
                    aria-orientation="vertical"
                    aria-valuemin={TABLE_RATIO_MIN}
                    aria-valuemax={TABLE_RATIO_MAX}
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
                      Рёбра показывают только типизированные relational
                      propositions текущей выборки.
                    </p>
                  </aside>
                </>
              ) : null}
            </div>

            <hr
              className="workspace-divider workspace-divider--horizontal"
              aria-label="Изменить высоту таблицы и деталей"
              aria-orientation="horizontal"
              aria-valuemin={TOP_RATIO_MIN}
              aria-valuemax={TOP_RATIO_MAX}
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
                  <span>
                    {knowledgeKindLabel(selectedItem.kind)}
                    {selectedItem.knowledgeForm
                      ? ` · ${knowledgeFormLabel(selectedItem.knowledgeForm)}`
                      : ""}
                  </span>
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
                        Объект знания с формой{" "}
                        {selectedItem.knowledgeForm
                          ? knowledgeFormLabel(selectedItem.knowledgeForm)
                          : "не классифицирована"}.
                      </p>
                    )}
                  </div>

                  <div className="knowledge-detail-relations">
                    <span className="knowledge-detail-label">
                      Типизированные связи
                    </span>
                    {selectedRelations.length > 0 ? (
                      <ul>
                        {selectedRelations.map(
                          ({
                            relationship,
                            counterpart,
                            displayPredicate,
                          }) => (
                            <li key={relationship.propositionRef}>
                              <div className="knowledge-relation-summary">
                                <span className="knowledge-relation-predicate">
                                  {knowledgePredicateLabel(displayPredicate)}
                                </span>
                                <button
                                  type="button"
                                  className="knowledge-relation-link"
                                  onClick={() =>
                                    chooseItem(counterpart.knowledgeRef)
                                  }
                                >
                                  {counterpart.label}
                                </button>
                                <span>
                                  {knowledgeRelationFamilyLabel(
                                    relationship.family,
                                  )}
                                </span>
                              </div>
                              <small className="knowledge-relation-explanation">
                                {relationship.statement}
                              </small>
                            </li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <p>
                        В текущей выборке типизированных связей для знания нет.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="knowledge-detail-placeholder">
                  <h2 className="knowledge-detail-placeholder-title">
                    Выберите строку
                  </h2>
                  <p className="knowledge-detail-placeholder-copy">
                    Здесь появятся форма знания и смысл типизированных связей.
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
