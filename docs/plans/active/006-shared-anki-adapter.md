# Plan 006 — Shared Anki adapter

## Goal

Extract the proven domain-independent AnkiConnect mechanics from the legacy English-listening project into shared `prep` infrastructure.

## Scope

- add a standard-library AnkiConnect HTTP client;
- add reusable deck/note-type reconciliation helpers;
- add stable external-ID lookup and idempotent note upsert;
- add media upload support;
- add safe note-type evolution behavior based on the legacy implementation;
- add unit tests using fake AnkiConnect clients;
- extend CI to run the new tests;
- do not migrate English-specific ASR/media-source logic in this PR;
- do not yet implement the Interview Question → Anki mapping command.

## Behavioral source

The uploaded `anki_codex_pipeline_v09` project is the reference implementation. Its test baseline is 43/43 passing.

## Validation

- shared code contains no interview-specific or English-specific vocabulary;
- standard-library-only client remains dependency-free;
- repeated upsert updates one note rather than creating duplicates;
- duplicate external IDs are treated as conflicts;
- note-type migration preserves non-empty legacy fields;
- media upload returns the stored Anki filename;
- existing question validator still passes;
- new unit tests pass in CI.

## Status

In progress.
