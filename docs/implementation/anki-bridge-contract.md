# Anki Local Bridge Contract

## Responsibility

The bridge is a deterministic edge agent between Prep and one local Anki Desktop profile. It contains no learning/graph policy.

## Local dependencies

- Python application/process;
- Anki Desktop running with AnkiConnect;
- AnkiConnect reachable only on localhost;
- bridge configuration containing Prep base URL, RuntimeBinding ID and token.

## Single-writer lease

Before applying desired changes, bridge acquires a server lease for its `RuntimeBinding`.

```text
DISCONNECTED
 -> AUTHENTICATED
 -> LEASED
 -> IDLE
 -> EXECUTING
 -> REPORTING
 -> IDLE
```

Lease heartbeat default is 30 seconds; server lease expiry default is 90 seconds. A second bridge for the same binding receives `409 BINDING_LEASED`.

Read-only heartbeat/review upload may continue only under the server's accepted lease policy; writes require an active lease.

## Work protocol

Server work item contains:

```text
work_id
runtime_binding_id
operation
learning_object_type
learning_object_id
desired_content_version
payload
idempotency_key
```

Initial operations:

- ensure deck;
- ensure note type/model;
- upsert learning object;
- retire/unpublish according to policy;
- reconcile object;
- fetch review watermark/range.

Bridge maps work to existing shared Anki infrastructure and posts a result:

```text
SUCCEEDED | RETRYABLE_FAILURE | CONFLICT | PERMANENT_FAILURE
external_object_ref?
observed_content_version?
diagnostic?
```

The same `work_id/idempotency_key` must not duplicate an Anki object.

## Review ingestion

Bridge maintains a server-acknowledged review watermark per RuntimeBinding, fetches newer Anki revlog/review observations and uploads batches.

Canonical dedupe identity is scoped:

```text
(runtime_binding_id, anki_review_id)
```

Server acknowledgement advances the bridge cursor only after accepted/deduplicated persistence.

## Drift

Bridge reports observed fields/tags/model/deck identity needed for reconciliation. User edits in Anki are never silently promoted to Prep canonical semantic content.

## Offline behavior

When server or Anki is unavailable:

- no desired work is discarded;
- bridge backs off with jitter;
- local durable cursor/config survives restart;
- later lease/reconcile converges state.

Bridge stores no authoritative graph/plan data.
