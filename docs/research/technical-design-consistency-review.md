# Technical Design Consistency Review

Date: 2026-09-23
Status: accepted review for TECHNICAL-DESIGN

## Scope

Review all technical design providers as one architecture before implementation slicing.

## P0/P1 findings resolved

### Persistence and graph semantics remain separated

PostgreSQL is a physical choice; KnowledgeNode/Relation/Assertion semantics do not depend on SQL representation. pgvector is explicitly candidate/search assistance only and cannot establish semantic identity.

### No second authoritative runtime store

Anki is an execution runtime. Prep PostgreSQL remains authoritative for Prep content/intent/evidence mappings; Anki scheduler/review state remains runtime-owned and is imported as evidence.

### Multi-device Anki ownership

The architecture does not create one Prep controller per device. One designated desktop bridge integrates one synced collection; AnkiWeb propagates collection changes among Anki clients.

### Async reliability without premature infrastructure

PostgreSQL-backed jobs/outbox preserve retry/durability without introducing a second broker/cache source of operational truth.

### Frontend renderer is replaceable

react-force-graph-3d is behind a project-owned renderer boundary; force coordinates/layout do not become graph semantics.

### Security details

The single-user/self-hosted-first posture is now an explicit ADR. Cookie authentication includes an explicit CSRF requirement. Bridge credentials are scoped independently.

### Review-event identity

Anki review deduplication is scoped by RuntimeBinding/profile plus revlog/review identity, avoiding accidental collisions across collections.

## Cross-artifact invariants

1. PostgreSQL is the single authoritative database in v1.
2. No Neo4j/AGE/Redis/broker is introduced without measured need.
3. Graph queries remain bounded even though storage can hold much larger graph state.
4. Browser/UI/API cannot bypass curation/admission.
5. Local Bridge owns localhost AnkiConnect; central service never exposes it.
6. External model/provider output remains proposal/evidence, never accepted truth automatically.
7. Every external side effect has durable intent and retry/reconcile semantics.
8. deployment remains modular-monolith-first, not microservice-first.
9. implementation modules follow accepted bounded-context/application dependency direction.
10. tests use real PostgreSQL for DB semantics and do not pretend SQLite is equivalent.

## Residual implementation freedoms

Not blockers for TECHNICAL-DESIGN:

- exact FastAPI/SQLAlchemy/psycopg package choice and versions;
- concrete table/column names beyond the accepted model families;
- exact worker polling/claim SQL;
- exact React state-management/query library;
- exact reverse proxy/TLS implementation;
- exact OpenTelemetry backend;
- detailed CSS/visual theme.

These choices can be made inside component/implementation design without changing architecture.

## Harness result

GitHub Actions run `35886821812` evaluated:

```text
TOP-LEVEL-DESIGN: COMPLETE
LOGICAL-DESIGN:   COMPLETE
TECHNICAL-DESIGN: COMPLETE
```

No Harness Question blocks this depth.

## Conclusion

The technical layer is coherent enough to open implementation design. Implementation should still be designed breadth-first across database schema/contracts, API contracts, jobs/bridge protocol, frontend component contracts, deployment configuration and executable acceptance fixtures before coding feature slices.
