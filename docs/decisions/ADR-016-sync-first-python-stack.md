# ADR-016 — Use a sync-first Python application stack

Status: Accepted

## Context

Prep requires explicit PostgreSQL transaction boundaries, a modular monolith, durable background jobs and a moderate interactive HTTP workload. Forcing asyncio through domain/application/persistence would add two execution models before measured concurrency requires it.

FastAPI supports synchronous handlers by running them outside the event loop, while SQLAlchemy 2.x supports psycopg 3 directly.

## Decision

- Use Python 3.13 + FastAPI for the central HTTP application.
- Use synchronous SQLAlchemy 2.x sessions with psycopg 3 for application persistence.
- Keep domain/application APIs synchronous unless their semantics inherently require async streaming.
- Move slow/model/media/runtime side effects to durable background jobs.
- External adapters may use async internally if beneficial, but adapt back to the application contract at their boundary.
- Do not add an async ORM/driver path in parallel without measured need.

## Consequences

- UnitOfWork and transaction semantics remain straightforward.
- HTTP concurrency uses FastAPI's supported sync-handler execution model.
- Long-running work is not hidden inside request handlers.
- A future high-concurrency requirement may justify revisiting the boundary with benchmarks.
