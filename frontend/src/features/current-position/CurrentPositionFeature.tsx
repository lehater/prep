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
      <TaskHeader
        eyebrow="Текущее состояние"
        title="Определите, на чём сосредоточиться дальше"
        headingId="current-position-heading"
      >
        <p>
          Оцените состояние компетенций по свидетельствам, изучите важные для
          цели пробелы и явно выберите следующий фокус.
        </p>
      </TaskHeader>

      {message ? <OutcomeMessage>{message}</OutcomeMessage> : null}

      {status === "loading" ? <p role="status">Загрузка текущего состояния…</p> : null}

      {currentState ? (
        <section
          className="current-state-region"
          aria-labelledby="current-state-heading"
        >
          <SectionHeader
            eyebrow="Состояние по свидетельствам"
            title="Состояние компетенций"
            headingId="current-state-heading"
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
        </section>
      ) : null}

      {gapProjection ? (
        <section className="gaps-region" aria-labelledby="gaps-heading">
          <SectionHeader
            eyebrow="Пробелы и неопределённость"
            title="Что требует внимания"
            headingId="gaps-heading"
          />

          <div className="gap-list">
            {gapProjection.gaps.map((gap) => {
              const decision = gapProjection.decisionContext.candidates.find(
                (candidate) => candidate.gapRef === gap.gapRef,
              );

              return (
                <Surface as="article" className="gap-card" key={gap.gapRef}>
                  <div className="gap-card-heading">
                    <h3>{gap.capabilityLabel}</h3>
                    <StatusBadge
                      tone={gap.status === "challenged" ? "warning" : "neutral"}
                    >
                      {gapStatusLabel(gap.status)}
                    </StatusBadge>
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
                  <ActionGroup>
                    <ActionButton
                      onClick={() => onExploreKnowledge(gap.capabilityRef)}
                    >
                      Изучить знания: {gap.capabilityLabel}
                    </ActionButton>
                  </ActionGroup>
                </Surface>
              );
            })}
          </div>
        </section>
      ) : null}

      {gapProjection ? (
        <Surface className="next-focus-region" aria-labelledby="next-focus-heading">
          <SectionHeader
            eyebrow="Следующий фокус"
            title={
              activeFocusRef
                ? "Проверьте или измените следующий фокус"
                : "Выберите следующий фокус"
            }
            headingId="next-focus-heading"
          >
            {activeFocusRef && !acceptedFocus ? (
              <p>
                Следующий фокус уже выбран. Новый выбор ниже изменит его явно,
                а не автоматически.
              </p>
            ) : null}
          </SectionHeader>

          <fieldset className="focus-options">
            <legend>Какой пробел проработать следующим</legend>
            {gapProjection.decisionContext.candidates.map((candidate) => (
              <ChoiceCard
                className="focus-option"
                key={candidate.gapRef}
                controlId={`focus-${candidate.gapRef}`}
                selected={selectedGapRef === candidate.gapRef}
              >
                <input
                  id={`focus-${candidate.gapRef}`}
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
              </ChoiceCard>
            ))}
          </fieldset>

          {selectedDecision ? (
            <div className="focus-draft">
              <Field controlId="focus-purpose" label="Цель фокуса">
                <input
                  id="focus-purpose"
                  value={purposeDraft}
                  onChange={(event) =>
                    onWorkingStateChange({
                      ...workingState,
                      purposeDraft: event.currentTarget.value,
                    })
                  }
                />
              </Field>

              <Field controlId="focus-rationale" label="Основание выбора">
                <textarea
                  id="focus-rationale"
                  rows={3}
                  value={rationaleDraft}
                  onChange={(event) =>
                    onWorkingStateChange({
                      ...workingState,
                      rationaleDraft: event.currentTarget.value,
                    })
                  }
                />
              </Field>

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

              <ActionGroup>
                <ActionButton
                  variant="primary"
                  disabled={status === "submitting-focus"}
                  onClick={() => void setNextFocus()}
                >
                  {status === "submitting-focus"
                    ? "Сохранение фокуса…"
                    : activeFocusRef
                      ? "Изменить фокус"
                      : "Выбрать фокус"}
                </ActionButton>
              </ActionGroup>
            </div>
          ) : null}

          {acceptedFocus ? (
            <Surface as="div" className="accepted-focus" role="status">
              <strong>Следующий фокус выбран</strong>
              <p>{acceptedFocus.purpose}</p>
              <p>{acceptedFocus.rationale}</p>
              <ActionGroup>
                {selectedDecision?.supportAvailability === "missing" ? (
                  <ActionButton onClick={onRequestPreparationSupport}>
                    Подготовить недостающую поддержку
                  </ActionButton>
                ) : null}
                <ActionButton
                  variant="primary"
                  onClick={onContinueActivity}
                >
                  Перейти к практике
                </ActionButton>
              </ActionGroup>
            </Surface>
          ) : null}
        </Surface>
      ) : null}

      {evidence ? (
        <Surface as="details" className="evidence-basis-region">
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
        </Surface>
      ) : null}
    </section>
  );
}
