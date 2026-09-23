# ADR-009 — Uniform KnowledgeNode, typed relations and controlled graph admission

Status: Accepted

## Context

Prep needs a graph rich enough for filtering, curriculum derivation and learner-state overlays. The earlier Obsidian-oriented Knowledge Graph constrained relations to document links, while direct free-form editing would make semantic identity and relation quality unreliable.

## Decision

- The canonical semantic graph uses one structural node entity, `KnowledgeNode`, with stable system-owned identity.
- Node `kind` is controlled classification rather than a class hierarchy.
- Relations are first-class typed semantic assertions with explicit direction and a controlled extensible registry.
- There is no generic `related_to` escape relation.
- Canonical graph mutation occurs through a controlled candidate/GraphDelta admission process; the ordinary learner does not directly edit accepted nodes/edges.
- Learner state, plan membership and visualization are overlays/references and never fields that redefine semantic graph truth.
- Learning evidence may reference both node and relation identities.

## Consequences

- 3D visualization can filter/color by node kind and relation type without defining domain semantics itself.
- Semantic deduplication happens before card/exercise generation.
- Adding a new node/relation vocabulary item is an explicit semantic decision.
- Storage technology remains unconstrained; the model can be realized by a property graph, relational representation or another persistence model later.
