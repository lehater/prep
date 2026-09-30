import type {
  AssessmentCurationModel,
  CapabilityCurationModel,
  CorpusDiagnosticModel,
  LearningSupportCurationModel,
  LearningSupportKind,
  TargetProfileModel,
  TargetProfilePurpose,
  UserCenteredCurationCollection,
  UserCenteredCurationOutcome,
} from "../model/userCenteredCurationModels";

export interface TargetProfileCurationPort {
  list(query: { readonly search?: string }): Promise<UserCenteredCurationOutcome<UserCenteredCurationCollection<TargetProfileModel>>>;
  get(targetId: string): Promise<UserCenteredCurationOutcome<TargetProfileModel>>;
  create(input: {
    readonly name: string;
    readonly definition: string;
    readonly targetPurpose: TargetProfilePurpose;
    readonly provenance: readonly string[];
    readonly unresolvedExpectations: readonly string[];
    readonly relatedTargetRefs: readonly string[];
  }): Promise<UserCenteredCurationOutcome<TargetProfileModel>>;
  update(targetId: string, input: {
    readonly name: string;
    readonly definition: string;
    readonly targetPurpose: TargetProfilePurpose;
    readonly provenance: readonly string[];
    readonly unresolvedExpectations: readonly string[];
    readonly relatedTargetRefs: readonly string[];
  }): Promise<UserCenteredCurationOutcome<TargetProfileModel>>;
  setCapabilities(targetId: string, capabilityIds: readonly string[]): Promise<UserCenteredCurationOutcome<TargetProfileModel>>;
}

export interface CapabilityCurationPortV2 {
  list(query: { readonly search?: string }): Promise<UserCenteredCurationOutcome<UserCenteredCurationCollection<CapabilityCurationModel>>>;
  get(capabilityId: string): Promise<UserCenteredCurationOutcome<CapabilityCurationModel>>;
  create(input: {
    readonly title: string;
    readonly performanceExpectation: string;
    readonly conditionSummary: string;
    readonly criterionSummary: string;
    readonly knowledgeIds: readonly string[];
  }): Promise<UserCenteredCurationOutcome<CapabilityCurationModel>>;
  update(capabilityId: string, input: {
    readonly title: string;
    readonly performanceExpectation: string;
    readonly conditionSummary: string;
    readonly criterionSummary: string;
    readonly knowledgeIds: readonly string[];
  }): Promise<UserCenteredCurationOutcome<CapabilityCurationModel>>;
}

export interface LearningSupportCurationPortV2 {
  list(query: { readonly search?: string }): Promise<UserCenteredCurationOutcome<UserCenteredCurationCollection<LearningSupportCurationModel>>>;
  get(supportId: string): Promise<UserCenteredCurationOutcome<LearningSupportCurationModel>>;
  create(input: {
    readonly title: string;
    readonly kind: LearningSupportKind;
    readonly summary: string;
    readonly capabilityIds: readonly string[];
    readonly knowledgeIds: readonly string[];
  }): Promise<UserCenteredCurationOutcome<LearningSupportCurationModel>>;
  update(supportId: string, input: {
    readonly title: string;
    readonly kind: LearningSupportKind;
    readonly summary: string;
    readonly capabilityIds: readonly string[];
    readonly knowledgeIds: readonly string[];
  }): Promise<UserCenteredCurationOutcome<LearningSupportCurationModel>>;
}

export interface AssessmentCurationPortV2 {
  list(query: { readonly search?: string }): Promise<UserCenteredCurationOutcome<UserCenteredCurationCollection<AssessmentCurationModel>>>;
  get(assessmentId: string): Promise<UserCenteredCurationOutcome<AssessmentCurationModel>>;
  create(input: {
    readonly title: string;
    readonly capabilityIds: readonly string[];
    readonly taskSummary: string;
    readonly observationSummary: string;
    readonly evidenceRuleSummary: string;
    readonly evidenceBearing: "supports" | "challenges";
  }): Promise<UserCenteredCurationOutcome<AssessmentCurationModel>>;
  update(assessmentId: string, input: {
    readonly title: string;
    readonly capabilityIds: readonly string[];
    readonly taskSummary: string;
    readonly observationSummary: string;
    readonly evidenceRuleSummary: string;
    readonly evidenceBearing: "supports" | "challenges";
  }): Promise<UserCenteredCurationOutcome<AssessmentCurationModel>>;
}

export interface CorpusQualityPort {
  get(): Promise<UserCenteredCurationOutcome<readonly CorpusDiagnosticModel[]>>;
}
