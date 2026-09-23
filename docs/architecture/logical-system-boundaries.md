# Logical System Boundaries

## Purpose

Refine the black-box landscape into logical collaborating responsibilities without deciding deployable services/processes.

## Logical modules

### Semantic Graph Core

Owns canonical KnowledgeNodes, KnowledgeAssertions, Relations, classification, revisions and lifecycle invariants.

Only accepted admission changes may write it.

### Knowledge Curation

Owns source observations, candidate analysis, identity-resolution workflow, proposed GraphChangeSets and semantic review state.

Reads Graph Core; proposes writes through Graph Admission.

### Learning Coordination

Owns TargetScopes, Curricula, LearningPlans, desired publication state, raw learning evidence and learner-state projections.

References graph subjects but never writes semantic graph truth.

### Subject Learning Contexts

Interview Preparation, English Listening and future domains own their learning-object and assessment/generation semantics.

They exchange stable GraphSubjectRefs and publication projections, not internal domain objects.

### Study Runtime Integration

Owns external runtime transport, PublicationBindings, observed runtime state and reconciliation mechanics.

It does not own learning-object semantics or mastery.

### Graph Read / Exploration Projection

Builds searchable/bounded graph views, derived clusters and overlay joins for interactive use.

It is read-only with respect to canonical semantic truth.

### Learner Personal State Boundary

Scopes plan/evidence/runtime/view ownership by LearnerId and provides the access boundary between reusable shared knowledge and personal state.

This is a logical responsibility and need not become a separate deployable component.

## Dependency direction

```text
UI / external interfaces
        -> application workflows
            -> domain owners

Curation -> Graph Core
Learning Coordination -> Graph Core (read/reference)
Subject contexts -> GraphSubjectRef contract
Runtime Integration -> application ports
Read Projection <- canonical/derived state feeds
```

Graph Core never depends on Anki, UI, subject learning objects or learner state.

## Cross-boundary communication

- semantic graph changes use explicit GraphChangeSets/Revisions;
- learning contexts reference graph subjects by stable IDs;
- external runtime work uses desired/observed reconciliation;
- read models consume change/state feeds logically but remain rebuildable.

Whether these calls are in-process or networked is deliberately undecided.
