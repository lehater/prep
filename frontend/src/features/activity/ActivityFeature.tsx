import { useEffect, useState } from "react";

import type {
  ActivityAttemptModel,
  ActivityCompletionModel,
  ActivityPort,
  SupportModel,
} from "./contract";
import type {
  ActivityAttemptRef,
  FocusRef,
  SemanticBasisRef,
  SupportRef,
  TargetRef,
} from "../contracts";

export interface ActivityFeatureProps {
  readonly port: ActivityPort;
  readonly activeTargetRef: TargetRef;
  readonly activeFocusRef: FocusRef;
  readonly focusPurpose: string;
  readonly focusRationale: string;
  readonly focusBasisRef: SemanticBasisRef;
  readonly onRequestPreparationSupport: () => void;
  readonly onReviewEvidenceChange: (activityAttemptRef: ActivityAttemptRef) => void;
}

type ActivityViewState =
  | "loading-support"
  | "support-selection"
  | "starting-attempt"
  | "attempt-active"
  | "submitting-attempt"
  | "evidence-processing";

export function ActivityFeature({
  port,
  activeTargetRef,
  activeFocusRef,
  focusPurpose,
  focusRationale,
  focusBasisRef,
  onRequestPreparationSupport,
  onReviewEvidenceChange,
}: ActivityFeatureProps) {
  const [supportOptions, setSupportOptions] = useState<readonly SupportModel[]>(
    [],
  );
  const [selectedSupportRef, setSelectedSupportRef] =
    useState<SupportRef | null>(null);
  const [attempt, setAttempt] = useState<ActivityAttemptModel | null>(null);
  const [completion, setCompletion] =
    useState<ActivityCompletionModel | null>(null);
  const [resultSummary, setResultSummary] = useState("");
  const [provenance, setProvenance] = useState("");
  const [viewState, setViewState] =
    useState<ActivityViewState>("loading-support");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setSupportOptions([]);
    setSelectedSupportRef(null);
    setAttempt(null);
    setCompletion(null);
    setResultSummary("");
    setProvenance("");
    setMessage(null);
    setViewState("loading-support");

    void port
      .listSupport({
        targetRef: activeTargetRef,
        focusRef: activeFocusRef,
      })
      .then((outcome) => {
        if (cancelled) {
          return;
        }

        if (outcome.status !== "accepted") {
          setMessage(outcome.message);
          setViewState("support-selection");
          return;
        }

        const support = outcome.projection.value;
        setSupportOptions(support);
        setSelectedSupportRef(support[0]?.supportRef ?? null);
        setViewState("support-selection");
      });

    return () => {
      cancelled = true;
    };
  }, [activeFocusRef, activeTargetRef, port]);

  const selectedSupport =
    supportOptions.find((item) => item.supportRef === selectedSupportRef) ?? null;

  async function startAttempt() {
    if (!selectedSupport) {
      setMessage("Choose suitable support before starting an Activity.");
      return;
    }

    setMessage(null);
    setViewState("starting-attempt");

    const outcome = await port.startActivity({
      targetRef: activeTargetRef,
      focusRef: activeFocusRef,
      supportRef: selectedSupport.supportRef,
      semanticBasisRef: focusBasisRef,
    });

    if (outcome.status !== "accepted") {
      setMessage(outcome.message);
      setViewState("support-selection");
      return;
    }

    setAttempt(outcome.projection.value);
    setViewState("attempt-active");
  }

  async function completeAttempt() {
    if (!attempt) {
      setMessage("No accepted ActivityAttempt is active.");
      return;
    }

    if (
      resultSummary.trim().length === 0 ||
      provenance.trim().length === 0
    ) {
      setMessage(
        "Record what happened and its provenance before submitting the attempt.",
      );
      return;
    }

    setMessage(null);
    setViewState("submitting-attempt");

    const outcome = await port.completeActivity({
      activityAttemptRef: attempt.activityAttemptRef,
      resultSummary,
      provenance,
      semanticBasisRef: attempt.semanticBasisRef,
    });

    if (outcome.status !== "accepted") {
      setMessage(outcome.message);
      setViewState("attempt-active");
      return;
    }

    setCompletion(outcome.projection.value);
    setViewState("evidence-processing");
  }

  return (
    <section
      className="task-view activity-view"
      data-view="activity"
      data-variant={viewState}
      aria-labelledby="activity-heading"
    >
      <header className="task-heading">
        <p className="eyebrow">Activity</p>
        <h1 id="activity-heading">Work on the accepted Next focus</h1>
        <p>
          Choose support that fits this Focus, perform one attributable attempt,
          then submit what happened for evidence processing.
        </p>
      </header>

      <section className="activity-focus-context" aria-label="Active focus">
        <p className="eyebrow">Active Next focus</p>
        <strong>{focusPurpose}</strong>
        <p>{focusRationale}</p>
      </section>

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      {viewState === "loading-support" ? (
        <p role="status">Loading suitable support…</p>
      ) : null}

      {viewState !== "loading-support" ? (
        <section
          className="activity-support-region"
          aria-labelledby="support-options-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Support selection</p>
            <h2 id="support-options-heading">Available support</h2>
          </div>

          {supportOptions.length === 0 ? (
            <div className="activity-no-support">
              <strong>No suitable support is currently prepared.</strong>
              <p>
                Keep the accepted Target and Next focus, prepare the missing
                support contextually, then return to this work.
              </p>
              <button
                type="button"
                className="primary-action"
                onClick={onRequestPreparationSupport}
              >
                Prepare missing support
              </button>
            </div>
          ) : (
            <fieldset className="support-options">
              <legend>Support for this attempt</legend>
              {supportOptions.map((support) => (
                <label className="support-option" key={support.supportRef}>
                  <input
                    type="radio"
                    name="activity-support"
                    checked={selectedSupportRef === support.supportRef}
                    disabled={attempt !== null}
                    onChange={() => setSelectedSupportRef(support.supportRef)}
                  />
                  <span className="support-option-body">
                    <strong>{support.label}</strong>
                    <small>
                      Intended capability: {support.intendedCapabilityLabel}
                    </small>
                    <span>{support.fitBasis}</span>
                    <span>
                      Expected conditions:{" "}
                      {support.expectedConditions.join(", ")}
                    </span>
                    {support.limitations.length > 0 ? (
                      <ul className="limitation-list">
                        {support.limitations.map((limitation) => (
                          <li key={limitation.detail}>{limitation.detail}</li>
                        ))}
                      </ul>
                    ) : null}
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          {supportOptions.length > 0 && !attempt ? (
            <div className="action-row">
              <button
                type="button"
                className="primary-action"
                disabled={
                  !selectedSupportRef || viewState === "starting-attempt"
                }
                onClick={() => void startAttempt()}
              >
                {viewState === "starting-attempt"
                  ? "Starting attempt…"
                  : "Start Activity"}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {attempt ? (
        <section
          className="activity-attempt-region"
          aria-labelledby="activity-attempt-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Accepted occurrence</p>
            <h2 id="activity-attempt-heading">Activity attempt</h2>
          </div>

          <dl className="activity-attempt-context">
            <div>
              <dt>Support</dt>
              <dd>{selectedSupport?.label ?? "Selected support"}</dd>
            </div>
            <div>
              <dt>Attempt state</dt>
              <dd>{attempt.state}</dd>
            </div>
          </dl>

          {viewState !== "evidence-processing" ? (
            <div className="activity-completion-form">
              <label className="field">
                <span>What happened</span>
                <textarea
                  rows={4}
                  value={resultSummary}
                  disabled={viewState === "submitting-attempt"}
                  onChange={(event) =>
                    setResultSummary(event.currentTarget.value)
                  }
                  placeholder="Record the observable result of this attempt."
                />
              </label>

              <label className="field">
                <span>Provenance / source</span>
                <input
                  value={provenance}
                  disabled={viewState === "submitting-attempt"}
                  onChange={(event) =>
                    setProvenance(event.currentTarget.value)
                  }
                  placeholder="Identify where this result came from."
                />
              </label>

              <div className="action-row">
                <button
                  type="button"
                  className="primary-action"
                  disabled={viewState === "submitting-attempt"}
                  onClick={() => void completeAttempt()}
                >
                  {viewState === "submitting-attempt"
                    ? "Submitting attempt…"
                    : "Submit completed attempt"}
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {viewState === "evidence-processing" && completion ? (
        <section
          className="activity-processing-region"
          aria-labelledby="activity-processing-heading"
          role="status"
        >
          <p className="eyebrow">Evidence processing</p>
          <h2 id="activity-processing-heading">Attempt submitted</h2>
          <p>
            The accepted ActivityAttempt remains the occurrence being evaluated.
            Completion does not mark the capability demonstrated and does not
            close a gap.
          </p>
          <p>
            {completion.historicalFactsAccepted
              ? "Attributable facts were accepted for evidence/change review."
              : "The submitted facts remain unresolved for evidence review."}
          </p>
          <p className="supporting-text">
            The evaluated change outcome belongs to the contextual Evidence &
            changes review.
          </p>
          <div className="action-row">
            <button
              type="button"
              className="primary-action"
              onClick={() =>
                onReviewEvidenceChange(completion.activityAttemptRef)
              }
            >
              Review evidence &amp; changes
            </button>
          </div>
        </section>
      ) : null}
    </section>
  );
}
