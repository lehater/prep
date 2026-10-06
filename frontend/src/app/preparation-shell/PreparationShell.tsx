import { type ReactNode, useState } from "react";

import type { ActivityPort } from "../../features/activity/contract";
import { ActivityFeature } from "../../features/activity/ActivityFeature";
import type { CurrentPositionPort } from "../../features/current-position/contract";
import { CurrentPositionFeature } from "../../features/current-position/CurrentPositionFeature";
import type { EvidenceChangePort } from "../../features/evidence-change/contract";
import { EvidenceChangeFeature } from "../../features/evidence-change/EvidenceChangeFeature";
import type { KnowledgePort } from "../../features/knowledge-explorer/contract";
import { KnowledgeExplorerFeature } from "../../features/knowledge-explorer/KnowledgeExplorerFeature";
import type { PreparationSupportPort } from "../../features/preparation-support/contract";
import { PreparationSupportFeature } from "../../features/preparation-support/PreparationSupportFeature";
import type { TargetDirectionPort, CandidateTargetOption } from "../../features/target-direction/contract";
import { TargetDirectionFeature } from "../../features/target-direction/TargetDirectionFeature";
import type { TargetPort } from "../../features/target/contract";
import { TargetFeature } from "../../features/target/TargetFeature";
import { usePreparationContext } from "../preparation-context/PreparationContext";
import {
  type PreparationDestination,
  type PreparationNavigationRequest,
  resolvePreparationNavigation,
} from "./navigation";

const navigationItems: readonly {
  readonly destination: PreparationDestination;
  readonly label: string;
}[] = [
  { destination: "targets", label: "Цели" },
  { destination: "target", label: "Цель" },
  { destination: "current", label: "Текущее состояние" },
  { destination: "knowledge", label: "Знания" },
  { destination: "activity", label: "Практика" },
];

export interface PreparationShellProps {
  readonly targetDirectionPort: TargetDirectionPort;
  readonly targetPort: TargetPort;
  readonly currentPositionPort: CurrentPositionPort;
  readonly knowledgePort: KnowledgePort;
  readonly activityPort: ActivityPort;
  readonly evidenceChangePort: EvidenceChangePort;
  readonly preparationSupportPort: PreparationSupportPort;
  readonly candidateTargets: readonly CandidateTargetOption[];
}

function StructuralPlaceholder({
  title,
  description,
  recoveryReason,
}: {
  readonly title: string;
  readonly description: string;
  readonly recoveryReason?: string | undefined;
}) {
  return (
    <section className="task-view structural-placeholder" data-view={title.toLowerCase()}>
      <p className="eyebrow">Раздел недоступен</p>
      <h1>{title}</h1>
      {recoveryReason ? (
        <p className="recovery-message" role="status">
          {recoveryReason}
        </p>
      ) : null}
      <p>{description}</p>
      <p className="supporting-text">
        Этот раздел будет реализован на следующем этапе.
      </p>
    </section>
  );
}

export function PreparationShell({
  targetDirectionPort,
  targetPort,
  currentPositionPort,
  knowledgePort,
  activityPort,
  evidenceChangePort,
  preparationSupportPort,
  candidateTargets,
}: PreparationShellProps) {
  const {
    activeTargetRef,
    activeTargetBasisRef,
    activeFocus,
    activeFocusRef,
    setAcceptedTarget,
    setAcceptedFocus,
  } = usePreparationContext();
  const [navigation, setNavigation] = useState<PreparationNavigationRequest>({
    destination: "targets",
  });
  const [recoveryReason, setRecoveryReason] = useState<string | null>(null);

  const activeTarget = activeTargetRef
    ? candidateTargets.find((candidate) => candidate.targetRef === activeTargetRef)
    : null;

  function navigate(request: PreparationNavigationRequest) {
    const resolved = resolvePreparationNavigation(request, {
      activeTargetRef,
      activeFocusRef,
    });
    setNavigation({
      destination: resolved.destination,
      ...(resolved.candidateTargetRef
        ? { candidateTargetRef: resolved.candidateTargetRef }
        : {}),
      ...(resolved.requiredCapabilityRef
        ? { requiredCapabilityRef: resolved.requiredCapabilityRef }
        : {}),
      ...(resolved.activityAttemptRef
        ? { activityAttemptRef: resolved.activityAttemptRef }
        : {}),
      ...(resolved.returnDestination
        ? { returnDestination: resolved.returnDestination }
        : {}),
      ...(resolved.motivatingContext
        ? { motivatingContext: resolved.motivatingContext }
        : {}),
    });
    setRecoveryReason(resolved.recoveryReason ?? null);
  }


  let child: ReactNode;

  switch (navigation.destination) {
    case "targets":
      child = (
        <TargetDirectionFeature
          port={targetDirectionPort}
          candidates={candidateTargets}
          onContinueCandidate={(targetRef) =>
            navigate({ destination: "target", candidateTargetRef: targetRef })
          }
        />
      );
      break;
    case "target":
      child = (
        <TargetFeature
          port={targetPort}
          candidates={candidateTargets}
          candidateTargetRef={navigation.candidateTargetRef}
          activeTargetRef={activeTargetRef}
          recoveryReason={recoveryReason ?? undefined}
          onAcceptedTarget={(target, semanticBasisRef) => {
            setAcceptedTarget(target.targetRef, semanticBasisRef);
            setRecoveryReason(null);
          }}
          onExploreKnowledge={(requiredCapabilityRef) =>
            navigate({ destination: "knowledge", requiredCapabilityRef })
          }
          onRequestPreparationSupport={(candidateTargetRef) =>
            navigate({
              destination: "prepare-support",
              candidateTargetRef,
              returnDestination: "target",
              motivatingContext:
                "Подготовить недостающую поддержку для этой цели.",
            })
          }
          onReconsiderDirection={() => navigate({ destination: "targets" })}
        />
      );
      break;
    case "current":
      child = activeTargetRef ? (
        <CurrentPositionFeature
          port={currentPositionPort}
          activeTargetRef={activeTargetRef}
          activeFocusRef={activeFocusRef}
          onAcceptedFocus={(focus, semanticBasisRef) => {
            setAcceptedFocus({
              focusRef: focus.focusRef,
              purpose: focus.purpose,
              rationale: focus.rationale,
              semanticBasisRef,
            });
            setRecoveryReason(null);
          }}
          onContinueActivity={() => navigate({ destination: "activity" })}
          onRequestPreparationSupport={() =>
            navigate({
              destination: "prepare-support",
              candidateTargetRef: activeTargetRef,
              returnDestination: "current",
              motivatingContext:
                "Подготовить подходящую поддержку для выбранного фокуса.",
            })
          }
        />
      ) : (
        <StructuralPlaceholder
          title="Цель"
          description="Сначала зафиксируйте цель, затем оценивайте текущее состояние."
          recoveryReason={
            recoveryReason ??
            "Сначала зафиксируйте цель подготовки."
          }
        />
      );
      break;
    case "knowledge":
      child = activeTargetRef ? (
        <KnowledgeExplorerFeature
          port={knowledgePort}
          activeTargetRef={activeTargetRef}
          activeFocusRef={activeFocusRef}
          incomingRequiredCapabilityRef={navigation.requiredCapabilityRef}
        />
      ) : (
        <StructuralPlaceholder
          title="Target"
          description="Сначала зафиксируйте цель, затем исследуйте знания."
          recoveryReason={
            recoveryReason ??
            "Establish a Target before entering Target-dependent preparation work."
          }
        />
      );
      break;
    case "activity":
      child =
        activeTargetRef && activeFocus ? (
          <ActivityFeature
            port={activityPort}
            activeTargetRef={activeTargetRef}
            activeFocusRef={activeFocus.focusRef}
            focusPurpose={activeFocus.purpose}
            focusRationale={activeFocus.rationale}
            focusBasisRef={activeFocus.semanticBasisRef}
            onRequestPreparationSupport={() =>
              navigate({
                destination: "prepare-support",
                candidateTargetRef: activeTargetRef,
                returnDestination: "activity",
                motivatingContext:
                  "Для выбранного фокуса пока нет подходящей поддержки.",
              })
            }
            onReviewEvidenceChange={(activityAttemptRef) =>
              navigate({
                destination: "evidence-change",
                activityAttemptRef,
              })
            }
          />
        ) : (
          <StructuralPlaceholder
            title={activeTargetRef ? "Текущее состояние" : "Цель"}
            description={
              activeTargetRef
                ? "Перед началом практики выберите следующий фокус."
                : "Перед началом практики зафиксируйте цель."
            }
            recoveryReason={
              recoveryReason ??
              (activeTargetRef
                ? "Перед началом практики выберите следующий фокус."
                : "Сначала зафиксируйте цель подготовки.")
            }
          />
        );
      break;
    case "evidence-change":
      child =
        activeTargetRef && navigation.activityAttemptRef ? (
          <EvidenceChangeFeature
            port={evidenceChangePort}
            activeTargetRef={activeTargetRef}
            activityAttemptRef={navigation.activityAttemptRef}
            canContinueCurrentFocus={activeFocusRef !== null}
            onContinueCurrentFocus={() => navigate({ destination: "activity" })}
            onReturnCurrent={() => navigate({ destination: "current" })}
            onInspectKnowledge={() => navigate({ destination: "knowledge" })}
          />
        ) : (
          <StructuralPlaceholder
            title={activeTargetRef ? "Практика" : "Цель"}
            description="Для просмотра свидетельств и изменений нужен завершённый результат практики."
            recoveryReason={
              recoveryReason ??
              "Сначала завершите практику так, чтобы её результат можно было проверить."
            }
          />
        );
      break;
    case "prepare-support": {
      const preparationTargetRef =
        navigation.candidateTargetRef ?? activeTargetRef;
      const preparationTarget = preparationTargetRef
        ? candidateTargets.find(
            (candidate) => candidate.targetRef === preparationTargetRef,
          ) ?? null
        : null;
      const targetIsActive =
        preparationTargetRef !== undefined &&
        preparationTargetRef !== null &&
        preparationTargetRef === activeTargetRef;
      const semanticBasisRef = targetIsActive
        ? activeFocus?.semanticBasisRef ?? activeTargetBasisRef
        : null;
      const returnDestination = navigation.returnDestination ?? "target";
      const originLabel =
        returnDestination === "current"
          ? "Текущее состояние"
          : returnDestination === "activity"
            ? "Практика"
            : "Цель";

      child = preparationTargetRef && preparationTarget ? (
        <PreparationSupportFeature
          port={preparationSupportPort}
          targetRef={preparationTargetRef}
          targetLabel={preparationTarget.label}
          focusRef={targetIsActive ? activeFocusRef ?? undefined : undefined}
          focusPurpose={targetIsActive ? activeFocus?.purpose : undefined}
          semanticBasisRef={semanticBasisRef}
          motivatingContext={
            navigation.motivatingContext ??
            "Устранить текущий дефицит поддержки."
          }
          originLabel={originLabel}
          onReturn={() =>
            navigate({
              destination: returnDestination,
              ...(returnDestination === "target"
                ? { candidateTargetRef: preparationTargetRef }
                : {}),
            })
          }
        />
      ) : (
        <StructuralPlaceholder
          title="Target"
          description="Сначала выберите или зафиксируйте цель подготовки."
          recoveryReason={
            recoveryReason ??
            "Сначала выберите или зафиксируйте цель подготовки."
          }
        />
      );
      break;
    }
  }

  return (
    <div className="preparation-shell">
      <header className="shell-header">
        <a className="brand" href="/" onClick={(event) => event.preventDefault()}>
          Prep
        </a>
        <span className="prototype-label">Прототип для проверки удобства</span>
      </header>

      <nav className="prep-navigation" aria-label="Подготовка">
        {navigationItems.map((item) => (
          <button
            type="button"
            key={item.destination}
            aria-current={
              navigation.destination === item.destination ? "page" : undefined
            }
            onClick={() => navigate({ destination: item.destination })}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section className="active-context" aria-label="Текущий контекст подготовки">
        <div>
          <span>Текущая цель</span>
          <strong>{activeTarget?.label ?? "не выбрана"}</strong>
        </div>
        <div>
          <span>Следующий фокус</span>
          <strong>{activeFocusRef ? "выбран" : "не выбран"}</strong>
        </div>
      </section>

      <main className="active-child">{child}</main>
    </div>
  );
}
