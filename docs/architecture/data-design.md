# Data Design

## Purpose

Define the smallest durable physical representation that can preserve the current accepted Knowledge, Learning, Learner, consistency and System Architecture semantics.

Persistence realizes semantic owners; it does not become a second domain model.

## Persistence ownership

For the current scope, one logical persistence boundary is sufficient. Physical co-location does not transfer semantic ownership.

Writes remain owner-scoped:

- Subject Knowledge meaning is owned by its Knowledge model;
- Capability/target/support semantics are owned by Learning Design / Preparation Direction;
- learner historical facts and evidence inference are owned by Learner Evidence & State;
- application coordination does not become persistence ownership.

Concrete database product, ORM, table/column names, indexes beyond required constraints and migration tooling remain implementation freedoms.

## Durable Subject Knowledge representation

Persist enough accepted representation to preserve:

- `KnowledgeObject` stable semantic identity, content and optional open `knowledge_form`;
- `KnowledgeProposition` stable identity and proposition meaning, including participants/conditions where present;
- accepted relational proposition predicate and direction/participant semantics;
- accepted provenance/support references when they are part of the canonical record.

Do not introduce a universal `KnowledgeNode` carrier merely for graph/storage convenience. Spatial/2D/3D graph coordinates are projections and are not canonical Knowledge fields.

## Durable Learning Design representation

Persist accepted owner records required to reconstruct current target/performance/support semantics, including where applicable:

- `Capability`, `PerformanceExpectation`, condition-space and criterion dimensions;
- `CapabilitySpecification` and optional `CapabilityStandard`;
- `PreparationTarget` and recursive `RequirementExpression`;
- current accepted `PreparationIntent` and its target/capability/gap references;
- reusable `LearningMaterial`, `LearningSupportRequirement`, `TaskSpecification` and `ObservationSpecification`.

Derived `Gap`, priority and support-fit projections need not become independent authoritative storage objects when they can be recomputed from accepted target, learner-state and support semantics. An implementation may cache projections only if cache invalidation cannot change semantic truth.

Question/card forms are optional projections and are not required persistence entities.

## Durable Learner Evidence & State representation

Persist historical and inferential semantics distinctly:

- `Performance`: identity, temporal extent, participant attribution, actual known conditions/assistance, actions/traces/work products/reasoning references and provenance;
- `Observation`: identity, referenced Performance/part, asserted observed feature/value, time, provenance and semantic context references;
- `CapabilityEvidenceArgument`: source Observation refs, target `LearnerCapabilityClaim`, supports/challenges bearing, applicability/condition/time/coverage/transfer/dependence limits, reasoning and provenance;
- `LearnerCapabilityClaim`: learner, reusable Capability scope, polarity and time scope.

Historical `Performance`/`Observation` facts are not overwritten to represent a new current-state projection.

Target-relative `demonstrated | challenged | unknown` state is a projection over accepted claims/evidence; it is not a mandatory mutable mastery row.

## Cross-owner references

Cross-owner references use stable semantic IDs while validation remains with the owning contract.

Physical foreign-key-like constraints may preserve existence where owners share the same physical store, but:

- they do not transfer semantic ownership;
- they must not create cross-owner write aggregates;
- they must not reclassify Capability-to-Knowledge, learner evidence, or target requirements as Subject Knowledge relations.

## Consistency realization

Physical persistence must be able to realize Import Consistency without redefining it.

Required realization properties:

- owner-scoped accepted mutation is atomic;
- independently accepted preparation-support owner results may commit independently;
- stale-basis mutation cannot silently overwrite meaning established from a newer semantic basis;
- replay of the same semantic command identity must not create duplicate accepted effects;
- genuinely distinct learner executions remain distinct `Performance` records;
- incompatible concurrent changes to one owner-controlled meaning do not silently become last-writer-wins.

Exact transaction/isolation/version/locking mechanisms remain implementation choices provided these semantics are preserved.

## Currentness and technical correlation

Where the application contract exposes `semantic_basis_ref`, persistence may store an opaque owner/application revision or equivalent technical token sufficient to detect material stale continuation.

Where retry/idempotency requires replay detection, a technical operation record may retain:

- semantic operation kind;
- semantic correlation identity such as activity-attempt or preparation-request reference;
- basis/version needed to distinguish valid continuation from stale replay;
- terminal accepted outcome where necessary for safe replay.

Technical delivery/job IDs are not domain identity.

## External-runtime integration data

External runtime/provider data is integration persistence only.

An adapter may persist the minimum provider mapping/checkpoint information needed to correlate a supported external activity or avoid duplicate delivery. Such records must point to current semantic identities such as activity attempt, Performance/Observation provenance, or support/runtime correlation as appropriate.

No provider-specific identifier replaces Prep semantic identity. No Anki/Question-specific mapping is required by Data Design.

## Lifecycle and retention

Current semantics require historical learner evidence to remain distinguishable across time, but no independent retention/deletion/backup/encryption policy is accepted here.

Do not invent:

- universal retention periods;
- backup/restore targets;
- audit-history obligations beyond accepted semantic/provenance history;
- tenant partitioning;
- deletion/anonymization policy;
- semantic version-history machinery beyond what accepted currentness/provenance requires.

## Explicitly removed legacy assumptions

The current Data Design does not treat the following as canonical entities:

- `KnowledgeNode` / generic `KnowledgeRelation`;
- `Requirement` / `RequirementSet` as the old target model;
- fundamental `Question`;
- `LearningTarget`;
- Question-specific `ReviewObservation` with rating/interval/review-phase semantics;
- canonical Question-to-Anki mappings;
- normalized-question-text fingerprint identity.

Those concepts belonged to superseded compatibility/reference models and must not define production persistence.

## Reopening conditions

Revisit Data Design when accepted requirements introduce multiple users/tenants, explicit retention/deletion/protection rules, backup/recovery objectives, independently durable workflow/job lifecycle, offline synchronization, multiple authoritative stores, provider-specific synchronization semantics with independent product value, or non-trivial migration/coexistence requirements.
