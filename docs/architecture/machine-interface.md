# Machine Interface Design

## Style

Use a versioned HTTP JSON API with purpose-built command/query resources.

Do not expose arbitrary SQL/Cypher/GraphQL traversal in v1. The accepted graph read shapes are bounded and should remain enforceable server-side.

## Main interface groups

### Graph queries

```text
GET/POST /api/v1/graph/search
POST     /api/v1/graph/subgraph
GET      /api/v1/graph/nodes/{id}
GET      /api/v1/graph/relations/{id}
```

Complex filter/query input may use POST while remaining read-only.

### Curation

```text
POST /api/v1/sources/imports
GET  /api/v1/curation/proposals
POST /api/v1/curation/proposals/{id}/accept
POST /api/v1/curation/proposals/{id}/reject
```

There is no generic node/edge CRUD API that bypasses admission.

### Learning

TargetScope/Curriculum/LearningPlan commands and progress queries use stable graph subject IDs.

### Bridge/runtime

The local bridge receives desired work and posts observed/reconciliation/evidence results through scoped endpoints.

## Async work

Long-running imports/generation/synchronization return a durable job/resource ID.

Use normal polling as baseline; Server-Sent Events may provide progress notification. WebSocket is not required for core semantics.

## API correctness

- commands support idempotency keys where clients may safely retry;
- DTOs carry stable IDs and revision/version metadata;
- errors distinguish validation, semantic conflict, authorization and retryable external failure;
- API versioning is independent from graph/domain identity.
