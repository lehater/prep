# ADR-010 — Represent node content as evidence-backed KnowledgeAssertions

Status: Accepted

## Context

A graph node needs enough semantic content for a useful detail/card view and for later learning-material generation. Storing only label/kind/relations is insufficient. Storing one large mutable Markdown body makes provenance, conflict and obsolescence too coarse.

## Decision

- `KnowledgeNode` remains the visual/canonical representation of one semantic entity.
- Evidence-backed `KnowledgeAssertion` objects carry independently reviewable statements about that entity.
- Assertions are not graph nodes by default and do not clutter the 3D topology.
- Relations remain first-class structured assertions between two node identities and are not duplicated as KnowledgeAssertions.
- Conflict/obsolescence/provenance can operate at assertion granularity.
- The exact assertion-aspect taxonomy is deferred until real ingestion/content cases justify it.

## Consequences

- Node detail views can render trustworthy semantic content without making UI text the source of truth.
- Ingestion can deduplicate/conflict-check individual claims.
- Later card generation can select assertions/relations relevant to a learning task.
- Persistence remains unconstrained by this decision.
