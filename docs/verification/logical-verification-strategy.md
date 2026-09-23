# Logical Verification Strategy

## Purpose

Define evidence required to trust the logical platform boundaries before detailed component/test design.

## Verification methods

Use:

- **TEST** for deterministic invariants and replay/reconciliation behavior;
- **ANALYSIS** for dependency/coverage/consistency review;
- **INSPECTION** for controlled vocabularies, provenance and access-policy declarations;
- **DEMONSTRATION** for graph exploration/curation flows whose human usefulness matters.

## Required verification obligations

### Semantic graph

Verify that:

- one accepted GraphChangeSet creates one coherent GraphRevision;
- invalid/ambiguous candidates cannot leak into canonical state;
- duplicate ingestion/replay is semantically idempotent;
- relation kinds/directions obey the registry;
- rename/merge/retirement preserve historical references/evidence.

### Learning intent/state

Verify that:

- LearningPlan revisions preserve target/graph context;
- content coverage, plan membership and learner state remain distinct;
- raw evidence can rebuild derived learner state;
- node and relation learning evidence map only through accepted GraphSubjectRefs.

### Study runtime

Verify that:

- repeated publish/reconcile converges without duplicate learning objects;
- semantic updates preserve compatible runtime identity/scheduler history;
- partial failure is observable and retryable;
- duplicate evidence import has one semantic effect;
- external semantic drift is detected rather than silently adopted.

### Read model/UI contract

Verify that:

- bounded graph queries never require full-graph loading;
- returned graph topology is coherent for one GraphRevision;
- overlay freshness/revision is visible;
- graph UI mutations of layout/filter do not mutate semantic graph truth.

### Access/privacy

Verify that:

- learners cannot bypass curation to edit canonical graph truth;
- one learner cannot access another learner's personal plan/evidence through logical interfaces;
- graph curation authority does not automatically grant personal-history access;
- restricted provenance content is not leaked through general graph views.

### Reliability/operability

Verify failure scenarios for unavailable runtime, failed projection refresh, repeated ingestion, interrupted synchronization and replay after recovery.

## Next boundary

This strategy defines what must be proven. Concrete test contracts, fixtures, property tests, end-to-end harnesses and performance targets belong to the next design depth.
