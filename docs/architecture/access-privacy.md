# Logical Access and Privacy Boundary

## Purpose

Define who may act on shared semantic truth and learner-specific state without selecting authentication/authorization technology.

## Actor capabilities

### Learner

May:

- read permitted canonical knowledge;
- explore/filter/save personal views;
- create/revise own TargetScopes/LearningPlans;
- publish own selected learning material;
- inspect own learning evidence/progress;
- submit source material/feedback/change requests.

A learner does not directly mutate accepted graph nodes/relations/assertions.

### Curator / semantic administrator

May make admission decisions, resolve identity/conflict cases and approve controlled registry changes.

Curator authority applies to shared semantic knowledge, not to ownership of a learner's private study history.

### Runtime/source integration

May submit observations within an explicitly bound scope. It cannot gain arbitrary graph mutation authority.

## Shared versus personal state

Shared:

- canonical semantic graph;
- reusable curricula when designated shared;
- public/shared source evidence subject to source visibility rules.

Personal:

- LearningPlans;
- review/attempt evidence;
- derived learner state;
- runtime/device bindings;
- personal SavedViews/preferences.

## Evidence visibility

A semantic assertion may be visible even when underlying source material/excerpt has restricted visibility. Provenance references must not leak protected source content merely because the graph claim is readable.

## Model/agent boundary

External model providers receive only the source/candidate context required for the semantic task. Personal learner evidence is excluded unless the explicit workflow requires it.

## Security invariants

- presentation/UI is not an authorization boundary;
- learner isolation is based on LearnerId ownership, not device identity;
- administrative graph mutation and personal learning-state access are separate privileges;
- runtime credentials/secrets remain infrastructure concerns and never become domain content.
