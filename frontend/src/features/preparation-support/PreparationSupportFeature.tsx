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
      <header className="task-heading">
        <p className="eyebrow">Подготовка поддержки</p>
        <h1 id="prepare-support-heading">Подготовить поддержку</h1>
        <p>
          Подготовьте недостающий материал или задание, сохранив исходный
          контекст подготовки.
        </p>
      </header>

      <section
        className="preparation-motivating-context"
        aria-labelledby="preparation-context-heading"
      >
        <div className="section-heading">
          <p className="eyebrow">Исходный контекст</p>
          <h2 id="preparation-context-heading">{targetLabel}</h2>
        </div>
        {focusPurpose ? (
          <p>
            <strong>Следующий фокус:</strong> {focusPurpose}
          </p>
        ) : null}
        <p>{motivatingContext}</p>
        <p className="supporting-text">Вернуться в: {originLabel}</p>
      </section>

      {message ? (
        <p className="outcome-message" role="status">
          {message}
        </p>
      ) : null}

      <section
        className="preparation-source-region"
        aria-labelledby="preparation-source-heading"
      >
        <div className="section-heading">
          <p className="eyebrow">Контекст запроса</p>
          <h2 id="preparation-source-heading">Опишите, чего не хватает</h2>
        </div>

        <label className="field">
          <span>Недостающая поддержка</span>
          <textarea
            rows={4}
            value={sourceContext}
            disabled={viewState === "requesting"}
            onChange={(event) => setSourceContext(event.currentTarget.value)}
          />
        </label>

        <label className="field">
          <span>Источник контекста</span>
          <input
            value={provenanceLabel}
            disabled={viewState === "requesting"}
            onChange={(event) => setProvenanceLabel(event.currentTarget.value)}
          />
        </label>

        <div className="action-row">
          <button
            type="button"
            className="primary-action"
            disabled={viewState === "requesting" || !semanticBasisRef}
            onClick={() => void requestPreparation()}
          >
            {viewState === "requesting"
              ? "Подготовка…"
              : result
                ? "Запросить ещё раз"
                : "Подготовить поддержку"}
          </button>
          <button
            type="button"
            className="text-action"
            onClick={onReturn}
          >
            Вернуться: {originLabel}
          </button>
        </div>
      </section>

      {result ? (
        <section
          className="preparation-results-region"
          aria-labelledby="preparation-results-heading"
        >
          <div className="section-heading">
            <p className="eyebrow">Принятый результат</p>
            <h2 id="preparation-results-heading">
              Подготовленная поддержка и оставшиеся вопросы
            </h2>
          </div>

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
                      <span data-remainder-status={item.status}>
                        {preparationRemainderStatusLabel(item.status)}
                      </span>
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

          <div className="action-row">
            <button
              type="button"
              className="primary-action"
              onClick={onReturn}
            >
              Вернуться: {originLabel}
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={() => void refreshPreparation()}
            >
              Обновить результат
            </button>
          </div>
        </section>
      ) : null}
    </section>
  );
}
