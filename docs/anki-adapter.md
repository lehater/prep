# Anki adapter v0.1

## Purpose

Define how the canonical `prep` question model is projected into Anki for the first live execution adapter.

This document describes an adapter boundary. It does not change the domain meaning of `Question`, `Attempt`, `Assessment`, or `Mastery`.

## Responsibility

The adapter is responsible for:

- ensuring the target Anki deck exists;
- ensuring the required Anki NoteType exists and matches the expected schema;
- creating new Anki notes from canonical questions;
- updating previously generated notes when canonical content changes;
- resolving Anki note/card IDs back to canonical `QuestionId` values;
- reading review observations needed for later diagnostics;
- optionally invoking Anki sync as an explicit command.

The adapter is not responsible for:

- deciding what questions should exist;
- defining LearningTask or QuestionType semantics;
- inferring mastery directly from Anki scheduling state;
- making repository content subordinate to edits made only inside Anki.

## Boundary

```text
questions/*.json
      ↓
canonical Question
      ↓
AnkiAdapter
      ↓
AnkiConnect v6
      ↓
Anki Desktop collection
```

Review flow:

```text
Anki review event
      ↓
AnkiConnect
      ↓
raw ReviewObservation
      ↓
prep Attempt import
      ↓
domain assessment / gap analysis
```

## Initial deck

Default deck:

```text
Prep
```

The deck name must be configurable.

Knowledge classification should remain in fields/tags rather than being encoded as a deep deck hierarchy. Separate normal decks should be introduced only when different scheduling/study behavior justifies them.

## Initial NoteType

Name:

```text
Prep Question v1
```

Fields in order:

1. `QuestionId`
2. `Prompt`
3. `ReferenceAnswer`
4. `RequiredPoints`
5. `ConceptId`
6. `QuestionType`
7. `LearningTask`
8. `Sources`
9. `ContentVersion`

### `QuestionId`

`QuestionId` is the first field intentionally.

It is the stable external identity owned by the repository. It is not rendered on the card.

Anki checks the first field when detecting duplicates for a note type, so stable `QuestionId` values make repeated creation attempts naturally converge instead of depending on mutable prompt text.

### Derived fields

`LearningTask` is derived from `model/question-taxonomy.json` using `QuestionType`. It is materialized into Anki for search/debugging but remains derived data.

`ContentVersion` is adapter metadata. The exact representation (schema version, content hash, or revision) will be chosen during implementation.

## Initial card type

`Prep Question v1` has one card type in v0.1.

Front:

```html
<div class="prep-prompt">{{Prompt}}</div>
```

Back conceptually renders:

```text
Prompt
ReferenceAnswer
RequiredPoints
Sources (optional / visually secondary)
```

One canonical Question therefore produces:

```text
1 Question
→ 1 Anki Note
→ 1 Anki Card
```

This keeps one canonical assessment prompt aligned with one Anki review stream.

Additional card templates must not be added merely to show alternate views; every extra card template creates another scheduled card and therefore changes assessment data.

## QuestionType versus NoteType

`QuestionType` is domain metadata and does not map 1:1 to Anki NoteType.

All ordinary text-based interview questions initially use `Prep Question v1`.

A new NoteType is justified only when Anki interaction semantics materially differ, for example:

- cloze deletion;
- typed-answer comparison;
- image occlusion;
- a future specialized code/diagram interaction.

## Tags

Adapter-generated tags should be deterministic and namespaced.

Initial shape:

```text
prep
prep::concept::<ConceptId>
prep::question-type::<QuestionType>
prep::learning-task::<LearningTask>
```

Example:

```text
prep
prep::concept::backend.idempotency
prep::question-type::diagnose
prep::learning-task::analyze
```

Tags are projections of canonical metadata. The repository remains authoritative.

## Create/update algorithm

For each canonical question:

```text
validate canonical question
→ derive LearningTask
→ ensure deck
→ ensure NoteType/schema
→ search by exact QuestionId field
   ├─ none   → add note
   ├─ one    → update generated fields/tags if changed
   └─ many   → fail: identity invariant violated
→ resolve generated card id(s)
→ record/report mapping result
```

Anki field searches use exact matching by default, so `QuestionId:<escaped-id>` is appropriate for identity lookup.

The implementation must correctly escape Anki search syntax rather than concatenate arbitrary values unsafely.

## Required AnkiConnect operations

The first adapter only needs a small subset of the API.

### Connection/capability

- `version`

### Deck

- `deckNames`
- `createDeck`

### Model / NoteType

- `modelNames`
- `modelFieldNames`
- `modelTemplates`
- `modelStyling`
- `createModel`
- later, explicit migration operations if NoteType evolution is required

### Notes

- `findNotes`
- `notesInfo`
- `addNotes`
- `updateNoteFields`
- `updateNoteTags`

### Cards / review evidence

- `findCards` or note/card resolution operations
- `cardsInfo`
- `getReviewsOfCards` and/or `cardReviews`

### Explicit optional operation

- `sync`

Do not use broad API capabilities merely because they exist. Keep the adapter surface minimal.

## Upsert semantics

The desired behavior is repository-to-Anki reconciliation, not blind append.

A sync run should classify each question as one of:

```text
created
updated
unchanged
conflict
error
```

Deletion semantics are intentionally deferred. Removing a question from the repository must not automatically delete a user's Anki review history in v0.1.

## Local edits in Anki

Generated semantic fields (`Prompt`, reference answer, metadata) are repository-owned.

If a user edits them directly in Anki, a later reconciliation may overwrite those fields. The implementation should make this explicit before write support is enabled.

User-owned Anki scheduling/review state must not be overwritten during ordinary content reconciliation.

## Baseline/review distinction

Anki's review log records review events but does not know `prep` concepts such as baseline versus reassessment.

A future `AssessmentRun` manifest must provide that context. Review events should be imported as observations and associated with a run before they become domain `Attempt` records.

## Security

Initial rules:

- endpoint default: `http://127.0.0.1:8765`;
- no remote binding;
- optional API key supplied through local configuration/environment;
- no AnkiWeb credentials in repository files;
- explicit `sync`, not automatic sync after every mutation.

## Implementation slice after this research

The smallest useful implementation is:

```text
check AnkiConnect version
→ ensure `Prep` deck
→ ensure `Prep Question v1`
→ dry-run 8 idempotency questions
→ upsert them
→ verify 8 canonical QuestionIds resolve to 8 notes/cards
```

Only after this succeeds should review-history ingestion be implemented.
