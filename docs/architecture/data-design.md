# Data Design

## Purpose

Define the smallest durable representation needed to preserve accepted Prep semantics and import consistency. Storage remains a physical realization, not a second domain owner.

## Persistence boundary

The backend owns access to one logical durable store for the current scope. Model contexts retain semantic ownership even when physically stored together.

No accepted driver requires a database per bounded context.

Durability currently means canonical data survives ordinary backend/container restarts. Backup/restore, backup retention and point-in-time recovery are intentionally deferred while the data model is still expected to change rapidly; they are not current persistence obligations.

The first version has one user/data scope. Canonical records therefore do not require user/tenant ownership columns or tenant-scoped uniqueness. This is an explicit current-scope decision, not an assumption that the product will remain single-user.

## Durable records

### Knowledge Model

Persist enough accepted semantic representation to preserve:

- `KnowledgeObject` stable semantic identity, accepted subject meaning, optional open `knowledge_form` classification and relevant provenance/support;
- `KnowledgeProposition` stable identity, predicate/conclusion, participants, conditions and relevant provenance/support.

Relational Subject Knowledge is persisted as `KnowledgeProposition` meaning rather than as a generic `KnowledgeRelation` edge type. References to proposition participants must resolve to the accepted semantic subjects they identify.

### Learning Design

Persist enough accepted representation to reconstruct the current reusable preparation semantics, including where applicable:

- `Capability` identity and its PerformanceExpectation, condition space, constitutive constraints, criterion dimensions and direct Knowledge-focus references;
- reusable or selected `CapabilitySpecification` scope/standard values referenced by targets, support or evidence;
- `PreparationTarget`, its purpose/context and RequirementExpression structure without flattening `all_of` / `any_of`;
- current accepted `PreparationPriority` / `PreparationIntent` when the application must preserve preparation direction across restarts;
- reusable `LearningMaterial`, `LearningSupportRequirement`, `TaskSpecification` and `ObservationSpecification` semantics and their cross-context references.

Derived target-relative Gap/state projections do not need to become independent durable truth when they can be recomputed from accepted target requirements and learner evidence/state.

Contextual support fit is not persisted as an intrinsic property of Capability, support or learner. If a concrete selection decision needs durable provenance, store the decision context/reference separately from the reusable support meaning.

`Question` is not a canonical persistence entity. A question/card-like interaction is a runtime/interface projection over accepted Learning Design and Subject Knowledge semantics.

### Learner Model

Persist historical `Performance` records with their temporal extent, actual known conditions, attributable actions/traces/work products or expressed reasoning and provenance.

Persist `Observation` tokens with their Performance reference, subject attribution, assertion/value, time/provenance and semantic-context references.

Persist accepted `CapabilityEvidenceArgument` and `LearnerCapabilityClaim` records with the exact claim scope, bearing, applicability/coverage/transfer/dependence limits, reasoning, time and provenance needed to reproduce the accepted inference.

Learner state such as demonstrated/challenged/unknown remains a projection over applicable accepted claims and evidence arguments rather than a mutable persisted mastery/state truth.

Accepted historical Performance/Observation/evidence records are not overwritten merely to represent a new current projection.

## Cross-model references

Cross-model references use canonical stable IDs while semantic validation remains with the owning application/domain contracts.

Physical foreign keys may be used where they preserve accepted existence constraints within the single logical store, but they do not transfer semantic ownership.

## Import identity

Durably preserve enough import identity to enforce the accepted priority:

- canonical Prep ID;
- stable import key with producer/import namespace where applicable;
- technical fingerprint plus fingerprint canonicalization/algorithm version when fallback identity is used.

A uniqueness constraint must prevent two canonical records of the same importable kind from claiming the same active stable import identity.

Fingerprint uniqueness is scoped by importable kind and fingerprint version. It is a technical duplicate guard, not semantic equality.

## Item transactions

One import item is the transaction boundary for its durable canonical changes and technical import identity.

Successful peer items in the same bulk request commit independently. Rejected items leave no partial durable mutation for that item.

Concurrent creation of the same resolved import identity is serialized by durable uniqueness/transaction behavior so only one logical canonical object is created.

Conflicting concurrent updates to the same stable identity must not silently use last-writer-wins. A conflict is surfaced unless later version/reconciliation semantics are accepted.

## External learning-system mapping

Persist integration-owned mapping sufficient to reconcile external study-runtime item identifiers with the Prep semantic basis from which the external representation was projected.

For Anki this may include note/card identifiers, synchronization cursor/checkpoint data, external item/version identity and references to the applicable accepted semantic basis such as TaskSpecification, ObservationSpecification, LearningMaterial or CapabilitySpecification identities where present.

The mapping is integration persistence. An external note/card is not a canonical `Question` entity and its identifier never replaces Prep semantic identity.

Raw runtime telemetry such as rating, interval, duration, scheduling phase or similar scheduler state may be retained as integration-boundary data when needed for synchronization or audit. It becomes canonical `Performance` / `Observation` only when attribution, actual meaning/conditions, time and provenance can be translated faithfully under Learner Model semantics. Otherwise it must remain integration-boundary telemetry and must not be treated as capability evidence.

The first concrete adapter is AnkiConnect. Persist only identifiers, mapping basis and cursor/checkpoint data actually required to reconcile exported runtime representations and avoid replaying the same external record as a new historical event.

Endpoint, bind address, port and API key are deployment configuration and are not canonical learning data.

The exact identifier/cursor representation remains an implementation decision constrained by the external-runtime adapter contract.

## Bulk outcome durability

Bulk response statistics are computed from per-item outcomes. The current product semantics do not require permanent storage of every bulk execution report.

Failed input payloads are not required to be retained.

## Implementation freedoms

The following remain downstream implementation choices unless later requirements constrain them:

- relational versus another storage engine;
- concrete database product;
- table/column names;
- ORM;
- index implementation beyond required uniqueness;
- migration tooling;
- backup format/tooling and restore automation.

## Reopening conditions

Revisit Data Design before introducing multiple users/tenants; ownership scope, tenant-scoped uniqueness, authorization references and migration of existing single-user data must then be designed explicitly. Also revisit when backup/recovery objectives become accepted, retention/deletion obligations, audit requirements, offline synchronization, multiple durable stores, semantic version history, or asynchronous import processing becomes accepted scope.
