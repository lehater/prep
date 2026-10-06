import { type FormEvent, useEffect, useMemo, useState } from "react";

import type {
  KnowledgeItemModel,
  KnowledgePort,
  KnowledgeProjectionModel,
} from "./contract";
import { useKnowledgeExplorerState } from "./state";
import type { CapabilityRef, FocusRef, TargetRef } from "../contracts";
import { knowledgeKindLabel } from "../../ui/presentationLabels";

export interface KnowledgeExplorerFeatureProps {
  readonly port: KnowledgePort;
  readonly activeTargetRef: TargetRef;
  readonly activeFocusRef: FocusRef | null;
  readonly incomingRequiredCapabilityRef?: CapabilityRef | undefined;
}

export function KnowledgeExplorerFeature({
  port,
  activeTargetRef,
  activeFocusRef,
  incomingRequiredCapabilityRef,
}: KnowledgeExplorerFeatureProps) {
  const {
    queryDraft,
    appliedQuery,
    scope,
    requiredCapabilityRef,
    selectedKnowledgeRef,
    setQueryDraft,
    applyQuery,
    setScope,
    setRequiredCapabilityRef,
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
        ...(requiredCapabilityRef
          ? { requiredCapabilityRef }
          : {}),
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

  const selectedItem = useMemo(
    () =>
      projection?.items.find(
        (item) => item.knowledgeRef === selectedKnowledgeRef,
      ) ?? null,
    [projection, selectedKnowledgeRef],
  );

  function submitQuery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSelectedKnowledgeRef(null);
    applyQuery();
  }

  function chooseItem(item: KnowledgeItemModel) {
    setSelectedKnowledgeRef(item.knowledgeRef);
    setScope("detail");
  }

  return (
    <section
      className="task-view knowledge-explorer-view"
      data-view="knowledge"
      data-renderer="nonspatial"
      aria-labelledby="knowledge-heading"
    >
      <header className="task-heading">
        <p className="eyebrow">Знания</p>
        <h1 id="knowledge-heading">Исследуйте знания, важные для текущей цели</h1>
        <p>
          Ищите знания в текущей смысловой области, изучайте утверждения и
          связи между ними, не теряя контекст цели и выбранного фокуса.
        </p>
      </header>

      <section className="knowledge-query-region" aria-labelledby="knowledge-query-heading">
        <div className="section-heading">
          <p className="eyebrow">Смысловая область</p>
          <h2 id="knowledge-query-heading">Поиск знаний</h2>
        </div>

        <div className="knowledge-scope-context">
          <div>
            <span>Цель</span>
            <strong>Текущая цель</strong>
          </div>
          <div>
            <span>Следующий фокус</span>
            <strong>{activeFocusRef ? "учтён" : "не выбран"}</strong>
          </div>
          <div>
            <span>Требуемая компетенция</span>
            <strong>
              {projection?.requiredCapabilityLabel ??
                (requiredCapabilityRef ? "ограничено" : "без фильтра")}
            </strong>
          </div>
        </div>

        <form className="knowledge-query-form" onSubmit={submitQuery}>
          <label className="field">
            <span>Поиск</span>
            <input
              value={queryDraft}
              onChange={(event) => setQueryDraft(event.currentTarget.value)}
              placeholder="Найти знание в текущей области"
            />
          </label>

          <label className="field knowledge-scope-field">
            <span>Глубина</span>
            <select
              value={scope}
              onChange={(event) =>
                setScope(event.currentTarget.value as "overview" | "detail")
              }
            >
              <option value="overview">Обзор</option>
              <option value="detail">Подробно</option>
            </select>
          </label>

          <div className="action-row">
            <button type="submit" className="primary-action">
              Применить
            </button>
            {requiredCapabilityRef ? (
              <button
                type="button"
                className="secondary-action"
                onClick={() => setRequiredCapabilityRef(null)}
              >
                Снять фильтр по компетенции
              </button>
            ) : null}
          </div>
        </form>
      </section>

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      <section className="knowledge-results-region" aria-labelledby="knowledge-results-heading">
        <div className="section-heading">
          <p className="eyebrow">Результаты</p>
          <h2 id="knowledge-results-heading">Найденные знания</h2>
          {projection ? (
            <p>
              Найдено: {projection.items.length} в текущей смысловой области.
            </p>
          ) : null}
        </div>

        {status === "loading" ? <p role="status">Загрузка знаний…</p> : null}

        {status === "ready" && projection?.items.length === 0 ? (
          <div className="knowledge-empty">
            <strong>По запросу ничего не найдено.</strong>
            <p>
              Измените запрос или снимите фильтр по компетенции. Контекст цели и
              выбранного фокуса сохранится.
            </p>
          </div>
        ) : null}

        {projection && projection.items.length > 0 ? (
          <div className="knowledge-result-list">
            {projection.items.map((item) => (
              <article className="knowledge-result-card" key={item.knowledgeRef}>
                <div>
                  <span className="knowledge-kind">{knowledgeKindLabel(item.kind)}</span>
                  <h3>{item.label}</h3>
                  {item.predicate ? <p>{item.predicate}</p> : null}
                </div>

                {item.related.length > 0 ? (
                  <div className="knowledge-relations">
                    <strong>Связанные знания</strong>
                    <ul>
                      {item.related.map((related) => (
                        <li key={related.knowledgeRef}>
                          <span>{knowledgeKindLabel(related.kind)}</span>: {related.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => chooseItem(item)}
                >
                  Открыть {knowledgeKindLabel(item.kind)}
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {selectedItem ? (
        <aside className="knowledge-detail-region" aria-labelledby="knowledge-detail-heading">
          <div className="section-heading">
            <p className="eyebrow">Выбранный элемент</p>
            <h2 id="knowledge-detail-heading">{selectedItem.label}</h2>
          </div>

          <dl className="knowledge-detail-list">
            <div>
              <dt>Тип</dt>
              <dd>{knowledgeKindLabel(selectedItem.kind)}</dd>
            </div>
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
                        {related.label} ({knowledgeKindLabel(related.kind)})
                      </li>
                    ))}
                  </ul>
                ) : (
                  "В текущей области связанных знаний нет."
                )}
              </dd>
            </div>
          </dl>
        </aside>
      ) : null}

      <p className="supporting-text knowledge-renderer-note">
        Этот сценарий можно использовать и без пространственного графа:
        геометрия не определяет смысл знаний.
      </p>
    </section>
  );
}
