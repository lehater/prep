# Plan 005 — Unify learning use cases

## Goal

Evaluate the existing English-listening Anki pipeline and evolve `prep` so interview preparation and English listening can coexist without forcing domain-specific concepts into one model.

## Inputs

- current `prep` main branch;
- uploaded `anki_codex_pipeline_v09` project;
- existing ADR-003 AnkiConnect integration boundary.

## Completed work

- executed the legacy project unit suite: 43/43 tests passed;
- documented the legacy English-listening architecture and reusable Anki mechanics;
- adopted Interview Preparation and English Listening as separate bounded contexts;
- kept the existing interview `Question` model local rather than inventing a universal `Exercise` abstraction;
- designated Anki/AnkiConnect as shared infrastructure;
- updated repository vision, architecture, agent harness, navigation, and domain ownership;
- added landing pages for both initial use cases;
- recorded ADR-004 and a staged migration strategy.

## Validation

- English-specific entities remain outside interview domain artifacts;
- interview `Question` was not generalized merely to fit audio exercises;
- Anki remains an infrastructure adapter shared by use cases;
- stable identity/upsert/migration behavior from the legacy project is captured as shared-adapter design input;
- existing question-bank implementation remains structurally unchanged.

## Result

`prep` is now intentionally a multi-use-case learning workspace. The next implementation slice should extract the proven AnkiConnect client/reconciliation primitives with tests before migrating the English pipeline itself.

## Status

Completed.
