import type {
  DiagnosticEvidenceAcceptanceModel,
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
  private readonly acceptedCapabilityEvidence = new Set<string>();
  private readonly challengedCapabilityEvidence = new Set<string>();
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
        .flatMap((assessment) =>
          assessment.capabilityIds
            .filter(
              (capabilityId) =>
                targetCapabilities.has(capabilityId) &&
                (!selectedCapabilityId || capabilityId === selectedCapabilityId),
            )
            .map((capabilityId) => ({
              id: `diagnostic-${assessment.id}`,
              gapId: `gap-${capabilityId}`,
              capabilityId,
              title: assessment.title,
              summary: assessment.taskSummary,
            })),
        ),
    };
  }

  async acceptDiagnosticEvidence(
    targetId: string,
    diagnosticId: string,
    capabilityId: string,
  ): Promise<LearningOutcome<DiagnosticEvidenceAcceptanceModel>> {
    if (!this.targetExists(targetId)) {
      return { status: "not_found", message: "Target state not found." };
    }

    const assessmentId = diagnosticId.replace(/^diagnostic-/, "");
    const assessment = this.store.assessmentDesigns.find(
      (candidate) => candidate.id === assessmentId,
    );
    if (
      !assessment ||
      !assessment.capabilityIds.includes(capabilityId) ||
      !this.capabilityIds(targetId).includes(capabilityId)
    ) {
      return { status: "not_found", message: "Diagnostic evidence target not found." };
    }

    if (assessment.evidenceBearing === "challenges") {
      this.challengedCapabilityEvidence.add(capabilityId);
    } else {
      this.acceptedCapabilityEvidence.add(capabilityId);
    }
    const capability = this.store.capabilities.find(
      (candidate) => candidate.id === capabilityId,
    );

    return {
      status: "success",
      value: {
        diagnosticId,
        observation: {
          id: `observation-${assessment.id}-accepted`,
          summary:
            "The mock diagnostic produced the observation pattern required by its assessment design.",
          provenance: "Prep mock diagnostic",
        },
        evidenceArgument: {
          capabilityId,
          bearing: assessment.evidenceBearing,
          summary:
            assessment.evidenceBearing === "challenges"
              ? `Accepted assessment semantics materially challenge the current positive learner claim for ${capability?.title ?? capabilityId}.`
              : `Accepted assessment semantics support the current positive learner claim for ${capability?.title ?? capabilityId}.`,
        },
        claimProjection: {
          summary:
            assessment.evidenceBearing === "challenges"
              ? "The positive learner claim remains explicit, but unresolved challenging evidence prevents it from establishing target satisfaction."
              : "A current positive learner claim is supported by the accepted evidence argument for the represented conditions.",
        },
        state: this.state(targetId),
      },
    };
  }

  async getProgress(
    targetId: string,
  ): Promise<LearningOutcome<ProgressComparisonModel>> {
    if (!this.targetExists(targetId)) {
      return { status: "not_found", message: "Target progress not found." };
    }

    const currentState = this.state(targetId);
    const changes = this.capabilities(targetId).flatMap((capability) => {
      const before = INITIAL_EVIDENCE[capability.id]?.state ?? "unresolved";
      const after =
        currentState.items.find((item) => item.requirementId === capability.id)?.state ??
        before;
      if (before === after) return [];
      return [
        {
          requirementId: capability.id,
          title: capability.title,
          before,
          after,
          evidenceSummary:
            after === "challenged"
              ? "New accepted diagnostic evidence materially challenges previously established satisfaction."
              : "New accepted diagnostic evidence supports the target-required capability in the represented conditions.",
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
        targetRefinement: {
          changed: false,
          summary:
            "No target-definition change was accepted in this comparison. Learner-state change is shown separately from target refinement.",
        },
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

        if (this.challengedCapabilityEvidence.has(capability.id)) {
          return {
            requirementId: capability.id,
            title: capability.title,
            summary: capability.performanceExpectation,
            state: "challenged",
            basis: [
              {
                id: `evidence-diagnostic-challenge-${capability.id}`,
                summary:
                  "Accepted diagnostic evidence materially challenges the current positive learner-capability claim for this requirement.",
                provenance: "Prep mock diagnostic evidence",
              },
            ],
          };
        }

        if (this.acceptedCapabilityEvidence.has(capability.id)) {
          return {
            requirementId: capability.id,
            title: capability.title,
            summary: capability.performanceExpectation,
            state: "satisfied",
            basis: [
              {
                id: `evidence-diagnostic-${capability.id}`,
                summary:
                  "Accepted diagnostic evidence supports the current learner-capability claim for this target requirement.",
                provenance: "Prep mock diagnostic evidence",
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
        this.acceptedCapabilityEvidence.size > 0 ||
        this.challengedCapabilityEvidence.size > 0
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
