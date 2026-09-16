# prep

Repository-centered workspace for adaptive learning workflows.

## Purpose

`prep` is the durable source of truth for learning use cases, their domain models, execution adapters, research, decisions, plans, and validation rules.

Initial bounded contexts:

- `use-cases/interview-preparation/` — technical interview preparation through competency/question diagnostics and gap-driven learning;
- `use-cases/english-listening/` — spoken-English listening practice from authentic film/TV audio.

Shared infrastructure is extracted only when it is demonstrably domain-independent. Anki/AnkiConnect is the first shared execution adapter.

## Start here

- `AGENTS.md` — agent workflow and repository rules.
- `docs/vision.md` — project goal and scope.
- `ARCHITECTURE.md` — bounded contexts and shared infrastructure.
- `docs/decisions/` — accepted architectural decisions.
- `docs/research/` — evidence, source reviews, and migration assessments.
- `docs/anki-adapter.md` — Anki mapping and live adapter boundary.

Interview-preparation artifacts currently remain at their established root paths:

- `docs/domain-model.md` — interview domain model;
- `docs/question-types.md` — LearningTask and QuestionType semantics;
- `docs/question-bank-format.md` — machine-readable question authoring format;
- `model/question-taxonomy.json` — executable taxonomy registry;
- `questions/` — canonical interview question banks;
- `tools/validate_questions.py` — structural/project-invariant validation.

They are not moved merely for directory symmetry.

## Validation

Run current executable validation with:

```bash
python tools/validate_questions.py
```

The validator uses only the Python standard library. The same check runs in GitHub Actions for pull requests and `main`.

## Development workflow

After the initial bootstrap commit, all changes are made on dedicated branches and merged into `main` through pull requests using squash merge.
