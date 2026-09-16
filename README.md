# prep

Repository-centered system for adaptive technical interview preparation.

## Purpose

`prep` is the durable source of truth for:
- competency and concept models;
- learning tasks and question types;
- canonical question data;
- baseline assessment and gap analysis;
- mappings to Anki and future execution adapters;
- research, decisions, plans, and validation rules.

## Start here

- `AGENTS.md` — agent workflow and repository rules.
- `docs/vision.md` — project goal and initial scope.
- `docs/domain-model.md` — current domain model.
- `docs/question-types.md` — LearningTask and QuestionType semantics.
- `docs/question-bank-format.md` — machine-readable question authoring format.
- `docs/process.md` — preparation feedback loop.
- `ARCHITECTURE.md` — architectural boundaries.
- `docs/decisions/` — accepted architectural decisions.

## Executable model

- `model/question-taxonomy.json` — canonical machine-readable LearningTask/QuestionType registry.
- `questions/` — canonical question banks.
- `tools/validate_questions.py` — structural and project-invariant validation.

Run validation with:

```bash
python tools/validate_questions.py
```

The validator uses only the Python standard library. The same check runs in GitHub Actions for pull requests and `main`.

## Development workflow

After the initial bootstrap commit, all changes are made on dedicated branches and merged into `main` through pull requests using squash merge.
