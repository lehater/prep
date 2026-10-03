# Application Design

## Purpose

Define Prep application operations, materializations, orchestration, outcomes and currentness semantics required to realize the accepted Task Model without re-owning Product, Subject Knowledge, Capability/Learning, Learner Evidence/State, machine-interface, persistence, concurrency or UI semantics.

The primary application loop is:

```text
establish target
  -> understand required performance
  -> review evidence-backed current state
  -> review gaps / uncertainty
  -> choose next focus
  -> inspect knowledge and/or select support
  -> perform activity
  -> capture Performance / Observations
  -> evaluate evidence
  -> review what changed
  -> continue / refocus / diagnose / refine target
```

Missing preparation support forms a second bounded loop:

```text
request preparation support
  -> prepare owner-scoped candidate meaning
  -> accept/reject/unresolve through semantic owners
  -> return usable support plus remaining gaps
```

## Application boundaries

- Application operations compose accepted semantics; they do not redefine target, Capability, Knowledge, support, Performance, Observation, evidence argument or learner-state meaning.
- Every mutation is performed by the semantic owner of the affected meaning. Application orchestration may coordinate multiple owners but is not a cross-context aggregate owner.
- `TaskSpecification` remains a reusable performer-facing performance opportunity; application task ids remain Task Model work.
- Learner-facing bootstrap does not imply learner-owned corpus curation or schema repair.
- Graph/list/detail, routes, screens, API shapes, persistence and framework decomposition remain downstream.

## Operation catalogue

| Operation | Kind | Task | Reads | Writes / owner | Observable result |
|---|---|---|---|---|---|
| `APP-ESTABLISH-TARGET` | command/query composition | `TASK-U-ESTABLISH-TARGET` | prepared targets, source context, known purpose/uncertainty | PreparationTarget/refinement through its tactical owner; active application context | active target or explicit unresolved preparation need |
| `APP-UNDERSTAND-REQUIREMENTS` | materialization/query | `TASK-U-UNDERSTAND-REQUIREMENTS` | target purpose, RequirementExpression, CapabilitySpecifications, standards, Knowledge focus | none | target-requirement view preserving performance/conditions/quality and all_of/any_of meaning |
| `APP-REVIEW-CURRENT-STATE` | materialization/query | `TASK-U-REVIEW-CURRENT-STATE` | applicable claims, evidence arguments, Observations, time/condition/transfer limits | none | demonstrated/challenged/unknown projection with inspectable basis |
| `APP-REVIEW-GAPS` | materialization/query | `TASK-U-REVIEW-GAPS` | target requirements plus current learner-state projection | none | target-relative satisfied/challenged/unresolved fragments and Gap basis |
| `APP-CHOOSE-NEXT-FOCUS` | command | `TASK-U-CHOOSE-NEXT-FOCUS` | gaps/uncertainty, target relevance, explicit external constraints, support availability | PreparationIntent / priority through Learning Design owner | explicit current preparation focus with rationale |
| `APP-EXPLORE-KNOWLEDGE` | materialization/query | `TASK-U-EXPLORE-KNOWLEDGE` | KnowledgeObjects, KnowledgePropositions, relation predicates, semantic scope/depth and permitted target/focus refs | none | semantic overview/detail projection independent of presentation form |
| `APP-SELECT-SUPPORT` | materialization/query | `TASK-U-SELECT-SUPPORT` | PreparationIntent, CapabilitySpecification, LearningMaterial, LearningSupportRequirement, TaskSpecification, ObservationSpecification | none | applicable support options and explicit inadequacy/limitations |
| `APP-PERFORM-ACTIVITY` | orchestration | `TASK-U-PERFORM-ACTIVITY` | selected support and correlation context | no learner-state write; delegates local/external execution | activity attempt context and, when observable, input for Performance capture |
| `APP-CAPTURE-PERFORMANCE` | command | `TASK-S-CAPTURE-PERFORMANCE` | actual attributable actions/work product/reasoning, known conditions, time, provenance | Performance and Observation through Learner Evidence & State owner | historical facts or explicit integration-boundary/unresolved result |
| `APP-EVALUATE-EVIDENCE` | command/materialization | `TASK-S-EVALUATE-EVIDENCE` | Observations, reusable Capability scope, time/conditions/coverage/dependence/target relevance | CapabilityEvidenceArgument and justified LearnerCapabilityClaim through Learner Evidence & State owner | accepted supports/challenges inference and recomputed current-state projection |
| `APP-REVIEW-CHANGE` | materialization/query | `TASK-U-REVIEW-CHANGE` | previous/current semantic bases, new evidence, gaps/priorities, separately classified target information | none | explainable state/target-understanding delta and continuation choices |
| `APP-REQUEST-PREPARATION-SUPPORT` | command | `TASK-U-REQUEST-PREPARATION-SUPPORT` | motivating target/focus, fragmented sources, known missing support | preparation request/correlation context only; no reusable semantic truth | accepted request with preserved purpose/sources or explicit dependency/unresolved outcome |
| `APP-PREPARE-SUPPORT` | orchestration | `TASK-S-PREPARE-SUPPORT` | request, source provenance, current accepted target/capability/knowledge/support semantics | owner-scoped accepted target/capability/Knowledge/learning/observation-spec semantics only through their owners | accepted owner-scoped results plus rejected/unresolved remainder and continuation context |

## Mutation ownership

Application Design never performs a semantic cross-owner mutation.

- PreparationTarget, RequirementExpression, CapabilitySpecification, PreparationIntent, LearningMaterial, LearningSupportRequirement, TaskSpecification and ObservationSpecification remain owned by their accepted tactical semantics.
- KnowledgeObject and KnowledgeProposition remain owned by Subject Knowledge.
- Performance, Observation, CapabilityEvidenceArgument and LearnerCapabilityClaim remain owned by Learner Evidence & State.
- Target-relative state and Gap views are projections/materializations, not mutable learner-state records.
- A preparation-support operation may coordinate multiple owner writes, but each owner validates and accepts only its own semantic meaning.

## Orchestration order

Where evidence can change learner-state conclusions, the semantic order is:

1. preserve the actual activity facts as Performance and Observation;
2. evaluate evidence applicability and produce an inspectable CapabilityEvidenceArgument;
3. create/update a LearnerCapabilityClaim only where the argument justifies it;
4. recompute target-relative state, gaps and focus inputs;
5. expose the delta for review.

The application may not infer capability first and backfill observations later.

Target-information changes follow a separate branch: refine target understanding through its owner, then recompute target-relative projections. They are never treated as learner evidence.

## Outcome model

Application operations distinguish:

- `SUCCESS` — requested application outcome exists;
- `UNRESOLVED` — accepted semantics are insufficient to establish the requested conclusion/result;
- `REJECTED` — an owning semantic contract rejects the requested mutation or inference;
- `DEPENDENCY_UNAVAILABLE` — required external/system support cannot currently complete the operation;
- `STALE_BASIS` — a command depends on a previously inspected semantic basis that materially changed.

These outcomes remain distinct. Missing evidence, unsupported source meaning and dependency outages are not collapsed into domain rejection.

No application-level automatic retry policy is accepted. Retry/idempotency/consistency mechanics belong to their downstream owners unless a later accepted requirement makes them semantic.

## Partial preparation results

Preparation support is owner-scoped rather than one global cross-owner transaction.

Independently valid results may be accepted by their semantic owners while conflicting, unsupported or incomplete candidates remain rejected/unresolved. The operation returns both accepted results and remaining preparation gaps so work can continue without discarding trustworthy accepted meaning.

Application Design does not define physical transaction boundaries, rollback algorithms or retry/idempotency semantics.

## Currentness and continuation

Task-oriented read models expose an opaque **semantic basis** identifying the accepted target/evidence/focus inputs from which the materialization was derived.

A command that semantically depends on a previously inspected materialization supplies that basis. If material inputs changed, the application returns `STALE_BASIS` together with or followed by a refreshed materialization instead of silently applying the command to a different meaning.

This basis is application currentness metadata, not a domain entity and not a transport token format.

The mechanism supports:

- distinguishing previous from current target-relative state;
- showing what changed after evidence or target refinement;
- preventing support/focus actions from silently using materially different target/evidence inputs;
- preserving history while recomputing the current projection.

## Synchronous/asynchronous applicability

Accepted behavior requires semantic completion boundaries, not a particular runtime timing model.

The operations above are logical application operations. Downstream System/Machine Interface Design may realize a long-running operation asynchronously only if it preserves the same owner ordering, outcomes, semantic basis/currentness and continuation result. Fire-and-forget continuation on unprocessed evidence is not equivalent.

## Implementation freedoms

Application Design does not choose:

- HTTP/RPC/file/message representations;
- database or transaction technology;
- queue/job infrastructure;
- retry/idempotency algorithms;
- frontend routes/components/state libraries;
- graph/list/2D/3D presentation;
- persistence schema.

Those choices remain downstream provided this operation/outcome/currentness contract is preserved.
