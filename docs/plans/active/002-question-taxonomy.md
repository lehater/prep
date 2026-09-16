# Plan 002 — LearningTask and QuestionType taxonomy

## Goal

Define a minimal evidence-informed v0.1 taxonomy of learning tasks and question types for technical interview preparation.

## Scope

- research relevant learning-science and assessment taxonomies;
- separate cognitive learning tasks from presentation/card formats;
- define a small stable set of `LearningTask` values;
- define reusable `QuestionType` values and their assessment semantics;
- update the domain model and record a decision if the taxonomy changes project invariants;
- avoid Anki-specific modeling in the domain taxonomy.

## Deliverables

- `docs/research/question-taxonomy.md`;
- `docs/question-types.md`;
- updated `docs/domain-model.md` if needed;
- ADR for the accepted taxonomy boundary if warranted.

## Validation

- every QuestionType maps to at least one LearningTask;
- LearningTask values describe cognitive operations rather than UI/card mechanics;
- the taxonomy supports the first vertical slice without requiring a full LMS model;
- duplicate or overlapping categories are explicitly resolved.

## Status

In progress.
