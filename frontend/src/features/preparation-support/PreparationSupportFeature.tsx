import { useState } from "react";

import type {
  PreparationRequestModel,
  PreparationSupportPort,
} from "./contract";
import type {
  FocusRef,
  SemanticBasisRef,
  TargetRef,
} from "../contracts";
import {
  ActionButton,
  ActionGroup,
  Field,
  OutcomeMessage,
  SectionHeader,
  StatusBadge,
  Surface,
  TaskHeader,
} from "../../ui/primitives";
import {
  preparationRemainderStatusLabel,
  preparationRequestStateLabel,
} from "../../ui/presentationLabels";

export interface PreparationSupportFeatureProps {
  readonly port: PreparationSupportPort;
  readonly targetRef: TargetRef;
  readonly targetLabel: string;
  readonly focusRef?: FocusRef | undefined;
  readonly focusPurpose?: string | undefined;
  readonly semanticBasisRef: SemanticBasisRef | null;
  readonly motivatingContext: string;
  readonly originLabel: string;
  readonly onReturn: () => void;
}

type PreparationSupportViewState =
  | "request-input"
  | "requesting"
  | "result-review"
  | "continuation-recovery";

export function PreparationSupportFeature({
  port,
  targetRef,
  targetLabel,
  focusRef,
  focusPurpose,
  semanticBasisRef,
  motivatingContext,
  originLabel,
  onReturn,
}: PreparationSupportFeatureProps) {
  const [sourceContext, setSourceContext] = useState(motivatingContext);
  const [provenanceLabel, setProvenanceLabel] = useState(
    `Текущий контекст подготовки: ${originLabel}`,
  );
  const [result, setResult] = useState<PreparationRequestModel | null>(null);
  const [viewState, setViewState] = useState<PreparationSupportViewState>(
    semanticBasisRef ? "request-input" : "continuation-recovery",
  );
  const [message, setMessage] = useState<string | null>(
    semanticBasisRef
      ? null
      : "У этого контекста ещё нет принятого смыслового основания. Вернитесь и зафиксируйте цель перед подготовкой поддержки.",
  );

  async function requestPreparation() {
    if (!semanticBasisRef) {
      setMessage(
        "Для подготовки поддержки нужна зафиксированная цель или выбранный фокус.",
      );
      setViewState("continuation-recovery");
      return;
    }

    if (
      sourceContext.trim().length === 0 ||
      provenanceLabel.trim().length === 0
    ) {
      setMessage(
        "Опишите, какой поддержки не хватает, и укажите источник этого контекста.",
      );
      return;
    }

    setViewState("requesting");
    setMessage(null);

    const outcome = await port.requestPreparation({
      targetRef,
      ...(focusRef ? { focusRef } : {}),
      sourceContext,
      sourceProvenance: [{ label: provenanceLabel }],
      semanticBasisRef,
    });

    if (outcome.status !== "accepted") {
      setMessage(outcome.message);
      setViewState("continuation-recovery");
      return;
    }

    setResult(outcome.projection.value);
    setViewState("result-review");
  }

  async function refreshPreparation() {
    if (!result) {
      return;
    }

    setMessage(null);
    const outcome = await port.getPreparation(result.preparationRequestRef);

    if (outcome.status !== "accepted") {
      setMessage(outcome.message);
      setViewState("continuation-recovery");
      return;
    }

    setResult(outcome.projection.value);
    setViewState("result-review");
  }

  return (
    <section
      className="task-view preparation-support-view"
      data-view="prepare-support"
      data-variant={viewState}
      aria-labelledby="prepare-support-heading"
    >
      <TaskHeader
        eyebrow="Подготовка поддержки"
        title="Подготовить поддержку"
        headingId="prepare-support-heading"
      >
        <p>
          Подготовьте недостающий материал или задание, сохранив исходный
          контекст подготовки.
        </p>
      </TaskHeader>

      <Surface
        className="preparation-motivating-context"
        aria-labelledby="preparation-context-heading"
      >
        <SectionHeader
          eyebrow="Исходный контекст"
          title={targetLabel}
          headingId="preparation-context-heading"
        />
        {focusPurpose ? (
          <p>
            <strong>Следующий фокус:</strong> {focusPurpose}
          </p>
        ) : null}
        <p>{motivatingContext}</p>
        <p className="supporting-text">Вернуться в: {originLabel}</p>
      </Surface>

      {message ? <OutcomeMessage>{message}</OutcomeMessage> : null}

      <Surface
        className="preparation-source-region"
        aria-labelledby="preparation-source-heading"
      >
        <SectionHeader
          eyebrow="Контекст запроса"
          title="Опишите, чего не хватает"
          headingId="preparation-source-heading"
        />

        <Field controlId="support-source-context" label="Недостающая поддержка">
          <textarea
            id="support-source-context"
            rows={4}
            value={sourceContext}
            disabled={viewState === "requesting"}
            onChange={(event) => setSourceContext(event.currentTarget.value)}
          />
        </Field>

        <Field controlId="support-provenance" label="Источник контекста">
          <input
            id="support-provenance"
            value={provenanceLabel}
            disabled={viewState === "requesting"}
            onChange={(event) => setProvenanceLabel(event.currentTarget.value)}
          />
        </Field>

        <ActionGroup>
          <ActionButton
            variant="primary"
            disabled={viewState === "requesting" || !semanticBasisRef}
            onClick={() => void requestPreparation()}
          >
            {viewState === "requesting"
              ? "Подготовка…"
              : result
                ? "Запросить ещё раз"
                : "Подготовить поддержку"}
          </ActionButton>
          <ActionButton variant="text" onClick={onReturn}>
            Вернуться: {originLabel}
          </ActionButton>
        </ActionGroup>
      </Surface>

      {result ? (
        <Surface
          className="preparation-results-region"
          aria-labelledby="preparation-results-heading"
        >
          <SectionHeader
            eyebrow="Принятый результат"
            title="Подготовленная поддержка и оставшиеся вопросы"
            headingId="preparation-results-heading"
          />

          <div className="preparation-result-grid">
            <section
              className="accepted-support-region"
              aria-labelledby="accepted-support-heading"
            >
              <h3 id="accepted-support-heading">Принятая поддержка</h3>
              {result.acceptedSupport.length > 0 ? (
                <div className="accepted-support-list">
                  {result.acceptedSupport.map((support) => (
                    <article
                      className="accepted-support-card"
                      key={support.supportRef}
                    >
                      <strong>{support.label}</strong>
                      <p>
                        Компетенция: {support.intendedCapabilityLabel}
                      </p>
                      <p>{support.fitBasis}</p>
                      {support.limitations.length > 0 ? (
                        <ul className="limitation-list">
                          {support.limitations.map((limitation) => (
                            <li key={limitation.detail}>
                              {limitation.detail}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p>Для этого запроса ничего не было принято.</p>
              )}
            </section>

            <section
              className="preparation-remainder-region"
              aria-labelledby="preparation-remainder-heading"
            >
              <h3 id="preparation-remainder-heading">Оставшиеся вопросы</h3>
              {result.remainder.length > 0 ? (
                <ul className="preparation-remainder-list">
                  {result.remainder.map((item) => (
                    <li key={item.subject}>
                      <strong>{item.subject}</strong>
                      <StatusBadge
                        tone={item.status === "rejected" ? "danger" : "neutral"}
                      >
                        {preparationRemainderStatusLabel(item.status)}
                      </StatusBadge>
                      <p>{item.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Неразрешённых или отклонённых пунктов нет.</p>
              )}
            </section>
          </div>

          <p className="supporting-text">
            Состояние запроса: {preparationRequestStateLabel(result.state)}.
            Принятую поддержку можно использовать, даже если часть запроса
            остаётся неразрешённой или отклонена.
          </p>

          <ActionGroup>
            <ActionButton variant="primary" onClick={onReturn}>
              Вернуться: {originLabel}
            </ActionButton>
            <ActionButton onClick={() => void refreshPreparation()}>
              Обновить результат
            </ActionButton>
          </ActionGroup>
        </Surface>
      ) : null}
    </section>
  );
}
