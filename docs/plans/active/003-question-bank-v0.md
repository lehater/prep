# Plan 003 — Machine-readable question bank v0

## Goal

Prove the next vertical slice after taxonomy definition: a machine-readable question model, dependency-free validation, and one small concept question set.

## Scope

- create an executable registry for LearningTask and QuestionType v0.1;
- define a minimal JSON question-bank format independent of Anki;
- add a standard-library validator for structural/project invariants;
- add one small backend concept set (`idempotency`) covering all canonical QuestionTypes;
- document authoring rules and source-of-truth boundaries;
- do not implement Anki export yet.

## Deliverables

- `model/question-taxonomy.json`;
- `questions/idempotency.json`;
- `tools/validate_questions.py`;
- authoring documentation updates;
- completed plan after validation.

## Validation

- taxonomy JSON parses and all QuestionTypes reference known LearningTasks;
- question bank JSON parses;
- question IDs are unique;
- every question references a known QuestionType and declared Concept;
- required assessment evidence is present;
- the sample set covers all canonical QuestionTypes at least once;
- validator runs with Python standard library only.

## Status

In progress.
