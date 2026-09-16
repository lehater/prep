# Plan 010 — Learning card architecture research

## Goal

Research an evidence-informed model for Interview Preparation learning cards before changing the Anki NoteType or visual design.

## Completed work

- reviewed retrieval-practice / testing-effect evidence;
- reviewed feedback meta-analysis evidence;
- reviewed worked-example, self-explanation, expertise-reversal and guidance-fading research;
- reviewed programming-education evidence for tracing, explaining, code writing, subgoal-labelled examples and Parsons-style scaffolds;
- reviewed multimedia-learning evidence for coherence/signaling;
- inspected `knowledge-graph` Concept Card, `kind + areas + facets`, and facet-analysis research;
- documented the synthesis in `docs/research/learning-card-architecture.md`;
- proposed candidate orthogonal axes:
  - `KnowledgeKind`;
  - `LearningTask`;
  - `QuestionType`;
  - `GuidanceLevel`;
  - `StimulusFormat`;
  - `ResponseFormat`;
- rejected one flat `InteractionType` / `CardType` taxonomy as the primary semantic model because it mixes stimulus, cognitive intent, response form and scaffolding;
- proposed semantic front/back content blocks;
- proposed presentation presets as recipes rather than canonical domain types;
- defined bounded prototype families for `Idempotency` and `asyncio`;
- derived visual UX constraints from coherence/signaling principles;
- defined a 12–16-object `Prep Card v2` prototype experiment as the recommended next step.

## Validation

GitHub Actions run `35154034148` passed all existing checks:

- documentation link validation;
- architecture boundary validation;
- question-bank validation;
- unit tests.

No production schema, Anki NoteType, Question ID, `LearningTask`, or `QuestionType` was changed.

## Outcome

The research supports a compositional learning-object model rather than a growing enum of card types.

The next implementation should remain experimental: model and render approximately 6–8 `Idempotency` and 6–8 `asyncio` learning objects, then evaluate whether the proposed axes and content blocks are sufficient before accepting a permanent schema or ADR.

## Status

Completed.
