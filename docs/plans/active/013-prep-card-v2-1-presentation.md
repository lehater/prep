# Plan 013 — Prep Card v2.1 learner-first presentation

## Goal

Apply the information-architecture research to the existing 14 `Prep Learning Object v2` prototypes without changing their semantic source data.

## Scope

- keep the same 14 prototype objects, IDs, axes, prompts, stimuli and feedback content;
- add a second Anki projection only, so `v2.0` remains available as a control for side-by-side comparison;
- use NoteType `Prep Learning Object v2.1` and deck `Prep::Prototype v2.1`;
- remove raw `LearningTask`, `StimulusFormat`, and `GuidanceLevel` badges from the normal front surface;
- present `Concept` as `Тема` and actual domain `Context` explicitly as `Контекст`, so context cannot be mistaken for a subtopic;
- suppress values such as `Code trace`, `Worked example`, and `Bug diagnosis` from `Контекст` because they are instructional/presentation labels rather than subject context;
- use learner-facing concept labels such as `Idempotency (идемпотентность)` in the bounded prototype;
- replace raw `ResponseFormat` values with Russian learner-facing response guidance;
- show at most one optional human interaction cue when it changes how the learner should interpret the card;
- organize feedback into fast check, deeper explanation, and optional extension/provenance layers;
- keep machine taxonomy in Anki fields/tags but out of the normal learner surface.

## Constraints

- no changes to canonical v1;
- no changes to `prototypes.json` semantic content;
- do not modify or delete the existing `Prep Learning Object v2` notes/deck;
- no JavaScript dependency;
- essential meaning must not rely on color alone;
- dry-run remains read-only.

## Validation

- front template contains explicit Russian `Тема`, `Контекст`, and `Формат ответа` semantics;
- raw taxonomy badges are absent from the learner front;
- raw machine response values are not rendered to the learner;
- actual context such as `Payment API` remains visible while instructional labels are suppressed or converted to one human cue;
- back places `ShortAnswer` and `KeyPoints` before deeper explanation;
- machine fields/tags remain available for analysis;
- existing v1 and v2 reconciliation tests remain green;
- new presentation tests cover concept translation, response guidance, hidden metadata, context distinction, and template hierarchy.

## Status

In progress.
