# Plan 007 — Documentation system and Clean Architecture boundaries

## Goal

Turn `docs/` into the durable project knowledge base and make DDD + Clean/Hexagonal Architecture explicit before further feature work.

## Completed work

- added `docs/README.md` as the documentation map and artifact-routing contract;
- created canonical `docs/vision/`, `docs/architecture/`, `docs/domain/`, and `docs/guides/` artifacts;
- added a PlantUML Context Map for Interview Preparation, English Listening, ports, adapters, and external systems;
- documented inward dependency direction and consumer-owned ports;
- accepted ADR-005: DDD + Clean/Hexagonal Architecture;
- rewrote Interview → Anki integration as `application use case -> port -> adapter`;
- turned legacy documentation paths into compatibility pointers to one canonical source of truth;
- strengthened `AGENTS.md` with bounded-context, documentation-routing, dependency, identity, and provenance rules;
- added an ADR index;
- aligned use-case landing pages with canonical domain docs;
- added `tools/validate_docs.py` and wired relative-link validation into GitHub Actions;
- kept executable question/model/data paths and production package layout unchanged.

## Architecture result

```text
DDD                -> bounded-context ownership
Clean Architecture -> inward dependency direction
Hexagonal          -> ports/adapters around external systems
```

Anki, ffmpeg, Whisper, filesystems, delivery frameworks, and LLM providers are external mechanisms. Domain/application policy does not depend on them directly.

## Validation

PR CI passed with:

```text
python tools/validate_docs.py
python tools/validate_questions.py
python -m unittest discover -s tests -v
```

The final head is revalidated after archiving this plan.

## Status

Completed.
