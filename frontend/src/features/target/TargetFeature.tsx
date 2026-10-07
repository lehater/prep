import { useEffect, useMemo, useState } from "react";

import type {
  CapabilityRef,
  SemanticBasisRef,
  TargetRef,
} from "../contracts";
import {
  ActionButton,
  ActionGroup,
  Field,
  OutcomeMessage,
  SectionHeader,
  Surface,
  TaskHeader,
} from "../../ui/primitives";
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
  readonly onAcceptedTarget: (
    target: TargetModel,
    semanticBasisRef: SemanticBasisRef,
  ) => void;
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
      setMessage("Сначала выберите цель подготовки.");
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
    onAcceptedTarget(acceptedTarget, outcome.projection.basisRef);

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
      <TaskHeader
        eyebrow="Цель"
        title={
          established ? "Что требуется для этой цели" : "Зафиксируйте цель подготовки"
        }
        headingId="target-heading"
      >
        <p>
          Зафиксируйте назначение подготовки и ожидаемый результат,
          прежде чем выбирать следующий шаг.
        </p>
      </TaskHeader>

      {message ? <OutcomeMessage>{message}</OutcomeMessage> : null}

      <Surface className="target-context-region" aria-labelledby="target-context-heading">
        <SectionHeader
          eyebrow="Контекст цели"
          title={contextCandidate?.label ?? "Выберите цель подготовки"}
          headingId="target-context-heading"
        >
          {contextPurpose ? <p>{contextPurpose}</p> : null}
        </SectionHeader>

        <Field controlId="target-choice" label="Цель">
          <select
            id="target-choice"
            value={selectedTargetRef ?? ""}
            disabled={established || status === "submitting"}
            onChange={(event) =>
              selectCandidate(event.currentTarget.value as TargetRef)
            }
          >
            <option value="">Выберите цель</option>
            {candidates.map((candidate) => (
              <option key={candidate.targetRef} value={candidate.targetRef}>
                {candidate.label}
              </option>
            ))}
          </select>
        </Field>

        <Field controlId="target-source-context" label="Источник / контекст">
          <textarea
            id="target-source-context"
            rows={3}
            value={sourceContext}
            disabled={status === "submitting"}
            onChange={(event) => setSourceContext(event.currentTarget.value)}
            placeholder="Укажите источник или контекст, который определяет эту цель."
          />
        </Field>

        {contextUncertainty.length > 0 ? (
          <div className="target-uncertainty">
            <strong>Неопределённость цели</strong>
            <ul>
              {contextUncertainty.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <ActionGroup>
          <ActionButton
            variant="primary"
            disabled={!selectedTargetRef || status === "submitting"}
            onClick={() => void establishTarget()}
          >
            {status === "submitting"
              ? "Сохранение…"
              : established
                ? "Уточнить цель"
                : "Зафиксировать цель"}
          </ActionButton>
          <ActionButton variant="text" onClick={onReconsiderDirection}>
            Вернуться к выбору целей
          </ActionButton>
        </ActionGroup>
      </Surface>

      {established ? (
        <section
          className="target-requirements-region"
          aria-labelledby="target-requirements-heading"
        >
          <SectionHeader
            eyebrow="Ожидаемый результат"
            title="Требования"
            headingId="target-requirements-heading"
          />

          {status === "loading-requirements" && !requirements ? (
            <p role="status">Загрузка требований…</p>
          ) : null}

          {requirements ? (
            <div className="requirements-list">
              {requirements.expectations.map((expectation) => (
                <Surface
                  as="article"
                  className="requirement-card"
                  key={expectation.requirementRef}
                >
                  <header>
                    <h3>{expectation.capabilityLabel}</h3>
                    <p>{expectation.performance}</p>
                  </header>

                  <div className="requirement-detail-grid">
                    <div>
                      <h4>Условия</h4>
                      <ul>
                        {expectation.conditions.map((condition) => (
                          <li key={condition}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Критерии качества</h4>
                      <ul>
                        {expectation.qualityCriteria.map((criterion) => (
                          <li key={criterion}>{criterion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="knowledge-focus">
                    <h4>Связанные знания</h4>
                    {expectation.knowledgeFocus.length > 0 ? (
                      <ul>
                        {expectation.knowledgeFocus.map((knowledge) => (
                          <li key={knowledge.knowledgeRef}>{knowledge.label}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="supporting-text">
                        Для этого требования не указаны связанные знания.
                      </p>
                    )}
                  </div>

                  <ActionButton
                    onClick={() =>
                      onExploreKnowledge(expectation.capabilityRef)
                    }
                  >
                    Открыть знания: {expectation.capabilityLabel}
                  </ActionButton>
                </Surface>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {established && requirements ? (
        <Surface
          as="aside"
          className="target-provenance-region"
          aria-label="Источники цели"
        >
          <strong>Источники и сохраняющаяся неопределённость</strong>
          <ul>
            {requirements.provenance.map((item) => (
              <li key={item.label}>{item.label}</li>
            ))}
            {requirements.unresolvedExpectations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Surface>
      ) : null}

      <ActionGroup className="target-actions">
        {selectedTargetRef ? (
          <ActionButton
            onClick={() => onRequestPreparationSupport(selectedTargetRef)}
          >
            Подготовить недостающую поддержку
          </ActionButton>
        ) : null}
      </ActionGroup>
    </section>
  );
}
