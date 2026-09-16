# Plan 004 — Anki integration research

## Goal

Choose the first Anki integration boundary for `prep` and define a stable mapping from canonical questions to Anki without coupling the domain model to Anki internals.

## Scope

- document Anki's note/card/template model;
- compare AnkiConnect, the official `anki` Python module, and package/file import/export;
- determine which interface best fits live card creation plus later review analytics;
- define the initial `Question -> Anki Note -> Card` mapping;
- define stable identity and update semantics;
- record an ADR for the selected primary adapter;
- do not implement the adapter yet.

## Validation

- selected adapter can create note types, decks, notes, and update/search existing notes;
- selected adapter can expose review/card data required by future diagnostics;
- canonical question identity remains repository-owned;
- duplicate/update behavior is explicit;
- offline/package generation remains possible as a later adapter;
- Anki-specific concepts do not leak into `QuestionType` or `LearningTask`.

## Status

In progress.
