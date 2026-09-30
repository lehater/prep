import type { PreparationSupportPort } from "../../features/learning/ports/PreparationSupportPort";
import type { LearningTargetModel } from "../../features/learning/model/learningTarget";
import type { MockCurationStore } from "./MockCurationStore";

export class MockPreparationSupportAdapter implements PreparationSupportPort {
  constructor(private readonly store: MockCurationStore) {}

  async getOptions(input: { readonly targetContext: string }) {
    return {
      status: "success" as const,
      value: {
        targetContext: input.targetContext,
        missing: [
          "A prepared target profile",
          "Learning/practice support for at least one required capability",
          "A diagnostic/evidence path for initial uncertainty",
        ],
        options: [
          {
            id: "delegated" as const,
            label: "Ask Prep to prepare it",
            summary:
              "Delegate preparation to the supported system/agent/curator path, then review the result before using it.",
          },
          {
            id: "self-curation" as const,
            label: "Prepare it yourself",
            summary:
              "Enter Curation explicitly if you want to author or import reusable preparation data yourself.",
          },
        ],
      },
    };
  }

  async request(input: {
    readonly targetContext: string;
    readonly fulfillmentPreference: "delegated" | "self-curation";
  }) {
    if (input.fulfillmentPreference === "self-curation") {
      return {
        status: "success" as const,
        value: {
          status: "self-curation-handoff" as const,
          message: "Self-curation selected explicitly.",
        },
      };
    }

    const expectedName = input.targetContext + " — prepared";
    const existing = this.store.targets.find((target) => target.name === expectedName);
    const targetId = existing?.id ?? this.store.nextId("target");
    if (!existing) {
      const capabilityId = this.store.nextId("capability");
      this.store.capabilities.push({
        id: capabilityId,
        title: "Initial preparation capability",
        performanceExpectation:
          "Demonstrate the first reviewable capability required by the requested target.",
        conditionSummary: "Initial delegated preparation scope.",
        criterionSummary:
          "Enough detail to review the prepared target and start evidence-backed assessment.",
        knowledgeIds: [],
      });
      this.store.learningSupport.push({
        id: this.store.nextId("support"),
        title: "Initial preparation support",
        kind: "material",
        summary:
          "Starter material prepared for the first reviewable target capability.",
        capabilityIds: [capabilityId],
        knowledgeIds: [],
      });
      this.store.assessmentDesigns.push({
        id: this.store.nextId("assessment"),
        title: "Initial preparation diagnostic",
        capabilityIds: [capabilityId],
        taskSummary: "Explain or demonstrate the prepared capability in a bounded scenario.",
        observationSummary: "Observe whether the learner can satisfy the prepared capability criterion.",
        evidenceRuleSummary: "The observation is scoped to this prepared scenario and does not establish broader mastery.",
        evidenceBearing: "supports",
      });
      this.store.targets.push({
        id: targetId,
        name: expectedName,
        definition:
          "Delegated preparation result. Review this target before treating it as the active preparation context.",
        targetPurpose: "role-capability",
        provenance: ["Delegated preparation from learner-supplied target context."],
        unresolvedExpectations: [
          "Company/interview-specific expectations remain unresolved until supplied and reviewed.",
        ],
        relatedTargetRefs: [],
        scopeItems: [],
      });
      this.store.targetCapabilityIds.set(targetId, [capabilityId]);
    }

    const target = this.store.targets.find((item) => item.id === targetId)!;
    const capabilities = (this.store.targetCapabilityIds.get(targetId) ?? []).flatMap(
      (capabilityId) => {
        const capability = this.store.capabilities.find((item) => item.id === capabilityId);
        return capability
          ? [{ id: capability.id, title: capability.title, summary: capability.performanceExpectation }]
          : [];
      },
    );
    const preparedTarget: LearningTargetModel = {
      id: target.id,
      name: target.name,
      definition: target.definition,
      targetPurpose: target.targetPurpose,
      provenance: target.provenance,
      unresolvedExpectations: target.unresolvedExpectations,
      relatedTargets: [],
      scopeSummary: String(capabilities.length) + " required capability(s)",
      capabilities,
      scopeItems: [],
    };

    return {
      status: "success" as const,
      value: {
        status: "ready-to-review" as const,
        message: "A reviewable target and starter support were prepared.",
        preparedTarget,
      },
    };
  }
}
