# Plan 002 — LearningTask and QuestionType taxonomy

## Goal

Define a minimal evidence-informed v0.1 taxonomy of learning tasks and question types for technical interview preparation.

## Scope completed

- researched revised Bloom taxonomy, retrieval practice, self-explanation, interleaving, and current technical-interview guidance;
- separated cognitive learning tasks from prompt patterns and response/card formats;
- defined a compact `LearningTask` v0.1 taxonomy;
- defined reusable `QuestionType` v0.1 values with expected answer evidence;
- normalized the domain model;
- recorded ADR-002 for the taxonomy boundary.

## Deliverables

- `docs/research/question-taxonomy.md`;
- `docs/question-types.md`;
- updated `docs/domain-model.md`;
- `docs/decisions/ADR-002-learning-task-question-type-boundary.md`.

## Validation result

- every QuestionType maps to exactly one primary LearningTask in v0.1;
- LearningTask values describe cognitive operations rather than UI/card mechanics;
- purpose/causality/prediction/debugging/selection/trade-off are represented at the appropriate lower abstraction level;
- verbal/text/code/diagram delivery is explicitly kept outside LearningTask;
- Anki note/card structures do not appear in the canonical taxonomy;
- the taxonomy is small enough for the first vertical slice and leaves multi-label classification deferred until evidence requires it.

## Status

Completed.
