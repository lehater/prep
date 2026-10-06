import { useState } from "react";

import type {
  PreparationRequestModel,
  PreparationSupportPort,
} from "./contract";
import type {
  FocusRef,
  SemanticBasisRef,
  TargetRef,
} from "../contracts";

export interface PreparationSupportFeatureProps {
  readonly port: PreparationSupportPort;
  readonly targetRef: TargetRef;
  readonly targetLabel: string;
  readonly focusRef?: FocusRef | undefined;
  readonly focusPurpose?: string | undefined;
  readonly semanticBasisRef: SemanticBasisRef | null;
  readonly motivatingContext: string;
  readonly originLabel: string;
  readonly onReturn: () => void;
}

type PreparationSupportViewState =
  | "request-input"
  | "requesting"
  | "result-review"
  | "continuation-recovery";

export function PreparationSupportFeature({
  port,
  targetRef,
  targetLabel,
  focusRef,
  focusPurpose,
  semanticBasisRef,
  motivatingContext,
  originLabel,
  onReturn,
}: PreparationSupportFeatureProps) {
  const [sourceContext, setSourceContext] = useState(motivatingContext);
  const [provenanceLabel, setProvenanceLabel] = useState(
    `Current preparation context from ${originLabel}`,
  );
  const [result, setResult] = useState<PreparationRequestModel | null>(null);
  const [viewState, setViewState] =
    useState<PreparationSupportViewState>("request-input");
  const [message, setMessage] = useState<string | null>(
    semanticBasisRef
      ? null
      : "This candidate context has no accepted semantic basis yet. Return and establish the Target before requesting generated support.",
  );

  async function requestPreparation() {
    if (!semanticBasisRef) {
      setMessage(
        "An accepted Target or Focus basis is required before requesting preparation support.",
      );
      setViewState("continuation-recovery");
      return;
    }

    if (
      sourceContext.trim().length === 0 ||
      provenanceLabel.trim().length === 0
    ) {
      setMessage(
        "Keep both the missing-support context and its provenance before requesting preparation.",
      );
      return;
    }

    setViewState("requesting");
    setMessage(null);

    const outcome = await port.requestPreparation({
      targetRef,
      ...(focusRef ? { focusRef } : {}),
      sourceContext,
      sourceProvenance: [{ label: provenanceLabel }],
      semanticBasisRef,
    });

    if (outcome.status !== "accepted") {
      setMessage(outcome.message);
      setViewState("continuation-recovery");
      return;
    }

    setResult(outcome.projection.value);
    setViewState("result-review");
  }

  async function refreshPreparation() {
    if (!result) {
      return;
    }

    setMessage(null);
    const outcome = await port.getPreparation(result.preparationRequestRef);

    if (outcome.status !== "accepted") {
      setMessage(outcome.message);
      setViewState("continuation-recovery");
      return;
    }

    setResult(outcome.projection.value);
    setViewState("result-review");
  }

  return (
    <section
      className="task-view preparation-support-view"
      data-view="prepare-support"
      data-variant={viewState}
      aria-labelledby="prepare-support-heading"
    >
      <header className="task-heading">
        <p className="eyebrow">Prepare Support</p>
        <h1 id="prepare-support-heading">Prepare Support</h1>
        <p>
          Resolve one bounded missing-support need while preserving the
          originating preparation context.
        </p>
      </header>

      <section
        className="preparation-motivating-context"
        aria-labelledby="preparation-context-heading"
      >
        <div className="section-heading">
          <p className="eyebrow">Motivating context</p>
          <h2 id="preparation-context-heading">{targetLabel}</h2>
        </div>
        {focusPurpose ? (
          <p>
            <strong>Next focus:</strong> {focusPurpose}
          </p>
        ) : null}
        <p>{motivatingContext}</p>
        <p className="supporting-text">Return destination: {originLabel}</p>
      </section>

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      <section
        className="preparation-source-region"
        aria-labelledby="preparation-source-heading"
      >
        <div className="section-heading">
          <p className="eyebrow">Source context</p>
          <h2 id="preparation-source-heading">Describe what is missing</h2>
        </div>

        <label className="field">
          <span>Missing-support context</span>
          <textarea
            rows={4}
            value={sourceContext}
            disabled={viewState === "requesting"}
            onChange={(event) => setSourceContext(event.currentTarget.value)}
          />
        </label>

        <label className="field">
          <span>Provenance</span>
          <input
            value={provenanceLabel}
            disabled={viewState === "requesting"}
            onChange={(event) => setProvenanceLabel(event.currentTarget.value)}
          />
        </label>

        <div className="action-row">
          <button
            type="button"
            className="primary-action"
            disabled={viewState === "requesting" || !semanticBasisRef}
            onClick={() => void requestPreparation()}
          >
            {viewState === "requesting"
              ? "Preparing support…"
              : result
                ? "Request again"
                : "Request preparation support"}
          </button>
          <button
            type="button"
            className="text-action"
            onClick={onReturn}
          >
            Return to {originLabel}
          </button>
        </div>
      </section>

      {result ? (
        <section
          className="preparation-results-region"
          aria-labelledby="preparation-results-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Accepted result</p>
            <h2 id="preparation-results-heading">
              Prepared support and explicit remainder
            </h2>
          </div>

          <div className="preparation-result-grid">
            <section
              className="accepted-support-region"
              aria-labelledby="accepted-support-heading"
            >
              <h3 id="accepted-support-heading">Accepted support</h3>
              {result.acceptedSupport.length > 0 ? (
                <div className="accepted-support-list">
                  {result.acceptedSupport.map((support) => (
                    <article
                      className="accepted-support-card"
                      key={support.supportRef}
                    >
                      <strong>{support.label}</strong>
                      <p>
                        Intended capability: {support.intendedCapabilityLabel}
                      </p>
                      <p>{support.fitBasis}</p>
                      {support.limitations.length > 0 ? (
                        <ul className="limitation-list">
                          {support.limitations.map((limitation) => (
                            <li key={limitation.detail}>
                              {limitation.detail}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p>No support was accepted for this request.</p>
              )}
            </section>

            <section
              className="preparation-remainder-region"
              aria-labelledby="preparation-remainder-heading"
            >
              <h3 id="preparation-remainder-heading">Remainder</h3>
              {result.remainder.length > 0 ? (
                <ul className="preparation-remainder-list">
                  {result.remainder.map((item) => (
                    <li key={item.subject}>
                      <strong>{item.subject}</strong>
                      <span data-remainder-status={item.status}>
                        {item.status}
                      </span>
                      <p>{item.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No unresolved or rejected remainder.</p>
              )}
            </section>
          </div>

          <p className="supporting-text">
            Request state: {result.state}. Accepted support remains usable even
            when other requested support is unresolved or rejected.
          </p>

          <div className="action-row">
            <button
              type="button"
              className="primary-action"
              onClick={onReturn}
            >
              Return to {originLabel}
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={() => void refreshPreparation()}
            >
              Refresh preparation result
            </button>
          </div>
        </section>
      ) : null}
    </section>
  );
}
