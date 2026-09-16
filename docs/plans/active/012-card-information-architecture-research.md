# Plan 012 — Learning card information architecture research

## Goal

Determine what information a learner should see on an Interview Preparation card, in what order, and with what visual hierarchy, while keeping machine metadata separate from learner-facing UI.

## Questions

- Which semantic fields belong in the visible card surface?
- Which fields are system metadata only?
- How should `Concept` and `Context` be presented without implying parent/child hierarchy?
- When should expected `ResponseFormat` be shown, and how should it be worded?
- Should `LearningTask`, `QuestionType`, `GuidanceLevel`, or `StimulusFormat` ever appear explicitly?
- Can card type be conveyed mainly by layout/structure rather than taxonomy badges?
- What visual hierarchy works across recall, scenario, code-trace, diagnose, and worked-example cards?

## Inputs

- `docs/research/learning-card-architecture.md`;
- the `Prep Learning Object v2` prototype and its current UI;
- cognitive-load / multimedia-learning evidence on coherence, signaling, spatial contiguity, redundancy, and segmenting;
- instructional-design and human-interface evidence on labels, hierarchy, recognition, and progressive disclosure.

## Deliverables

- visible-vs-hidden field policy;
- information priority levels;
- candidate universal card skeleton;
- rules for Concept/Context/ResponseFormat presentation;
- rules for when card-type labels are useful;
- five concrete layouts: recall, scenario, code-trace, diagnose, worked-example;
- design hypotheses that should be tested in Anki before changing the permanent schema.

## Constraints

- research first; do not change the production v1 or experimental v2 templates in this task;
- learner-facing explanatory labels should be Russian;
- conventional technical terms remain English-first;
- visual differences must not encode essential meaning by color alone;
- avoid exposing taxonomy merely because the data exists.

## Status

In progress.
