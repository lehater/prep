import { useMemo, useState } from "react";

import type {
  CandidateTargetOption,
  TargetComparisonModel,
  TargetDirectionPort,
} from "./contract";
import type { TargetRef } from "../contracts";

export interface TargetDirectionFeatureProps {
  readonly port: TargetDirectionPort;
  readonly candidates: readonly CandidateTargetOption[];
  readonly onContinueCandidate: (targetRef: TargetRef) => void;
}

function capabilityLabel(
  candidate: TargetComparisonModel["candidates"][number],
  capabilityRef: string,
): string {
  return (
    candidate.currentState.find(
      (state) => state.capabilityRef === capabilityRef,
    )?.capabilityLabel ?? "Capability"
  );
}

export function TargetDirectionFeature({
  port,
  candidates,
  onContinueCandidate,
}: TargetDirectionFeatureProps) {
  const [selectedRefs, setSelectedRefs] = useState<readonly TargetRef[]>([]);
  const [comparison, setComparison] = useState<TargetComparisonModel | null>(
    null,
  );
  const [continueRef, setContinueRef] = useState<TargetRef | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const selectedSet = useMemo(() => new Set(selectedRefs), [selectedRefs]);
  const comparisonReady = comparison !== null;

  function toggleCandidate(targetRef: TargetRef) {
    setSelectedRefs((current) =>
      current.includes(targetRef)
        ? current.filter((value) => value !== targetRef)
        : [...current, targetRef],
    );
    setComparison(null);
    setContinueRef(null);
    setMessage(null);
  }

  async function compareSelected() {
    const [first, second, ...rest] = selectedRefs;
    if (!first || !second) {
      setMessage("Select at least two Targets to compare.");
      return;
    }

    setStatus("loading");
    setMessage(null);
    const outcome = await port.compareTargets({
      candidateTargetRefs: [first, second, ...rest],
    });
    setStatus("idle");

    if (outcome.status !== "accepted") {
      setComparison(null);
      setContinueRef(null);
      setMessage(outcome.message);
      return;
    }

    setComparison(outcome.projection.value);
  }

  return (
    <section
      className="task-view target-direction"
      data-view="targets"
      data-variant={comparisonReady ? "comparison-ready" : "candidate-selection"}
      aria-labelledby="targets-heading"
    >
      <header className="task-heading">
        <p className="eyebrow">Target direction</p>
        <h1 id="targets-heading">Choose what you are preparing for</h1>
        <p>
          Compare plausible Targets against the same learner evidence before
          deciding which one to continue with.
        </p>
      </header>

      <fieldset className="candidate-selector">
        <legend>Candidate Targets</legend>
        <div className="candidate-grid">
          {candidates.map((candidate) => (
            <label
              className="candidate-card"
              key={candidate.targetRef}
              data-selected={selectedSet.has(candidate.targetRef)}
            >
              <span className="candidate-choice">
                <input
                  type="checkbox"
                  checked={selectedSet.has(candidate.targetRef)}
                  onChange={() => toggleCandidate(candidate.targetRef)}
                />
                <strong>{candidate.label}</strong>
              </span>
              <span>{candidate.purpose}</span>
              {candidate.uncertainty.length > 0 ? (
                <small>{candidate.uncertainty.join(" ")}</small>
              ) : null}
            </label>
          ))}
        </div>
      </fieldset>

      {!comparisonReady ? (
        <div className="action-row">
          <button
            type="button"
            className="primary-action"
            disabled={selectedRefs.length < 2 || status === "loading"}
            onClick={() => void compareSelected()}
          >
            {status === "loading" ? "Comparing…" : "Compare selected"}
          </button>
          <span className="supporting-text">
            {selectedRefs.length} selected
          </span>
        </div>
      ) : null}

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      {comparison ? (
        <>
          <section
            className="comparison-region"
            aria-labelledby="comparison-heading"
          >
            <div className="section-heading">
              <p className="eyebrow">Same evidence basis</p>
              <h2 id="comparison-heading">Compare selected Targets</h2>
            </div>

            <div className="comparison-grid">
              {comparison.candidates.map((candidate) => {
                const shared = candidate.sharedCapabilityRefs.map((ref) =>
                  capabilityLabel(candidate, ref),
                );
                const specific = candidate.targetSpecificCapabilityRefs.map(
                  (ref) => capabilityLabel(candidate, ref),
                );

                return (
                  <article
                    className="comparison-card"
                    key={candidate.targetRef}
                  >
                    <header>
                      <h3>{candidate.label}</h3>
                      <p>{candidate.purpose}</p>
                    </header>

                    <div className="comparison-dimension">
                      <h4>Shared required capabilities</h4>
                      <ul>
                        {shared.map((label) => (
                          <li key={label}>{label}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="comparison-dimension">
                      <h4>Target-specific capabilities</h4>
                      <ul>
                        {specific.map((label) => (
                          <li key={label}>{label}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="comparison-dimension">
                      <h4>Current evidence-backed position</h4>
                      <ul className="state-list">
                        {candidate.currentState.map((state) => (
                          <li key={state.capabilityRef}>
                            <span>{state.capabilityLabel}</span>
                            <strong data-state={state.state}>
                              {state.state}
                            </strong>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="comparison-dimension">
                      <h4>Gaps and uncertainty</h4>
                      <ul>
                        {candidate.gaps.map((gap) => (
                          <li key={gap.gapRef}>
                            {capabilityLabel(candidate, gap.capabilityRef)}:{" "}
                            {gap.status}
                          </li>
                        ))}
                        {candidate.uncertainty.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="comparison-basis" aria-label="Comparison basis">
            <strong>Comparison basis</strong>
            <p>
              The same learner evidence basis is used for every candidate.
              Applicability and Target uncertainty remain explicit.
            </p>
            <ul>
              {comparison.limitations.map((limitation) => (
                <li key={limitation.detail}>{limitation.detail}</li>
              ))}
            </ul>
          </aside>

          <fieldset className="direction-actions">
            <legend>Continue with a Target</legend>
            <div className="continuation-options">
              {comparison.candidates.map((candidate) => (
                <label key={candidate.targetRef}>
                  <input
                    type="radio"
                    name="continue-target"
                    value={candidate.targetRef}
                    checked={continueRef === candidate.targetRef}
                    onChange={() => setContinueRef(candidate.targetRef)}
                  />
                  {candidate.label}
                </label>
              ))}
            </div>
            <div className="action-row">
              <button
                type="button"
                className="primary-action"
                disabled={!continueRef}
                onClick={() => {
                  if (continueRef) {
                    onContinueCandidate(continueRef);
                  }
                }}
              >
                Continue with selected Target
              </button>
              <button
                type="button"
                className="secondary-action"
                onClick={() => {
                  setComparison(null);
                  setContinueRef(null);
                  setMessage(null);
                }}
              >
                Change comparison
              </button>
              <button
                type="button"
                className="text-action"
                onClick={() => {
                  setContinueRef(null);
                  setMessage("Target direction remains unresolved.");
                }}
              >
                Leave undecided
              </button>
            </div>
          </fieldset>
        </>
      ) : null}
    </section>
  );
}
