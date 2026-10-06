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
import {
  capabilityStateLabel,
  changeOutcomeLabel,
  evidenceKindLabel,
} from "../../ui/presentationLabels";

export interface EvidenceChangeFeatureProps {
  readonly port: EvidenceChangePort;
  readonly activeTargetRef: TargetRef;
  readonly activityAttemptRef: ActivityAttemptRef;
  readonly canContinueCurrentFocus: boolean;
  readonly onContinueCurrentFocus: () => void;
  readonly onReturnCurrent: () => void;
  readonly onInspectKnowledge: () => void;
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
        <p className="eyebrow">Свидетельства и изменения</p>
        <h1 id="evidence-change-heading">
          Проверьте, что изменилось после практики
        </h1>
        <p>
          Изучите результат завершённой попытки, отделите факты от выводов о
          состоянии компетенций и явно выберите следующий шаг.
        </p>
      </header>

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      {status === "loading" ? <p role="status">Загрузка результата…</p> : null}

      {change ? (
        <section
          className="change-summary-region"
          aria-labelledby="change-summary-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Проверенный результат практики</p>
            <h2 id="change-summary-heading">Что изменилось</h2>
          </div>

          <div className="change-outcome-grid">
            <div>
              <span>Свидетельства / интерпретация состояния</span>
              <strong data-change-outcome={change.learnerEvidenceChange}>
                {changeOutcomeLabel(change.learnerEvidenceChange)}
              </strong>
            </div>
            <div>
              <span>Информация о цели</span>
              <strong>{changeOutcomeLabel(change.targetInformationChange)}</strong>
            </div>
          </div>

          <p className="change-explanation">{change.explanation}</p>

          <p className="supporting-text">
            Результат относится к конкретной попытке практики. Само завершение
            попытки не считается свидетельством компетенции.
          </p>
        </section>
      ) : null}

      {currentState ? (
        <section
          className="current-state-after-region"
          aria-labelledby="current-state-after-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Состояние после проверки</p>
            <h2 id="current-state-after-heading">
              Состояние компетенций по свидетельствам
            </h2>
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

      {change ? (
        <section
          className="evidence-change-actions"
          aria-labelledby="evidence-change-actions-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Продолжение</p>
            <h2 id="evidence-change-actions-heading">Выберите следующий шаг</h2>
          </div>
          <div className="action-row">
            {canContinueCurrentFocus ? (
              <button
                type="button"
                className="primary-action"
                onClick={onContinueCurrentFocus}
              >
                Продолжить текущий фокус
              </button>
            ) : null}
            <button
              type="button"
              className="secondary-action"
              onClick={onReturnCurrent}
            >
              Вернуться к текущему состоянию
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={onInspectKnowledge}
            >
              Открыть знания
            </button>
          </div>
        </section>
      ) : null}

      {evidence ? (
        <details className="evidence-review-detail">
          <summary>Показать факты и их источники</summary>
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
