import { type FormEvent, useEffect, useMemo, useState } from "react";

import type {
  KnowledgeItemModel,
  KnowledgePort,
  KnowledgeProjectionModel,
} from "./contract";
import { useKnowledgeExplorerState } from "./state";
import type { CapabilityRef, FocusRef, TargetRef } from "../contracts";

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
        <p className="eyebrow">Knowledge</p>
        <h1 id="knowledge-heading">Explore the Knowledge that matters here</h1>
        <p>
          Query bounded Subject Knowledge, inspect proposition meaning and
          relationships, and keep the current Target/focus scope visible.
        </p>
      </header>

      <section className="knowledge-query-region" aria-labelledby="knowledge-query-heading">
        <div className="section-heading">
          <p className="eyebrow">Semantic scope</p>
          <h2 id="knowledge-query-heading">Query Knowledge</h2>
        </div>

        <div className="knowledge-scope-context">
          <div>
            <span>Target</span>
            <strong>Active Target</strong>
          </div>
          <div>
            <span>Next focus</span>
            <strong>{activeFocusRef ? "Included" : "Not selected"}</strong>
          </div>
          <div>
            <span>Required Capability</span>
            <strong>
              {projection?.requiredCapabilityLabel ??
                (requiredCapabilityRef ? "Scoped" : "No filter")}
            </strong>
          </div>
        </div>

        <form className="knowledge-query-form" onSubmit={submitQuery}>
          <label className="field">
            <span>Knowledge query</span>
            <input
              value={queryDraft}
              onChange={(event) => setQueryDraft(event.currentTarget.value)}
              placeholder="Search semantic Knowledge in the current scope"
            />
          </label>

          <label className="field knowledge-scope-field">
            <span>Semantic depth</span>
            <select
              value={scope}
              onChange={(event) =>
                setScope(event.currentTarget.value as "overview" | "detail")
              }
            >
              <option value="overview">Overview</option>
              <option value="detail">Detail</option>
            </select>
          </label>

          <div className="action-row">
            <button type="submit" className="primary-action">
              Apply query
            </button>
            {requiredCapabilityRef ? (
              <button
                type="button"
                className="secondary-action"
                onClick={() => setRequiredCapabilityRef(null)}
              >
                Clear Required Capability scope
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
          <p className="eyebrow">Bounded results</p>
          <h2 id="knowledge-results-heading">Knowledge results</h2>
          {projection ? (
            <p>
              {projection.items.length} result
              {projection.items.length === 1 ? "" : "s"} in the current
              semantic scope.
            </p>
          ) : null}
        </div>

        {status === "loading" ? <p role="status">Loading Knowledge…</p> : null}

        {status === "ready" && projection?.items.length === 0 ? (
          <div className="knowledge-empty">
            <strong>No Knowledge matched this query.</strong>
            <p>
              Change the query or clear the Required Capability scope without
              losing the active Target/focus context.
            </p>
          </div>
        ) : null}

        {projection && projection.items.length > 0 ? (
          <div className="knowledge-result-list">
            {projection.items.map((item) => (
              <article className="knowledge-result-card" key={item.knowledgeRef}>
                <div>
                  <span className="knowledge-kind">{item.kind}</span>
                  <h3>{item.label}</h3>
                  {item.predicate ? <p>{item.predicate}</p> : null}
                </div>

                {item.related.length > 0 ? (
                  <div className="knowledge-relations">
                    <strong>Related Knowledge</strong>
                    <ul>
                      {item.related.map((related) => (
                        <li key={related.knowledgeRef}>
                          <span>{related.kind}</span>: {related.label}
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
                  Inspect {item.kind}
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {selectedItem ? (
        <aside className="knowledge-detail-region" aria-labelledby="knowledge-detail-heading">
          <div className="section-heading">
            <p className="eyebrow">Selected detail</p>
            <h2 id="knowledge-detail-heading">{selectedItem.label}</h2>
          </div>

          <dl className="knowledge-detail-list">
            <div>
              <dt>Kind</dt>
              <dd>{selectedItem.kind}</dd>
            </div>
            {selectedItem.predicate ? (
              <div>
                <dt>Predicate meaning</dt>
                <dd>{selectedItem.predicate}</dd>
              </div>
            ) : null}
            <div>
              <dt>Relationships</dt>
              <dd>
                {selectedItem.related.length > 0 ? (
                  <ul>
                    {selectedItem.related.map((related) => (
                      <li key={related.knowledgeRef}>
                        {related.label} ({related.kind})
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No related Knowledge is present in this bounded projection."
                )}
              </dd>
            </div>
          </dl>
        </aside>
      ) : null}

      <p className="supporting-text knowledge-renderer-note">
        This task path is complete without a spatial renderer. Geometry is not
        Knowledge meaning.
      </p>
    </section>
  );
}
