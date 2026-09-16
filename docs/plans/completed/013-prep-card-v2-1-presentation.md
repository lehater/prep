# Plan 013 — Prep Card v2.1 learner-first presentation

## Goal

Apply the information-architecture research to the existing 14 `Prep Learning Object v2` prototypes without changing their semantic source data.

## Completed work

- reused the same 14 prototype objects and the same `prototypes.json` source;
- kept `v2.0` intact as a control and added a separate `v2.1` projection;
- added NoteType `Prep Learning Object v2.1` and deck `Prep::Prototype v2.1`;
- removed raw taxonomy badges from the normal learner-facing front;
- added explicit learner-facing `Тема`, `Контекст`, and `Формат ответа` labels;
- added bounded display labels such as `Idempotency (идемпотентность)` and `Coroutine (корутина)`;
- translated machine response-format values into Russian learner-facing response guidance;
- distinguished actual subject context from instructional labels stored in the prototype `Context` field;
- limited visible interaction metadata to at most one human cue such as `Разобранный пример`, `Диагностика`, `Проектирование`, or `Анализ кода`;
- placed stimulus before prompt when stimulus exists;
- reorganized feedback into fast check (`ShortAnswer`, `KeyPoints`), deeper explanation, and optional extension/provenance;
- retained all machine taxonomy as fields/tags for analysis without exposing it on the normal learner surface;
- added a side-by-side comparison guide and safe-by-default v2.1 sync CLI;
- added tests for presentation semantics, context distinction, response guidance, feedback ordering, dry-run, and idempotent apply.

## Validation

GitHub Actions run `35159660924` completed successfully:

```text
documentation links : passed
architecture         : passed
question model       : passed
unit tests           : passed
```

The v2.1 tests verify:

- exactly the same 14 semantic learning objects are used;
- front template does not expose raw machine taxonomy fields;
- `Payment API` is shown as explicit context;
- instructional values such as `Worked code example` are not shown as subject context;
- raw `free-recall` is replaced by learner-facing Russian guidance;
- `ShortAnswer` and `KeyPoints` precede deeper `Explanation`;
- first fake-Anki apply creates 14 isolated v2.1 notes and second apply is unchanged;
- dry-run performs no mutation.

## Local comparison

With Anki Desktop + AnkiConnect:

```bash
python -m experiments.interview_card_v2.sync_v21
python -m experiments.interview_card_v2.sync_v21 --apply
```

Compare:

```text
Prep::Prototype v2
Prep::Prototype v2.1
```

The comparison checklist is in `experiments/interview_card_v2/V21.md`.

## Decision boundary

`v2.1` remains an experiment. The learner-first information architecture is not yet a permanent Interview Preparation schema/template decision; real Anki use should determine which presentation rules are accepted.

## Status

Completed.
