# Implementation Acceptance Contracts

## Purpose

Define executable fixtures that must pass before a coding slice can claim architecture-compliant completion.

## A. Graph admission/revision

Fixture starts with two sources that describe the same idempotency concept using different wording.

Expected:

- one canonical NodeId;
- compatible assertions deduplicated/added;
- relation types come only from registry;
- retrying identical ingestion yields NO_CHANGE;
- one accepted GraphChangeSet is atomic;
- failed mutation produces no partial GraphRevision.

## B. Merge/history

Create two canonical candidates later proven identical, references from a LearningPlan/evidence, then merge.

Expected:

- survivor remains canonical;
- old NodeId resolves through redirect;
- historical plan/evidence remains interpretable;
- no ID reuse.

## C. Graph query bounding

Generate representative cyclic graph.

Expected:

- neighborhood/path requests obey server max bounds;
- response includes GraphRevision;
- truncation is explicit;
- no endpoint requires full graph materialization.

## D. Learning evidence

Replay one runtime review batch twice.

Expected:

- unique `(runtime_binding_id, source_event_id)` persists once;
- derived learner state can be rebuilt from raw evidence;
- scheduler metadata does not directly overwrite semantic graph state.

## E. Anki publication

With fake/live contract AnkiConnect:

1. publish learning object;
2. publish identical version again;
3. update content version;
4. simulate bridge restart/offline;
5. reconcile.

Expected same external identity, no duplicate note, preserved scheduler history, durable retry state and convergence.

## F. Bridge lease

Two bridge clients target one RuntimeBinding.

Expected exactly one active writer lease; second receives conflict; expired lease can be reacquired without duplicating work.

## G. Authorization/CSRF

Expected:

- anonymous personal/admin endpoint denied;
- learner without curator capability cannot accept proposal;
- unsafe cookie request without valid CSRF denied;
- bridge token cannot call human/admin endpoints;
- revoked session/token denied.

## H. Frontend semantics

Playwright flows:

- graph filters/relation toggles do not mutate canonical graph;
- selecting node opens detail without losing graph context;
- create plan from explicit selection;
- curation decision is explicit;
- runtime offline/drift state is visible.

## I. Database lifecycle

CI:

- fresh PostgreSQL -> Alembic head;
- schema metadata/constraints match contract;
- backup/restore smoke fixture preserves stable IDs/revisions;
- migration from every supported release fixture reaches head.

## J. Performance

Generated fixtures run bounded query and browser graph benchmarks at accepted envelopes. Regression thresholds are recorded in CI/performance configuration, not hidden in developer intuition.
