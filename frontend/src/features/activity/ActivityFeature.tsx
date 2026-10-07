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
import {
  ActionButton,
  ActionGroup,
  ChoiceCard,
  Field,
  OutcomeMessage,
  SectionHeader,
  StatusBadge,
  Surface,
  TaskHeader,
} from "../../ui/primitives";
import { activityAttemptStateLabel } from "../../ui/presentationLabels";

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
      setMessage("Перед началом практики выберите подходящую поддержку.");
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
      setMessage("Нет активной принятой попытки практики.");
      return;
    }

    if (
      resultSummary.trim().length === 0 ||
      provenance.trim().length === 0
    ) {
      setMessage(
        "Перед отправкой опишите результат попытки и укажите его источник.",
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
      <TaskHeader
        eyebrow="Практика"
        title="Проработайте выбранный фокус"
        headingId="activity-heading"
      >
        <p>
          Выберите подходящую поддержку, выполните одну проверяемую попытку
          и зафиксируйте результат для последующего анализа свидетельств.
        </p>
      </TaskHeader>

      <Surface className="activity-focus-context" aria-label="Текущий фокус">
        <p className="eyebrow">Текущий фокус</p>
        <strong>{focusPurpose}</strong>
        <p>{focusRationale}</p>
      </Surface>

      {message ? <OutcomeMessage>{message}</OutcomeMessage> : null}

      {viewState === "loading-support" ? (
        <p role="status">Загрузка подходящей поддержки…</p>
      ) : null}

      {viewState !== "loading-support" ? (
        <Surface
          className="activity-support-region"
          aria-labelledby="support-options-heading"
        >
          <SectionHeader
            eyebrow="Выбор поддержки"
            title="Доступная поддержка"
            headingId="support-options-heading"
          />

          {supportOptions.length === 0 ? (
            <div className="activity-no-support">
              <strong>Подходящая поддержка пока не подготовлена.</strong>
              <p>
                Сохраните выбранную цель и фокус, подготовьте недостающую
                поддержку и затем вернитесь к практике.
              </p>
              <ActionButton
                variant="primary"
                onClick={onRequestPreparationSupport}
              >
                Подготовить поддержку
              </ActionButton>
            </div>
          ) : (
            <fieldset className="support-options">
              <legend>Поддержка для этой попытки</legend>
              {supportOptions.map((support) => (
                <ChoiceCard
                  className="support-option"
                  key={support.supportRef}
                  controlId={`support-${support.supportRef}`}
                  selected={selectedSupportRef === support.supportRef}
                >
                  <input
                    id={`support-${support.supportRef}`}
                    type="radio"
                    name="activity-support"
                    checked={selectedSupportRef === support.supportRef}
                    disabled={attempt !== null}
                    onChange={() => setSelectedSupportRef(support.supportRef)}
                  />
                  <span className="support-option-body">
                    <strong>{support.label}</strong>
                    <small>
                      Компетенция: {support.intendedCapabilityLabel}
                    </small>
                    <span>{support.fitBasis}</span>
                    <span>
                      Ожидаемые условия:{" "}
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
                </ChoiceCard>
              ))}
            </fieldset>
          )}

          {supportOptions.length > 0 && !attempt ? (
            <ActionGroup>
              <ActionButton
                variant="primary"
                disabled={
                  !selectedSupportRef || viewState === "starting-attempt"
                }
                onClick={() => void startAttempt()}
              >
                {viewState === "starting-attempt"
                  ? "Запуск попытки…"
                  : "Начать практику"}
              </ActionButton>
            </ActionGroup>
          ) : null}
        </Surface>
      ) : null}

      {attempt ? (
        <Surface
          className="activity-attempt-region"
          aria-labelledby="activity-attempt-heading"
        >
          <SectionHeader
            eyebrow="Зафиксированная попытка"
            title="Попытка практики"
            headingId="activity-attempt-heading"
          />

          <dl className="activity-attempt-context">
            <div>
              <dt>Поддержка</dt>
              <dd>{selectedSupport?.label ?? "Выбранная поддержка"}</dd>
            </div>
            <div>
              <dt>Состояние попытки</dt>
              <dd>
                <StatusBadge tone="info">
                  {activityAttemptStateLabel(attempt.state)}
                </StatusBadge>
              </dd>
            </div>
          </dl>

          {viewState !== "evidence-processing" ? (
            <div className="activity-completion-form">
              <Field controlId="activity-result" label="Что произошло">
                <textarea
                  id="activity-result"
                  rows={4}
                  value={resultSummary}
                  disabled={viewState === "submitting-attempt"}
                  onChange={(event) =>
                    setResultSummary(event.currentTarget.value)
                  }
                  placeholder="Опишите наблюдаемый результат этой попытки."
                />
              </Field>

              <Field
                controlId="activity-provenance"
                label="Источник результата"
              >
                <input
                  id="activity-provenance"
                  value={provenance}
                  disabled={viewState === "submitting-attempt"}
                  onChange={(event) =>
                    setProvenance(event.currentTarget.value)
                  }
                  placeholder="Укажите, откуда получен этот результат."
                />
              </Field>

              <ActionGroup>
                <ActionButton
                  variant="primary"
                  disabled={viewState === "submitting-attempt"}
                  onClick={() => void completeAttempt()}
                >
                  {viewState === "submitting-attempt"
                    ? "Отправка результата…"
                    : "Завершить попытку"}
                </ActionButton>
              </ActionGroup>
            </div>
          ) : null}
        </Surface>
      ) : null}

      {viewState === "evidence-processing" && completion ? (
        <Surface
          className="activity-processing-region"
          aria-labelledby="activity-processing-heading"
          role="status"
        >
          <p className="eyebrow">Анализ свидетельств</p>
          <h2 id="activity-processing-heading">Результат попытки отправлен</h2>
          <p>
            Завершённая попытка остаётся отдельным наблюдаемым событием.
            Сам факт завершения не подтверждает компетенцию и не закрывает пробел.
          </p>
          <p>
            {completion.historicalFactsAccepted
              ? "Проверяемые факты приняты для анализа свидетельств и изменений."
              : "Отправленные факты пока не приняты для анализа свидетельств."}
          </p>
          <p className="supporting-text">
            Итоговая интерпретация изменений выполняется отдельно в разделе
            анализа свидетельств и изменений.
          </p>
          <ActionGroup>
            <ActionButton
              variant="primary"
              onClick={() =>
                onReviewEvidenceChange(completion.activityAttemptRef)
              }
            >
              Проверить свидетельства и изменения
            </ActionButton>
          </ActionGroup>
        </Surface>
      ) : null}
    </section>
  );
}
