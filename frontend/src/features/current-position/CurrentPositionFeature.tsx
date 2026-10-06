import { useEffect, useMemo, useState } from "react";

import type {
  CurrentPositionPort,
  CurrentPositionWorkingState,
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
import {
  capabilityStateLabel,
  evidenceKindLabel,
  gapStatusLabel,
  supportAvailabilityLabel,
} from "../../ui/presentationLabels";

export interface CurrentPositionFeatureProps {
  readonly port: CurrentPositionPort;
  readonly activeTargetRef: TargetRef;
  readonly activeFocusRef: FocusRef | null;
  readonly workingState: CurrentPositionWorkingState;
  readonly onWorkingStateChange: (state: CurrentPositionWorkingState) => void;
  readonly onAcceptedFocus: (
    focus: FocusModel,
    semanticBasisRef: SemanticBasisRef,
  ) => void;
  readonly onExploreKnowledge: (capabilityRef: CapabilityRef) => void;
  readonly onContinueActivity: () => void;
  readonly onRequestPreparationSupport: () => void;
}

function stateExplanation(state: "demonstrated" | "challenged" | "unknown") {
  switch (state) {
    case "demonstrated":
      return "Текущие свидетельства подтверждают эту компетенцию.";
    case "challenged":
      return "Часть требуемого результата противоречит текущим свидетельствам.";
    case "unknown":
      return "Недостаточно надёжных свидетельств, чтобы сделать вывод.";
  }
}

export function CurrentPositionFeature({
  port,
  activeTargetRef,
  activeFocusRef,
  workingState,
  onWorkingStateChange,
  onAcceptedFocus,
  onExploreKnowledge,
  onContinueActivity,
  onRequestPreparationSupport,
}: CurrentPositionFeatureProps) {
  const [currentState, setCurrentState] = useState<CurrentStateModel | null>(null);
  const [gapProjection, setGapProjection] =
    useState<GapProjectionModel | null>(null);
  const [evidence, setEvidence] = useState<EvidenceModel | null>(null);
  const [focusBasisRef, setFocusBasisRef] =
    useState<SemanticBasisRef | null>(null);
  const { selectedGapRef, purposeDraft, rationaleDraft } = workingState;
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
    setAcceptedFocus(null);
    setMessage(null);

    onWorkingStateChange({
      selectedGapRef: gapRef,
      purposeDraft: decision
        ? `Следующий фокус: ${decision.capabilityLabel}.`
        : "",
      rationaleDraft: decision?.priorityRationale ?? "",
    });
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
        "Выберите пробел и явно укажите цель фокуса и основание выбора.",
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
    onAcceptedFocus(focus, outcome.projection.basisRef);
  }

  return (
    <section
      className="task-view current-position-view"
      data-view="current"
      aria-labelledby="current-position-heading"
    >
      <header className="task-heading">
        <p className="eyebrow">Текущее состояние</p>
        <h1 id="current-position-heading">Определите, на чём сосредоточиться дальше</h1>
        <p>
          Оцените состояние компетенций по свидетельствам, изучите важные для
          цели пробелы и явно выберите следующий фокус.
        </p>
      </header>

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      {status === "loading" ? <p role="status">Загрузка текущего состояния…</p> : null}

      {currentState ? (
        <section
          className="current-state-region"
          aria-labelledby="current-state-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Состояние по свидетельствам</p>
            <h2 id="current-state-heading">Состояние компетенций</h2>
          </div>

          <div className="current-state-grid">
            {currentState.capabilities.map((item) => (
              <article className="state-card" key={item.capabilityRef}>
                <div className="state-card-heading">
                  <h3>{item.capabilityLabel}</h3>
                  <strong data-state={item.state}>{capabilityStateLabel(item.state)}</strong>
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
            <p className="eyebrow">Пробелы и неопределённость</p>
            <h2 id="gaps-heading">Что требует внимания</h2>
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
                    <strong data-gap-state={gap.status}>{gapStatusLabel(gap.status)}</strong>
                  </div>
                  <p>{gap.rationale}</p>
                  {decision ? (
                    <dl className="decision-basis">
                      <div>
                        <dt>Важность для цели</dt>
                        <dd>{decision.targetRelevance}</dd>
                      </div>
                      <div>
                        <dt>Почему сейчас</dt>
                        <dd>{decision.priorityRationale}</dd>
                      </div>
                      <div>
                        <dt>Поддержка</dt>
                        <dd>{supportAvailabilityLabel(decision.supportAvailability)}</dd>
                      </div>
                    </dl>
                  ) : null}
                  <div className="action-row">
                    <button
                      type="button"
                      className="secondary-action"
                      onClick={() => onExploreKnowledge(gap.capabilityRef)}
                    >
                      Изучить знания: {gap.capabilityLabel}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {gapProjection ? (
        <section className="next-focus-region" aria-labelledby="next-focus-heading">
          <div className="section-heading">
            <p className="eyebrow">Следующий фокус</p>
            <h2 id="next-focus-heading">
              {activeFocusRef ? "Проверьте или измените следующий фокус" : "Выберите следующий фокус"}
            </h2>
            {activeFocusRef && !acceptedFocus ? (
              <p>
                Следующий фокус уже выбран. Новый выбор ниже изменит его явно,
                а не автоматически.
              </p>
            ) : null}
          </div>

          <fieldset className="focus-options">
            <legend>Какой пробел проработать следующим</legend>
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
                    {candidate.targetRelevance} Поддержка:{" "}
                    {supportAvailabilityLabel(candidate.supportAvailability)}.
                  </small>
                </span>
              </label>
            ))}
          </fieldset>

          {selectedDecision ? (
            <div className="focus-draft">
              <label className="field">
                <span>Цель фокуса</span>
                <input
                  value={purposeDraft}
                  onChange={(event) =>
                    onWorkingStateChange({
                      ...workingState,
                      purposeDraft: event.currentTarget.value,
                    })
                  }
                />
              </label>

              <label className="field">
                <span>Основание выбора</span>
                <textarea
                  rows={3}
                  value={rationaleDraft}
                  onChange={(event) =>
                    onWorkingStateChange({
                      ...workingState,
                      rationaleDraft: event.currentTarget.value,
                    })
                  }
                />
              </label>

              {gapProjection.decisionContext.externalConstraints.length > 0 ? (
                <div className="external-constraints">
                  <strong>Значимые ограничения</strong>
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
                    ? "Сохранение фокуса…"
                    : activeFocusRef
                      ? "Изменить фокус"
                      : "Выбрать фокус"}
                </button>
              </div>
            </div>
          ) : null}

          {acceptedFocus ? (
            <div className="accepted-focus" role="status">
              <strong>Следующий фокус выбран</strong>
              <p>{acceptedFocus.purpose}</p>
              <p>{acceptedFocus.rationale}</p>
              <div className="action-row">
                {selectedDecision?.supportAvailability === "missing" ? (
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={onRequestPreparationSupport}
                  >
                    Подготовить недостающую поддержку
                  </button>
                ) : null}
                <button
                  type="button"
                  className="primary-action"
                  onClick={onContinueActivity}
                >
                  Перейти к практике
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {evidence ? (
        <details className="evidence-basis-region">
          <summary>Почему такое состояние: свидетельства</summary>
          <div className="evidence-facts">
            {evidence.facts.map((fact) => (
              <article className="evidence-card" key={fact.evidenceRef}>
                <div className="evidence-card-heading">
                  <strong>{evidenceKindLabel(fact.kind)}</strong>
                  <span>{fact.summary}</span>
                </div>

                {fact.supportsCapabilityRefs.length > 0 ? (
                  <p>
                    Подтверждает:{" "}
                    {fact.supportsCapabilityRefs
                      .map(
                        (capabilityRef: CapabilityRef) =>
                          capabilityLabels.get(capabilityRef) ?? "Компетенция",
                      )
                      .join(", ")}
                  </p>
                ) : null}

                {fact.challengesCapabilityRefs.length > 0 ? (
                  <p>
                    Противоречит:{" "}
                    {fact.challengesCapabilityRefs
                      .map(
                        (capabilityRef: CapabilityRef) =>
                          capabilityLabels.get(capabilityRef) ?? "Компетенция",
                      )
                      .join(", ")}
                  </p>
                ) : null}

                <p>
                  Источник:{" "}
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
