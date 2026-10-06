import type {
  ActivityCompletionModel,
  ActivityPort,
  ActivityAttemptModel,
  CompleteActivityInput,
  ListSupportInput,
  StartActivityInput,
  SupportModel,
} from "../../features/activity/contract";
import type {
  CurrentPositionPort,
  CurrentStateModel,
  EvidenceModel,
  FocusModel,
  GapProjectionModel,
  SetFocusInput,
} from "../../features/current-position/contract";
import type {
  ChangeModel,
  EvidenceChangePort,
  GetChangeInput,
} from "../../features/evidence-change/contract";
import type {
  KnowledgePort,
  KnowledgeProjectionModel,
  KnowledgeQueryInput,
} from "../../features/knowledge-explorer/contract";
import type {
  PreparationRequestModel,
  PreparationSupportPort,
  RequestPreparationInput,
} from "../../features/preparation-support/contract";
import type {
  CompareTargetsInput,
  ComparedTargetModel,
  TargetComparisonModel,
  TargetDirectionPort,
} from "../../features/target-direction/contract";
import type {
  EstablishTargetInput,
  TargetModel,
  TargetPort,
  TargetRequirementModel,
} from "../../features/target/contract";
import type {
  CapabilityRef,
  EvidenceRef,
  FocusRef,
  Limitation,
  PreparationRequestRef,
  Provenance,
  SemanticBasisRef,
  SemanticOutcome,
  TargetRef,
} from "../../features/contracts";
import { mockScenarioRefs, rawMockScenario } from "./scenario";

function accepted<Value>(
  value: Value,
  basisRef: SemanticBasisRef = mockScenarioRefs.basis,
): SemanticOutcome<Value> {
  return {
    status: "accepted",
    projection: {
      value,
      basisRef,
      currentness: "current",
    },
  };
}

function rejected<Value>(message: string): SemanticOutcome<Value> {
  return {
    status: "rejected",
    message,
    currentBasisRef: mockScenarioRefs.basis,
  };
}

function coverageLimit(detail: string): Limitation {
  return { kind: "coverage", detail };
}

function provenance(
  label: string,
  sourceRef: Provenance["sourceRef"],
): Provenance {
  return sourceRef ? { label, sourceRef } : { label };
}

function targetByRef(targetRef: TargetRef) {
  return rawMockScenario.targets.find((target) => target.recordId === targetRef);
}

function stateRows(targetRef: TargetRef) {
  if (targetRef === mockScenarioRefs.targetPrimary) {
    return rawMockScenario.states.primary;
  }
  if (targetRef === mockScenarioRefs.targetAlternative) {
    return rawMockScenario.states.alternative;
  }
  return null;
}

function mapComparedTarget(targetRef: TargetRef): ComparedTargetModel | null {
  const target = targetByRef(targetRef);
  const rows = stateRows(targetRef);
  if (!target || !rows) {
    return null;
  }

  const relevantGapRows =
    targetRef === mockScenarioRefs.targetPrimary
      ? rawMockScenario.gaps
      : [
          {
            gapId: mockScenarioRefs.gapKubernetes,
            requirementId: mockScenarioRefs.requirementKubernetes,
            capabilityId: mockScenarioRefs.capabilityKubernetes,
            statusCode: "unresolved" as const,
            reasonText: "No Kubernetes-specific learner evidence is available.",
            targetRelevanceText: "Platform-specific target requirement.",
            priorityText: "Material if the platform role remains selected.",
            supportCode: "missing" as const,
          },
        ];

  return {
    targetRef: target.recordId,
    label: target.title,
    purpose: target.purposeText,
    requirementRefs: target.requirementIds,
    sharedCapabilityRefs: target.sharedCapabilityIds,
    targetSpecificCapabilityRefs: target.specificCapabilityIds,
    currentState: rows.map((row) => ({
      capabilityRef: row.capabilityId,
      state: row.stateCode,
      evidenceRefs: row.evidenceIds,
      limitations: row.limitationTexts.map(coverageLimit),
    })),
    gaps: relevantGapRows.map((row) => ({
      gapRef: row.gapId,
      capabilityRef: row.capabilityId,
      status: row.statusCode,
    })),
    uncertainty: target.uncertaintyNotes,
  };
}

function mapSupport(): SupportModel {
  const support = rawMockScenario.support[0];
  return {
    supportRef: support.supportId,
    label: support.title,
    kind: support.kindCode,
    intendedCapabilityRef: support.capabilityId,
    expectedConditions: support.conditions,
    fitBasis: support.fitText,
    limitations: support.limitationTexts.map(coverageLimit),
  };
}

function mapPreparedSupport(): SupportModel {
  const support = rawMockScenario.preparedSupport;
  return {
    supportRef: support.supportId,
    label: support.title,
    kind: support.kindCode,
    intendedCapabilityRef: support.capabilityId,
    expectedConditions: support.conditions,
    fitBasis: support.fitText,
    limitations: support.limitationTexts.map(coverageLimit),
  };
}

export class MockFrontendAdapter
  implements
    TargetDirectionPort,
    TargetPort,
    CurrentPositionPort,
    KnowledgePort,
    ActivityPort,
    EvidenceChangePort,
    PreparationSupportPort
{
  async compareTargets(
    input: CompareTargetsInput,
  ): Promise<SemanticOutcome<TargetComparisonModel>> {
    const candidates = input.candidateTargetRefs
      .map(mapComparedTarget)
      .filter((candidate): candidate is ComparedTargetModel => candidate !== null);

    if (candidates.length !== input.candidateTargetRefs.length || candidates.length < 2) {
      return rejected("At least two known candidate Targets are required.");
    }

    const tuple: [ComparedTargetModel, ComparedTargetModel, ...ComparedTargetModel[]] = [
      candidates[0],
      candidates[1],
      ...candidates.slice(2),
    ];

    return accepted({
      evidenceBasisRef: mockScenarioRefs.basis,
      candidates: tuple,
      limitations: [
        coverageLimit("Candidate projections share one learner evidence basis; target requirement uncertainty remains explicit."),
      ],
    });
  }

  async establishTarget(
    input: EstablishTargetInput,
  ): Promise<SemanticOutcome<TargetModel>> {
    const target = targetByRef(input.targetRef);
    if (!target) {
      return rejected("Unknown Target.");
    }

    return accepted({
      targetRef: target.recordId,
      label: target.title,
      purpose: target.purposeText,
      uncertainty: target.uncertaintyNotes,
      provenance: [
        provenance(target.source.sourceLabel, target.source.sourceId),
      ],
    });
  }

  async getTargetRequirements(
    targetRef: TargetRef,
  ): Promise<SemanticOutcome<TargetRequirementModel>> {
    const target = targetByRef(targetRef);
    if (!target) {
      return rejected("Unknown Target.");
    }

    const expectations = rawMockScenario.requirements
      .filter((item) => target.requirementIds.includes(item.requirementId))
      .map((item) => ({
        requirementRef: item.requirementId,
        capabilityRef: item.capabilityId,
        performance: item.performanceText,
        conditions: item.conditionTexts,
        qualityCriteria: item.qualityTexts,
        knowledgeFocusRefs: item.knowledgeIds,
      }));

    return accepted({
      targetRef,
      expectations,
      unresolvedExpectations: target.uncertaintyNotes,
      provenance: [
        provenance(target.source.sourceLabel, target.source.sourceId),
      ],
      limitations: target.uncertaintyNotes.map((detail) => ({
        kind: "target-uncertainty" as const,
        detail,
      })),
    });
  }

  async getCurrentState(
    targetRef: TargetRef,
  ): Promise<SemanticOutcome<CurrentStateModel>> {
    const rows = stateRows(targetRef);
    if (!rows) {
      return rejected("Unknown Target.");
    }

    return accepted({
      targetRef,
      capabilities: rows.map((row) => ({
        capabilityRef: row.capabilityId,
        state: row.stateCode,
        evidenceRefs: row.evidenceIds,
        limitations: row.limitationTexts.map(coverageLimit),
      })),
    });
  }

  async getEvidence(
    targetRef: TargetRef,
    evidenceRef?: EvidenceRef,
  ): Promise<SemanticOutcome<EvidenceModel>> {
    if (!targetByRef(targetRef)) {
      return rejected("Unknown Target.");
    }

    const rows = evidenceRef
      ? rawMockScenario.evidence.filter((item) => item.evidenceId === evidenceRef)
      : rawMockScenario.evidence;

    return accepted({
      targetRef,
      facts: rows.map((item) => ({
        evidenceRef: item.evidenceId,
        kind: item.evidenceKind,
        summary: item.text,
        provenance: [
          provenance(item.source.sourceLabel, item.source.sourceId),
        ],
        supportsCapabilityRefs: item.supportIds,
        challengesCapabilityRefs: item.challengeIds,
        limitations: item.limitationTexts.map(coverageLimit),
      })),
    });
  }

  async getGaps(
    targetRef: TargetRef,
  ): Promise<SemanticOutcome<GapProjectionModel>> {
    if (targetRef !== mockScenarioRefs.targetPrimary) {
      return rejected("Gap scenario is only defined for the established Target.");
    }

    return accepted({
      gaps: rawMockScenario.gaps.map((row) => ({
        gapRef: row.gapId,
        requirementRef: row.requirementId,
        capabilityRef: row.capabilityId,
        status: row.statusCode,
        rationale: row.reasonText,
      })),
      decisionContext: {
        targetRef,
        candidates: rawMockScenario.gaps.map((row) => ({
          gapRef: row.gapId,
          capabilityRef: row.capabilityId,
          targetRelevance: row.targetRelevanceText,
          priorityRationale: row.priorityText,
          supportAvailability: row.supportCode,
        })),
        externalConstraints: [
          "Preparation time is bounded; no exact deadline is accepted in the scenario.",
        ],
      },
    });
  }

  async setFocus(
    input: SetFocusInput,
  ): Promise<SemanticOutcome<FocusModel>> {
    if (
      input.targetRef !== mockScenarioRefs.targetPrimary ||
      input.semanticBasisRef !== mockScenarioRefs.basis
    ) {
      return {
        status: "stale-basis",
        message: "Focus basis is not current for the deterministic scenario.",
        currentBasisRef: mockScenarioRefs.basis,
      };
    }

    if (
      input.selectedGapRefs.includes(mockScenarioRefs.gapSystemDesign) &&
      input.selectedCapabilityRefs.includes(mockScenarioRefs.capabilitySystemDesign)
    ) {
      return accepted({
        focusRef: rawMockScenario.focus.focusId,
        targetRef: rawMockScenario.focus.targetId,
        purpose: rawMockScenario.focus.purposeText,
        capabilityRefs: rawMockScenario.focus.capabilityIds,
        gapRefs: rawMockScenario.focus.gapIds,
        rationale: rawMockScenario.focus.reasonText,
      });
    }

    if (
      input.selectedGapRefs.includes(mockScenarioRefs.gapBehavioral) &&
      input.selectedCapabilityRefs.includes(mockScenarioRefs.capabilityBehavioral)
    ) {
      return accepted({
        focusRef: mockScenarioRefs.focusMissingSupport,
        targetRef: mockScenarioRefs.targetPrimary,
        purpose: "Prepare attributable behavioral evidence.",
        capabilityRefs: [mockScenarioRefs.capabilityBehavioral],
        gapRefs: [mockScenarioRefs.gapBehavioral],
        rationale: "Target-relevant unresolved gap with no suitable prepared support.",
      });
    }

    return rejected("Selected gap/capability combination is not part of the scenario.");
  }

  async queryKnowledge(
    input: KnowledgeQueryInput,
  ): Promise<SemanticOutcome<KnowledgeProjectionModel>> {
    if (!targetByRef(input.targetRef)) {
      return rejected("Unknown Target.");
    }

    const anchors =
      input.requiredCapabilityRef === mockScenarioRefs.capabilitySystemDesign
        ? [mockScenarioRefs.knowledgeConsistency, mockScenarioRefs.knowledgeCaching]
        : input.requiredCapabilityRef === mockScenarioRefs.capabilityTypeScript
          ? [mockScenarioRefs.knowledgeEventLoop]
          : rawMockScenario.focus.capabilityIds.includes(
                input.requiredCapabilityRef as CapabilityRef,
              )
            ? [mockScenarioRefs.knowledgeConsistency]
            : [];

    const selected =
      anchors.length > 0
        ? rawMockScenario.knowledge.filter((item) =>
            anchors.includes(item.knowledgeId),
          )
        : rawMockScenario.knowledge;

    const items = selected.map((item) => ({
      knowledgeRef: item.knowledgeId,
      kind: item.kindCode,
      label: item.title,
      ...(item.kindCode === "proposition"
        ? { predicate: item.predicateText }
        : {}),
      relatedRefs: item.relatedIds,
    }));

    return accepted({
      targetRef: input.targetRef,
      ...(input.focusRef ? { focusRef: input.focusRef } : {}),
      ...(input.requiredCapabilityRef
        ? { requiredCapabilityRef: input.requiredCapabilityRef }
        : {}),
      scope: input.scope,
      ...(input.query ? { query: input.query } : {}),
      anchorRefs: anchors,
      items,
    });
  }

  async listSupport(
    input: ListSupportInput,
  ): Promise<SemanticOutcome<readonly SupportModel[]>> {
    if (input.targetRef !== mockScenarioRefs.targetPrimary) {
      return rejected("Support scenario is only defined for the established Target.");
    }

    if (input.focusRef === mockScenarioRefs.focusMissingSupport) {
      return accepted([]);
    }

    if (input.focusRef !== mockScenarioRefs.focusCurrent) {
      return rejected("Unknown Focus.");
    }

    return accepted([mapSupport()]);
  }

  async startActivity(
    input: StartActivityInput,
  ): Promise<SemanticOutcome<ActivityAttemptModel>> {
    if (
      input.targetRef !== rawMockScenario.activity.targetId ||
      input.focusRef !== rawMockScenario.activity.focusId ||
      input.supportRef !== rawMockScenario.activity.supportId ||
      input.semanticBasisRef !== mockScenarioRefs.basis
    ) {
      return rejected("Activity start does not match the deterministic scenario.");
    }

    return accepted({
      activityAttemptRef: rawMockScenario.activity.attemptId,
      targetRef: rawMockScenario.activity.targetId,
      focusRef: rawMockScenario.activity.focusId,
      supportRef: rawMockScenario.activity.supportId,
      semanticBasisRef: mockScenarioRefs.basis,
      state: "active",
    });
  }

  async completeActivity(
    input: CompleteActivityInput,
  ): Promise<SemanticOutcome<ActivityCompletionModel>> {
    if (
      input.activityAttemptRef !== mockScenarioRefs.activityAttempt ||
      input.semanticBasisRef !== mockScenarioRefs.basis
    ) {
      return rejected("Activity completion does not match the current attempt/basis.");
    }

    return accepted(
      {
        activityAttemptRef: mockScenarioRefs.activityAttempt,
        outcome: "increased-uncertainty",
        historicalFactsAccepted: true,
        evidenceRef: mockScenarioRefs.evidenceActivity,
      },
      mockScenarioRefs.basisAfterActivity,
    );
  }

  async getChange(
    input: GetChangeInput,
  ): Promise<SemanticOutcome<ChangeModel>> {
    if (input.targetRef !== mockScenarioRefs.targetPrimary) {
      return rejected("Change scenario is only defined for the established Target.");
    }

    return accepted(
      {
        targetRef: mockScenarioRefs.targetPrimary,
        ...(input.activityAttemptRef
          ? { activityAttemptRef: input.activityAttemptRef }
          : {}),
        previousBasisRef: rawMockScenario.change.previousBasisId,
        currentBasisRef: rawMockScenario.change.currentBasisId,
        learnerEvidenceChange: rawMockScenario.change.learnerChangeCode,
        targetInformationChange: rawMockScenario.change.targetChangeCode,
        explanation: rawMockScenario.change.explanationText,
      },
      mockScenarioRefs.basisAfterActivity,
    );
  }

  async requestPreparation(
    input: RequestPreparationInput,
  ): Promise<SemanticOutcome<PreparationRequestModel>> {
    if (input.targetRef !== mockScenarioRefs.targetPrimary) {
      return rejected("Preparation scenario is only defined for the established Target.");
    }

    return accepted({
      preparationRequestRef: rawMockScenario.preparation.requestId,
      targetRef: rawMockScenario.preparation.targetId,
      focusRef: rawMockScenario.preparation.focusId,
      sourceContext: input.sourceContext,
      sourceProvenance: input.sourceProvenance,
      acceptedSupport: [mapPreparedSupport()],
      remainder: rawMockScenario.preparation.remainderRows.map((row) => ({
        subject: row.subjectText,
        status: row.statusCode,
        reason: row.reasonText,
      })),
      state: rawMockScenario.preparation.stateCode,
    });
  }

  async getPreparation(
    preparationRequestRef: PreparationRequestRef,
  ): Promise<SemanticOutcome<PreparationRequestModel>> {
    if (preparationRequestRef !== mockScenarioRefs.preparationRequest) {
      return rejected("Unknown PreparationRequest.");
    }

    return accepted({
      preparationRequestRef,
      targetRef: rawMockScenario.preparation.targetId,
      focusRef: rawMockScenario.preparation.focusId,
      sourceContext: rawMockScenario.preparation.sourceText,
      sourceProvenance: [
        provenance("Backend interview brief", mockScenarioRefs.sourceInterviewBrief),
      ],
      acceptedSupport: [mapPreparedSupport()],
      remainder: rawMockScenario.preparation.remainderRows.map((row) => ({
        subject: row.subjectText,
        status: row.statusCode,
        reason: row.reasonText,
      })),
      state: rawMockScenario.preparation.stateCode,
    });
  }
}
