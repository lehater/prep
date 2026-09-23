# ADR-011 — Use PostgreSQL as the primary persistence platform

Status: Accepted

## Context

Prep must persist a semantic graph, evidence/provenance, immutable identities/revisions, learning plans, runtime mappings and review evidence. Interactive graph access is bounded by the accepted read-model contract; arbitrary whole-graph traversal is not required.

Native graph databases simplify some traversal patterns, but a second authoritative database would introduce cross-store consistency, backup, migration and operational complexity.

## Decision

- Use PostgreSQL 18+ as the primary authoritative database.
- Represent KnowledgeNodes, KnowledgeAssertions and Relations in explicit relational tables with stable IDs and indexes.
- Implement bounded graph traversal with SQL/recursive CTEs behind graph repository/query interfaces.
- Use pgvector for semantic-similarity candidate retrieval and derived clustering where useful.
- Do not require Neo4j or Apache AGE in v1.
- Keep graph persistence/query ports isolated enough that AGE/native graph technology can be introduced later if benchmarks demonstrate a real constraint.

## Consequences

- GraphRevision transactions and learner/runtime state can share one ACID database.
- Backup/migration/operations remain substantially simpler.
- Query design must explicitly optimize recursive traversals rather than relying on native Cypher.
- Native graph technology becomes an optimization decision backed by measurements, not a prerequisite of the domain model.
