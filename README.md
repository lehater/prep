# prep

Graph-centered adaptive learning workspace.

## Purpose

`prep` is the durable source of truth for a multi-domain learning platform. Its semantic Knowledge Graph describes what can be learned; learning contexts derive domain-specific practice; external study systems such as Anki execute repetition and return learning evidence.

Current/emerging bounded contexts:

- `Knowledge Graph` — canonical semantic knowledge identities and relations;
- `Learning Coordination` — target scopes, learning plans, publication intent and progress overlays;
- `Interview Preparation` — technical-interview diagnostics and gap-driven learning;
- `English Listening` — listening practice from authentic film/TV audio.

Shared technical infrastructure is extracted only when domain-independent. Anki/AnkiConnect is the first shared external-system adapter.

## Start here

1. [`AGENTS.md`](AGENTS.md) — agent workflow and repository rules.
2. [`docs/README.md`](docs/README.md) — documentation map and artifact routing.
3. [`docs/vision/problem-space.md`](docs/vision/problem-space.md) — problems being solved.
4. [`docs/vision/vision.md`](docs/vision/vision.md) — product intent.
5. [`docs/vision/product-capabilities.md`](docs/vision/product-capabilities.md) — top-level capability map.
6. [`docs/architecture/context-map.md`](docs/architecture/context-map.md) — bounded contexts.
7. [`docs/architecture/system-landscape.md`](docs/architecture/system-landscape.md) — black-box system responsibilities.

Engineering design coverage is controlled by the pinned universal Harness through `.harness/engineering-graph.yaml` and `.harness/core.yaml`.

## Architecture

Core policy points inward:

```text
interface -> application -> domain
infrastructure -> application ports
```

Anki, ffmpeg, Whisper, filesystems, databases, UIs, and LLM providers are external mechanisms. They must not define bounded-context domain models.

See [`docs/architecture/overview.md`](docs/architecture/overview.md).

## Current design strategy

Top-level platform design proceeds breadth-first across problem, product, domain, journeys, UI, quality and system landscape before deep component/persistence/API/implementation design. Existing working slices remain evidence and will be reused once the wider model stabilizes.

## Harness validation

Bootstrap the pinned Harness locally:

```bash
python tools/bootstrap_harness.py
python tools/check_harness_integration.py
```

## Existing executable artifacts

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
python tools/validate_architecture.py
python tools/validate_questions.py
python -m unittest discover -s tests -v
```

The same checks plus pinned Harness validation run in GitHub Actions.
