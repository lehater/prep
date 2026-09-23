# Technical Test Design

## Test layers

### Domain/unit

Use Python unit tests for graph admission/lifecycle, plan/evidence semantics and subject-context invariants.

Use property-based tests (Hypothesis) for identity/replay/merge/revision invariants where input combinations are large.

### PostgreSQL integration

Run tests against real PostgreSQL for:

- GraphChangeSet transaction atomicity;
- uniqueness/idempotency constraints;
- recursive graph queries and cycle handling;
- revision/history reconstruction;
- pgvector candidate queries where enabled;
- durable job claiming/retry.

SQLite is not an equivalent substitute for these contracts.

### External adapter contracts

AnkiConnect adapter has:

- deterministic fake/server contract tests in CI;
- optional live AnkiConnect acceptance suite outside normal CI;
- replay/update tests proving stable external identity and review-history preservation.

Model/media adapters have contract fixtures that prevent provider payloads from leaking into domain semantics.

### HTTP/API

Contract/integration tests cover validation, authz, idempotency, semantic conflict and async job states.

### Frontend

Use component tests plus Playwright browser end-to-end tests for Graph Explorer, node detail, plan flow, curation and sync diagnostics.

Renderer tests assert selection/filter/overlay semantics; they do not rely on exact force-layout coordinates.

### Performance

Maintain reproducible generated datasets at representative 10k/100k-node backend scales and 1k/2k/5k visible graph sizes.

Benchmark graph queries and browser render/interaction before accepting performance-sensitive changes.

## Acceptance suites

Minimum implementation closure requires automated scenarios for:

- duplicate semantic import -> no duplicate node/assertion/relation;
- atomic GraphChangeSet failure/replay;
- merge/retirement preserving historical references;
- plan pinned to graph revision;
- Anki publish then re-publish -> same note/card identity;
- content update preserves scheduler history;
- review-event replay -> one evidence effect;
- bridge offline -> durable pending state -> later convergence;
- learner/admin authorization separation;
- read-model rebuild from authoritative state.
