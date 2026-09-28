import type {
  DiagnosticOpportunityModel,
  GapModel,
  LearningFocusModel,
  LearningSupportModel,
  ProgressComparisonModel,
  TargetRequirementState,
  TargetStateItemModel,
  TargetStateModel,
} from "../../features/learning/model/targetWork";
import type { TargetWorkPort } from "../../features/learning/ports/TargetWorkPort";
import type { LearningOutcome } from "../../features/learning/ports/learningOutcome";
import {
  createMockCurationStore,
  type MockCurationStore,
} from "./MockCurationStore";

interface InitialEvidenceState {
  readonly state: TargetRequirementState;
  readonly basis: TargetStateItemModel["basis"];
}

const INITIAL_EVIDENCE: Readonly<Record<string, InitialEvidenceState>> = {
  "cap-python-backend": {
    state: "satisfied",
    basis: [
      {
        id: "evidence-python-backend",
        summary: "Repeated successful backend design and debugging evidence.",
        provenance: "Imported work-history evidence",
      },
    ],
  },
  "cap-payment-reliability": {
    state: "challenged",
    basis: [
      {
        id: "evidence-idempotency-challenge",
        summary:
          "Diagnostic answer missed duplicate-side-effect protection during retries.",
        provenance: "Prep diagnostic",
      },
    ],
  },
};

export class MockTargetWorkAdapter implements TargetWorkPort {
  private readonly completedCapabilityDiagnostics = new Set<string>();
  private readonly focusByTarget = new Map<string, LearningFocusModel>();

  constructor(
    private readonly store: MockCurationStore = createMockCurationStore(),
  ) {}

  async getState(targetId: string): Promise<LearningOutcome<TargetStateModel>> {
    if (!this.targetExists(targetId)) {
      return { status: "not_found", message: "Target state not found." };
    }
    return { status: "success", value: this.state(targetId) };
  }

  async getGaps(targetId: string): Promise<LearningOutcome<readonly GapModel[]>> {
    const stateOutcome = await this.getState(targetId);
    if (stateOutcome.status !== "success") return stateOutcome;

    const gaps = stateOutcome.value.items.flatMap((item): GapModel[] => {
      if (item.state === "satisfied") return [];
      return [
        {
          id: `gap-${item.requirementId}`,
          requirementId: item.requirementId,
          title: item.title,
          kind: item.state,
          summary: item.summary,
          basis:
            item.basis.length > 0
              ? item.basis.map((basis) => basis.summary).join(" ")
              : "No sufficient evidence currently establishes this requirement.",
          support: this.store.learningSupport.some((support) =>
            support.capabilityIds.includes(item.requirementId),
          )
            ? "available"
            : "missing",
        },
      ];
    });
    return { status: "success", value: gaps };
  }

  async getFocus(
    targetId: string,
  ): Promise<LearningOutcome<LearningFocusModel | null>> {
    if (!this.targetExists(targetId)) {
      return { status: "not_found", message: "Target focus not found." };
    }
    return {
      status: "success",
      value: this.focusByTarget.get(targetId) ?? null,
    };
  }

  async setFocus(
    targetId: string,
    input: {
      readonly gapId: string;
      readonly intentKind: "learning" | "diagnostic";
      readonly rationale?: string;
    },
  ): Promise<LearningOutcome<LearningFocusModel>> {
    const gaps = await this.getGaps(targetId);
    if (gaps.status !== "success") return gaps;

    const gap = gaps.value.find((candidate) => candidate.id === input.gapId);
    if (!gap) {
      return { status: "not_found", message: "Gap not found." };
    }

    const focus: LearningFocusModel = {
      id: `focus-${gap.requirementId}`,
      gapId: gap.id,
      title: gap.title,
      intentKind: input.intentKind,
      rationale:
        input.rationale ??
        (input.intentKind === "diagnostic"
          ? "Reduce important uncertainty before choosing what to learn."
          : "Work on a target-relative capability gap."),
    };
    this.focusByTarget.set(targetId, focus);
    return { status: "success", value: focus };
  }

  async listSupport(
    targetId: string,
    focusId: string,
  ): Promise<LearningOutcome<readonly LearningSupportModel[]>> {
    if (!this.targetExists(targetId)) {
      return { status: "not_found", message: "Target support not found." };
    }

    const capabilityId = focusId.replace(/^focus-/, "");
    if (!this.capabilityIds(targetId).includes(capabilityId)) {
      return { status: "not_found", message: "Focused capability not found." };
    }

    return {
      status: "success",
      value: this.store.learningSupport
        .filter((support) => support.capabilityIds.includes(capabilityId))
        .map((support) => ({
          id: support.id,
          title: support.title,
          kind: support.kind,
          summary: support.summary,
        })),
    };
  }

  async listDiagnostics(
    targetId: string,
    gapId?: string,
  ): Promise<LearningOutcome<readonly DiagnosticOpportunityModel[]>> {
    if (!this.targetExists(targetId)) {
      return { status: "not_found", message: "Target diagnostics not found." };
    }

    const targetCapabilities = new Set(this.capabilityIds(targetId));
    const selectedCapabilityId = gapId?.replace(/^gap-/, "");

    return {
      status: "success",
      value: this.store.assessmentDesigns
        .filter((assessment) =>
          assessment.capabilityIds.some(
            (capabilityId) =>
              targetCapabilities.has(capabilityId) &&
              (!selectedCapabilityId || capabilityId === selectedCapabilityId),
          ),
        )
        .map((assessment) => ({
          id: `diagnostic-${assessment.id}`,
          gapId: `gap-${
            assessment.capabilityIds.find((id) => targetCapabilities.has(id)) ?? ""
          }`,
          title: assessment.title,
          summary: assessment.taskSummary,
        })),
    };
  }

  async completeDiagnostic(
    targetId: string,
    diagnosticId: string,
  ): Promise<LearningOutcome<TargetStateModel>> {
    if (!this.targetExists(targetId)) {
      return { status: "not_found", message: "Target state not found." };
    }

    const assessmentId = diagnosticId.replace(/^diagnostic-/, "");
    const assessment = this.store.assessmentDesigns.find(
      (candidate) => candidate.id === assessmentId,
    );
    if (!assessment) {
      return { status: "not_found", message: "Diagnostic not found." };
    }

    const targetCapabilities = new Set(this.capabilityIds(targetId));
    for (const capabilityId of assessment.capabilityIds) {
      if (targetCapabilities.has(capabilityId)) {
        this.completedCapabilityDiagnostics.add(capabilityId);
      }
    }

    return { status: "success", value: this.state(targetId) };
  }

  async getProgress(
    targetId: string,
  ): Promise<LearningOutcome<ProgressComparisonModel>> {
    if (!this.targetExists(targetId)) {
      return { status: "not_found", message: "Target progress not found." };
    }

    const capabilities = this.capabilities(targetId);
    const changes = capabilities.flatMap((capability) => {
      if (!this.completedCapabilityDiagnostics.has(capability.id)) return [];
      const before = INITIAL_EVIDENCE[capability.id]?.state ?? "unresolved";
      if (before === "satisfied") return [];
      return [
        {
          requirementId: capability.id,
          title: capability.title,
          before,
          after: "satisfied" as const,
          evidenceSummary:
            "New diagnostic evidence now supports the target-required capability in this mock scenario.",
        },
      ];
    });

    const changed = changes.length > 0;
    return {
      status: "success",
      value: {
        targetId,
        fromProjectionId: "state-initial",
        toProjectionId: changed ? "state-after-diagnostic" : "state-initial",
        changes,
        summary: changed
          ? `${changes.length} target requirement(s) changed after new diagnostic evidence.`
          : "No target-relative state change is established yet.",
      },
    };
  }

  private state(targetId: string): TargetStateModel {
    const items = this.capabilities(targetId).map(
      (capability): TargetStateItemModel => {
        const initial = INITIAL_EVIDENCE[capability.id] ?? {
          state: "unresolved" as const,
          basis: [],
        };

        if (this.completedCapabilityDiagnostics.has(capability.id)) {
          return {
            requirementId: capability.id,
            title: capability.title,
            summary: capability.performanceExpectation,
            state: "satisfied",
            basis: [
              ...initial.basis,
              {
                id: `evidence-diagnostic-${capability.id}`,
                summary:
                  "A completed mock diagnostic now supplies accepted supporting evidence for this capability.",
                provenance: "Prep diagnostic",
              },
            ],
          };
        }

        return {
          requirementId: capability.id,
          title: capability.title,
          summary: capability.performanceExpectation,
          state: initial.state,
          basis: initial.basis,
        };
      },
    );

    return {
      targetId,
      projectionId:
        this.completedCapabilityDiagnostics.size > 0
          ? "state-after-diagnostic"
          : "state-initial",
      items,
    };
  }

  private targetExists(targetId: string): boolean {
    return this.store.targets.some((target) => target.id === targetId);
  }

  private capabilityIds(targetId: string): readonly string[] {
    return this.store.targetCapabilityIds.get(targetId) ?? [];
  }

  private capabilities(targetId: string) {
    const ids = new Set(this.capabilityIds(targetId));
    return this.store.capabilities.filter((capability) => ids.has(capability.id));
  }
}
