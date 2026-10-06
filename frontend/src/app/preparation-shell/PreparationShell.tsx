import { type ReactNode, useState } from "react";

import type { TargetDirectionPort, CandidateTargetOption } from "../../features/target-direction/contract";
import { TargetDirectionFeature } from "../../features/target-direction/TargetDirectionFeature";
import type { TargetPort } from "../../features/target/contract";
import { TargetFeature } from "../../features/target/TargetFeature";
import type { TargetRef } from "../../features/contracts";
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
  { destination: "targets", label: "Targets" },
  { destination: "target", label: "Target" },
  { destination: "current", label: "Current position" },
  { destination: "knowledge", label: "Knowledge" },
  { destination: "activity", label: "Activity" },
];

export interface PreparationShellProps {
  readonly targetDirectionPort: TargetDirectionPort;
  readonly targetPort: TargetPort;
  readonly candidateTargets: readonly CandidateTargetOption[];
}

function StructuralPlaceholder({
  title,
  description,
  recoveryReason,
  candidateTarget,
}: {
  readonly title: string;
  readonly description: string;
  readonly recoveryReason?: string | undefined;
  readonly candidateTarget?: CandidateTargetOption | undefined;
}) {
  return (
    <section className="task-view structural-placeholder" data-view={title.toLowerCase()}>
      <p className="eyebrow">Structural destination</p>
      <h1>{title}</h1>
      {recoveryReason ? (
        <p className="recovery-message" role="status">
          {recoveryReason}
        </p>
      ) : null}
      {candidateTarget ? (
        <div className="candidate-continuation">
          <strong>Candidate: {candidateTarget.label}</strong>
          <p>
            This candidate has not become the active Target. Establishment is
            implemented in the next slice.
          </p>
        </div>
      ) : null}
      <p>{description}</p>
      <p className="supporting-text">
        This task surface is intentionally not implemented in FI-02.
      </p>
    </section>
  );
}

export function PreparationShell({
  targetDirectionPort,
  targetPort,
  candidateTargets,
}: PreparationShellProps) {
  const {
    activeTargetRef,
    activeFocusRef,
    setAcceptedTarget,
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
    });
    setRecoveryReason(resolved.recoveryReason ?? null);
  }

  function candidateFor(ref?: TargetRef) {
    return ref
      ? candidateTargets.find((candidate) => candidate.targetRef === ref)
      : undefined;
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
          onAcceptedTarget={(target) => {
            setAcceptedTarget(target.targetRef);
            setRecoveryReason(null);
          }}
          onExploreKnowledge={(requiredCapabilityRef) =>
            navigate({ destination: "knowledge", requiredCapabilityRef })
          }
          onRequestPreparationSupport={(candidateTargetRef) =>
            navigate({ destination: "prepare-support", candidateTargetRef })
          }
          onReconsiderDirection={() => navigate({ destination: "targets" })}
        />
      );
      break;
    case "current":
      child = (
        <StructuralPlaceholder
          title="Current position"
          description="Review evidence-backed state, gaps, uncertainty, and choose the Next focus."
          recoveryReason={recoveryReason ?? undefined}
        />
      );
      break;
    case "knowledge":
      child = (
        <StructuralPlaceholder
          title="Knowledge"
          description={
            navigation.requiredCapabilityRef
              ? "Explore Subject Knowledge scoped to the selected Required Capability."
              : "Explore target-relevant Subject Knowledge and semantic relationships."
          }
          recoveryReason={recoveryReason ?? undefined}
        />
      );
      break;
    case "activity":
      child = (
        <StructuralPlaceholder
          title="Activity"
          description="Select suitable support and carry out one preparation activity."
          recoveryReason={recoveryReason ?? undefined}
        />
      );
      break;
    case "prepare-support":
      child = (
        <StructuralPlaceholder
          title="Prepare Support"
          description="Resolve a contextual missing-support need and return to the originating Target work."
          recoveryReason={recoveryReason ?? undefined}
          candidateTarget={candidateFor(
            navigation.candidateTargetRef ?? activeTargetRef ?? undefined,
          )}
        />
      );
      break;
  }

  return (
    <div className="preparation-shell">
      <header className="shell-header">
        <a className="brand" href="/" onClick={(event) => event.preventDefault()}>
          Prep
        </a>
        <span className="prototype-label">Usability prototype</span>
      </header>

      <nav className="prep-navigation" aria-label="Preparation">
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

      <section className="active-context" aria-label="Active preparation context">
        <div>
          <span>Active Target</span>
          <strong>{activeTarget?.label ?? "Not established"}</strong>
        </div>
        <div>
          <span>Next focus</span>
          <strong>{activeFocusRef ? "Selected" : "Not selected"}</strong>
        </div>
      </section>

      <main className="active-child">{child}</main>
    </div>
  );
}
