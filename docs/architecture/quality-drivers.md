# Top-level Quality Drivers

## Purpose

Record architecture-significant qualities before detailed technical design.

## Drivers

### Semantic correctness

Graph identity, relation direction/type and provenance must resist silent duplication or unsupported mutation. Incorrect semantic graph changes are higher risk than temporarily missing knowledge.

### Stable identity and non-destructive evolution

Canonical identities survive renames and presentation changes. External study synchronization must update existing learning objects where identity is unchanged and preserve scheduler history.

### Traceability

Accepted graph knowledge and generated learning material should remain traceable to canonical identities and supporting evidence.

### Evolvability

Node/relation registries, bounded contexts and future learning domains must be extendable without redesigning the entire platform or forcing one universal exercise schema.

### Domain isolation

English Listening, Interview Preparation and future domains keep independent semantics while sharing only proven platform/infrastructure responsibilities.

### Interactive graph usability

Filtering, neighborhood exploration and overlay changes must remain responsive enough for the graph to be a practical working surface; large graphs require bounded views/clustering rather than rendering everything indiscriminately.

### Deterministic integration

External publication/reconciliation should be idempotent, observable and conflict-aware. External systems must not become hidden sources of canonical domain truth.

### Recoverability and auditability

Semantic changes and synchronization conflicts must be diagnosable and recoverable without destructive implicit repair.

### Privacy boundary

Personal learning evidence is learner-specific state and must remain separable from globally reusable semantic knowledge.

## Current stage

Concrete SLOs, persistence durability levels, security controls, performance budgets and deployment targets are later design work. This document establishes the constraints they must satisfy.
