import type {
  KnowledgeNodeModel,
  KnowledgeRelationModel,
  KnowledgeRelationType,
  KnowledgeSemanticKind,
} from "../../features/knowledge-explorer/model/knowledge";

export const HARNESS_KNOWLEDGE_REVISION =
  "bdec95ddf2e5fb9f4a5359c93ceb285917237f3b";

export type HarnessKnowledgeEvidenceMode = "extracted" | "curated";

export interface HarnessKnowledgeSourceRef {
  readonly path: string;
  readonly locator?: string;
}

export interface HarnessKnowledgeFixtureNode {
  readonly id: string;
  readonly semanticKind: KnowledgeSemanticKind;
  readonly title: string;
  readonly summary: string;
  readonly sources: readonly HarnessKnowledgeSourceRef[];
}

export interface HarnessKnowledgeFixtureRelation {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly predicate: string;
  readonly evidenceMode: HarnessKnowledgeEvidenceMode;
  readonly sources: readonly HarnessKnowledgeSourceRef[];
  readonly condition?: string;
  readonly sourceNativePredicate?: string;
  readonly projectionType?: KnowledgeRelationType;
}

const src = (path: string, locator?: string): HarnessKnowledgeSourceRef => ({
  path,
  ...(locator ? { locator } : {}),
});

export const harnessKnowledgeFixtureNodes: readonly HarnessKnowledgeFixtureNode[] = [
  {
    id: "harness",
    semanticKind: "concept",
    title: "Harness",
    summary:
      "Repository-independent engineering control surface for knowledge ownership, production topology, assurance and derived project views.",
    sources: [src("README.md")],
  },
  {
    id: "harness.core",
    semanticKind: "mechanism",
    title: "Harness Core",
    summary:
      "Minimal state model for engineering knowledge ownership: Authority, CanonicalArtifact, CapabilityId, Question and artifact dependencies.",
    sources: [src("docs/design/core-v0.md")],
  },
  {
    id: "harness.core.authority",
    semanticKind: "concept",
    title: "Authority",
    summary:
      "Atomic boundary of engineering decision ownership with semantic cohesion, independent change and a public contract.",
    sources: [src("docs/design/core-v0.md", "Entities"), src("docs/design/engineering-graph-v0.md", "Authority")],
  },
  {
    id: "harness.core.canonical-artifact",
    semanticKind: "concept",
    title: "CanonicalArtifact",
    summary:
      "Addressable project-owned source of accepted engineering truth owned by exactly one Authority.",
    sources: [src("docs/design/core-v0.md", "Entities")],
  },
  {
    id: "harness.core.capability-id",
    semanticKind: "concept",
    title: "CapabilityId",
    summary:
      "Stable identity of accepted engineering knowledge provided by canonical artifacts and produced through the Engineering Graph.",
    sources: [src("docs/design/core-v0.md", "Entities"), src("docs/design/engineering-graph-v0.md", "Capability")],
  },
  {
    id: "harness.core.question",
    semanticKind: "concept",
    title: "Question",
    summary:
      "Material unresolved semantic gap addressed to the Authority allowed to decide it; resolution points back to changed canonical truth.",
    sources: [src("docs/design/core-v0.md", "Entities"), src("docs/design/engineering-graph-v0.md", "Questions and feedback")],
  },
  {
    id: "harness.engineering-graph",
    semanticKind: "mechanism",
    title: "Engineering Graph",
    summary:
      "Normative producer/consumer topology that declares Capability production ownership, prerequisites and Consumer knowledge closure above Core.",
    sources: [src("docs/design/engineering-graph-v0.md")],
  },
  {
    id: "harness.production-contract",
    semanticKind: "concept",
    title: "Production Contract",
    summary:
      "Authority-owned contract declaring one produced CapabilityId and the exact upstream CapabilityIds required to form it.",
    sources: [src("docs/design/engineering-graph-v0.md", "Production contract")],
  },
  {
    id: "harness.consumer",
    semanticKind: "concept",
    title: "Consumer",
    summary:
      "Selected terminal target that consumes engineering knowledge and defines the closure that Harness must derive for that target.",
    sources: [src("docs/design/engineering-graph-v0.md", "Consumer")],
  },
  {
    id: "harness.design-profile",
    semanticKind: "concept",
    title: "Design Profile",
    summary:
      "Target view declaring engineering knowledge that must exist for a selected scope; when an Engineering Graph exists the profile is derived from it.",
    sources: [src("docs/design/target-state-v0.md"), src("docs/design/engineering-graph-v0.md", "Derived target")],
  },
  {
    id: "harness.target-state",
    semanticKind: "mechanism",
    title: "Target State",
    summary:
      "Structural evaluator producing CREATE, WAIT, PENDING or COMPLETE from required knowledge, providers, prerequisites and blockers.",
    sources: [src("docs/design/target-state-v0.md", "Evaluation")],
  },
  {
    id: "harness.artifact-skill",
    semanticKind: "procedure",
    title: "Artifact Skill",
    summary:
      "Reusable agent procedure for obtaining one kind of engineering knowledge from explicit inputs, read boundaries, stop conditions and acceptance checks.",
    sources: [src("docs/design/agent-artifact-workbench-v0.md", "Artifact skill"), src("docs/design/agent-artifact-workbench-v0.md", "Skill contract")],
  },
  {
    id: "harness.managed-knowledge-workspace",
    semanticKind: "mechanism",
    title: "Managed Knowledge Workspace",
    summary:
      "Opt-in project layout where machine-readable canonical knowledge is Harness-managed while human-readable documentation remains disposable projection.",
    sources: [src("docs/design/managed-knowledge-v0.md")],
  },
  {
    id: "harness.semantic.acceptance",
    semanticKind: "mechanism",
    title: "Semantic Acceptance",
    summary:
      "Artifact-specific evaluation boundary checking machine-addressable obligations, provenance, ownership and required semantic review before a capability is accepted.",
    sources: [src("spec/semantic-acceptance/artifact-semantic-acceptance-v1.yaml")],
  },
  {
    id: "harness.semantic.admission",
    semanticKind: "mechanism",
    title: "Semantic Admission",
    summary:
      "Strict capability admission path composing production contract, Authority context, provenance, semantic acceptance, decision governance and lifecycle baseline.",
    sources: [src("semantic_admission.py"), src("docs/design/agent-artifact-workbench-v0.md", "Mandatory strict admission for routed artifact skills")],
  },
  {
    id: "harness.semantic.assertion",
    semanticKind: "concept",
    title: "Semantic Assertion / Atom",
    summary:
      "Individually addressable accepted semantic claim used for obligation accounting, semantic fingerprints and downstream derivation evidence.",
    sources: [src("spec/semantic-acceptance/artifact-semantic-acceptance-v1.yaml", "candidate_assertions"), src("docs/research/real-project-semantic-atom-coverage-proof-v0.md")],
  },
  {
    id: "harness.semantic.surface-admission",
    semanticKind: "mechanism",
    title: "Semantic Surface Admission",
    summary:
      "Assurance boundary that reviews statement-to-atom fidelity before extracted semantic atoms become an authoritative downstream derivation surface.",
    sources: [src("docs/research/semantic-surface-extraction-admission-v0.md"), src("docs/design/agent-artifact-workbench-v0.md", "Reconstruction and blind source coverage")],
  },
  {
    id: "harness.semantic.derivation",
    semanticKind: "mechanism",
    title: "Semantic Derivation",
    summary:
      "Generated evidence for preservation of accepted semantics across one direct Engineering Graph production dependency without requiring literal artifact identity.",
    sources: [src("spec/semantic-derivation/semantic-derivation-v1.yaml"), src("docs/research/capability-derivation-testing-closure-v1.md")],
  },
  {
    id: "harness.semantic.judgement",
    semanticKind: "mechanism",
    title: "Semantic Judgement",
    summary:
      "Request-bound HUMAN/EVALUATOR review used where deterministic trace structure cannot establish the truth of one declared semantic relation.",
    sources: [src("spec/semantic-derivation/semantic-derivation-v1.yaml", "semantic_judgement"), src("docs/research/semantic-judgement-calibration-v0.md")],
  },
  {
    id: "harness.lifecycle.capability-currentness",
    semanticKind: "mechanism",
    title: "Capability Lifecycle",
    summary:
      "Derived currentness model that checks whether an accepted Capability remains valid against the accepted prerequisite semantic baseline used during admission.",
    sources: [src("docs/design/capability-lifecycle-projection-v1.md")],
  },
  {
    id: "harness.semantic.closure",
    semanticKind: "mechanism",
    title: "Semantic Closure",
    summary:
      "Strict closure evaluator combining structural Consumer closure, accepted semantic evidence, generated Questions and Capability currentness.",
    sources: [src("semantic_closure.py"), src("docs/design/agent-artifact-workbench-v0.md", "Semantic completeness and automatic Questions")],
  },
  {
    id: "harness.source.set",
    semanticKind: "mechanism",
    title: "Source Set",
    summary:
      "Contract-relative assurance that every required evidence channel was reviewed and met the minimum accepted acquisition scope.",
    sources: [src("docs/research/source-set-evidence-boundary-v0.md"), src("source_set.py")],
  },
  {
    id: "harness.source.boundary",
    semanticKind: "mechanism",
    title: "Source Boundary",
    summary:
      "Deterministic lossless coverage boundary proving that no line or item disappears inside one selected immutable source before semantic review.",
    sources: [src("docs/research/source-boundary-statement-enumeration-v0.md"), src("source_boundary.py")],
  },
  {
    id: "harness.source.statement-enumeration-review",
    semanticKind: "procedure",
    title: "Statement Enumeration Review",
    summary:
      "Local semantic review that decomposes one losslessly covered source unit into independently meaningful source statements.",
    sources: [src("docs/research/source-boundary-statement-enumeration-v0.md", "Local statement-enumeration review")],
  },
  {
    id: "harness.source.coverage",
    semanticKind: "mechanism",
    title: "Source Coverage",
    summary:
      "Statement-level accounting that requires every enumerated source statement to have one explicit admitted, excluded or Question disposition.",
    sources: [src("source_coverage.py"), src("skills/artifacts/source-coverage-audit/SKILL.md")],
  },
  {
    id: "harness.coverage.engineering",
    semanticKind: "mechanism",
    title: "Engineering Coverage",
    summary:
      "Consumer- and scope-specific completeness evaluation over declared graph closure, activated engineering concerns, subjects and accepted semantic proof.",
    sources: [src("docs/research/engineering-coverage-evaluator.md"), src("docs/design/engineering-coverage-subject-obligations.md")],
  },
  {
    id: "harness.coverage.concern",
    semanticKind: "concept",
    title: "Engineering Concern",
    summary:
      "Reusable engineering concern identity from the Harness concern catalog, activated and proven for a selected Consumer and scope rather than persisted as project truth.",
    sources: [src("spec/engineering-coverage/concern-catalog-v1.yaml")],
  },
  {
    id: "harness.coverage.subject-obligation",
    semanticKind: "concept",
    title: "Subject Obligation",
    summary:
      "Canonical routing/classification knowledge identifying which accepted scope atoms require subject-scoped engineering proof.",
    sources: [src("docs/design/engineering-coverage-subject-obligations.md")],
  },
  {
    id: "harness.coverage.map",
    semanticKind: "concept",
    title: "Coverage Map",
    summary:
      "Generated human-readable projection of Engineering Coverage; it never becomes independent project authority.",
    sources: [src("docs/research/engineering-coverage-map.md"), src("docs/design/engineering-coverage-subject-obligations.md")],
  },
  {
    id: "harness.decision.governance",
    semanticKind: "mechanism",
    title: "Decision Governance",
    summary:
      "Assurance above Core that separates option-search diligence from delegated decision autonomy while preserving Authority ownership boundaries.",
    sources: [src("docs/design/decision-governance-v0.md")],
  },
  {
    id: "harness.decision.exploration",
    semanticKind: "procedure",
    title: "Decision Exploration",
    summary:
      "Pre-choice option-formation procedure that searches materially distinct alternatives and reviews the discovered decision space before any choice is made.",
    sources: [src("docs/design/decision-governance-v0.md", "Decision surface"), src("docs/design/decision-pipeline-v0.md", "Option formation")],
  },
  {
    id: "harness.decision.pipeline",
    semanticKind: "procedure",
    title: "Decision Pipeline",
    summary:
      "Sequential Capability procedure: form options, review options, choose or escalate, produce candidate, then perform semantic admission.",
    sources: [src("docs/design/decision-pipeline-v0.md")],
  },
  {
    id: "harness.scenario-suite",
    semanticKind: "mechanism",
    title: "Scenario Suite",
    summary:
      "Executable behavioral specification that drives Harness mechanisms over project/scenario states and asserts invariants over structured observations.",
    sources: [src("docs/design/scenario-suite-v0.md")],
  },
  {
    id: "harness.graph-doctor",
    semanticKind: "mechanism",
    title: "Graph Doctor",
    summary:
      "Non-destructive aggregate diagnostic pass over Engineering Graph, Core realization, canonical files and project graph alignment.",
    sources: [src("docs/design/graph-doctor-v1.md")],
  },
  {
    id: "harness.human-documentation-projection",
    semanticKind: "mechanism",
    title: "Human Documentation Projection",
    summary:
      "Consumer-scoped generation of source-bounded human-readable documentation from accepted engineering knowledge without creating a second source of truth.",
    sources: [src("docs/design/human-documentation-projection-v1.md")],
  },
  {
    id: "harness.frontend-design-model",
    semanticKind: "strategy",
    title: "Frontend Design Model",
    summary:
      "Harness application of the existing engineering-knowledge model to user-facing design, with granular interface knowledge and ordinary Authority boundaries.",
    sources: [src("docs/design/frontend-design-v0.md")],
  },
];

const rel = (
  id: string,
  sourceId: string,
  predicate: string,
  targetId: string,
  evidenceMode: HarnessKnowledgeEvidenceMode,
  sources: readonly HarnessKnowledgeSourceRef[],
  options: {
    readonly condition?: string;
    readonly sourceNativePredicate?: string;
    readonly projectionType?: KnowledgeRelationType;
  } = {},
): HarnessKnowledgeFixtureRelation => ({
  id: `harness-relation-${id}`,
  sourceId,
  targetId,
  predicate,
  evidenceMode,
  sources,
  ...options,
});

const core = [src("docs/design/core-v0.md", "Relations")];
const graph = [src("docs/design/engineering-graph-v0.md")];
const target = [src("docs/design/target-state-v0.md")];
const workbench = [src("docs/design/agent-artifact-workbench-v0.md")];
const semanticAcceptance = [src("spec/semantic-acceptance/artifact-semantic-acceptance-v1.yaml")];
const semanticDerivation = [src("spec/semantic-derivation/semantic-derivation-v1.yaml")];
const sourceAssurance = [src("docs/research/source-to-derivation-assurance-closure-v1.md")];
const engineeringCoverage = [src("docs/design/engineering-coverage-subject-obligations.md")];
const decision = [src("docs/design/decision-pipeline-v0.md"), src("docs/design/decision-governance-v0.md")];
const scenario = [src("docs/design/scenario-suite-v0.md")];

export const harnessKnowledgeFixtureRelations: readonly HarnessKnowledgeFixtureRelation[] = [
  rel("core-part-of-harness", "harness.core", "part_of", "harness", "curated", [src("README.md")], { projectionType: "part_of" }),
  rel("engineering-graph-part-of-harness", "harness.engineering-graph", "part_of", "harness", "curated", [src("README.md", "Engineering Graph v0")], { projectionType: "part_of" }),
  rel("managed-knowledge-part-of-harness", "harness.managed-knowledge-workspace", "part_of", "harness", "curated", [src("README.md", "Managed knowledge workspace")], { projectionType: "part_of" }),
  rel("semantic-acceptance-part-of-harness", "harness.semantic.acceptance", "part_of", "harness", "curated", [src("AGENTS.md")], { projectionType: "part_of" }),
  rel("semantic-derivation-part-of-harness", "harness.semantic.derivation", "part_of", "harness", "curated", [src("AGENTS.md")], { projectionType: "part_of" }),
  rel("source-coverage-part-of-harness", "harness.source.coverage", "part_of", "harness", "curated", [src("AGENTS.md")], { projectionType: "part_of" }),
  rel("engineering-coverage-part-of-harness", "harness.coverage.engineering", "part_of", "harness", "curated", [src("AGENTS.md")], { projectionType: "part_of" }),
  rel("decision-governance-part-of-harness", "harness.decision.governance", "part_of", "harness", "curated", [src("AGENTS.md")], { projectionType: "part_of" }),
  rel("scenario-suite-part-of-harness", "harness.scenario-suite", "part_of", "harness", "curated", [src("AGENTS.md")], { projectionType: "part_of" }),
  rel("graph-doctor-part-of-harness", "harness.graph-doctor", "part_of", "harness", "curated", [src("AGENTS.md")], { projectionType: "part_of" }),
  rel("human-projection-part-of-harness", "harness.human-documentation-projection", "part_of", "harness", "curated", [src("AGENTS.md")], { projectionType: "part_of" }),
  rel("frontend-design-part-of-harness", "harness.frontend-design-model", "part_of", "harness", "curated", [src("AGENTS.md")], { projectionType: "part_of" }),

  rel("authority-owns-artifact", "harness.core.authority", "owns", "harness.core.canonical-artifact", "extracted", core, { sourceNativePredicate: "owns" }),
  rel("artifact-realizes-capability", "harness.core.canonical-artifact", "realizes", "harness.core.capability-id", "curated", core, { sourceNativePredicate: "provides", projectionType: "realizes" }),
  rel("question-addressed-to-authority", "harness.core.question", "addressed_to", "harness.core.authority", "extracted", core, { sourceNativePredicate: "addressed to" }),
  rel("question-blocks-artifact", "harness.core.question", "blocks", "harness.core.canonical-artifact", "extracted", core, { sourceNativePredicate: "blocks" }),
  rel("question-blocks-capability", "harness.core.question", "blocks", "harness.core.capability-id", "extracted", core, { sourceNativePredicate: "blocks_capabilities" }),

  rel("production-contract-produces-capability", "harness.production-contract", "produces", "harness.core.capability-id", "extracted", graph, { sourceNativePredicate: "produces", projectionType: "produces" }),
  rel("production-contract-requires-capability", "harness.production-contract", "requires", "harness.core.capability-id", "extracted", graph, { sourceNativePredicate: "requires" }),
  rel("consumer-requires-capability", "harness.consumer", "requires", "harness.core.capability-id", "extracted", graph, { sourceNativePredicate: "requires" }),
  rel("engineering-graph-produces-profile", "harness.engineering-graph", "produces", "harness.design-profile", "extracted", [src("docs/design/engineering-graph-v0.md", "Derived target")], { sourceNativePredicate: "derive", projectionType: "produces" }),
  rel("design-profile-requires-capability", "harness.design-profile", "requires", "harness.core.capability-id", "extracted", target, { sourceNativePredicate: "expectation.capability" }),
  rel("target-state-evaluates-profile", "harness.target-state", "evaluates", "harness.design-profile", "extracted", target),
  rel("target-state-evaluates-core", "harness.target-state", "evaluates", "harness.core", "curated", target),
  rel("managed-workspace-requires-core", "harness.managed-knowledge-workspace", "requires", "harness.core", "extracted", [src("docs/design/managed-knowledge-v0.md", "Responsibilities are intentionally separated")]),
  rel("managed-workspace-requires-profile", "harness.managed-knowledge-workspace", "requires", "harness.design-profile", "extracted", [src("docs/design/managed-knowledge-v0.md", "Responsibilities are intentionally separated")]),
  rel("artifact-skill-requires-contract", "harness.artifact-skill", "requires", "harness.production-contract", "curated", workbench),

  rel("semantic-admission-requires-acceptance", "harness.semantic.admission", "requires", "harness.semantic.acceptance", "extracted", workbench),
  rel("semantic-admission-requires-graph", "harness.semantic.admission", "requires", "harness.engineering-graph", "extracted", workbench),
  rel("semantic-admission-requires-lifecycle", "harness.semantic.admission", "requires", "harness.lifecycle.capability-currentness", "extracted", [src("docs/design/capability-lifecycle-projection-v1.md", "Admission integration")]),
  rel("semantic-surface-requires-coverage", "harness.semantic.surface-admission", "requires", "harness.source.coverage", "extracted", sourceAssurance),
  rel("semantic-surface-requires-acceptance", "harness.semantic.surface-admission", "requires", "harness.semantic.acceptance", "curated", sourceAssurance),
  rel("semantic-surface-requires-judgement", "harness.semantic.surface-admission", "requires", "harness.semantic.judgement", "curated", sourceAssurance, { condition: "when statement-to-atom fidelity cannot be established deterministically" }),
  rel("semantic-derivation-requires-assertion", "harness.semantic.derivation", "requires", "harness.semantic.assertion", "extracted", semanticDerivation, { sourceNativePredicate: "sources/targets semantic assertions" }),
  rel("semantic-derivation-requires-judgement", "harness.semantic.derivation", "requires", "harness.semantic.judgement", "extracted", semanticDerivation, { condition: "semantic_judgement.required == true", sourceNativePredicate: "semantic_judgement.required" }),
  rel("semantic-closure-requires-graph", "harness.semantic.closure", "requires", "harness.engineering-graph", "extracted", [src("semantic_closure.py")]),
  rel("semantic-closure-requires-acceptance", "harness.semantic.closure", "requires", "harness.semantic.acceptance", "extracted", [src("semantic_closure.py")]),
  rel("semantic-closure-requires-lifecycle", "harness.semantic.closure", "requires", "harness.lifecycle.capability-currentness", "extracted", [src("semantic_closure.py")]),

  rel("source-coverage-requires-boundary", "harness.source.coverage", "requires", "harness.source.boundary", "extracted", sourceAssurance, { condition: "when source-loss assurance is material" }),
  rel("source-coverage-requires-enumeration", "harness.source.coverage", "requires", "harness.source.statement-enumeration-review", "extracted", sourceAssurance),
  rel("source-set-precedes-boundary", "harness.source.boundary", "requires", "harness.source.set", "curated", sourceAssurance, { condition: "when contract-relative source-set assurance is required" }),

  rel("engineering-coverage-requires-graph", "harness.coverage.engineering", "requires", "harness.engineering-graph", "extracted", [src("docs/research/engineering-coverage-evaluator.md")]),
  rel("engineering-coverage-requires-concern", "harness.coverage.engineering", "requires", "harness.coverage.concern", "extracted", engineeringCoverage),
  rel("engineering-coverage-requires-subject-obligation", "harness.coverage.engineering", "requires", "harness.coverage.subject-obligation", "extracted", engineeringCoverage, { condition: "when subject_inventory is REQUIRED" }),
  rel("coverage-map-represents-coverage", "harness.coverage.map", "represents", "harness.coverage.engineering", "extracted", engineeringCoverage, { sourceNativePredicate: "projection" }),

  rel("decision-governance-requires-exploration", "harness.decision.governance", "requires", "harness.decision.exploration", "extracted", decision),
  rel("decision-pipeline-requires-exploration", "harness.decision.pipeline", "requires", "harness.decision.exploration", "extracted", decision),
  rel("decision-pipeline-requires-governance", "harness.decision.pipeline", "requires", "harness.decision.governance", "extracted", decision),
  rel("decision-pipeline-requires-admission", "harness.decision.pipeline", "requires", "harness.semantic.admission", "extracted", decision),

  rel("graph-doctor-evaluates-graph", "harness.graph-doctor", "evaluates", "harness.engineering-graph", "extracted", [src("docs/design/graph-doctor-v1.md")]),
  rel("graph-doctor-evaluates-core", "harness.graph-doctor", "evaluates", "harness.core", "extracted", [src("docs/design/graph-doctor-v1.md")]),
  rel("human-projection-requires-graph", "harness.human-documentation-projection", "requires", "harness.engineering-graph", "extracted", [src("docs/design/human-documentation-projection-v1.md")]),
  rel("human-projection-requires-core", "harness.human-documentation-projection", "requires", "harness.core", "extracted", [src("docs/design/human-documentation-projection-v1.md")]),
  rel("human-projection-requires-artifact", "harness.human-documentation-projection", "requires", "harness.core.canonical-artifact", "extracted", [src("docs/design/human-documentation-projection-v1.md")]),
  rel("frontend-design-requires-graph", "harness.frontend-design-model", "requires", "harness.engineering-graph", "curated", [src("docs/design/frontend-design-v0.md", "Boundary")]),
  rel("frontend-design-requires-core", "harness.frontend-design-model", "requires", "harness.core", "curated", [src("docs/design/frontend-design-v0.md", "Boundary")]),

  rel("scenario-tests-core", "harness.scenario-suite", "tests", "harness.core", "extracted", scenario),
  rel("scenario-tests-graph", "harness.scenario-suite", "tests", "harness.engineering-graph", "extracted", scenario),
  rel("scenario-tests-semantic-acceptance", "harness.scenario-suite", "tests", "harness.semantic.acceptance", "extracted", scenario),
  rel("scenario-tests-semantic-derivation", "harness.scenario-suite", "tests", "harness.semantic.derivation", "extracted", scenario),
  rel("scenario-tests-lifecycle", "harness.scenario-suite", "tests", "harness.lifecycle.capability-currentness", "extracted", scenario),
  rel("scenario-tests-engineering-coverage", "harness.scenario-suite", "tests", "harness.coverage.engineering", "extracted", scenario),
  rel("scenario-tests-decision-governance", "harness.scenario-suite", "tests", "harness.decision.governance", "extracted", scenario),
  rel("scenario-tests-graph-doctor", "harness.scenario-suite", "tests", "harness.graph-doctor", "extracted", scenario),
];

export const harnessKnowledgeProjectedNodes: readonly KnowledgeNodeModel[] =
  harnessKnowledgeFixtureNodes.map(({ id, semanticKind, title, summary }) => ({
    id,
    semanticKind,
    title,
    summary,
  }));

export const harnessKnowledgeProjectedRelations: readonly KnowledgeRelationModel[] =
  harnessKnowledgeFixtureRelations
    .filter(
      (
        relation,
      ): relation is HarnessKnowledgeFixtureRelation & {
        readonly projectionType: KnowledgeRelationType;
      } => relation.projectionType !== undefined && relation.condition === undefined,
    )
    .map(({ id, sourceId, targetId, projectionType }) => ({
      id,
      sourceId,
      targetId,
      type: projectionType,
    }));

export const harnessKnowledgeProjectionLosses =
  harnessKnowledgeFixtureRelations.filter(
    (relation) =>
      relation.projectionType === undefined || relation.condition !== undefined,
  );
