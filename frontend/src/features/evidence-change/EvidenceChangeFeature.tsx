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
  ActionButton,
  ActionGroup,
  OutcomeMessage,
  SectionHeader,
  StatusBadge,
  Surface,
  TaskHeader,
} from "../../ui/primitives";
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
      <TaskHeader
        eyebrow="Свидетельства и изменения"
        title="Проверьте, что изменилось после практики"
        headingId="evidence-change-heading"
      >
        <p>
          Изучите результат завершённой попытки, отделите факты от выводов о
          состоянии компетенций и явно выберите следующий шаг.
        </p>
      </TaskHeader>

      {message ? <OutcomeMessage>{message}</OutcomeMessage> : null}

      {status === "loading" ? <p role="status">Загрузка результата…</p> : null}

      {change ? (
        <Surface
          className="change-summary-region"
          aria-labelledby="change-summary-heading"
        >
          <SectionHeader
            eyebrow="Проверенный результат практики"
            title="Что изменилось"
            headingId="change-summary-heading"
          />

          <div className="change-outcome-grid">
            <div>
              <span>Свидетельства / интерпретация состояния</span>
              <StatusBadge
                tone={
                  change.learnerEvidenceChange === "changed" ||
                  change.learnerEvidenceChange === "reviewable"
                    ? "positive"
                    : change.learnerEvidenceChange === "challenged" ||
                        change.learnerEvidenceChange === "increased-uncertainty"
                      ? "warning"
                      : "neutral"
                }
              >
                {changeOutcomeLabel(change.learnerEvidenceChange)}
              </StatusBadge>
            </div>
            <div>
              <span>Информация о цели</span>
              <StatusBadge
                tone={
                  change.targetInformationChange === "changed" ||
                  change.targetInformationChange === "reviewable"
                    ? "positive"
                    : change.targetInformationChange === "challenged" ||
                        change.targetInformationChange === "increased-uncertainty"
                      ? "warning"
                      : "neutral"
                }
              >
                {changeOutcomeLabel(change.targetInformationChange)}
              </StatusBadge>
            </div>
          </div>

          <p className="change-explanation">{change.explanation}</p>

          <p className="supporting-text">
            Результат относится к конкретной попытке практики. Само завершение
            попытки не считается свидетельством компетенции.
          </p>
        </Surface>
      ) : null}

      {currentState ? (
        <Surface
          className="current-state-after-region"
          aria-labelledby="current-state-after-heading"
        >
          <SectionHeader
            eyebrow="Состояние после проверки"
            title="Состояние компетенций по свидетельствам"
            headingId="current-state-after-heading"
          />

          <div className="current-state-grid">
            {currentState.capabilities.map((item) => (
              <Surface as="article" className="state-card" key={item.capabilityRef}>
                <div className="state-card-heading">
                  <h3>{item.capabilityLabel}</h3>
                  <StatusBadge
                    tone={
                      item.state === "demonstrated"
                        ? "positive"
                        : item.state === "challenged"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {capabilityStateLabel(item.state)}
                  </StatusBadge>
                </div>
                <p>{stateExplanation(item.state)}</p>
                {item.limitations.length > 0 ? (
                  <ul className="limitation-list">
                    {item.limitations.map((limitation) => (
                      <li key={limitation.detail}>{limitation.detail}</li>
                    ))}
                  </ul>
                ) : null}
              </Surface>
            ))}
          </div>
        </Surface>
      ) : null}

      {change ? (
        <Surface
          className="evidence-change-actions"
          aria-labelledby="evidence-change-actions-heading"
        >
          <SectionHeader
            eyebrow="Продолжение"
            title="Выберите следующий шаг"
            headingId="evidence-change-actions-heading"
          />
          <ActionGroup>
            {canContinueCurrentFocus ? (
              <ActionButton
                variant="primary"
                onClick={onContinueCurrentFocus}
              >
                Продолжить текущий фокус
              </ActionButton>
            ) : null}
            <ActionButton onClick={onReturnCurrent}>
              Вернуться к текущему состоянию
            </ActionButton>
            <ActionButton onClick={onInspectKnowledge}>
              Открыть знания
            </ActionButton>
          </ActionGroup>
        </Surface>
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
