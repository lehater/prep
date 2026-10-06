import { useEffect, useMemo, useState } from "react";

import type { CapabilityRef, TargetRef } from "../contracts";
import type {
  TargetModel,
  TargetPort,
  TargetRequirementModel,
  TargetSetupOption,
} from "./contract";

export interface TargetFeatureProps {
  readonly port: TargetPort;
  readonly candidates: readonly TargetSetupOption[];
  readonly candidateTargetRef?: TargetRef | undefined;
  readonly activeTargetRef: TargetRef | null;
  readonly recoveryReason?: string | undefined;
  readonly onAcceptedTarget: (target: TargetModel) => void;
  readonly onExploreKnowledge: (capabilityRef: CapabilityRef) => void;
  readonly onRequestPreparationSupport: (targetRef: TargetRef) => void;
  readonly onReconsiderDirection: () => void;
}

export function TargetFeature({
  port,
  candidates,
  candidateTargetRef,
  activeTargetRef,
  recoveryReason,
  onAcceptedTarget,
  onExploreKnowledge,
  onRequestPreparationSupport,
  onReconsiderDirection,
}: TargetFeatureProps) {
  const initialRef = candidateTargetRef ?? activeTargetRef ?? null;
  const [selectedTargetRef, setSelectedTargetRef] = useState<TargetRef | null>(
    initialRef,
  );
  const [sourceContext, setSourceContext] = useState(
    () =>
      candidates.find((candidate) => candidate.targetRef === initialRef)
        ?.sourceContext ?? "",
  );
  const [target, setTarget] = useState<TargetModel | null>(null);
  const [requirements, setRequirements] =
    useState<TargetRequirementModel | null>(null);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "loading-requirements"
  >("idle");
  const [message, setMessage] = useState<string | null>(recoveryReason ?? null);

  const selectedCandidate = useMemo(
    () =>
      selectedTargetRef
        ? candidates.find(
            (candidate) => candidate.targetRef === selectedTargetRef,
          ) ?? null
        : null,
    [candidates, selectedTargetRef],
  );

  const activeCandidate = useMemo(
    () =>
      activeTargetRef
        ? candidates.find((candidate) => candidate.targetRef === activeTargetRef) ??
          null
        : null,
    [activeTargetRef, candidates],
  );

  useEffect(() => {
    if (!candidateTargetRef) {
      return;
    }

    setSelectedTargetRef(candidateTargetRef);
    setSourceContext(
      candidates.find((candidate) => candidate.targetRef === candidateTargetRef)
        ?.sourceContext ?? "",
    );
    setMessage(recoveryReason ?? null);
  }, [candidateTargetRef, candidates, recoveryReason]);

  useEffect(() => {
    if (!activeTargetRef) {
      setRequirements(null);
      return;
    }

    const active = candidates.find(
      (candidate) => candidate.targetRef === activeTargetRef,
    );
    setSelectedTargetRef(activeTargetRef);
    setSourceContext((current) => current || active?.sourceContext || "");

    let cancelled = false;
    setStatus("loading-requirements");

    void port.getTargetRequirements(activeTargetRef).then((outcome) => {
      if (cancelled) {
        return;
      }

      setStatus("idle");
      if (outcome.status === "accepted") {
        setRequirements(outcome.projection.value);
        setMessage(null);
      } else {
        setRequirements(null);
        setMessage(outcome.message);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeTargetRef, candidates, port]);

  function selectCandidate(targetRef: TargetRef) {
    const candidate = candidates.find((item) => item.targetRef === targetRef);
    setSelectedTargetRef(targetRef);
    setSourceContext(candidate?.sourceContext ?? "");
    setMessage(null);
  }

  async function establishTarget() {
    if (!selectedTargetRef) {
      setMessage("Choose a Target before establishing preparation context.");
      return;
    }

    setStatus("submitting");
    setMessage(null);
    const outcome = await port.establishTarget({
      targetRef: selectedTargetRef,
      sourceContext,
    });

    if (outcome.status !== "accepted") {
      setStatus("idle");
      setMessage(outcome.message);
      return;
    }

    const acceptedTarget = outcome.projection.value;
    setTarget(acceptedTarget);
    onAcceptedTarget(acceptedTarget);

    setStatus("loading-requirements");
    const requirementsOutcome = await port.getTargetRequirements(
      acceptedTarget.targetRef,
    );
    setStatus("idle");

    if (requirementsOutcome.status === "accepted") {
      setRequirements(requirementsOutcome.projection.value);
      return;
    }

    setRequirements(null);
    setMessage(requirementsOutcome.message);
  }

  const established = activeTargetRef !== null;
  const contextCandidate = activeCandidate ?? selectedCandidate;
  const contextPurpose = target?.purpose ?? contextCandidate?.purpose;
  const contextUncertainty =
    target?.uncertainty ?? contextCandidate?.uncertainty ?? [];

  return (
    <section
      className="task-view target-view"
      data-view="target"
      data-variant={established ? "target-established" : "target-setup"}
      aria-labelledby="target-heading"
    >
      <header className="task-heading">
        <p className="eyebrow">Target</p>
        <h1 id="target-heading">
          {established ? "What this Target requires" : "Establish your Target"}
        </h1>
        <p>
          Keep the preparation purpose and required performance explicit before
          deciding what to work on next.
        </p>
      </header>

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      <section className="target-context-region" aria-labelledby="target-context-heading">
        <div className="section-heading">
          <p className="eyebrow">Target context</p>
          <h2 id="target-context-heading">
            {contextCandidate?.label ?? "Choose a preparation Target"}
          </h2>
          {contextPurpose ? <p>{contextPurpose}</p> : null}
        </div>

        <label className="field">
          <span>Target</span>
          <select
            value={selectedTargetRef ?? ""}
            disabled={established || status === "submitting"}
            onChange={(event) =>
              selectCandidate(event.currentTarget.value as TargetRef)
            }
          >
            <option value="">Choose a Target</option>
            {candidates.map((candidate) => (
              <option key={candidate.targetRef} value={candidate.targetRef}>
                {candidate.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Source / context</span>
          <textarea
            rows={3}
            value={sourceContext}
            disabled={status === "submitting"}
            onChange={(event) => setSourceContext(event.currentTarget.value)}
            placeholder="Describe or identify the source that defines this Target."
          />
        </label>

        {contextUncertainty.length > 0 ? (
          <div className="target-uncertainty">
            <strong>Target uncertainty</strong>
            <ul>
              {contextUncertainty.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="action-row">
          <button
            type="button"
            className="primary-action"
            disabled={!selectedTargetRef || status === "submitting"}
            onClick={() => void establishTarget()}
          >
            {status === "submitting"
              ? "Establishing…"
              : established
                ? "Refine Target"
                : "Establish Target"}
          </button>
          <button
            type="button"
            className="text-action"
            onClick={onReconsiderDirection}
          >
            Reconsider Targets
          </button>
        </div>
      </section>

      {established ? (
        <section
          className="target-requirements-region"
          aria-labelledby="target-requirements-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Required performance</p>
            <h2 id="target-requirements-heading">Requirements</h2>
          </div>

          {status === "loading-requirements" && !requirements ? (
            <p role="status">Loading requirements…</p>
          ) : null}

          {requirements ? (
            <div className="requirements-list">
              {requirements.expectations.map((expectation) => (
                <article
                  className="requirement-card"
                  key={expectation.requirementRef}
                >
                  <header>
                    <h3>{expectation.capabilityLabel}</h3>
                    <p>{expectation.performance}</p>
                  </header>

                  <div className="requirement-detail-grid">
                    <div>
                      <h4>Conditions</h4>
                      <ul>
                        {expectation.conditions.map((condition) => (
                          <li key={condition}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Quality criteria</h4>
                      <ul>
                        {expectation.qualityCriteria.map((criterion) => (
                          <li key={criterion}>{criterion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="knowledge-focus">
                    <h4>Direct Knowledge focus</h4>
                    {expectation.knowledgeFocus.length > 0 ? (
                      <ul>
                        {expectation.knowledgeFocus.map((knowledge) => (
                          <li key={knowledge.knowledgeRef}>{knowledge.label}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="supporting-text">
                        No direct Knowledge focus is declared for this performance.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() =>
                      onExploreKnowledge(expectation.capabilityRef)
                    }
                  >
                    Explore Knowledge for {expectation.capabilityLabel}
                  </button>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {established && requirements ? (
        <aside className="target-provenance-region" aria-label="Target provenance">
          <strong>Provenance and unresolved meaning</strong>
          <ul>
            {requirements.provenance.map((item) => (
              <li key={item.label}>{item.label}</li>
            ))}
            {requirements.unresolvedExpectations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      ) : null}

      <div className="target-actions action-row">
        {selectedTargetRef ? (
          <button
            type="button"
            className="secondary-action"
            onClick={() => onRequestPreparationSupport(selectedTargetRef)}
          >
            Request missing preparation support
          </button>
        ) : null}
      </div>
    </section>
  );
}
