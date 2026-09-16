# Plan 011 — Prep Card v2 prototype

## Goal

Turn the learning-card architecture research into a bounded, reversible Anki experiment that can be used and compared with the existing `Prep Question v1` cards.

## Scope

- keep the current `questions/*.json` schema and `Prep Question v1` path unchanged;
- add a separate prototype dataset with 14 learning objects across `Idempotency` and `asyncio`;
- represent the research axes explicitly: `KnowledgeKind`, `LearningTask`, `QuestionType`, `GuidanceLevel`, `StimulusFormat`, and `ResponseFormat`;
- represent feedback as semantic blocks rather than one answer string;
- include conceptual, scenario, worked-example, code-trace, completion, diagnose, code-writing, and architecture/design examples;
- add an experimental Anki NoteType `Prep Learning Object v2` and default deck `Prep::Prototype v2`;
- keep prototype sync safe-by-default with dry-run and explicit `--apply`;
- add tests for dataset validity, rendering, dry-run, idempotent sync, code escaping, and stable identity;
- document how to load and compare the prototype in local Anki.

## Constraints

- this is an experiment, not acceptance of a permanent domain/schema model;
- do not migrate or delete current v1 notes;
- prototype IDs are stable lowercase ASCII identifiers;
- technical terms/code remain English-first while explanatory prose is Russian;
- no JavaScript-dependent interaction; the prototype must remain usable in Anki desktop/mobile with ordinary templates;
- visual styling follows coherence/signaling: clear hierarchy, restrained decoration, readable code, light/dark compatibility.

## Acceptance

- 14 prototype objects validate;
- both `Idempotency` and `asyncio` are represented;
- at least one worked, faded, and independent object exists;
- at least one code, scenario, and prose stimulus exists;
- first fake-Anki apply creates 14 notes and second apply reports 14 unchanged;
- existing v1 tests and validators remain green;
- live Anki remains an explicit local verification step.

## Status

In progress.
