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
          "Сначала выберите цель, затем можно анализировать свидетельства и изменения после активности.",
      };
    }

    if (!request.activityAttemptRef) {
      return context.activeFocusRef
        ? {
            destination: "activity",
            recoveryReason:
              "Сначала завершите активность так, чтобы её результат можно было проверить.",
          }
        : {
            destination: "current",
            recoveryReason:
              "Сначала выберите следующий фокус и завершите активность.",
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
        "Сначала выберите или зафиксируйте цель подготовки.",
    };
  }

  if (!context.activeTargetRef) {
    return {
      destination: "target",
      recoveryReason:
        "Сначала зафиксируйте цель подготовки.",
    };
  }

  if (request.destination === "activity" && !context.activeFocusRef) {
    return {
      destination: "current",
      recoveryReason:
        "Перед началом активности выберите следующий фокус.",
    };
  }

  return request;
}
