# Target Scope, Curriculum and Learning Plan

## Responsibility

Separate reusable knowledge scope from reusable teaching structure and learner-specific execution intent.

## Target Scope

A `TargetScope` answers:

> Which canonical knowledge subjects are in scope?

It references Knowledge Graph subjects (nodes and, where relevant, relations) explicitly or through a reproducible selection rule.

It does not imply teaching order, card count or learner state.

Examples:

```text
Python backend Middle+
Payment Processing core
Transactions + Concurrency selected subgraph
```

## Curriculum

A `Curriculum` is a reusable learning design over a TargetScope.

It may define:

- required/optional subjects;
- conceptual ordering/prerequisite guidance;
- importance/priority;
- required evidence dimensions or learning tasks;
- domain-specific learning policy references.

A curriculum is reusable and not tied to one learner's current progress.

Graph semantic `depends_on` relations may inform curriculum ordering but do not automatically become learning prerequisites.

## Learning Plan

A `LearningPlan` is a learner-specific realization of a target/curriculum.

It owns intent such as:

- selected target/curriculum revision;
- included/excluded subjects;
- learner-specific priority/order adjustments;
- planned domain learning activities;
- publication intent;
- plan lifecycle and progress projection.

It references canonical graph identities; it does not copy semantic knowledge.

## Saved View is not a Target

A graph filter/layout may be saved for convenience. It becomes a TargetScope only through an explicit learning-intent action.

```text
SavedView  -> how I want to inspect
TargetScope -> what I intend to cover
Curriculum  -> how this scope is designed for learning
LearningPlan -> how I personally intend to execute it now
```

## Stability

A plan must retain the graph/curriculum revision context needed to explain what its original scope meant. Current graph evolution may offer migration/reconciliation, but cannot silently rewrite historical plan intent.
