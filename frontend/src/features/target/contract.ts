import type {
  CapabilityRef,
  KnowledgeRef,
  Limitation,
  Provenance,
  RequirementRef,
  SemanticBasisRef,
  SemanticOutcome,
  TargetRef,
} from "../contracts";

export interface TargetSetupOption {
  readonly targetRef: TargetRef;
  readonly label: string;
  readonly purpose: string;
  readonly sourceContext: string;
  readonly uncertainty: readonly string[];
}

export interface TargetModel {
  readonly targetRef: TargetRef;
  readonly label: string;
  readonly purpose: string;
  readonly uncertainty: readonly string[];
  readonly provenance: readonly Provenance[];
}

export interface KnowledgeFocusModel {
  readonly knowledgeRef: KnowledgeRef;
  readonly label: string;
}

export interface RequirementExpectationModel {
  readonly requirementRef: RequirementRef;
  readonly capabilityRef: CapabilityRef;
  readonly capabilityLabel: string;
  readonly performance: string;
  readonly conditions: readonly string[];
  readonly qualityCriteria: readonly string[];
  readonly knowledgeFocus: readonly KnowledgeFocusModel[];
}

export interface TargetRequirementModel {
  readonly targetRef: TargetRef;
  readonly expectations: readonly RequirementExpectationModel[];
  readonly unresolvedExpectations: readonly string[];
  readonly provenance: readonly Provenance[];
  readonly limitations: readonly Limitation[];
}

export interface EstablishTargetInput {
  readonly targetRef: TargetRef;
  readonly sourceContext: string;
  readonly priorBasisRef?: SemanticBasisRef;
}

export interface TargetPort {
  establishTarget(input: EstablishTargetInput): Promise<SemanticOutcome<TargetModel>>;
  getTargetRequirements(targetRef: TargetRef): Promise<SemanticOutcome<TargetRequirementModel>>;
}
