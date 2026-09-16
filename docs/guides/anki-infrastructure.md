# Shared Anki infrastructure

## Purpose

Document the domain-independent AnkiConnect mechanics reusable by bounded contexts.

Implementation:

```text
src/prep/infrastructure/anki/
```

This is infrastructure. It implements technical capabilities; it does not define learning-domain ports or semantics.

## Responsibilities

### Transport

`AnkiConnect` owns:

- HTTP/JSON request envelope;
- AnkiConnect API version;
- timeout;
- response-envelope validation;
- conversion of connection/API failures into `AnkiConnectError`.

### Reconciliation primitives

Shared helpers own:

- `ensure_deck`;
- declarative `NoteTypeSpec` / `CardTemplateSpec`;
- safe `ensure_note_type` evolution;
- exact lookup by caller-provided stable external ID;
- idempotent note create/update;
- additive generated tags while preserving unknown/user tags;
- media upload.

## Boundary

Shared infrastructure does **not** own a universal `StudySystem` domain contract. Application/core code defines the capability it needs; infrastructure adapts these primitives to that port.

```text
bounded-context application port
          ^
          | implemented by use-case adapter/mapping
          |
shared Anki reconciliation primitives
          |
      AnkiConnect
          |
      Anki Desktop
```

## Stable identity

Every bounded context supplies its own stable identifier.

Examples:

```text
Interview Preparation -> QuestionId
English Listening      -> persisted listening-segment identity
```

Shared code never computes domain identity.

Identity lookup verifies exact field equality after Anki search results:

```text
findNotes
  -> notesInfo
  -> exact external-ID comparison
```

Multiple exact matches are a conflict.

## Upsert semantics

```text
external ID absent      -> addNote
external ID present once -> update existing note
external ID duplicated   -> conflict
```

Ordinary update preserves the note/card identity and therefore its scheduling/review history.

## NoteType evolution

Safe migration can:

- create a missing NoteType;
- add missing fields/templates;
- update canonical templates/styling;
- reposition canonical fields;
- optionally remove declared legacy fields only when they are empty across notes.

```text
legacy field empty    -> may remove
legacy field has data -> preserve
```

Do not perform destructive cleanup just because a newer schema stops using a field.

## Media

`store_media_file` uploads bytes through AnkiConnect and returns Anki's stored filename.

The caller/use case owns how that filename is represented, for example `[sound:...]`.

## What infrastructure must not decide

- what a Question or ListeningSegment means;
- which material should be studied;
- domain identity rules;
- mastery/assessment semantics;
- deck/note taxonomy as a learning ontology.

## Validation

Run:

```bash
python -m unittest discover -s tests -v
```

Tests use fake AnkiConnect implementations and do not require Anki Desktop in CI.
