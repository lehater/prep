import type {
  ActivityAttemptRef,
  CapabilityRef,
  FocusRef,
  TargetRef,
} from "../../features/contracts";

export type PrepareSupportReturnDestination = "target" | "current" | "activity";

export type PreparationDestination =
  | "targets"
  | "target"
  | "current"
  | "knowledge"
  | "activity"
  | "evidence-change"
  | "prepare-support";

export interface PreparationNavigationRequest {
  readonly destination: PreparationDestination;
  readonly candidateTargetRef?: TargetRef;
  readonly requiredCapabilityRef?: CapabilityRef;
  readonly activityAttemptRef?: ActivityAttemptRef;
  readonly returnDestination?: PrepareSupportReturnDestination;
  readonly motivatingContext?: string;
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

  if (request.destination === "evidence-change") {
    if (!context.activeTargetRef) {
      return {
        destination: "target",
        recoveryReason:
          "Establish a Target before reviewing Activity evidence and changes.",
      };
    }

    if (!request.activityAttemptRef) {
      return context.activeFocusRef
        ? {
            destination: "activity",
            recoveryReason:
              "Complete a reviewable Activity attempt before opening Evidence & changes.",
          }
        : {
            destination: "current",
            recoveryReason:
              "Choose a Next focus and complete an Activity before opening Evidence & changes.",
          };
    }

    return request;
  }

  if (request.destination === "prepare-support") {
    if (context.activeTargetRef || request.candidateTargetRef) {
      return request;
    }
    return {
      destination: "target",
      recoveryReason:
        "Choose or establish a Target context before requesting preparation support.",
    };
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
