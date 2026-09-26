# Legacy Implementation Design

Status: historical pre-revalidation solution artifact; not current canonical implementation authority.

Current production frontend implementation design is `docs/implementation/frontend-implementation-design.md` and is registered through `.harness/core.yaml`.

## Historical purpose

Define the repository state from which coding agents may implement without inventing architecture-significant decisions.

## Exact technology baseline

Backend:

```text
Python 3.13
FastAPI
Pydantic v2
SQLAlchemy 2.x (synchronous sessions)
psycopg 3 (synchronous driver)
Alembic
PostgreSQL 18 + pgvector
pytest + Hypothesis
```

Frontend:

```text
React 19
TypeScript
Vite
TanStack Query
React Router
react-force-graph-3d
Playwright
```

Infrastructure:

```text
Docker Compose
PostgreSQL-backed durable jobs/outbox
local Python Anki bridge
OpenTelemetry-compatible instrumentation
```

Exact patch/minor versions are pinned in lockfiles when scaffolding is created.

## Repository target shape

```text
src/prep/**               backend modular monolith + worker/admin
src/prep_bridge/**        local Anki bridge
web/**                    React application
alembic/**                database migrations
tests/unit/**
tests/integration/**
tests/contract/**
tests/e2e/**
tests/performance/**
docker-compose.yml
pyproject.toml
web/package.json
```

Existing Interview/Anki code is migrated into these boundaries incrementally; working behavior is preserved by tests rather than rewritten wholesale.

## First implementation milestone

Implementation is allowed to create the **platform skeleton across breadth**, not one deep product feature:

1. dependency/build/Compose skeleton;
2. PostgreSQL migration baseline and UnitOfWork;
3. FastAPI auth/health/request-id shell;
4. durable job worker shell;
5. bridge auth/lease/poll shell with fake AnkiConnect contract;
6. React/Vite shell + routes + API client + empty GraphRenderer boundary;
7. cross-stack smoke tests and acceptance fixtures.

This milestone proves architectural wiring without implementing full graph curation, learning plans or English/interview features.

## Subsequent slice rule

After skeleton acceptance passes, feature slices may proceed vertically inside accepted contracts.

A feature slice may choose local algorithms/UI details but may not invent:

- new source-of-truth ownership;
- new database/storage technology;
- generic graph mutation endpoints;
- new external synchronization semantics;
- auth/session model;
- cross-context dependencies;
- unreviewed relation/node kinds.

Such changes require upstream design updates.

## Migration of existing code

Existing Interview question sync and shared Anki infrastructure are assets, not throwaway prototypes.

Migration strategy:

- wrap/rehome behavior behind accepted ports;
- preserve stable question/external IDs;
- move tests with behavior;
- do not bulk refactor directories before the skeleton provides destination boundaries.

## Completion gate

Coding work may start only while Harness design consumers remain COMPLETE and the implementation slice references applicable acceptance contracts.
