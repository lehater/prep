# Plan 004 — Anki integration research

## Goal

Choose the first Anki integration boundary for `prep` and define a stable mapping from canonical questions to Anki without coupling the domain model to Anki internals.

## Completed work

- documented Anki's NoteType/Note/Card/CardTemplate model;
- compared AnkiConnect, the official `anki` Python module, and `.apkg`/text interchange;
- selected AnkiConnect API v6 as the primary live adapter;
- defined `Prep Question v1` and the initial one Question → one Note → one Card mapping;
- selected repository-owned `QuestionId` as the first Anki field for stable identity and duplicate protection;
- defined deck/tag boundaries and upsert semantics;
- defined the required minimal AnkiConnect API surface;
- documented future review-history ingestion and baseline-session context requirements;
- recorded ADR-003.

## Validation result

The selected adapter supports the capabilities required for the next vertical slice:

- create/inspect deck and NoteType;
- add/search/update notes;
- resolve cards;
- read review history;
- explicitly trigger sync if requested.

Canonical question identity and taxonomy remain independent of Anki. Offline `.apkg` generation remains a future secondary adapter.

## Status

Completed.
