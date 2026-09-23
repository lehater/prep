# Operability Architecture

## Structured diagnostics

All backend/worker/bridge processes emit structured logs containing relevant domain correlation IDs (GraphRevision, job, LearningPlan, PublicationBinding, sync run, evidence event).

## Health endpoints

Central application exposes:

- liveness;
- database readiness;
- worker/job backlog summary;
- read-projection freshness;
- bridge/runtime status as application data rather than server liveness.

## Administrative diagnostics

The product exposes curation backlog, failed jobs, sync drift/conflicts and evidence-ingestion errors through authenticated admin views/API.

## Audit trail

Persist administrative audit events for semantic admission, merge/retire, relation/kind registry change and manual conflict resolution.

## Metrics/tracing

Instrument major application/job/runtime operations through OpenTelemetry-compatible boundaries. A specific metrics backend is deployment choice; correctness must not depend on telemetry delivery.

## Recovery operations

Supported operational actions are semantic/reconciliation operations:

- retry/requeue job;
- rebuild derived read model/embedding;
- rerun runtime reconcile;
- restore DB backup;
- inspect/resolve curation conflict.

Direct database editing is not a normal recovery path.
