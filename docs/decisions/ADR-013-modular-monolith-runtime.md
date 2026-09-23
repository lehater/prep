# ADR-013 — Start as a modular monolith with worker and local bridge

Status: Accepted

## Context

Prep has several bounded contexts and external integrations, but current consistency/scale requirements do not justify distributed microservices. Ingestion/model/media processing and external synchronization can be long-running.

## Decision

Deploy the central application as a modular monolith backed by PostgreSQL, with a separate worker process using the same codebase/database for asynchronous jobs.

Runtime shape:

```text
Browser
  -> Prep API/Application
       -> PostgreSQL
       -> durable jobs/outbox
  -> Prep Worker
       -> model/source/media adapters

Prep Local Bridge
  -> Prep API
  -> local AnkiConnect
```

Logical modules remain separated by domain/application contracts even when they share a process.

Do not introduce Redis, Kafka/RabbitMQ or microservices initially. Durable job/outbox state lives in PostgreSQL.

## Consequences

- Deployment and transactions stay simple.
- Long-running work does not block HTTP request handling.
- Jobs/retries remain durable without another infrastructure product.
- A future workload may split a module/process without changing domain ownership.
