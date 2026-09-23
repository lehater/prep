# Learning Platform boundary

## Responsibility

Define the smallest shared learning-coordination semantics that can span multiple subject domains without forcing their learning objects into one universal model.

## Shared responsibilities

### Target, curriculum and plan

The canonical distinctions are defined in [learning-targets-plans.md](learning-targets-plans.md):

```text
TargetScope  -> what knowledge is in scope
Curriculum   -> reusable learning structure over that scope
LearningPlan -> learner-specific execution intent
```

### Publication state

The platform tracks which domain learning objects are intended/published in an external study system and reconciles desired versus observed state.

### Learning evidence

Review/attempt events from execution systems are retained as evidence and aggregated into learner-specific state. Anki scheduler state is evidence, not the definition of domain mastery.

The learner/personal-state boundary is defined by [learner-boundary.md](learner-boundary.md).

### Learning overlay

Progress is projected back onto graph identities according to [learning-state.md](learning-state.md).

## Bounded-context rule

The shared platform does not own subject-specific learning-object semantics.

```text
Interview Preparation: Question / scenario / code task
English Listening:     ListeningSegment / lexical target / audio policy
Future Mathematics:    problem / proof / derivation forms
```

Cross-context references to reusable semantic knowledge use the boundary in [graph-subject-integration.md](graph-subject-integration.md).

## Anki boundary

Anki is an execution runtime responsible for card scheduling and review interaction. Prep owns canonical source identities, learning intent, publication reconciliation and aggregated progress views.
