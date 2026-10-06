import { useEffect, useMemo, useState } from "react";

import type {
  CurrentPositionPort,
  CurrentStateModel,
  EvidenceModel,
  FocusModel,
  GapProjectionModel,
} from "./contract";
import type {
  CapabilityRef,
  FocusRef,
  GapRef,
  SemanticBasisRef,
  TargetRef,
} from "../contracts";

export interface CurrentPositionFeatureProps {
  readonly port: CurrentPositionPort;
  readonly activeTargetRef: TargetRef;
  readonly activeFocusRef: FocusRef | null;
  readonly onAcceptedFocus: (focus: FocusModel) => void;
  readonly onContinueActivity: () => void;
  readonly onRequestPreparationSupport: () => void;
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

export function CurrentPositionFeature({
  port,
  activeTargetRef,
  activeFocusRef,
  onAcceptedFocus,
  onContinueActivity,
  onRequestPreparationSupport,
}: CurrentPositionFeatureProps) {
  const [currentState, setCurrentState] = useState<CurrentStateModel | null>(null);
  const [gapProjection, setGapProjection] =
    useState<GapProjectionModel | null>(null);
  const [evidence, setEvidence] = useState<EvidenceModel | null>(null);
  const [focusBasisRef, setFocusBasisRef] =
    useState<SemanticBasisRef | null>(null);
  const [selectedGapRef, setSelectedGapRef] = useState<GapRef | null>(null);
  const [purposeDraft, setPurposeDraft] = useState("");
  const [rationaleDraft, setRationaleDraft] = useState("");
  const [acceptedFocus, setAcceptedFocus] = useState<FocusModel | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "submitting-focus">(
    "loading",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setStatus("loading");
    setMessage(null);
    setCurrentState(null);
    setGapProjection(null);
    setEvidence(null);
    setFocusBasisRef(null);
    setSelectedGapRef(null);
    setAcceptedFocus(null);

    void Promise.all([
      port.getCurrentState(activeTargetRef),
      port.getGaps(activeTargetRef),
      port.getEvidence(activeTargetRef),
    ]).then(([stateOutcome, gapsOutcome, evidenceOutcome]) => {
      if (cancelled) {
        return;
      }

      const failures: string[] = [];

      if (stateOutcome.status === "accepted") {
        setCurrentState(stateOutcome.projection.value);
      } else {
        failures.push(stateOutcome.message);
      }

      if (gapsOutcome.status === "accepted") {
        setGapProjection(gapsOutcome.projection.value);
        setFocusBasisRef(gapsOutcome.projection.basisRef);
      } else {
        failures.push(gapsOutcome.message);
      }

      if (evidenceOutcome.status === "accepted") {
        setEvidence(evidenceOutcome.projection.value);
      } else {
        failures.push(evidenceOutcome.message);
      }

      setMessage(failures.length > 0 ? failures.join(" ") : null);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [activeTargetRef, port]);

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

  const selectedDecision = gapProjection?.decisionContext.candidates.find(
    (candidate) => candidate.gapRef === selectedGapRef,
  );
  const selectedGap = gapProjection?.gaps.find(
    (gap) => gap.gapRef === selectedGapRef,
  );

  function selectGap(gapRef: GapRef) {
    const decision = gapProjection?.decisionContext.candidates.find(
      (candidate) => candidate.gapRef === gapRef,
    );
    setSelectedGapRef(gapRef);
    setAcceptedFocus(null);
    setMessage(null);

    if (decision) {
      setPurposeDraft(`Work on ${decision.capabilityLabel} next.`);
      setRationaleDraft(decision.priorityRationale);
    }
  }

  async function setNextFocus() {
    if (
      !selectedDecision ||
      !selectedGap ||
      !focusBasisRef ||
      purposeDraft.trim().length === 0 ||
      rationaleDraft.trim().length === 0
    ) {
      setMessage(
        "Choose a gap and keep an explicit focus purpose and rationale before continuing.",
      );
      return;
    }

    setStatus("submitting-focus");
    setMessage(null);

    const outcome = await port.setFocus({
      targetRef: activeTargetRef,
      selectedGapRefs: [selectedDecision.gapRef],
      selectedCapabilityRefs: [selectedDecision.capabilityRef],
      purpose: purposeDraft,
      rationale: rationaleDraft,
      semanticBasisRef: focusBasisRef,
    });

    setStatus("ready");

    if (outcome.status !== "accepted") {
      setMessage(outcome.message);
      return;
    }

    const focus = outcome.projection.value;
    setAcceptedFocus(focus);
    onAcceptedFocus(focus);
  }

  return (
    <section
      className="task-view current-position-view"
      data-view="current"
      aria-labelledby="current-position-heading"
    >
      <header className="task-heading">
        <p className="eyebrow">Current position</p>
        <h1 id="current-position-heading">Understand where to focus next</h1>
        <p>
          Review evidence-backed capability state, inspect the gaps that matter
          for this Target, and explicitly choose the Next focus.
        </p>
      </header>

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      {status === "loading" ? <p role="status">Loading current position…</p> : null}

      {currentState ? (
        <section
          className="current-state-region"
          aria-labelledby="current-state-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Evidence-backed state</p>
            <h2 id="current-state-heading">Current capability state</h2>
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

      {gapProjection ? (
        <section className="gaps-region" aria-labelledby="gaps-heading">
          <div className="section-heading">
            <p className="eyebrow">Gaps and uncertainty</p>
            <h2 id="gaps-heading">What needs attention</h2>
          </div>

          <div className="gap-list">
            {gapProjection.gaps.map((gap) => {
              const decision = gapProjection.decisionContext.candidates.find(
                (candidate) => candidate.gapRef === gap.gapRef,
              );

              return (
                <article className="gap-card" key={gap.gapRef}>
                  <div className="gap-card-heading">
                    <h3>{gap.capabilityLabel}</h3>
                    <strong data-gap-state={gap.status}>{gap.status}</strong>
                  </div>
                  <p>{gap.rationale}</p>
                  {decision ? (
                    <dl className="decision-basis">
                      <div>
                        <dt>Target relevance</dt>
                        <dd>{decision.targetRelevance}</dd>
                      </div>
                      <div>
                        <dt>Why now</dt>
                        <dd>{decision.priorityRationale}</dd>
                      </div>
                      <div>
                        <dt>Support</dt>
                        <dd>{decision.supportAvailability}</dd>
                      </div>
                    </dl>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {gapProjection ? (
        <section className="next-focus-region" aria-labelledby="next-focus-heading">
          <div className="section-heading">
            <p className="eyebrow">Next focus</p>
            <h2 id="next-focus-heading">
              {activeFocusRef ? "Review or revise the Next focus" : "Choose the Next focus"}
            </h2>
            {activeFocusRef && !acceptedFocus ? (
              <p>
                An accepted Next focus is already active. Choosing below revises it
                explicitly rather than changing it automatically.
              </p>
            ) : null}
          </div>

          <fieldset className="focus-options">
            <legend>Gap to address next</legend>
            {gapProjection.decisionContext.candidates.map((candidate) => (
              <label className="focus-option" key={candidate.gapRef}>
                <input
                  type="radio"
                  name="next-focus-gap"
                  checked={selectedGapRef === candidate.gapRef}
                  onChange={() => selectGap(candidate.gapRef)}
                />
                <span>
                  <strong>{candidate.capabilityLabel}</strong>
                  <small>
                    {candidate.targetRelevance} Support:{" "}
                    {candidate.supportAvailability}.
                  </small>
                </span>
              </label>
            ))}
          </fieldset>

          {selectedDecision ? (
            <div className="focus-draft">
              <label className="field">
                <span>Focus purpose</span>
                <input
                  value={purposeDraft}
                  onChange={(event) => setPurposeDraft(event.currentTarget.value)}
                />
              </label>

              <label className="field">
                <span>Rationale</span>
                <textarea
                  rows={3}
                  value={rationaleDraft}
                  onChange={(event) => setRationaleDraft(event.currentTarget.value)}
                />
              </label>

              {gapProjection.decisionContext.externalConstraints.length > 0 ? (
                <div className="external-constraints">
                  <strong>Material constraints</strong>
                  <ul>
                    {gapProjection.decisionContext.externalConstraints.map(
                      (constraint) => (
                        <li key={constraint}>{constraint}</li>
                      ),
                    )}
                  </ul>
                </div>
              ) : null}

              <div className="action-row">
                <button
                  type="button"
                  className="primary-action"
                  disabled={status === "submitting-focus"}
                  onClick={() => void setNextFocus()}
                >
                  {status === "submitting-focus"
                    ? "Setting focus…"
                    : activeFocusRef
                      ? "Revise Next focus"
                      : "Set Next focus"}
                </button>
              </div>
            </div>
          ) : null}

          {acceptedFocus ? (
            <div className="accepted-focus" role="status">
              <strong>Next focus accepted</strong>
              <p>{acceptedFocus.purpose}</p>
              <p>{acceptedFocus.rationale}</p>
              <div className="action-row">
                {selectedDecision?.supportAvailability === "missing" ? (
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={onRequestPreparationSupport}
                  >
                    Prepare missing support
                  </button>
                ) : null}
                <button
                  type="button"
                  className="primary-action"
                  onClick={onContinueActivity}
                >
                  Continue to Activity
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {evidence ? (
        <details className="evidence-basis-region">
          <summary>Why this state: evidence basis</summary>
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
