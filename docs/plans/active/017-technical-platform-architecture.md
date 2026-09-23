# Plan 017 — Breadth-first technical platform architecture

## Goal

Select concrete technologies and implementation-facing architecture across the whole platform before any one implementation slice is allowed to drive the design.

Harness consumer: `TECHNICAL-DESIGN`.

## Required breadth

- [x] persistence architecture for semantic graph, provenance, plans, evidence and derived views
- [x] data lifecycle: migrations, backup/restore, retention and historical revisions
- [x] external-dependency design: Anki/AnkiConnect, model providers, media/ASR and frontend/runtime libraries
- [x] concrete machine-interface/API design
- [x] presentation-system architecture for the graph-first application
- [x] screen/view design for graph exploration, node detail, curation, plans and progress
- [x] concrete security architecture
- [x] performance/capacity model and benchmark envelopes
- [x] reliability architecture and retry/recovery mechanisms
- [x] deployable/runtime topology
- [x] component/module design and dependency/composition boundaries
- [x] operability implementation architecture
- [x] executable test design

## Accepted foundation

- PostgreSQL 18+ primary authoritative persistence; relational graph representation + pgvector.
- Modular-monolith Python application + PostgreSQL-backed worker queue; no broker/microservices initially.
- Browser React/TypeScript UI using react-force-graph-3d.
- Purpose-built versioned HTTP JSON API; bounded graph queries; no GraphQL in v1.
- Local Python bridge to localhost AnkiConnect; AnkiWeb remains Anki's device-sync mechanism.
- Docker Compose reference central deployment; local bridge outside central container topology.

## Remaining review

- [ ] run technical cross-artifact consistency/dependency review
- [ ] validate TECHNICAL-DESIGN in Harness
- [ ] record any blocking Questions rather than inventing implementation decisions
- [ ] decide whether implementation design may open

## Stop rule

No production implementation or vertical implementation plan begins until this technical layer passes the breadth review.
