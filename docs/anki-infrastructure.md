# Shared Anki infrastructure

## Purpose

Provide domain-independent AnkiConnect mechanics reusable by all `prep` bounded contexts.

Implementation:

```text
src/prep/infrastructure/anki/
```

This layer is intentionally below use-case mapping code.

## Responsibilities

### Transport

`AnkiConnect` owns:

- HTTP/JSON request envelope;
- AnkiConnect API version;
- timeout;
- response-envelope validation;
- conversion of connection/API failures into `AnkiConnectError`.

It does not know about questions, listening segments, decks, note schemas, or learning semantics.

### Reconciliation primitives

Shared helpers own:

- `ensure_deck`;
- declarative `NoteTypeSpec` / `CardTemplateSpec`;
- safe `ensure_note_type` evolution;
- exact lookup by repository-owned external ID;
- idempotent note create/update;
- additive generated tags while preserving unknown/user tags;
- media upload.

## Stable identity

Every use case supplies its own stable external identifier and chooses the Anki field that stores it.

Examples:

```text
Interview Preparation -> QuestionId
English Listening      -> stable listening-segment ID
```

Shared code never computes domain identity.

Identity lookup is two-stage:

```text
Anki findNotes query
  -> notesInfo
  -> exact field-value comparison
```

The second step ensures Anki's search behavior cannot silently become the project's identity semantics.

Multiple exact matches are a conflict and fail loudly.

## Upsert semantics

```text
external ID absent
  -> addNote

external ID present once
  -> updateNoteFields
  -> add missing generated tags

external ID present more than once
  -> conflict
```

Ordinary update does not recreate the note, so Anki scheduling/review state remains attached to the existing note/cards.

## NoteType evolution

`ensure_note_type` can:

- create a missing NoteType;
- add missing fields;
- add missing templates;
- update canonical templates and styling;
- optionally remove extra templates;
- reposition canonical fields;
- optionally remove explicitly declared legacy fields.

Legacy field removal follows the behavior proven in the old English-listening pipeline:

```text
legacy field empty across all notes -> may remove
legacy field contains data           -> preserve
```

The adapter therefore avoids destructive schema cleanup merely because the new spec no longer uses a field.

## Media

`store_media_file` uploads bytes through AnkiConnect `storeMediaFile` and returns Anki's stored filename.

How a use case references that filename, e.g. `[sound:...]`, belongs to its mapping layer.

## What remains outside shared infrastructure

Interview Preparation owns:

- `Prep Question v1` schema;
- question fields/tags/templates;
- question-bank synchronization command;
- assessment-run semantics.

English Listening owns:

- its listening NoteType fields/templates;
- source/segment IDs;
- audio extraction and normalization;
- ASR/alignment;
- legacy listening-card migration rules that depend on source provenance.

## Provenance

The initial implementation was extracted and refactored from the uploaded `anki_codex_pipeline_v09` project rather than written independently. That project had a 43-test passing baseline. Shared behavior is covered again by dedicated `prep` unit tests instead of depending on the legacy test suite.

## Validation

Run:

```bash
python -m unittest discover -s tests -v
```

Current tests use fake AnkiConnect implementations; they do not require Anki Desktop in CI.
