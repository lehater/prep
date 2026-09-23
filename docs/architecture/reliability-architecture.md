# Reliability Architecture

## Transactional state

PostgreSQL transactions enforce:

- accepted GraphChangeSet -> one GraphRevision;
- LearningPlan revision updates;
- stable publication/runtime mapping updates;
- evidence-event deduplication.

Unique constraints enforce stable identities and idempotency boundaries where applicable.

## Durable asynchronous work

Use PostgreSQL-backed job/outbox records for work that leaves the request transaction:

- semantic/model extraction;
- embedding/projection rebuild;
- external runtime reconciliation;
- media/ASR processing.

Workers claim jobs with database concurrency control. Job identity plus operation idempotency makes retry safe.

No separate broker is required initially.

## External reconciliation

Anki publication is desired/observed reconciliation, never a distributed transaction.

Failures leave durable pending/error state. The local bridge retries with bounded exponential backoff and reports observed state after side effects.

## Evidence ingestion

Review events are accepted at least once and deduplicated by runtime/event identity. Derived learner-state computation is replayable.

## Recovery hierarchy

- canonical DB restore recovers authoritative Prep state;
- read projections/embeddings can rebuild;
- Anki content/runtime mappings reconcile after restore;
- jobs may replay safely;
- semantic graph admission never resumes halfway through a GraphChangeSet.

## Future escalation

Introduce a broker/distributed worker platform only when measured throughput or failure isolation cannot be met by the database-backed queue.
