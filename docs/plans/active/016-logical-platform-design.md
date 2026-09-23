# Plan 016 — Breadth-first logical platform design

## Goal

Descend exactly one design level while preserving breadth-first coverage. Define logical responsibilities/contracts across the whole platform before choosing concrete technology or implementing one deep slice.

Harness consumer: `LOGICAL-DESIGN`.

## Required breadth

- [x] application/use-case responsibility map
- [x] logical data ownership and atomic consistency boundaries
- [x] graph query/read-model requirements for interactive exploration
- [x] knowledge ingestion/admission workflow contract
- [x] subject-context learning-material/publication responsibility boundary
- [x] study-runtime synchronization and evidence-ingestion contract
- [x] learner/personal-state access/privacy boundary
- [x] logical interface responsibilities
- [x] reliability/consistency expectations across graph, plans and external runtimes
- [x] logical system/module responsibility map
- [x] operability/diagnostic requirements
- [x] verification strategy for logical boundaries

## Review

- [x] cross-artifact consistency/dependency review for all LOGICAL-DESIGN providers
- [x] unresolved logical Questions reviewed; none blocks this depth
- [x] LOGICAL-DESIGN evaluated COMPLETE by pinned Harness
- [x] layer accepted as coherent enough to open the next design depth

## Explicit non-goals

- choosing Neo4j/PostgreSQL/RDF/document storage;
- choosing REST/GraphQL/gRPC;
- choosing frontend framework/3D library;
- deployable service/process decomposition;
- implementation tickets/code.

## Stop rule

Do not start concrete persistence/API/component implementation design until the logical responsibility map passes breadth review.


## Evidence

- [Logical Design Consistency Review](../../research/logical-design-consistency-review.md)
- GitHub Actions run `35885404858`

## Status

Complete.
