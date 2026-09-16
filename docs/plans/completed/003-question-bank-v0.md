# Plan 003 — Machine-readable question bank v0

## Goal

Prove the next vertical slice after taxonomy definition: a machine-readable question model, dependency-free validation, and one small concept question set.

## Scope completed

- added executable LearningTask/QuestionType registry;
- defined a minimal JSON question-bank format independent of Anki;
- added a standard-library validator for structural/project invariants;
- added one backend concept set (`idempotency`) covering all canonical QuestionTypes;
- documented authoring rules and source-of-truth boundaries;
- added GitHub Actions validation for pull requests and `main`;
- deliberately deferred Anki export.

## Deliverables

- `model/question-taxonomy.json`;
- `questions/idempotency.json`;
- `tools/validate_questions.py`;
- `docs/question-bank-format.md`;
- `.github/workflows/validate.yml`;
- updated `README.md`.

## Validation result

The validator reports:

```text
OK: 8 question types, 1 bank(s), 8 question(s)
```

GitHub Actions `Validate` completed successfully on PR #3 before plan closure.

Validated invariants:
- taxonomy and question-bank JSON parse correctly;
- all QuestionTypes reference known LearningTasks;
- every question references a known QuestionType and locally declared Concept;
- question IDs are globally unique across current banks;
- prompts and assessment evidence are present;
- current sample banks cover all eight canonical QuestionTypes;
- validator requires only the Python standard library.

## Status

Completed.
