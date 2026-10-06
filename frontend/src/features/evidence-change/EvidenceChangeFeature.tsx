import { useEffect, useMemo, useState } from "react";

import type {
  ChangeModel,
  EvidenceChangePort,
} from "./contract";
import type {
  CurrentStateModel,
  EvidenceModel,
} from "../current-position/contract";
import type {
  ActivityAttemptRef,
  CapabilityRef,
  TargetRef,
} from "../contracts";

export interface EvidenceChangeFeatureProps {
  readonly port: EvidenceChangePort;
  readonly activeTargetRef: TargetRef;
  readonly activityAttemptRef: ActivityAttemptRef;
  readonly canContinueCurrentFocus: boolean;
  readonly onContinueCurrentFocus: () => void;
  readonly onReturnCurrent: () => void;
  readonly onInspectKnowledge: () => void;
}

function outcomeLabel(
  outcome: ChangeModel["learnerEvidenceChange"],
): string {
  switch (outcome) {
    case "changed":
      return "Changed";
    case "no-change":
      return "No change";
    case "challenged":
      return "Challenged";
    case "increased-uncertainty":
      return "Increased uncertainty";
    case "unresolved":
      return "Unresolved";
  }
}

function stateExplanation(state: "demonstrated" | "challenged" | "unknown") {
  switch (state) {
    case "demonstrated":
      return "Evidence currently supports this capability.";
    case "challenged":
      return "Current evidence challenges part of the required performance.";
    case "unknown":
      return "There is not enough attributable evidence to conclude either way.";
  }
}

export function EvidenceChangeFeature({
  port,
  activeTargetRef,
  activityAttemptRef,
  canContinueCurrentFocus,
  onContinueCurrentFocus,
  onReturnCurrent,
  onInspectKnowledge,
}: EvidenceChangeFeatureProps) {
  const [change, setChange] = useState<ChangeModel | null>(null);
  const [currentState, setCurrentState] = useState<CurrentStateModel | null>(
    null,
  );
  const [evidence, setEvidence] = useState<EvidenceModel | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setMessage(null);
    setChange(null);
    setCurrentState(null);
    setEvidence(null);

    void Promise.all([
      port.getChange({
        targetRef: activeTargetRef,
        activityAttemptRef,
      }),
      port.getCurrentState(activeTargetRef),
      port.getEvidence(activeTargetRef),
    ]).then(([changeOutcome, stateOutcome, evidenceOutcome]) => {
      if (cancelled) {
        return;
      }

      const messages: string[] = [];

      if (changeOutcome.status === "accepted") {
        setChange(changeOutcome.projection.value);
      } else {
        messages.push(changeOutcome.message);
      }

      if (stateOutcome.status === "accepted") {
        setCurrentState(stateOutcome.projection.value);
      } else {
        messages.push(stateOutcome.message);
      }

      if (evidenceOutcome.status === "accepted") {
        setEvidence(evidenceOutcome.projection.value);
      } else {
        messages.push(evidenceOutcome.message);
      }

      setMessage(messages.length > 0 ? messages.join(" ") : null);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [activityAttemptRef, activeTargetRef, port]);

  const capabilityLabels = useMemo(
    () =>
      new Map(
        currentState?.capabilities.map((item) => [
          item.capabilityRef,
          item.capabilityLabel,
        ]) ?? [],
      ),
    [currentState],
  );

  return (
    <section
      className="task-view evidence-change-view"
      data-view="evidence-change"
      data-variant={change?.learnerEvidenceChange ?? status}
      aria-labelledby="evidence-change-heading"
    >
      <header className="task-heading">
        <p className="eyebrow">Evidence &amp; changes</p>
        <h1 id="evidence-change-heading">
          Review what changed after the Activity
        </h1>
        <p>
          Review the evaluated result of the completed occurrence, keep evidence
          separate from learner-state conclusions, and choose the next
          continuation explicitly.
        </p>
      </header>

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      {status === "loading" ? <p role="status">Loading reviewed result…</p> : null}

      {change ? (
        <section
          className="change-summary-region"
          aria-labelledby="change-summary-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Reviewed Activity result</p>
            <h2 id="change-summary-heading">Change summary</h2>
          </div>

          <div className="change-outcome-grid">
            <div>
              <span>Learner evidence / state interpretation</span>
              <strong data-change-outcome={change.learnerEvidenceChange}>
                {outcomeLabel(change.learnerEvidenceChange)}
              </strong>
            </div>
            <div>
              <span>Target information</span>
              <strong>{outcomeLabel(change.targetInformationChange)}</strong>
            </div>
          </div>

          <p className="change-explanation">{change.explanation}</p>

          <p className="supporting-text">
            The reviewed ActivityAttempt is the correlation context for this
            result. Activity completion itself was not treated as capability
            evidence.
          </p>
        </section>
      ) : null}

      {currentState ? (
        <section
          className="current-state-after-region"
          aria-labelledby="current-state-after-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Current state after review</p>
            <h2 id="current-state-after-heading">
              Evidence-backed capability state
            </h2>
          </div>

          <div className="current-state-grid">
            {currentState.capabilities.map((item) => (
              <article className="state-card" key={item.capabilityRef}>
                <div className="state-card-heading">
                  <h3>{item.capabilityLabel}</h3>
                  <strong data-state={item.state}>{item.state}</strong>
                </div>
                <p>{stateExplanation(item.state)}</p>
                {item.limitations.length > 0 ? (
                  <ul className="limitation-list">
                    {item.limitations.map((limitation) => (
                      <li key={limitation.detail}>{limitation.detail}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {change ? (
        <section
          className="evidence-change-actions"
          aria-labelledby="evidence-change-actions-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Continuation</p>
            <h2 id="evidence-change-actions-heading">Choose what to do next</h2>
          </div>
          <div className="action-row">
            {canContinueCurrentFocus ? (
              <button
                type="button"
                className="primary-action"
                onClick={onContinueCurrentFocus}
              >
                Continue current focus
              </button>
            ) : null}
            <button
              type="button"
              className="secondary-action"
              onClick={onReturnCurrent}
            >
              Return to Current position
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={onInspectKnowledge}
            >
              Inspect Knowledge
            </button>
          </div>
        </section>
      ) : null}

      {evidence ? (
        <details className="evidence-review-detail">
          <summary>Inspect evidence facts and provenance</summary>
          <div className="evidence-facts">
            {evidence.facts.map((fact) => (
              <article className="evidence-card" key={fact.evidenceRef}>
                <div className="evidence-card-heading">
                  <strong>{fact.kind}</strong>
                  <span>{fact.summary}</span>
                </div>

                {fact.supportsCapabilityRefs.length > 0 ? (
                  <p>
                    Supports:{" "}
                    {fact.supportsCapabilityRefs
                      .map(
                        (capabilityRef: CapabilityRef) =>
                          capabilityLabels.get(capabilityRef) ?? "Capability",
                      )
                      .join(", ")}
                  </p>
                ) : null}

                {fact.challengesCapabilityRefs.length > 0 ? (
                  <p>
                    Challenges:{" "}
                    {fact.challengesCapabilityRefs
                      .map(
                        (capabilityRef: CapabilityRef) =>
                          capabilityLabels.get(capabilityRef) ?? "Capability",
                      )
                      .join(", ")}
                  </p>
                ) : null}

                <p>
                  Provenance:{" "}
                  {fact.provenance.map((item) => item.label).join(", ")}
                </p>

                {fact.limitations.length > 0 ? (
                  <ul className="limitation-list">
                    {fact.limitations.map((limitation) => (
                      <li key={limitation.detail}>{limitation.detail}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}
