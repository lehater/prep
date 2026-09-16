# Plan 006 — Shared Anki adapter

## Goal

Extract the proven domain-independent AnkiConnect mechanics from the legacy English-listening project into shared `prep` infrastructure.

## Completed work

- added dependency-free `AnkiConnect` HTTP/JSON client;
- separated transport from reconciliation behavior;
- added `ensure_deck`;
- added declarative `NoteTypeSpec` / `CardTemplateSpec`;
- added safe NoteType evolution that removes declared legacy fields only when empty;
- added exact stable external-ID lookup with `notesInfo` verification;
- added idempotent note upsert while preserving existing/user tags;
- added media upload via `storeMediaFile`;
- added shared infrastructure documentation;
- extended GitHub Actions to run unit tests;
- added 9 standard-library unit tests using fake AnkiConnect implementations.

## Behavioral source

The uploaded `anki_codex_pipeline_v09` project was used as the reference implementation. Its legacy baseline was 43/43 tests passing before extraction.

## Validation

Local extracted slice:

```text
python -m unittest discover -s tests -v
9 tests passed
```

CI must also run:

```text
python tools/validate_questions.py
python -m unittest discover -s tests -v
```

## Boundaries preserved

The shared code contains no interview-specific `Question` concepts and no English-specific media/ASR/ListeningSegment concepts. Each bounded context remains responsible for mapping its own stable IDs, fields, templates, tags, and content into this infrastructure.

## Result

The repository now has an actual shared Anki infrastructure layer rather than only an architectural intent. The next vertical slice can implement Interview Preparation question synchronization using this layer.

## Status

Completed.
