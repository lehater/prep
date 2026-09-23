# Logical Consistency and Reliability

## Purpose

Define where Prep requires immediate semantic consistency and where it intentionally uses convergent/asynchronous behavior.

## Consistency classes

### Canonical semantic graph — atomic revision consistency

An accepted GraphChangeSet becomes one GraphRevision or has no canonical effect.

Identity redirects/merges, assertion changes and relation changes inside the same accepted consistency unit cannot be observed half-applied.

### LearningPlan — revision consistency

A plan change is atomic at one plan revision and preserves the graph/curriculum context from which it was derived.

Graph evolution does not silently rewrite an existing plan; migration/reconciliation is explicit.

### External Study Runtime — convergent consistency

Prep cannot atomically commit with Anki or another runtime.

Desired publication state persists independently, side effects are idempotent/retryable, observed state is re-read, and reconciliation converges.

### Learning evidence — replay-safe ingestion

Runtime/assessment observations may arrive at least once or out of order. Event identity/deduplication prevents repeated semantic effect.

Derived learner state is recomputable and may lag raw evidence.

### Read models — eventual consistency

Graph search/layout/cluster/progress projections may lag authoritative state but expose revision/freshness metadata.

## Required failure behavior

- semantic-analysis failure leaves canonical graph unchanged;
- partial external publication remains diagnosable and retryable;
- duplicate evidence import does not inflate review counts/mastery;
- unavailable runtime does not destroy desired publication intent;
- failed read-model refresh does not corrupt canonical state;
- merge/retirement does not orphan historical plan/evidence references.

## Data loss hierarchy

Highest protection priority:

1. canonical graph identities/assertions/relations and provenance;
2. learner plans and raw learning evidence;
3. runtime identity mappings required to preserve scheduler history;
4. derived learner/read-model state;
5. disposable UI layout/cache state.

Concrete durability, RPO/RTO and availability targets remain for later deployment design.
