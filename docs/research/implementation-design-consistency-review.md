# Implementation Design Consistency Review

Date: 2026-09-23
Status: accepted review for IMPLEMENTATION-DESIGN

## Scope

Review exact pre-coding contracts across schema, API, jobs, bridge, auth, frontend, deployment, components and acceptance tests.

## Findings resolved

### Authentication persistence was implicit

`app_user` and `auth_session` are now part of the physical schema contract, including hashed session/CSRF material and expiry/revocation fields.

### Alias provenance was too coarse

Aliases are no longer embedded only in node-version JSON. `node_alias` plus `alias_evidence` gives aliases their own lifecycle/provenance while preserving the invariant that equal names do not prove identity.

### Sync/async execution needed one rule

ADR-016 establishes synchronous application/SQLAlchemy/psycopg boundaries. Long-running/external work belongs to durable jobs; adapters may hide async internally without contaminating domain/application contracts.

### Session secret configuration was unnecessary

Opaque random server-side sessions do not require a global cookie-signing secret. The unused `PREP_SESSION_SECRET` configuration requirement was removed.

## Cross-contract invariants

1. PostgreSQL UUIDv7 IDs are generated independently from mutable labels.
2. One UnitOfWork owns one authoritative transaction; repositories never self-commit.
3. GraphChangeSet revision writes are atomic; external work is never executed inside that transaction.
4. Durable jobs contain IDs/revisions, not serialized aggregates.
5. HTTP mutation contracts use explicit idempotency/version conflict semantics.
6. Browser sessions and bridge tokens are separate authentication mechanisms.
7. Bridge writes require a single-writer lease and are replay-safe.
8. Frontend server state, URL state, transient renderer state and persisted SavedView state remain separate.
9. ORM/Pydantic/renderer classes cannot become domain entities.
10. Acceptance fixtures cover architecture-significant failure/replay/history behavior before feature completion.

## Implementation freedoms intentionally left local

Coding agents may choose:

- private class/function names;
- SQLAlchemy mapping style details that preserve schema;
- internal Pydantic model composition;
- small React component decomposition below documented boundaries;
- CSS/theme/layout details;
- job polling SQL details consistent with the claim/lease protocol.

They may not invent new state ownership, protocols, storage systems or cross-context dependencies.

## Conclusion

No unresolved design question blocks a breadth-first platform-skeleton implementation. Production business feature slices remain gated until the skeleton proves the accepted cross-stack wiring.
