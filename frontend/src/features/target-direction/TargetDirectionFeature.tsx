import { useMemo, useState } from "react";

import type {
  CandidateTargetOption,
  TargetComparisonModel,
  TargetDirectionPort,
} from "./contract";
import type { TargetRef } from "../contracts";
import {
  ActionButton,
  ActionGroup,
  ChoiceCard,
  OutcomeMessage,
  SectionHeader,
  TaskHeader,
} from "../../ui/primitives";
import {
  capabilityStateLabel,
  gapStatusLabel,
} from "../../ui/presentationLabels";

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
    )?.capabilityLabel ?? "Компетенция"
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
      setMessage("Выберите минимум две цели для сравнения.");
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
      <TaskHeader
        eyebrow="Выбор направления"
        title="Выберите, к чему вы готовитесь"
        headingId="targets-heading"
      >
        <p>
          Сравните возможные цели на одной и той же базе свидетельств,
          прежде чем выбрать направление подготовки.
        </p>
      </TaskHeader>

      <fieldset className="candidate-selector">
        <legend>Возможные цели</legend>
        <div className="candidate-grid">
          {candidates.map((candidate) => (
            <ChoiceCard
              className="candidate-card"
              key={candidate.targetRef}
              controlId={`candidate-${candidate.targetRef}`}
              selected={selectedSet.has(candidate.targetRef)}
            >
              <span className="candidate-choice">
                <input
                  id={`candidate-${candidate.targetRef}`}
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
            </ChoiceCard>
          ))}
        </div>
      </fieldset>

      {!comparisonReady ? (
        <ActionGroup>
          <ActionButton
            variant="primary"
            disabled={selectedRefs.length < 2 || status === "loading"}
            onClick={() => void compareSelected()}
          >
            {status === "loading" ? "Сравнение…" : "Сравнить выбранные"}
          </ActionButton>
          <span className="supporting-text">
            Выбрано: {selectedRefs.length}
          </span>
        </ActionGroup>
      ) : null}

      {message ? <OutcomeMessage>{message}</OutcomeMessage> : null}

      {comparison ? (
        <>
          <section
            className="comparison-region"
            aria-labelledby="comparison-heading"
          >
            <SectionHeader
              eyebrow="Единая база свидетельств"
              title="Сравнение выбранных целей"
              headingId="comparison-heading"
            />

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
                      <h4>Общие требуемые компетенции</h4>
                      <ul>
                        {shared.map((label) => (
                          <li key={label}>{label}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="comparison-dimension">
                      <h4>Специфичные компетенции</h4>
                      <ul>
                        {specific.map((label) => (
                          <li key={label}>{label}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="comparison-dimension">
                      <h4>Текущее состояние по свидетельствам</h4>
                      <ul className="state-list">
                        {candidate.currentState.map((state) => (
                          <li key={state.capabilityRef}>
                            <span>{state.capabilityLabel}</span>
                            <strong data-state={state.state}>
                              {capabilityStateLabel(state.state)}
                            </strong>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="comparison-dimension">
                      <h4>Пробелы и неопределённость</h4>
                      <ul>
                        {candidate.gaps.map((gap) => (
                          <li key={gap.gapRef}>
                            {capabilityLabel(candidate, gap.capabilityRef)}:{" "}
                            {gapStatusLabel(gap.status)}
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

          <aside className="comparison-basis" aria-label="Основание сравнения">
            <strong>Основание сравнения</strong>
            <p>
              Для всех вариантов используется одна база свидетельств об учащемся.
              Ограничения применимости и неопределённость цели показаны явно.
            </p>
            <ul>
              {comparison.limitations.map((limitation) => (
                <li key={limitation.detail}>{limitation.detail}</li>
              ))}
            </ul>
          </aside>

          <fieldset className="direction-actions">
            <legend>Выберите цель для продолжения</legend>
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
            <ActionGroup>
              <ActionButton
                variant="primary"
                disabled={!continueRef}
                onClick={() => {
                  if (continueRef) {
                    onContinueCandidate(continueRef);
                  }
                }}
              >
                Продолжить с выбранной целью
              </ActionButton>
              <ActionButton
                onClick={() => {
                  setComparison(null);
                  setContinueRef(null);
                  setMessage(null);
                }}
              >
                Изменить сравнение
              </ActionButton>
              <ActionButton
                variant="text"
                onClick={() => {
                  setContinueRef(null);
                  setMessage("Направление подготовки пока не выбрано.");
                }}
              >
                Пока не выбирать
              </ActionButton>
            </ActionGroup>
          </fieldset>
        </>
      ) : null}
    </section>
  );
}
