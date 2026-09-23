# Plan 016 — Breadth-first logical platform design

## Goal

Descend exactly one design level while preserving breadth-first coverage. Define logical responsibilities/contracts across the whole platform before choosing concrete technology or implementing one deep slice.

## Required breadth

- [ ] application/use-case responsibility map
- [ ] logical data ownership and aggregate/repository boundaries
- [ ] graph query/read-model requirements for interactive exploration
- [ ] knowledge ingestion/admission workflow contract
- [ ] subject-context learning-material publication contract
- [ ] study-runtime synchronization and evidence-ingestion contract
- [ ] learner/personal-state access/privacy boundary
- [ ] logical interface/API responsibilities
- [ ] reliability/consistency expectations across graph, plans and external runtimes
- [ ] operability/diagnostic requirements
- [ ] verification strategy for the logical boundaries

## Explicit non-goals until breadth is complete

- choosing Neo4j/PostgreSQL/RDF/document storage;
- choosing REST/GraphQL/gRPC;
- choosing frontend framework/3D library;
- deployable service/process decomposition;
- implementation tickets/code.

## Method

Move horizontally across all listed responsibilities. Record unresolved semantic questions as Harness Questions instead of filling gaps with technology choices.

## Stop rule

Do not start detailed persistence/API/component implementation design until the logical responsibility map is coherent across the full platform.
