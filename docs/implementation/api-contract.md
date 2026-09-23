# HTTP API Contract v1

## Stack and representation

FastAPI with Pydantic request/response models generates OpenAPI. API prefix: `/api/v1`. JSON uses snake_case to match Python/domain identifiers.

Backend application/persistence is sync-first. FastAPI sync handlers call synchronous application services/SQLAlchemy sessions; background/external work is represented by durable jobs.

## Common rules

- stable IDs are UUID strings;
- timestamps are RFC3339 UTC;
- every response/error includes `request_id`;
- errors use `{code, message, details?, request_id}`;
- repeatable commands accept `Idempotency-Key`;
- mutable aggregate commands include `expected_version` and fail with `409 VERSION_CONFLICT` on stale writes;
- async commands return `202` plus `job_id`;
- pagination uses opaque `cursor` + `limit`.

## Auth

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`

Unsafe cookie-authenticated commands require `X-CSRF-Token`.

## Graph query DTOs

`GraphNodeView`:

```text
node_id, label, kind, status, areas[], facets[], learner_state?, plan_membership?, content_coverage?
```

`GraphRelationView`:

```text
relation_id, from_node_id, to_node_id, relation_type, status, learner_state?
```

`GraphSlice`:

```text
graph_revision
nodes[]
relations[]
continuation?
overlay_revision?
warnings[]
```

Endpoints:

- `POST /graph/search`
- `POST /graph/subgraph`
- `POST /graph/neighborhood`
- `POST /graph/path`
- `GET /graph/nodes/{node_id}`
- `GET /graph/relations/{relation_id}`

Every traversal request contains explicit bounds (`max_nodes`, depth/path constraint or server default cap). Server may return a truncated slice + continuation/warning.

## Curation

- `POST /sources/imports` -> `202 job_id, ingestion_run_id`;
- `GET /curation/proposals`;
- `GET /curation/proposals/{id}`;
- `POST /curation/proposals/{id}/accept`;
- `POST /curation/proposals/{id}/reject`;
- `POST /curation/proposals/{id}/defer`.

Accept requires proposal version + idempotency key. Successful accept returns the resulting `graph_revision` or an async job when expensive validation is required.

## Learning

- CRUD-by-intent endpoints for `/targets`, `/curricula`, `/plans`;
- `GET /plans/{id}/progress`;
- `POST /plans/{id}/material-generation`;
- `PUT /plans/{id}/publication-intent`.

No generic CRUD endpoint exposes arbitrary graph semantic writes.

## Jobs

- `GET /jobs/{job_id}`;
- `POST /jobs/{job_id}/cancel` where supported.

## Runtime bridge API

Namespace `/bridge/v1`, bearer-token authenticated:

- `POST /heartbeat`;
- `POST /lease/acquire`;
- `POST /lease/renew`;
- `GET /work?cursor=...`;
- `POST /work/{work_id}/result`;
- `POST /observations/reviews`;
- `POST /observations/runtime-state`.

See [anki-bridge-contract.md](anki-bridge-contract.md).

## Diagnostics

Authenticated curator endpoints expose curation/job/sync status. Health endpoints expose no personal/semantic content.
