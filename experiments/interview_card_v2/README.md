# Prep Card v2 prototype

This directory is a bounded experiment derived from [`docs/research/learning-card-architecture.md`](../../docs/research/learning-card-architecture.md).

It does **not** replace the canonical `questions/*.json` schema or `Prep Question v1` NoteType.

## What is being tested

Each prototype object separates:

```text
KnowledgeKind
LearningTask
QuestionType
GuidanceLevel
StimulusFormat
ResponseFormat
```

from semantic feedback blocks:

```text
ShortAnswer
Explanation
ReasoningSteps
KeyPoints
CorrectArtifact
Pitfall
Alternatives
Sources
```

The current sample contains 14 objects:

- 7 around `Idempotency` — concept recall, scenario reasoning, comparison, diagnosis, worked reasoning, faded completion, architecture design;
- 7 around `asyncio` — worked code, trace, completion, diagnosis, comparison, code writing, architecture choice.

## Isolation from v1

Prototype notes use:

```text
NoteType: Prep Learning Object v2
Deck:     Prep::Prototype v2
Tag:      prep-v2
```

Current `Prep Question v1` notes are not migrated, updated, or deleted.

## Local dry-run

Start Anki Desktop with AnkiConnect and run from the repository root:

```bash
python -m experiments.interview_card_v2.sync
```

Dry-run is read-only.

## Apply

```bash
python -m experiments.interview_card_v2.sync --apply
```

A repeated apply with unchanged prototype data should report all objects as `unchanged`.

Optional overrides:

```bash
python -m experiments.interview_card_v2.sync \
  --endpoint http://127.0.0.1:8765 \
  --deck "Prep::Prototype v2" \
  --apply
```

## What to evaluate in Anki

Do not judge only whether the card looks attractive. Compare the prototype against v1 on these questions:

1. Can the task be understood before revealing the answer without reading internal metadata?
2. Does code/scenario stimulus visually separate from explanatory prose?
3. Is `ShortAnswer` sufficient for a fast check?
4. Does `Explanation` add mechanism/causality instead of repeating the short answer?
5. Are `ReasoningSteps` useful only where stepwise reasoning matters?
6. Do `KeyPoints` help self-assessment without becoming another wall of text?
7. Does `CorrectArtifact` work for code/SQL/diagram-like answers?
8. Is `Pitfall` useful enough to justify a dedicated block?
9. Are metadata chips (`LearningTask`, stimulus, guidance) useful or distracting?
10. Is the card readable on both desktop and mobile-sized windows and in light/dark mode?
11. Which blocks are consistently empty or redundant?
12. Which interaction cannot be represented comfortably with ordinary Anki reveal semantics?

## Decision boundary

The experiment should produce evidence for a later decision about `Prep Card v2`.

Possible outcomes include:

- accept most axes/blocks;
- remove dimensions that do not affect authoring or UX;
- split instructional objects from assessment questions;
- keep one Anki NoteType with conditional blocks;
- introduce a second NoteType only when interaction/scheduling semantics genuinely differ.

Do not migrate the main bank until the prototype has been used in real Anki.
