import type { FocusRef, TargetRef } from "../../features/contracts";

export type PreparationDestination =
  | "targets"
  | "target"
  | "current"
  | "knowledge"
  | "activity";

export interface PreparationNavigationRequest {
  readonly destination: PreparationDestination;
  readonly candidateTargetRef?: TargetRef;
}

export interface PreparationNavigationContext {
  readonly activeTargetRef: TargetRef | null;
  readonly activeFocusRef: FocusRef | null;
}

export interface ResolvedPreparationNavigation extends PreparationNavigationRequest {
  readonly recoveryReason?: string;
}

export function resolvePreparationNavigation(
  request: PreparationNavigationRequest,
  context: PreparationNavigationContext,
): ResolvedPreparationNavigation {
  if (request.destination === "targets" || request.destination === "target") {
    return request;
  }

  if (!context.activeTargetRef) {
    return {
      destination: "target",
      recoveryReason:
        "Establish a Target before entering Target-dependent preparation work.",
    };
  }

  if (request.destination === "activity" && !context.activeFocusRef) {
    return {
      destination: "current",
      recoveryReason:
        "Choose a Next focus before starting an Activity.",
    };
  }

  return request;
}
