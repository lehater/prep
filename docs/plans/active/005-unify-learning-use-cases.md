# Plan 005 — Unify learning use cases

## Goal

Evaluate the existing English-listening Anki pipeline and evolve `prep` so interview preparation and English listening can coexist without forcing domain-specific concepts into one model.

## Inputs

- current `prep` main branch;
- uploaded `anki_codex_pipeline_v09` project;
- existing ADR-003 AnkiConnect integration boundary.

## Scope

- assess the legacy English pipeline architecture and test health;
- identify reusable Anki integration mechanics;
- define bounded-context boundaries for interview preparation and English listening;
- broaden repository purpose from interview-only to a learning workspace while preserving the current interview model;
- add an English-listening use-case landing page and migration strategy;
- extract only clearly reusable AnkiConnect primitives in a later implementation slice, not wholesale-copy the legacy project in this decision PR.

## Validation

- English-specific entities do not leak into interview domain artifacts;
- interview `Question` is not generalized prematurely just to fit audio exercises;
- Anki remains an infrastructure adapter shared by use cases;
- the legacy pipeline's proven identity/upsert/migration behavior is explicitly captured as reusable design input;
- existing question-bank CI remains unchanged and passing.

## Status

In progress.
