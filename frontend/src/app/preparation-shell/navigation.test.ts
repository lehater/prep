import { describe, expect, it } from "vitest";

import { ref } from "../../features/contracts";
import { resolvePreparationNavigation } from "./navigation";

describe("Preparation Shell topology routing", () => {
  it("allows Targets and Target without active semantic context", () => {
    const context = { activeTargetRef: null, activeFocusRef: null };

    expect(
      resolvePreparationNavigation({ destination: "targets" }, context),
    ).toEqual({ destination: "targets" });
    expect(
      resolvePreparationNavigation(
        {
          destination: "target",
          candidateTargetRef: ref<"target">("target:candidate"),
        },
        context,
      ),
    ).toEqual({
      destination: "target",
      candidateTargetRef: "target:candidate",
    });
  });

  it("routes Target-dependent destinations to Target when Target context is missing", () => {
    const context = { activeTargetRef: null, activeFocusRef: null };

    for (const destination of ["current", "knowledge", "activity"] as const) {
      expect(resolvePreparationNavigation({ destination }, context)).toEqual({
        destination: "target",
        recoveryReason:
          "Establish a Target before entering Target-dependent preparation work.",
      });
    }
  });

  it("allows Knowledge with Target only but routes Activity to Current when focus is missing", () => {
    const context = {
      activeTargetRef: ref<"target">("target:active"),
      activeFocusRef: null,
    };

    expect(
      resolvePreparationNavigation({ destination: "knowledge" }, context),
    ).toEqual({ destination: "knowledge" });
    expect(
      resolvePreparationNavigation({ destination: "activity" }, context),
    ).toEqual({
      destination: "current",
      recoveryReason: "Choose a Next focus before starting an Activity.",
    });
  });

  it("preserves contextual Prepare Support entry from active or candidate Target context", () => {
    const noTarget = { activeTargetRef: null, activeFocusRef: null };
    expect(
      resolvePreparationNavigation({ destination: "prepare-support" }, noTarget),
    ).toEqual({
      destination: "target",
      recoveryReason:
        "Choose or establish a Target context before requesting preparation support.",
    });

    const candidateTargetRef = ref<"target">("target:candidate");
    expect(
      resolvePreparationNavigation(
        { destination: "prepare-support", candidateTargetRef },
        noTarget,
      ),
    ).toEqual({ destination: "prepare-support", candidateTargetRef });

    const target = {
      activeTargetRef: ref<"target">("target:active"),
      activeFocusRef: null,
    };
    expect(
      resolvePreparationNavigation({ destination: "prepare-support" }, target),
    ).toEqual({ destination: "prepare-support" });
  });

  it("preserves Prepare Support origin and motivating context through topology resolution", () => {
    const target = {
      activeTargetRef: ref<"target">("target:active"),
      activeFocusRef: ref<"focus">("focus:active"),
    };

    expect(
      resolvePreparationNavigation(
        {
          destination: "prepare-support",
          candidateTargetRef: target.activeTargetRef,
          returnDestination: "activity",
          motivatingContext: "No suitable support is currently prepared.",
        },
        target,
      ),
    ).toEqual({
      destination: "prepare-support",
      candidateTargetRef: "target:active",
      returnDestination: "activity",
      motivatingContext: "No suitable support is currently prepared.",
    });
  });

  it("allows Activity only when active Target and focus both exist", () => {
    const context = {
      activeTargetRef: ref<"target">("target:active"),
      activeFocusRef: ref<"focus">("focus:active"),
    };

    expect(
      resolvePreparationNavigation({ destination: "activity" }, context),
    ).toEqual({ destination: "activity" });
  });
});
