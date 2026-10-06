import { describe, expect, it } from "vitest";

import { MockFrontendAdapter } from "./MockFrontendAdapter";
import { mockScenarioRefs } from "./scenario";
import type { ActivityPort } from "../../features/activity/contract";
import type { CurrentPositionPort } from "../../features/current-position/contract";
import type { EvidenceChangePort } from "../../features/evidence-change/contract";
import type { KnowledgePort } from "../../features/knowledge-explorer/contract";
import type { PreparationSupportPort } from "../../features/preparation-support/contract";
import type { TargetDirectionPort } from "../../features/target-direction/contract";
import type { TargetPort } from "../../features/target/contract";
import { ref, type SemanticOutcome } from "../../features/contracts";

function acceptedValue<Value>(outcome: SemanticOutcome<Value>): Value {
  expect(outcome.status).toBe("accepted");
  if (outcome.status !== "accepted") {
    throw new Error(`Expected accepted outcome, received ${outcome.status}`);
  }
  expect(outcome.projection.currentness).toBe("current");
  return outcome.projection.value;
}

describe("MockFrontendAdapter semantic contract", () => {
  const adapter = new MockFrontendAdapter();

  const ports:
    & TargetDirectionPort
    & TargetPort
    & CurrentPositionPort
    & KnowledgePort
    & ActivityPort
    & EvidenceChangePort
    & PreparationSupportPort = adapter;

  void ports;

  it("compares multiple Targets over one learner evidence basis without scalar fit", async () => {
    const comparison = acceptedValue(
      await adapter.compareTargets({
        candidateTargetRefs: [
          mockScenarioRefs.targetPrimary,
          mockScenarioRefs.targetAlternative,
        ],
      }),
    );

    expect(comparison.evidenceBasisRef).toBe(mockScenarioRefs.basis);
    expect(comparison.candidates).toHaveLength(2);
    expect(comparison.candidates[0].sharedCapabilityRefs).toContain(
      mockScenarioRefs.capabilitySystemDesign,
    );
    expect(comparison.candidates[1].sharedCapabilityRefs).toContain(
      mockScenarioRefs.capabilitySystemDesign,
    );
    expect(comparison.candidates[0].targetSpecificCapabilityRefs).toContain(
      mockScenarioRefs.capabilityBehavioral,
    );
    expect(comparison.candidates[1].targetSpecificCapabilityRefs).toContain(
      mockScenarioRefs.capabilityKubernetes,
    );
    expect(comparison.candidates[0]).not.toHaveProperty("fitScore");
    expect(comparison.candidates[0]).not.toHaveProperty("readinessScore");
  });

  it("establishes Target and Focus only through explicit commands on the current basis", async () => {
    const target = acceptedValue(
      await adapter.establishTarget({
        targetRef: mockScenarioRefs.targetPrimary,
        sourceContext: "Backend interview brief",
      }),
    );
    expect(target.targetRef).toBe(mockScenarioRefs.targetPrimary);

    const focus = acceptedValue(
      await adapter.setFocus({
        targetRef: mockScenarioRefs.targetPrimary,
        selectedGapRefs: [mockScenarioRefs.gapSystemDesign],
        selectedCapabilityRefs: [mockScenarioRefs.capabilitySystemDesign],
        purpose: "Reduce uncertainty in system-design reasoning.",
        rationale: "Target-relevant challenged gap with suitable support.",
        semanticBasisRef: mockScenarioRefs.basis,
      }),
    );
    expect(focus.focusRef).toBe(mockScenarioRefs.focusCurrent);

    const stale = await adapter.setFocus({
      targetRef: mockScenarioRefs.targetPrimary,
      selectedGapRefs: [mockScenarioRefs.gapSystemDesign],
      selectedCapabilityRefs: [mockScenarioRefs.capabilitySystemDesign],
      purpose: "Reduce uncertainty in system-design reasoning.",
      rationale: "Attempted from a stale projection.",
      semanticBasisRef: ref<"semantic-basis">("basis:stale"),
    });
    expect(stale.status).toBe("stale-basis");
  });

  it("keeps Target requirements distinct from learner state and exposes direct Knowledge focus", async () => {
    const requirements = acceptedValue(
      await adapter.getTargetRequirements(mockScenarioRefs.targetPrimary),
    );
    const systemDesign = requirements.expectations.find(
      (item) => item.capabilityRef === mockScenarioRefs.capabilitySystemDesign,
    );

    expect(systemDesign?.knowledgeFocusRefs).toEqual([
      mockScenarioRefs.knowledgeConsistency,
      mockScenarioRefs.knowledgeCaching,
    ]);

    const state = acceptedValue(
      await adapter.getCurrentState(mockScenarioRefs.targetPrimary),
    );
    expect(state.capabilities.map((item) => item.state)).toEqual([
      "demonstrated",
      "challenged",
      "unknown",
    ]);
  });

  it("preserves attributable evidence supports, challenges, provenance, and limitations", async () => {
    const evidence = acceptedValue(
      await adapter.getEvidence(mockScenarioRefs.targetPrimary),
    );

    const demonstrated = evidence.facts.find(
      (item) => item.evidenceRef === mockScenarioRefs.evidenceTypeScript,
    );
    const challenged = evidence.facts.find(
      (item) => item.evidenceRef === mockScenarioRefs.evidenceSystemDesign,
    );

    expect(demonstrated?.supportsCapabilityRefs).toContain(
      mockScenarioRefs.capabilityTypeScript,
    );
    expect(challenged?.challengesCapabilityRefs).toContain(
      mockScenarioRefs.capabilitySystemDesign,
    );
    expect(challenged?.provenance.length).toBeGreaterThan(0);
    expect(challenged?.limitations.length).toBeGreaterThan(0);
  });

  it("provides multiple gaps with decision context and an explicit missing-support case", async () => {
    const gaps = acceptedValue(
      await adapter.getGaps(mockScenarioRefs.targetPrimary),
    );

    expect(gaps.gaps).toHaveLength(2);
    expect(
      gaps.decisionContext.candidates.find(
        (item) => item.gapRef === mockScenarioRefs.gapSystemDesign,
      )?.supportAvailability,
    ).toBe("available");
    expect(
      gaps.decisionContext.candidates.find(
        (item) => item.gapRef === mockScenarioRefs.gapBehavioral,
      )?.supportAvailability,
    ).toBe("missing");

    const missing = acceptedValue(
      await adapter.listSupport({
        targetRef: mockScenarioRefs.targetPrimary,
        focusRef: mockScenarioRefs.focusMissingSupport,
      }),
    );
    expect(missing).toEqual([]);
  });

  it("keeps Knowledge semantic and task-complete without renderer geometry", async () => {
    const knowledge = acceptedValue(
      await adapter.queryKnowledge({
        targetRef: mockScenarioRefs.targetPrimary,
        focusRef: mockScenarioRefs.focusCurrent,
        requiredCapabilityRef: mockScenarioRefs.capabilitySystemDesign,
        scope: "overview",
      }),
    );

    expect(knowledge.anchorRefs).toEqual([
      mockScenarioRefs.knowledgeConsistency,
      mockScenarioRefs.knowledgeCaching,
    ]);
    expect(knowledge.items.length).toBeGreaterThan(0);

    for (const item of knowledge.items) {
      expect(item).not.toHaveProperty("x");
      expect(item).not.toHaveProperty("y");
      expect(item).not.toHaveProperty("z");
      expect(item).not.toHaveProperty("position");
    }
  });

  it("does not turn Activity completion into learner-state progress", async () => {
    const before = acceptedValue(
      await adapter.getCurrentState(mockScenarioRefs.targetPrimary),
    );

    const attempt = acceptedValue(
      await adapter.startActivity({
        targetRef: mockScenarioRefs.targetPrimary,
        focusRef: mockScenarioRefs.focusCurrent,
        supportRef: mockScenarioRefs.supportSystemDesign,
        semanticBasisRef: mockScenarioRefs.basis,
      }),
    );

    const completion = acceptedValue(
      await adapter.completeActivity({
        activityAttemptRef: attempt.activityAttemptRef,
        resultSummary: "Completed the cache consistency design case.",
        provenance: "deterministic prototype scenario",
        semanticBasisRef: mockScenarioRefs.basis,
      }),
    );

    expect(completion.historicalFactsAccepted).toBe(true);
    expect(completion.outcome).toBe("increased-uncertainty");

    const after = acceptedValue(
      await adapter.getCurrentState(mockScenarioRefs.targetPrimary),
    );
    expect(after).toEqual(before);

    const change = acceptedValue(
      await adapter.getChange({
        targetRef: mockScenarioRefs.targetPrimary,
        activityAttemptRef: attempt.activityAttemptRef,
        priorBasisRef: mockScenarioRefs.basis,
      }),
    );
    expect(change.learnerEvidenceChange).toBe("increased-uncertainty");
    expect(change.targetInformationChange).toBe("no-change");
  });

  it("preserves accepted prepared support alongside explicit unresolved and rejected remainder", async () => {
    const request = acceptedValue(
      await adapter.requestPreparation({
        targetRef: mockScenarioRefs.targetPrimary,
        focusRef: mockScenarioRefs.focusMissingSupport,
        sourceContext: "Behavioral preparation support is missing.",
        sourceProvenance: [{ label: "Backend interview brief" }],
        semanticBasisRef: mockScenarioRefs.basis,
      }),
    );

    expect(request.state).toBe("partial");
    expect(request.acceptedSupport).toHaveLength(1);
    expect(request.remainder.map((item) => item.status)).toEqual([
      "unresolved",
      "rejected",
    ]);

    const continued = acceptedValue(
      await adapter.getPreparation(request.preparationRequestRef),
    );
    expect(continued.acceptedSupport).toEqual(request.acceptedSupport);
    expect(continued.remainder).toHaveLength(2);
  });

  it("returns explicit semantic rejection instead of leaking fixture/provider failure", async () => {
    const outcome = await adapter.getCurrentState(
      ref<"target">("target:not-in-scenario"),
    );

    expect(outcome).toEqual({
      status: "rejected",
      message: "Unknown Target.",
      currentBasisRef: mockScenarioRefs.basis,
    });
  });
});
