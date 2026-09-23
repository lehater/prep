# Plan 017 — Breadth-first technical platform architecture

## Goal

Select concrete technologies and implementation-facing architecture across the whole platform before any one implementation slice is allowed to drive the design.

Harness consumer: `TECHNICAL-DESIGN`.

## Required breadth

- [ ] persistence architecture for semantic graph, provenance, plans, evidence and derived views
- [ ] data lifecycle: migrations, backup/restore, retention and historical revisions
- [ ] external-dependency design: Anki/AnkiConnect, model providers, media/ASR and frontend/runtime libraries
- [ ] concrete machine-interface/API design
- [ ] presentation-system architecture for the graph-first application
- [ ] screen/view design for graph exploration, node detail, curation, plans and progress
- [ ] concrete security architecture
- [ ] performance/capacity model and budgets
- [ ] reliability architecture and retry/recovery mechanisms
- [ ] deployable/runtime topology
- [ ] component/module design and dependency/composition boundaries
- [ ] operability implementation architecture
- [ ] executable test design

## Method

For each area:

1. derive decision criteria from accepted logical contracts;
2. research realistic current alternatives where technology is involved;
3. record trade-offs and rejected alternatives;
4. make a decision only when enough adjacent areas are visible;
5. update Harness Core only for accepted canonical design artifacts.

Do not implement a proof-of-concept unless a specific unresolved decision cannot be responsibly made without one.

## Key cross-cutting decisions

The following must be made together rather than independently:

- graph persistence vs query/read-model strategy;
- web/API style vs interactive graph query shapes;
- browser 3D rendering limits vs server-side graph bounding/clustering;
- central service vs local bridge responsibilities for Anki;
- authentication/privacy vs personal learning evidence;
- revision/history model vs storage/migration strategy;
- idempotent runtime synchronization vs deployment/recovery topology.

## Explicit non-goals

- production implementation;
- implementation tickets for individual vertical slices;
- premature microservice decomposition;
- database/library selection based only on familiarity.

## Stop rule

Do not open an IMPLEMENTATION consumer until `TECHNICAL-DESIGN` is coherent across the full breadth and its verification/test contracts are explicit.
