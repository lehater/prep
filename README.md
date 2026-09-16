# prep

Repository-centered workspace for adaptive learning workflows.

## Purpose

`prep` is the durable source of truth for learning use cases, their domain models, application workflows, execution adapters, research, decisions, plans, and validation rules.

Current bounded contexts:

- `Interview Preparation` — technical-interview diagnostics and gap-driven learning;
- `English Listening` — listening practice from authentic film/TV audio.

Shared technical infrastructure is extracted only when domain-independent. Anki/AnkiConnect is the first shared external-system adapter.

## Start here

1. [`AGENTS.md`](AGENTS.md) — agent workflow and repository rules.
2. [`docs/README.md`](docs/README.md) — documentation map and artifact routing.
3. [`docs/vision/vision.md`](docs/vision/vision.md) — project intent.
4. [`docs/architecture/overview.md`](docs/architecture/overview.md) — DDD + Clean/Hexagonal architecture.
5. [`docs/architecture/context-map.md`](docs/architecture/context-map.md) — bounded contexts.

Use-case entrypoints:

- [`use-cases/interview-preparation/README.md`](use-cases/interview-preparation/README.md);
- [`use-cases/english-listening/README.md`](use-cases/english-listening/README.md).

## Architecture

Core policy points inward:

```text
interface -> application -> domain
infrastructure -> application ports
```

Anki, ffmpeg, Whisper, filesystems, UIs, and LLM providers are external mechanisms. They must not define bounded-context domain models.

See [`docs/architecture/dependency-rules.md`](docs/architecture/dependency-rules.md).

## Executable artifacts

Interview Preparation currently uses:

- `model/question-taxonomy.json` — machine-readable LearningTask/QuestionType registry;
- `questions/` — canonical question banks;
- `tools/validate_questions.py` — question-model validation.

Shared Python infrastructure:

```text
src/prep/infrastructure/anki/
```

## Validation

Run:

```bash
python tools/validate_docs.py
python tools/validate_questions.py
python -m unittest discover -s tests -v
```

The same checks run in GitHub Actions for pull requests and `main`.

## Development workflow

All feature/architecture work uses a dedicated branch and pull request into `main`; merge with squash so one coherent task becomes one commit in `main`.
