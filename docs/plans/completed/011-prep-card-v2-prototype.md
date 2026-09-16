# Plan 011 — Prep Card v2 prototype

## Goal

Turn the learning-card architecture research into a bounded, reversible Anki experiment that can be used and compared with the existing `Prep Question v1` cards.

## Completed work

- kept canonical `questions/*.json` and `Prep Question v1` unchanged;
- added 14 prototype learning objects: 7 `Idempotency`, 7 `asyncio`;
- represented `KnowledgeKind`, `LearningTask`, `QuestionType`, `GuidanceLevel`, `StimulusFormat`, and `ResponseFormat` independently;
- represented feedback through semantic blocks: short answer, explanation, reasoning steps, key points, correct artifact, pitfall, alternatives, sources;
- covered prose/scenario/code/mixed stimuli and worked/faded/independent guidance;
- added isolated Anki NoteType `Prep Learning Object v2` and deck `Prep::Prototype v2`;
- added responsive light/dark CSS and dedicated code/artifact rendering without JavaScript;
- added safe-by-default dry-run and explicit `--apply` CLI;
- added an evaluation checklist for real Anki use;
- added prototype validation and fake-Anki reconciliation tests;
- removed the accidental empty `noop` file from repository content.

## Validation

GitHub Actions run `35156346525` passed:

```text
documentation links : 47 Markdown files resolved
architecture         : passed
question model       : 8 question types, 1 bank, 8 canonical questions
unit tests           : 20 passed
```

Prototype behavior covered by tests:

- exactly 14 unique prototype IDs;
- both topic families represented;
- `worked`, `faded`, and `independent` guidance represented;
- code/scenario/prose/mixed interactions represented;
- code HTML is escaped and rendered as preformatted content;
- dry-run performs no Anki mutation;
- first apply creates 14 notes;
- second equivalent apply reports 14 unchanged notes;
- changing content updates the existing note identity rather than creating a new note;
- existing v1 tests continue to pass.

## Local verification

With Anki Desktop + AnkiConnect:

```bash
python -m experiments.interview_card_v2.sync
python -m experiments.interview_card_v2.sync --apply
```

The local prototype should be evaluated against the checklist in `experiments/interview_card_v2/README.md` before any v1 migration or permanent schema decision.

## Decision boundary

This implementation is still an experiment. It does not yet accept `KnowledgeKind`, guidance/stimulus/response fields, or the semantic feedback-block schema as permanent Interview Preparation domain concepts.

## Status

Completed.
