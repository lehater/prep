# Technical Design Decision Matrix

Date: 2026-09-23
Status: research/planning aid; decisions belong to canonical architecture artifacts/ADRs

| Area | Decision to make | Primary evidence/criteria |
|---|---|---|
| Persistence | one store vs graph + relational stores; graph/history representation | graph query shapes, atomic GraphRevision, personal-state isolation, migrations, operational complexity |
| Data lifecycle | revision retention, backups, restores, migrations | historical plans/evidence, merge redirects, recoverability, privacy |
| External dependencies | exact Anki integration topology, model/media/UI dependencies | supported APIs, local/cloud constraints, versioning, licensing, failure modes |
| Machine interface | REST/GraphQL/RPC/other contract style | bounded graph queries, commands vs queries, streaming/async status, client ergonomics |
| Presentation | frontend + 3D graph architecture | node/edge scale, filtering, layout, mobile/desktop UX, accessibility |
| Security | identity, authorization, secrets, administrative curation | learner isolation, curator privilege, runtime credentials, provenance visibility |
| Performance | graph size and latency budgets | interactive subgraph size, search, overlay joins, ingestion throughput |
| Reliability | retry/reconcile/recovery mechanisms | GraphRevision atomicity, external-runtime partial failure, evidence replay |
| Runtime topology | central service, workers, local bridge/agent | Anki locality, long-running ingestion, model/media processing, deployment simplicity |
| Components | module boundaries and dependency direction | DDD contexts, logical owners, composition roots, test seams |
| Operability | logs/metrics/traces/admin diagnostics | curation/reconciliation/evidence failure diagnosis and replay |
| Test design | executable contract/property/e2e plan | logical verification obligations and chosen technology boundaries |

## Decision discipline

A choice is not accepted merely because it is popular or convenient. Each accepted technology must be traced to one or more required logical contracts and must state what complexity it introduces.

Prefer one technology serving several responsibilities when it meets the contracts cleanly; introduce an additional specialized store/runtime only when it removes a demonstrated constraint rather than adding theoretical flexibility.
