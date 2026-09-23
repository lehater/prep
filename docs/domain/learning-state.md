# Learner State and Graph Overlays

## Responsibility

Define how learner-specific evidence is projected onto canonical Knowledge Graph identities without turning review/scheduler state into semantic truth.

## Learning subject

Learning evidence may target either:

```text
NodeId
RelationId
```

This is important because knowing two concepts independently does not prove that the learner understands the relationship between them.

Domain learning objects declare which graph subjects they provide evidence about. One exercise may contribute evidence to one or several subjects, but mappings must be explicit.

## Evidence layers

Keep three layers distinct.

### Raw evidence

Observed events from a study/runtime or assessment:

```text
review
attempt
rating
answer correctness/assessment
response time
timestamp
runtime scheduler metadata
```

Raw evidence is append-oriented historical evidence.

### Derived learner state

A learner-specific interpretation of evidence for one graph subject.

Minimum semantic states:

- `not_started` — no meaningful learner evidence for the target subject;
- `active` — evidence exists but current stability is not established;
- `weak` — evidence indicates current retrieval/application risk or repeated failure;
- `stable` — sufficient current evidence supports reliable retrieval/application for the plan's required coverage;
- `stale` — prior evidence existed, but recency/retrievability is no longer sufficient to retain `stable`.

These are derived states, not permanent labels.

### Graph overlay

A view projection joining learner state to the canonical graph. Overlay deletion/recomputation must not mutate nodes/relations.

## Coverage is separate from mastery

The system must not conflate “there is learning material for this subject” with “the learner knows it”.

Useful independent projections include:

```text
ContentCoverage  -> does suitable learning material exist?
PlanMembership   -> is the subject in the current target/plan?
LearnerState     -> what does current evidence indicate?
```

The UI may combine them, but storage/domain semantics remain distinct.

## Aggregation across exercises

Several exercises may test the same node or relation from different cognitive angles.

A single easy recall success must not automatically mark a concept `stable` when the active plan requires explanation/application/design evidence.

Therefore stable/weak aggregation is evaluated against the plan's required evidence dimensions, for example `Concept × LearningTask` in Interview Preparation.

The exact numeric formula/thresholds are intentionally deferred until real review/attempt data exists.

## Anki/FSRS boundary

Anki scheduler fields and FSRS-derived retrievability/stability are valuable evidence for card recall. They do not directly define Prep-level semantic mastery.

Prep may use them as inputs alongside domain assessments.

## Progress metrics

For a selected target subgraph, the default denominator is the target's graph subjects, not the number of Anki cards.

Top-level progress can report:

```text
target subjects
content-covered subjects
started subjects
stable subjects
weak subjects
stale subjects
not-started subjects
```

Card counts remain operational metrics.

Until weighting semantics are explicitly accepted, aggregate percentages are count-based over the selected target scope and must expose the underlying counts.

## Multi-device evidence

Multiple Anki/runtime instances may contribute observations for the same learner. Device identity is provenance for evidence, not a separate mastery dimension. Duplicate/replayed events must be reconciled before aggregation.
