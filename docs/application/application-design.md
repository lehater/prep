# Application Design

## Purpose

Define Prep application operations, materializations, outcomes, semantic ownership and currentness required to realize the accepted Task Model without re-owning Product, Subject Knowledge, Capability/Learning, Learner Evidence/State, Process, machine-interface, persistence, concurrency or UI semantics.

Application Design defines the work units that Process capabilities may coordinate. Independently consumable process occurrence, composition, continuation and completion semantics are owned by dedicated `application-process-design` capabilities.

## Application boundaries

- Application operations compose accepted semantics; they do not redefine Target, Capability, Knowledge, support, Performance, Observation, evidence argument or learner-state meaning.
- Every semantic mutation is validated and accepted by the owner of the affected meaning.
- Read/materialization operations remain separate from commands where that distinction is material to user decisions or currentness.
- `TaskSpecification` remains reusable performer-facing domain meaning; Application Task Model ids remain intended work.
- Learner-facing preparation does not imply learner-owned corpus/schema maintenance.
- Process occurrence boundaries, routes/screens, APIs, persistence and framework topology remain outside this artifact.

## Operation catalogue

| Operation | Kind | Task | Reads | Writes / owner | Observable result |
|---|---|---|---|---|---|
| `APP-ESTABLISH-TARGET` | command/query composition | `TASK-U-ESTABLISH-TARGET` | prepared targets, source context, purpose/uncertainty | target/refinement through its tactical owner; active application context | active target or explicit unresolved preparation need |
| `APP-UNDERSTAND-REQUIREMENTS` | materialization/query | `TASK-U-UNDERSTAND-REQUIREMENTS` | target purpose, RequirementExpression, CapabilitySpecifications, standards, Knowledge focus | none | target requirements preserving performance/conditions/quality and Boolean structure |
| `APP-REVIEW-CURRENT-STATE` | materialization/query | `TASK-U-REVIEW-CURRENT-STATE` | claims, evidence arguments, Observations, applicability limits | none | demonstrated/challenged/unknown projection with inspectable basis |
| `APP-REVIEW-GAPS` | materialization/query | `TASK-U-REVIEW-GAPS` | target requirements plus current learner-state projection | none | satisfied/challenged/unresolved fragments and Gap basis |
| `APP-CHOOSE-NEXT-FOCUS` | command | `TASK-U-CHOOSE-NEXT-FOCUS` | gaps/uncertainty, target relevance, explicit external constraints, support availability | PreparationIntent / priority through Learning Design owner | explicit current focus with rationale |
| `APP-EXPLORE-KNOWLEDGE` | materialization/query | `TASK-U-EXPLORE-KNOWLEDGE` | KnowledgeObjects, KnowledgePropositions, relation predicates, semantic scope/depth, permitted target/focus refs and optional Required Capability with direct Knowledge-focus anchors | none | semantic overview/detail projection optionally bounded by a selected Required Capability, independent of presentation form |
| `APP-SELECT-SUPPORT` | materialization/query | `TASK-U-SELECT-SUPPORT` | PreparationIntent, CapabilitySpecification, LearningMaterial, LearningSupportRequirement, TaskSpecification, ObservationSpecification | none | applicable support options and explicit inadequacy/limitations |
| `APP-PERFORM-ACTIVITY` | orchestration operation | `TASK-U-PERFORM-ACTIVITY` | selected support and correlation context | no learner-state write; delegates local/external execution | activity attempt context and, when observable, input for Performance capture |
| `APP-CAPTURE-PERFORMANCE` | command | `TASK-S-CAPTURE-PERFORMANCE` | attributable actions/work product/reasoning, conditions, time, provenance | Performance and Observation through Learner Evidence & State owner | historical facts or explicit unresolved integration-boundary result |
| `APP-EVALUATE-EVIDENCE` | command/materialization | `TASK-S-EVALUATE-EVIDENCE` | Observations, Capability scope, time/conditions/coverage/dependence/target relevance | CapabilityEvidenceArgument and justified LearnerCapabilityClaim through Learner Evidence & State owner | supports/challenges inference and recomputed current-state projection |
| `APP-REVIEW-CHANGE` | materialization/query | `TASK-U-REVIEW-CHANGE` | previous/current semantic bases, new evidence, gaps/priorities, separately classified target information | none | explainable state/target-understanding delta and continuation choices |
| `APP-REQUEST-PREPARATION-SUPPORT` | command | `TASK-U-REQUEST-PREPARATION-SUPPORT` | motivating target/focus, fragmented sources, known missing support | preparation request/context only; no reusable semantic truth | accepted request or explicit unavailable/unresolved outcome |
| `APP-PREPARE-SUPPORT` | orchestration operation | `TASK-S-PREPARE-SUPPORT` | request, source provenance, current target/capability/knowledge/support semantics | owner-scoped accepted meaning only through semantic owners | accepted owner-scoped results plus rejected/unresolved remainder |

## Mutation ownership

- PreparationTarget, RequirementExpression, CapabilitySpecification, PreparationIntent, LearningMaterial, LearningSupportRequirement, TaskSpecification and ObservationSpecification remain owned by their tactical semantics.
- KnowledgeObject and KnowledgeProposition remain owned by Subject Knowledge.
- Performance, Observation, CapabilityEvidenceArgument and LearnerCapabilityClaim remain owned by Learner Evidence & State.
- Target-relative state and Gap are projections/materializations, not mutable learner-state records.
- Multi-owner preparation may coordinate writes, but every owner accepts only its own meaning.

## Operation-local semantic constraints

`APP-EVALUATE-EVIDENCE` consumes accepted attributable Observations; it cannot infer capability first and backfill observations later. `APP-REVIEW-CHANGE` consumes a completed evidence/target-relative projection rather than manufacturing progress. Target-information changes are classified separately from learner evidence.

`APP-EXPLORE-KNOWLEDGE` may use a selected Required Capability as a reversible scope criterion. Its direct Knowledge focus supplies scope anchors; bounded expansion follows accepted Knowledge relation/scope semantics. This projection never turns the Capability-to-Knowledge relation into Subject Knowledge truth and never mutates either owner.

`APP-PREPARE-SUPPORT` may return independently accepted owner-scoped results plus unresolved/rejected remainder. This is an operation outcome contract, not a process-wide transaction or rollback rule.

## Outcome model

Application operations distinguish `SUCCESS`, `UNRESOLVED`, `REJECTED`, `DEPENDENCY_UNAVAILABLE` and `STALE_BASIS` where applicable. Missing evidence, unsupported source meaning and dependency outages are not collapsed into semantic rejection.

No application-level automatic retry policy is accepted. Retry/idempotency/consistency mechanics remain downstream unless a separately accepted semantic requirement makes them application meaning.

## Currentness basis

Task-oriented read models expose an opaque semantic basis over the accepted target/evidence/focus inputs used to derive them. A dependent command detects material change and returns `STALE_BASIS` with refresh/reconsideration semantics instead of silently acting on different meaning.

The basis is application currentness metadata, not a domain entity, transport token or ProcessState.

## Runtime timing freedom

Logical operations do not require synchronous transport. Downstream realization may execute an operation asynchronously only if its semantic owner ordering, outcomes, currentness and observable completion remain equivalent. Fire-and-forget processing that lets dependent work proceed before required evidence exists is not equivalent.

## Process handoff

Two independently consumable coordination contracts are intentionally outside this artifact:

- `prep.application-process.activity-evidence-cycle` owns one support/activity/evidence/review process occurrence;
- `prep.application-process.prepare-support` owns one missing-support preparation occurrence.

These Process capabilities reference the operations above. Application Design does not duplicate their occurrence boundary, cross-operation composition, continuation/recovery or process completion semantics.

## Implementation freedoms

Application Design does not choose HTTP/RPC/file/message shapes, databases/transactions, queue/job infrastructure, retry/idempotency algorithms, frontend routes/components/state libraries, graph/list/2D/3D presentation or persistence schema.
