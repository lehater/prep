import type {
  AssessmentCurationModel,
  CapabilityCurationModel,
  CorpusDiagnosticModel,
  LearningSupportCurationModel,
  TargetProfileModel,
} from "../../features/curation/model/userCenteredCurationModels";
import type {
  AssessmentCurationPortV2,
  CapabilityCurationPortV2,
  CorpusQualityPort,
  LearningSupportCurationPortV2,
  TargetProfileCurationPort,
} from "../../features/curation/ports/UserCenteredCurationPorts";
import type { CurationOutcome } from "../../features/curation/model/curationModels";
import type { MockCurationStore } from "./MockCurationStore";

function matches(search: string, ...values: readonly string[]) {
  const normalized = search.trim().toLocaleLowerCase();
  return (
    normalized.length === 0 ||
    values.some((value) => value.toLocaleLowerCase().includes(normalized))
  );
}

function required(value: string, message: string): CurationOutcome<never> | null {
  return value.trim()
    ? null
    : { status: "validation_rejected", message };
}

export class MockTargetProfileCurationAdapter implements TargetProfileCurationPort {
  constructor(private readonly store: MockCurationStore) {}

  async list(query: { readonly search?: string }) {
    const search = query.search ?? "";
    const items = this.store.targets
      .filter((target) => matches(search, target.name, target.definition))
      .map((target): TargetProfileModel => ({
        id: target.id,
        name: target.name,
        definition: target.definition,
        capabilityIds: this.store.targetCapabilityIds.get(target.id) ?? [],
      }));
    return { status: "success" as const, value: { items, totalCount: items.length } };
  }

  async get(targetId: string): Promise<CurationOutcome<TargetProfileModel>> {
    const target = this.store.targets.find((item) => item.id === targetId);
    return target
      ? {
          status: "success",
          value: {
            id: target.id,
            name: target.name,
            definition: target.definition,
            capabilityIds: this.store.targetCapabilityIds.get(target.id) ?? [],
          },
        }
      : { status: "not_found", message: "Target not found." };
  }

  async create(input: { readonly name: string; readonly definition: string }) {
    const issue =
      required(input.name, "Target name is required.") ??
      required(input.definition, "Target definition is required.");
    if (issue) return issue;
    const target = {
      id: this.store.nextId("target"),
      name: input.name.trim(),
      definition: input.definition.trim(),
      scopeItems: [],
    };
    this.store.targets.push(target);
    this.store.targetCapabilityIds.set(target.id, []);
    return {
      status: "success" as const,
      value: { ...target, capabilityIds: [] },
    };
  }

  async update(
    targetId: string,
    input: { readonly name: string; readonly definition: string },
  ) {
    const issue =
      required(input.name, "Target name is required.") ??
      required(input.definition, "Target definition is required.");
    if (issue) return issue;
    const index = this.store.targets.findIndex((item) => item.id === targetId);
    if (index < 0) return { status: "not_found" as const, message: "Target not found." };
    const target = {
      ...this.store.targets[index],
      name: input.name.trim(),
      definition: input.definition.trim(),
    };
    this.store.targets[index] = target;
    return {
      status: "success" as const,
      value: {
        id: target.id,
        name: target.name,
        definition: target.definition,
        capabilityIds: this.store.targetCapabilityIds.get(target.id) ?? [],
      },
    };
  }

  async setCapabilities(targetId: string, capabilityIds: readonly string[]) {
    const target = this.store.targets.find((item) => item.id === targetId);
    if (!target) return { status: "not_found" as const, message: "Target not found." };
    const missing = capabilityIds.find(
      (id) => !this.store.capabilities.some((capability) => capability.id === id),
    );
    if (missing) {
      return {
        status: "validation_rejected" as const,
        message: `Capability ${missing} does not exist.`,
      };
    }
    this.store.targetCapabilityIds.set(targetId, [...new Set(capabilityIds)]);
    return this.get(targetId);
  }
}

export class MockCapabilityCurationAdapter implements CapabilityCurationPortV2 {
  constructor(private readonly store: MockCurationStore) {}

  async list(query: { readonly search?: string }) {
    const search = query.search ?? "";
    const items = this.store.capabilities.filter((item) =>
      matches(search, item.title, item.performanceExpectation),
    );
    return { status: "success" as const, value: { items, totalCount: items.length } };
  }

  async get(capabilityId: string): Promise<CurationOutcome<CapabilityCurationModel>> {
    const item = this.store.capabilities.find((candidate) => candidate.id === capabilityId);
    return item
      ? { status: "success", value: item }
      : { status: "not_found", message: "Capability not found." };
  }

  async create(input: Omit<CapabilityCurationModel, "id">) {
    const issue =
      required(input.title, "Capability title is required.") ??
      required(input.performanceExpectation, "Performance expectation is required.");
    if (issue) return issue;
    const item: CapabilityCurationModel = {
      id: this.store.nextId("capability"),
      ...input,
      title: input.title.trim(),
      performanceExpectation: input.performanceExpectation.trim(),
    };
    this.store.capabilities.push(item);
    return { status: "success" as const, value: item };
  }

  async update(capabilityId: string, input: Omit<CapabilityCurationModel, "id">) {
    const issue =
      required(input.title, "Capability title is required.") ??
      required(input.performanceExpectation, "Performance expectation is required.");
    if (issue) return issue;
    const index = this.store.capabilities.findIndex((item) => item.id === capabilityId);
    if (index < 0) return { status: "not_found" as const, message: "Capability not found." };
    const item = { id: capabilityId, ...input };
    this.store.capabilities[index] = item;
    return { status: "success" as const, value: item };
  }
}

export class MockLearningSupportCurationAdapter
  implements LearningSupportCurationPortV2 {
  constructor(private readonly store: MockCurationStore) {}

  async list(query: { readonly search?: string }) {
    const search = query.search ?? "";
    const items = this.store.learningSupport.filter((item) =>
      matches(search, item.title, item.summary),
    );
    return { status: "success" as const, value: { items, totalCount: items.length } };
  }

  async get(supportId: string): Promise<CurationOutcome<LearningSupportCurationModel>> {
    const item = this.store.learningSupport.find((candidate) => candidate.id === supportId);
    return item
      ? { status: "success", value: item }
      : { status: "not_found", message: "Learning support not found." };
  }

  async create(input: Omit<LearningSupportCurationModel, "id">) {
    const issue =
      required(input.title, "Learning support title is required.") ??
      required(input.summary, "Learning support content/summary is required.");
    if (issue) return issue;
    const item: LearningSupportCurationModel = {
      id: this.store.nextId("support"),
      ...input,
      title: input.title.trim(),
      summary: input.summary.trim(),
    };
    this.store.learningSupport.push(item);
    return { status: "success" as const, value: item };
  }

  async update(supportId: string, input: Omit<LearningSupportCurationModel, "id">) {
    const index = this.store.learningSupport.findIndex((item) => item.id === supportId);
    if (index < 0) return { status: "not_found" as const, message: "Learning support not found." };
    const item = { id: supportId, ...input };
    this.store.learningSupport[index] = item;
    return { status: "success" as const, value: item };
  }
}

export class MockAssessmentCurationAdapter implements AssessmentCurationPortV2 {
  constructor(private readonly store: MockCurationStore) {}

  async list(query: { readonly search?: string }) {
    const search = query.search ?? "";
    const items = this.store.assessmentDesigns.filter((item) =>
      matches(search, item.title, item.taskSummary, item.observationSummary),
    );
    return { status: "success" as const, value: { items, totalCount: items.length } };
  }

  async get(assessmentId: string): Promise<CurationOutcome<AssessmentCurationModel>> {
    const item = this.store.assessmentDesigns.find((candidate) => candidate.id === assessmentId);
    return item
      ? { status: "success", value: item }
      : { status: "not_found", message: "Assessment design not found." };
  }

  async create(input: Omit<AssessmentCurationModel, "id">) {
    const issue =
      required(input.title, "Assessment title is required.") ??
      required(input.taskSummary, "Assessment task semantics are required.") ??
      required(input.observationSummary, "Observation semantics are required.") ??
      required(input.evidenceRuleSummary, "Evidence rule is required.");
    if (issue) return issue;
    const item: AssessmentCurationModel = {
      id: this.store.nextId("assessment"),
      ...input,
    };
    this.store.assessmentDesigns.push(item);
    return { status: "success" as const, value: item };
  }

  async update(assessmentId: string, input: Omit<AssessmentCurationModel, "id">) {
    const index = this.store.assessmentDesigns.findIndex((item) => item.id === assessmentId);
    if (index < 0) return { status: "not_found" as const, message: "Assessment design not found." };
    const item = { id: assessmentId, ...input };
    this.store.assessmentDesigns[index] = item;
    return { status: "success" as const, value: item };
  }
}

export class MockCorpusQualityAdapter implements CorpusQualityPort {
  constructor(private readonly store: MockCurationStore) {}

  async get(): Promise<CurationOutcome<readonly CorpusDiagnosticModel[]>> {
    const diagnostics: CorpusDiagnosticModel[] = [];
    for (const capability of this.store.capabilities) {
      if (!this.store.learningSupport.some((support) => support.capabilityIds.includes(capability.id))) {
        diagnostics.push({
          id: `missing-support-${capability.id}`,
          severity: "warning",
          area: "learning-support",
          summary: `No learning/practice support is prepared for ${capability.title}.`,
          ownerSection: "learning-support",
        });
      }
      if (!this.store.assessmentDesigns.some((assessment) => assessment.capabilityIds.includes(capability.id))) {
        diagnostics.push({
          id: `missing-assessment-${capability.id}`,
          severity: "warning",
          area: "assessment",
          summary: `No assessment/evidence design is prepared for ${capability.title}.`,
          ownerSection: "assessment",
        });
      }
    }
    return { status: "success", value: diagnostics };
  }
}
