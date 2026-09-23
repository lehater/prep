# Learning Platform boundary

## Responsibility

Define the smallest shared learning-coordination semantics that can span multiple subject domains without forcing their learning objects into one universal model.

## Shared responsibilities

### Target scope

A learner can select a graph/subgraph, curriculum or saved scope as the knowledge target for a learning effort.

### Learning plan

A plan references canonical knowledge identities and records intended coverage, prioritization/order and domain-specific generation policy. It is not a copy of the Knowledge Graph.

### Publication state

The platform tracks which domain learning objects are intended/published in an external study system and reconciles desired versus observed state.

### Learning evidence

Review/attempt events from execution systems are retained as evidence and aggregated into learner-specific state. Anki scheduler state is evidence, not the definition of domain mastery.

### Learning overlay

Progress is projected back onto graph identities so the same semantic graph can be viewed as not-started, active, weak, stable or otherwise derived by an accepted learning-state model.

## Bounded-context rule

The shared platform does not own subject-specific learning-object semantics.

```text
Interview Preparation: Question / scenario / code task
English Listening:     ListeningSegment / lexical target / audio policy
Future Mathematics:    problem / proof / derivation forms
```

These contexts may publish through shared technical infrastructure while preserving their own domain invariants.

## Anki boundary

Anki is an execution runtime responsible for card scheduling and review interaction. Prep owns canonical source identities, learning intent, publication reconciliation and aggregated progress views.
