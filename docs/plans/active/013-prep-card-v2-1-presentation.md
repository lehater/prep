# Plan 013 — Prep Card v2.1 learner-first presentation

## Goal

Apply the information-architecture research to the existing 14 `Prep Learning Object v2` prototypes without changing their semantic source data.

## Scope

- keep the same 14 prototype objects, IDs, axes, prompts, stimuli and feedback content;
- update only the Anki projection/template/CSS and presentation-derived labels;
- remove raw `LearningTask`, `StimulusFormat`, and `GuidanceLevel` badges from the normal front surface;
- present `Concept` as `Тема` and `Context` explicitly as `Контекст`, so context cannot be mistaken for a subtopic;
- use a learner-facing concept label (`Idempotency (идемпотентность)` in this bounded prototype);
- replace raw `ResponseFormat` values with Russian learner-facing response guidance;
- show at most one optional human interaction cue when it changes how the learner should interpret the card;
- organize feedback into fast check, deeper explanation, and optional extension/provenance layers;
- keep machine taxonomy in Anki fields/tags but out of the normal learner surface;
- preserve one NoteType / one card template and existing note identity.

## Constraints

- no changes to canonical v1;
- no changes to `prototypes.json` semantic content;
- no JavaScript dependency;
- essential meaning must not rely on color alone;
- existing notes must update their template/styling in place;
- dry-run remains read-only.

## Validation

- front template contains explicit Russian `Тема`, `Контекст`, and `Формат ответа` semantics;
- raw taxonomy badges are absent from the learner front;
- raw machine response values are not rendered to the learner;
- back places `ShortAnswer` and `KeyPoints` before deeper explanation;
- machine fields/tags remain available for analysis;
- existing v1 and v2 reconciliation tests remain green;
- new presentation tests cover concept translation, response guidance, hidden metadata, and template hierarchy.

## Status

In progress.
