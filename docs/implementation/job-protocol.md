# Durable Job Protocol

## Purpose

Define one PostgreSQL-backed background-work mechanism for model extraction, projections, runtime synchronization and media processing.

## Job record

`job` fields:

```text
job_id UUIDv7
kind
status
payload JSONB
dedupe_key nullable
priority
attempt_count
max_attempts
available_at
lease_owner nullable
lease_until nullable
last_error_code nullable
last_error_message nullable
created_at
started_at nullable
finished_at nullable
```

Unique `(kind, dedupe_key)` applies when `dedupe_key` is non-null and the operation is logically singular.

## State machine

```text
QUEUED
  -> RUNNING
       -> SUCCEEDED
       -> RETRY_WAIT -> QUEUED
       -> FAILED_FINAL
       -> CANCELLED
```

A crashed/expired `RUNNING` lease returns to `QUEUED`/retry handling if attempts remain.

## Claim algorithm

Workers claim a bounded batch ordered by priority/available time with `FOR UPDATE SKIP LOCKED`, set a lease owner/expiry and commit before executing external work.

Workers never hold a database transaction open while calling LLMs, ffmpeg, Anki or other external systems.

## Retry

- exponential backoff with bounded jitter;
- retry policy selected by job kind/error class;
- permanent validation/semantic errors become `FAILED_FINAL`;
- retryable network/provider errors become `RETRY_WAIT`;
- every handler must be idempotent or protect its effect with a durable idempotency key.

## Outbox

When a domain transaction needs follow-up work, it inserts the job/outbox record in the same transaction as its authoritative state change.

No in-memory enqueue after commit is considered reliable.

## Handler boundary

Job payload contains stable IDs/revision references, not a serialized domain aggregate. Handler reloads authoritative state and calls an application use case.

## Cancellation

Cancellation is cooperative. A queued/retry job may become `CANCELLED`; running external work is not assumed interruptible unless its adapter supports it.
