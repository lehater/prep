# Data Design

## Purpose

Define the smallest durable representation needed to preserve accepted Prep semantics and import consistency. Storage remains a physical realization, not a second domain owner.

## Persistence boundary

The backend owns access to one logical durable store for the current scope. Model contexts retain semantic ownership even when physically stored together.

No accepted driver requires a database per bounded context.

## Durable records

### Knowledge Model

Persist:

- KnowledgeNode stable ID, semantic kind and content;
- KnowledgeRelation stable ID, type, source KnowledgeNode ID and target KnowledgeNode ID.

Relation endpoints must reference existing KnowledgeNodes.

### Learning Design

Persist:

- Requirement stable ID and accepted content;
- RequirementSet stable ID and accepted content;
- RequirementSet membership edges;
- Requirement-to-Knowledge alignment edges;
- Question stable ID, question text and direct answer;
- Question-to-Knowledge alignment edges;
- LearningTarget stable ID and accepted target content;
- Target-to-Requirement/RequirementSet selection edges.

RequirementSet composition must preserve the accepted acyclicity invariant. Its physical enforcement may combine storage constraints with application transaction validation where a simple declarative database constraint is insufficient.

### Learner Model

Persist ReviewObservations as append-oriented historical records attributable to canonical Question ID, including occurred_at, rating, previous_interval, next_interval, duration and review_phase.

Accepted history is not overwritten to represent current inferred state.

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

Persist a technical mapping sufficient to reconcile external Anki study/review identifiers to canonical Question IDs.

The mapping belongs to integration persistence, not Question semantics. External identifiers never replace Prep IDs.

The exact Anki note/card identifier set is determined by the concrete adapter contract/implementation.

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
- migration tooling.

## Reopening conditions

Revisit Data Design when multi-user/tenant ownership, retention/deletion obligations, audit requirements, offline synchronization, multiple durable stores, semantic version history, or asynchronous import processing becomes accepted scope.
