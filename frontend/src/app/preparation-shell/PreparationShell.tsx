import { type ReactNode, useState } from "react";

import type { ActivityPort } from "../../features/activity/contract";
import type { TargetRef } from "../../features/contracts";
import { ActivityFeature } from "../../features/activity/ActivityFeature";
import type {
  CurrentPositionPort,
  CurrentPositionWorkingState,
} from "../../features/current-position/contract";
import { CurrentPositionFeature } from "../../features/current-position/CurrentPositionFeature";
import type { EvidenceChangePort } from "../../features/evidence-change/contract";
import { EvidenceChangeFeature } from "../../features/evidence-change/EvidenceChangeFeature";
import type { KnowledgePort } from "../../features/knowledge-explorer/contract";
import type { KnowledgeRelationshipRenderer } from "../../features/knowledge-explorer/relationship-renderer";
import { KnowledgeExplorerFeature } from "../../features/knowledge-explorer/KnowledgeExplorerFeature";
import { KnowledgeExplorerStateProvider } from "../../features/knowledge-explorer/state";
import type { PreparationSupportPort } from "../../features/preparation-support/contract";
import { PreparationSupportFeature } from "../../features/preparation-support/PreparationSupportFeature";
import type { TargetDirectionPort, CandidateTargetOption } from "../../features/target-direction/contract";
import { TargetDirectionFeature } from "../../features/target-direction/TargetDirectionFeature";
import type { TargetPort } from "../../features/target/contract";
import { TargetFeature } from "../../features/target/TargetFeature";
import {
  ApplicationShell,
  ShellStatusBar,
  ShellTopBar,
} from "../../ui/AppShell";
import { usePreparationContext } from "../preparation-context/PreparationContext";
import {
  type PreparationDestination,
  type PreparationNavigationRequest,
  resolvePreparationNavigation,
} from "./navigation";

const destinationLabels: Readonly<Record<PreparationDestination, string>> = {
  targets: "Цели",
  target: "Цель",
  current: "Текущее состояние",
  knowledge: "Знания",
  activity: "Практика",
  "evidence-change": "Свидетельства и изменения",
  "prepare-support": "Подготовить поддержку",
};

const navigationItems: readonly {
  readonly destination: PreparationDestination;
  readonly label: string;
}[] = [
  { destination: "targets", label: destinationLabels.targets },
  { destination: "target", label: destinationLabels.target },
  { destination: "current", label: destinationLabels.current },
  { destination: "knowledge", label: destinationLabels.knowledge },
  { destination: "activity", label: destinationLabels.activity },
];

const EMPTY_CURRENT_POSITION_WORKING_STATE: CurrentPositionWorkingState = {
  selectedGapRef: null,
  purposeDraft: "",
  rationaleDraft: "",
};

interface CurrentPositionWorkingSession {
  readonly targetRef: TargetRef | null;
  readonly state: CurrentPositionWorkingState;
}

export interface PreparationShellProps {
  readonly targetDirectionPort: TargetDirectionPort;
  readonly targetPort: TargetPort;
  readonly currentPositionPort: CurrentPositionPort;
  readonly knowledgePort: KnowledgePort;
  readonly knowledgeRelationshipRenderer?: KnowledgeRelationshipRenderer | undefined;
  readonly activityPort: ActivityPort;
  readonly evidenceChangePort: EvidenceChangePort;
  readonly preparationSupportPort: PreparationSupportPort;
  readonly candidateTargets: readonly CandidateTargetOption[];
}

function StructuralPlaceholder({
  view,
  title,
  description,
  recoveryReason,
}: {
  readonly view: PreparationDestination;
  readonly title: string;
  readonly description: string;
  readonly recoveryReason?: string | undefined;
}) {
  return (
    <section className="task-view structural-placeholder" data-view={view}>
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
  knowledgeRelationshipRenderer,
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
  const [currentPositionWorkingSession, setCurrentPositionWorkingSession] =
    useState<CurrentPositionWorkingSession>({
      targetRef: null,
      state: EMPTY_CURRENT_POSITION_WORKING_STATE,
    });
  const currentPositionWorkingState =
    currentPositionWorkingSession.targetRef === activeTargetRef
      ? currentPositionWorkingSession.state
      : EMPTY_CURRENT_POSITION_WORKING_STATE;

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
          workingState={currentPositionWorkingState}
          onWorkingStateChange={(state) =>
            setCurrentPositionWorkingSession({
              targetRef: activeTargetRef,
              state,
            })
          }
          onAcceptedFocus={(focus, semanticBasisRef) => {
            setAcceptedFocus({
              focusRef: focus.focusRef,
              purpose: focus.purpose,
              rationale: focus.rationale,
              semanticBasisRef,
            });
            setRecoveryReason(null);
          }}
          onExploreKnowledge={(requiredCapabilityRef) =>
            navigate({
              destination: "knowledge",
              requiredCapabilityRef,
              returnDestination: "current",
            })
          }
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
          view="current"
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
        navigation.returnDestination === "current" &&
        navigation.requiredCapabilityRef ? (
          <KnowledgeExplorerStateProvider>
            <KnowledgeExplorerFeature
              port={knowledgePort}
              activeTargetRef={activeTargetRef}
              activeFocusRef={activeFocusRef}
              incomingRequiredCapabilityRef={navigation.requiredCapabilityRef}
              relationshipRenderer={knowledgeRelationshipRenderer}
              returnLabel="Вернуться к выбору фокуса"
              onReturn={() => navigate({ destination: "current" })}
            />
          </KnowledgeExplorerStateProvider>
        ) : (
          <KnowledgeExplorerFeature
            port={knowledgePort}
            activeTargetRef={activeTargetRef}
            activeFocusRef={activeFocusRef}
            incomingRequiredCapabilityRef={navigation.requiredCapabilityRef}
            relationshipRenderer={knowledgeRelationshipRenderer}
          />
        )
      ) : (
        <StructuralPlaceholder
          view="knowledge"
          title="Цель"
          description="Сначала зафиксируйте цель, затем исследуйте знания."
          recoveryReason={
            recoveryReason ??
            "Сначала зафиксируйте цель подготовки."
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
            view="activity"
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
            view="evidence-change"
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
          view="prepare-support"
          title="Цель"
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

  const currentLocationLabel = destinationLabels[navigation.destination];
  const focusStatus =
    activeFocus?.purpose ?? (activeFocusRef ? "выбран" : "не выбран");

  return (
    <ApplicationShell
      className="preparation-shell preparation-shell--admin"
      data-destination={navigation.destination}
      contentClassName="active-child"
      sidebar={
        <aside className="app-sidebar">
          <div className="sidebar-brand-row">
            <a
              className="brand"
              href="/"
              onClick={(event) => event.preventDefault()}
            >
              Prep
            </a>
            <span className="prototype-label">prototype</span>
          </div>

          <nav className="prep-navigation" aria-label="Подготовка">
            {navigationItems.map((item) => (
              <button
                type="button"
                key={item.destination}
                aria-current={
                  navigation.destination === item.destination
                    ? "page"
                    : undefined
                }
                onClick={() => navigate({ destination: item.destination })}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <section
            className="active-context"
            aria-label="Текущий контекст подготовки"
          >
            <div>
              <span>Цель</span>
              <strong>{activeTarget?.label ?? "не выбрана"}</strong>
            </div>
            <div>
              <span>Фокус</span>
              <strong>{focusStatus}</strong>
            </div>
          </section>
        </aside>
      }
      topBar={
        <ShellTopBar
          breadcrumbs={[
            { label: "Подготовка" },
            { label: currentLocationLabel },
          ]}
        />
      }
      statusBar={
        <ShellStatusBar
          leading={[
            {
              label: "Цель",
              value: activeTarget?.label ?? "не выбрана",
            },
          ]}
          trailing={[
            {
              label: "Фокус",
              value: focusStatus,
            },
          ]}
        />
      }
    >
      {child}
    </ApplicationShell>
  );
}
