import type {
  DiagnosticOpportunityModel,
  GapModel,
  LearningFocusModel,
  LearningSupportModel,
  ProgressComparisonModel,
  TargetStateItemModel,
  TargetStateModel,
} from "../../features/learning/model/targetWork";
import type { TargetWorkPort } from "../../features/learning/ports/TargetWorkPort";
import type { LearningOutcome } from "../../features/learning/ports/learningOutcome";
import { PREPARED_TARGET_ID } from "./mockFixtures";

const INITIAL_ITEMS: readonly TargetStateItemModel[] = [
  {
    requirementId: "python-backend-core",
    title: "Build and reason about Python backend services",
    summary: "Design, implement and explain production Python backend behavior.",
    state: "satisfied",
    basis: [
      {
        id: "evidence-python-backend",
        summary: "Repeated successful backend design and debugging evidence.",
        provenance: "Imported work-history evidence",
      },
    ],
  },
  {
    requirementId: "card-payment-processing",
    title: "Explain the card-payment processing chain",
    summary: "Explain gateway, processor, acquiring, clearing and settlement responsibilities.",
    state: "unresolved",
    basis: [],
  },
  {
    requirementId: "reliable-payment-commands",
    title: "Design reliable payment commands",
    summary: "Handle retries, duplicate delivery and idempotent payment-side effects.",
    state: "challenged",
    basis: [
      {
        id: "evidence-idempotency-challenge",
        summary: "Diagnostic answer missed duplicate-side-effect protection during retries.",
        provenance: "Prep diagnostic",
      },
    ],
  },
  {
    requirementId: "payment-reconciliation",
    title: "Reason about payment reconciliation",
    summary: "Detect and resolve mismatches between internal and external financial records.",
    state: "unresolved",
    basis: [],
  },
];

const SUPPORT: Readonly<Record<string, readonly LearningSupportModel[]>> = {
  "reliable-payment-commands": [
    {
      id: "support-idempotency",
      title: "Idempotency and retry safety",
      kind: "material",
      summary: "Review idempotency keys, bounded retry policy and duplicate-side-effect prevention.",
    },
    {
      id: "practice-retry-design",
      title: "Design a retry-safe payment endpoint",
      kind: "practice",
      summary: "Work through a payment-command design with retries and duplicate delivery.",
    },
  ],
  "card-payment-processing": [
    {
      id: "support-card-chain",
      title: "Card processing chain",
      kind: "material",
      summary: "Review gateway, processor, acquiring, clearing and settlement relationships.",
    },
  ],
};

const DIAGNOSTICS: readonly DiagnosticOpportunityModel[] = [
  {
    id: "diagnostic-idempotency",
    gapId: "gap-reliable-payment-commands",
    title: "Retry-safe payment command",
    summary: "Explain how an idempotency key prevents duplicate payment side effects across retries.",
  },
  {
    id: "diagnostic-card-chain",
    gapId: "gap-card-payment-processing",
    title: "Card-processing chain check",
    summary: "Place gateway, processor, acquirer, clearing and settlement in the correct responsibility chain.",
  },
];

export class MockTargetWorkAdapter implements TargetWorkPort {
  private completedIdempotencyDiagnostic = false;
  private focus: LearningFocusModel | null = null;

  async getState(targetId: string): Promise<LearningOutcome<TargetStateModel>> {
    if (targetId !== PREPARED_TARGET_ID) {
      return { status: "not_found", message: "Target state not found." };
    }
    return { status: "success", value: this.state() };
  }

  async getGaps(targetId: string): Promise<LearningOutcome<readonly GapModel[]>> {
    if (targetId !== PREPARED_TARGET_ID) {
      return { status: "not_found", message: "Target gaps not found." };
    }
    const gaps = this.state().items.flatMap((item): GapModel[] => {
      if (item.state === "satisfied") return [];
      return [{
        id: `gap-${item.requirementId}`,
        requirementId: item.requirementId,
        title: item.title,
        kind: item.state,
        summary: item.summary,
        basis:
          item.basis.length > 0
            ? item.basis.map((basis) => basis.summary).join(" ")
            : "No sufficient evidence currently establishes this requirement.",
        support: item.requirementId === "payment-reconciliation" ? "missing" : "available",
      }];
    });
    return { status: "success", value: gaps };
  }

  async getFocus(targetId: string): Promise<LearningOutcome<LearningFocusModel | null>> {
    if (targetId !== PREPARED_TARGET_ID) {
      return { status: "not_found", message: "Target focus not found." };
    }
    return { status: "success", value: this.focus };
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
    this.focus = {
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
    return { status: "success", value: this.focus };
  }

  async listSupport(
    targetId: string,
    focusId: string,
  ): Promise<LearningOutcome<readonly LearningSupportModel[]>> {
    if (targetId !== PREPARED_TARGET_ID) {
      return { status: "not_found", message: "Target support not found." };
    }
    const requirementId = focusId.replace(/^focus-/, "");
    return { status: "success", value: SUPPORT[requirementId] ?? [] };
  }

  async listDiagnostics(
    targetId: string,
    gapId?: string,
  ): Promise<LearningOutcome<readonly DiagnosticOpportunityModel[]>> {
    if (targetId !== PREPARED_TARGET_ID) {
      return { status: "not_found", message: "Target diagnostics not found." };
    }
    return {
      status: "success",
      value: gapId ? DIAGNOSTICS.filter((item) => item.gapId === gapId) : DIAGNOSTICS,
    };
  }

  async completeDiagnostic(
    targetId: string,
    diagnosticId: string,
  ): Promise<LearningOutcome<TargetStateModel>> {
    if (targetId !== PREPARED_TARGET_ID) {
      return { status: "not_found", message: "Target state not found." };
    }
    if (diagnosticId !== "diagnostic-idempotency") {
      return { status: "success", value: this.state() };
    }
    this.completedIdempotencyDiagnostic = true;
    return { status: "success", value: this.state() };
  }

  async getProgress(targetId: string): Promise<LearningOutcome<ProgressComparisonModel>> {
    if (targetId !== PREPARED_TARGET_ID) {
      return { status: "not_found", message: "Target progress not found." };
    }
    const changes = this.completedIdempotencyDiagnostic
      ? [{
          requirementId: "reliable-payment-commands",
          title: "Design reliable payment commands",
          before: "challenged" as const,
          after: "satisfied" as const,
          evidenceSummary: "The retry-safe payment diagnostic now supports the required idempotency behavior.",
        }]
      : [];
    return {
      status: "success",
      value: {
        targetId,
        fromProjectionId: "state-initial",
        toProjectionId: this.completedIdempotencyDiagnostic ? "state-after-diagnostic" : "state-initial",
        changes,
        summary:
          changes.length > 0
            ? "One target requirement changed after new diagnostic evidence."
            : "No target-relative state change is established yet.",
      },
    };
  }

  private state(): TargetStateModel {
    const items = INITIAL_ITEMS.map((item) => {
      if (
        item.requirementId === "reliable-payment-commands" &&
        this.completedIdempotencyDiagnostic
      ) {
        return {
          ...item,
          state: "satisfied" as const,
          basis: [
            ...item.basis,
            {
              id: "evidence-idempotency-success",
              summary: "Retry-safe payment diagnostic demonstrated correct idempotency reasoning.",
              provenance: "Prep diagnostic",
            },
          ],
        };
      }
      return item;
    });
    return {
      targetId: PREPARED_TARGET_ID,
      projectionId: this.completedIdempotencyDiagnostic ? "state-after-diagnostic" : "state-initial",
      items,
    };
  }
}
