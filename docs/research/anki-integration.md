# Research — Anki integration surfaces

Date: 2026-09-16

## Question

What Anki integration surface should `prep` use first to create/update study material and later import review evidence without making Anki the domain model?

## Anki object model

Anki distinguishes **notes** from **cards**:

```text
NoteType (model)
  ├─ fields
  └─ CardType/template(s)
          ↓
        Note
          ↓
       Card(s)
```

A note contains field values and tags. A note type defines fields and one or more card types/templates. Adding one note can therefore generate one or more cards. Card templates use HTML/CSS and field substitution.

Important consequences for `prep`:

- canonical `Question` should map to an Anki **Note**, not directly to an Anki Card;
- the Anki NoteType/CardTemplate is presentation/execution infrastructure;
- creating multiple card types for one note creates multiple scheduled cards and therefore multiple review streams;
- note types are collection-wide and are independent of decks.

Sources:
- Anki Manual — Getting Started / Notes & Card Types: https://docs.ankiweb.net/getting-started.html
- Anki Manual — Card Templates: https://docs.ankiweb.net/templates/intro.html
- Anki Manual — Adding/Editing: https://docs.ankiweb.net/editing.html

## Integration option A — AnkiConnect

AnkiConnect is a third-party Anki add-on that exposes Anki functions to external applications through a local HTTP/JSON API. API requests use an `action`, API `version` (currently v6), optional parameters, and optional API key.

The service normally listens on `127.0.0.1:8765`, which makes it suitable for a local CLI/service without opening the collection file directly.

Relevant capabilities:

### Models / note types

- `modelNames`
- `modelFieldNames`
- `createModel`
- `modelTemplates`
- `modelStyling`
- `updateModelTemplates`
- `updateModelStyling`

### Decks

- `deckNames`
- `createDeck`
- deck configuration operations

### Notes

- `addNote`
- `addNotes`
- `canAddNotes`
- `updateNoteFields`
- `updateNoteModel`
- `updateNoteTags`
- `findNotes`
- `notesInfo`
- tag operations

### Cards / reviews

- `findCards`
- `cardsInfo`
- `getIntervals`
- `cardReviews`
- `getReviewsOfCards`

`getReviewsOfCards` exposes review events including timestamp, button/ease, interval, previous interval, factor, duration, and review type. This is sufficient raw material for later `Attempt` ingestion, though domain interpretation remains `prep` responsibility.

### Synchronization

- `sync` can trigger local Anki ↔ AnkiWeb synchronization.

Operational properties:

- Anki Desktop must be running;
- the add-on must be installed;
- it is not an official built-in Anki network API;
- compatibility with Anki releases is an external dependency;
- keeping the listener on loopback is the appropriate default for `prep`;
- API authentication can be enabled with an AnkiConnect key if desired.

Sources:
- AnkiConnect AnkiWeb listing: https://ankiweb.net/shared/info/2055492159
- AnkiConnect API documentation (historical GitHub mirror): https://github.com/FooSoft/anki-connect/blob/master/README.md

## Integration option B — official `anki` Python module

Anki documents a Python package named `anki`. Collection access goes through `anki.collection.Collection`; the package can be used inside an add-on and can also be used outside the GUI by opening a collection directly.

The module can read/write notes, cards, decks, models and can import/export `.apkg` packages. Modern Anki delegates much of this work to its Rust backend.

Advantages:

- official Anki code path;
- direct access to collection operations;
- suitable for add-ons and potential headless/offline tooling;
- official support for `.apkg` import/export through `Collection`.

Costs/risks for the first `prep` adapter:

- tighter coupling to Anki package/version internals;
- direct collection lifecycle/file access becomes our responsibility;
- less process isolation than a localhost API;
- Anki's architecture documentation explicitly states that protobuf backend definitions are not considered public API;
- running against the same user collection creates more operational concerns than asking the running Anki instance to perform changes.

This makes the Python module attractive as a future **offline/package adapter** or dedicated Anki add-on implementation, but unnecessarily coupled for the first live integration.

Sources:
- Anki add-on docs — The `anki` Module: https://github.com/ankitects/anki/blob/main/docs-site/addons/the-anki-module.mdx
- Anki architecture: https://github.com/ankitects/anki/blob/main/docs/architecture.md

## Integration option C — `.apkg` / text import

Anki officially supports packaged decks (`.apkg`) containing notes, note types, cards, and optional media/scheduling data. Plain-text note import/export is also supported.

Advantages:

- no long-running integration API required;
- good for distribution, backup, and reproducible exported artifacts;
- `.apkg` is native Anki interchange.

Limitations for `prep`:

- not interactive;
- poor fit for incremental live updates;
- no direct feedback channel for review events;
- package import is an execution step performed by the user/client;
- text import is weaker for templates/media and live synchronization.

Therefore package/text export is useful as a later secondary adapter, not as the primary learning loop.

Sources:
- Anki Manual — Exporting: https://docs.ankiweb.net/exporting.html
- Anki Manual — Packaged Decks: https://docs.ankiweb.net/importing/packaged-decks.html

## Identity and duplicate behavior

Anki's normal duplicate check uses the **first field** of a note type and scopes uniqueness to the note type. AnkiConnect also uses the first field in its duplicate handling unless duplicate behavior is explicitly relaxed.

This gives `prep` a useful mapping:

```text
first field = QuestionId
```

`QuestionId` is repository-owned, stable, and not derived from prompt text. It should be present in Anki but hidden from the rendered card.

Benefits:

- retrying creation does not accidentally create a second note for the same canonical question;
- prompt text can change without changing identity;
- updates can locate the existing note by external ID;
- Anki's own first-field duplicate semantics reinforce repository identity.

Source:
- Anki Manual — Duplicate Check: https://docs.ankiweb.net/editing.html#duplicate-check

## Initial mapping hypothesis

Use one Anki note type for ordinary interview questions:

`Prep Question v1`

Proposed fields:

1. `QuestionId` — stable canonical ID; first field; not rendered.
2. `Prompt`
3. `ReferenceAnswer`
4. `RequiredPoints`
5. `ConceptId`
6. `QuestionType`
7. `LearningTask` — derived from taxonomy and materialized for filtering/debugging.
8. `Sources`
9. `ContentVersion` — generated content/schema version or hash when update semantics need it.

Initial card template:

```text
Front:
  Prompt

Back:
  Prompt
  ReferenceAnswer
  RequiredPoints
  Sources (optional/collapsible)
```

One canonical question generates **one note and one card** in v0.1.

QuestionType remains a field/tag, not a NoteType. Separate Anki note types should only appear when the interaction itself requires a materially different Anki mechanism (for example cloze, typed answer, or image occlusion).

## Deck and tags

Decks primarily affect scheduling/organization in Anki, so topic taxonomy should not initially be encoded as a large deck tree.

Initial proposal:

```text
Deck: Prep
```

Metadata goes into fields/tags, for example:

```text
prep
prep::concept::backend.idempotency
prep::question-type::diagnose
prep::learning-task::analyze
```

This keeps knowledge classification independent from scheduling topology.

## Review ingestion

AnkiConnect can return card review history, but Anki's review log does not know the domain distinction between:

- baseline assessment;
- normal learning/review;
- mock-interview exercise.

Therefore `prep` must add session semantics outside Anki. A future execution run should record a manifest/checkpoint such as:

```text
AssessmentRun
  id
  kind = baseline | review | reassessment
  started_at
  question_ids
  card_ids
```

Review events imported from Anki can then be associated with the run and converted into domain `Attempt` observations.

This preserves the invariant that Anki review buttons are evidence, not the definition of domain mastery.

## Security / operational boundary

For the first adapter:

- connect only to loopback (`127.0.0.1`);
- do not require network exposure;
- do not bind AnkiConnect to `0.0.0.0`;
- optionally support an API key from environment/local config;
- never store user AnkiWeb credentials in the repository;
- treat `sync` as an explicit operation, not an implicit side effect of every write.

## Recommendation

Use **AnkiConnect API v6 as the primary live execution adapter** for the first vertical slice.

Keep two future adapters conceptually open:

```text
AnkiConnectAdapter   # live local desktop integration
AnkiPackageAdapter   # offline .apkg generation/export
```

The official `anki` Python module is a likely implementation dependency for the package/headless path, but it should not be pulled into the domain layer.
