# Learner Model

## Purpose

Define the minimal learner-specific record of learning statistics independently of reusable subject knowledge and target-specific learning policy.

## Core distinctions

### Question Evidence Subject

Question is the canonical subject of directly recorded learning observations and evidence.

KnowledgeNode and Requirement state are not direct observations. Any state attributed to them is a later inference derived from evidence about related Questions.

### Review Observation

For the first integration-driven slice, the recorded statistics follow the semantics of an Anki review log while remaining source-neutral in the Learner Model.

A Review Observation records one answering of a Question:

```text
ReviewObservation
  question: Question
  occurred_at
  rating: Again | Hard | Good | Easy
  previous_interval
  next_interval
  duration
  review_phase: Learning | Review | Relearning | Early
```

The rating semantics follow the initial integration contract: Again means failed recall; Hard, Good and Easy mean successful recall with different self-reported difficulty. Intervals record the scheduling interval before and after the review. Duration records time spent before choosing the rating. Review phase records the scheduling context in which the answer occurred.

These fields are recorded facts/statistics. Prep does not currently interpret them as mastery, proficiency, confidence or knowledge state.

This vocabulary is intentionally integration-driven rather than claimed as a universal learning model. A later integration may demonstrate that the model must be generalized or revised.


## Ownership

Learner Model owns:

- learner-specific Review Observations about Questions;
- review history and statistics reproducible from those observations.

Interpretation of those statistics into evidence strength, inferred learner state, uncertainty, retention/decay, knowledge state or requirement state is deferred.

It references Questions from Learning Design as the canonical subjects of recorded learning observations and statistics. Knowledge Model identities and Requirements may receive derived interpretations later, but such interpretation is outside the current model.

It does not own subject meaning, target policy, gaps or learning priorities.

## Research influence

The initial Review Observation vocabulary is deliberately shaped by the first planned learning-system integration. It preserves review-history facts without importing that system's scheduler or inferred memory model into Prep.

## Invariants

- historical Review Observations are not rewritten;
- absence of observations is not a negative learning result;
- every Review Observation remains attributable to Question identity;
- learner statistics cannot redefine reusable subject semantics;
- interpretation of statistics into learner, KnowledgeNode or Requirement state is not part of the current model.

## Deferred questions

- whether later integrations require a more general observation vocabulary;

- what evidence-strength model should interpret recorded statistics;
- whether and how statistics should produce inferred learner state;
- how inferred state may propagate from Questions to KnowledgeNodes or Requirements;
- how context and transfer limitations affect evidence reuse;
- what decay/retention model is justified before sufficient empirical data exists.
