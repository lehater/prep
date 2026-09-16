# ADR-003: AnkiConnect as the primary live Anki adapter

- Status: Accepted
- Date: 2026-09-16

## Context

`prep` needs a first integration path that can:

- create and update Anki study material from repository-owned canonical questions;
- create/inspect required decks and note types;
- preserve Anki scheduling state while content evolves;
- later read review evidence for diagnostics;
- keep the domain model independent from Anki internals.

Three integration families were considered:

1. AnkiConnect — third-party local HTTP/JSON add-on API;
2. the official Anki Python `anki` module and direct `Collection` access;
3. file/package interchange such as `.apkg` or text import/export.

Direct use of the `anki` module is powerful but couples the external process more tightly to Anki's Python/backend versions and collection lifecycle. File/package interchange is useful for distribution and offline generation but does not provide a live feedback channel for incremental updates and review analytics.

## Decision

Use **AnkiConnect API v6** as the primary live Anki adapter for the first vertical slice.

The adapter boundary is:

```text
prep domain/canonical data
    ↓
AnkiAdapter port
    ↓
AnkiConnect implementation
    ↓
Anki Desktop
```

The canonical mapping for ordinary questions is initially:

```text
1 canonical Question
→ 1 Anki Note (`Prep Question v1`)
→ 1 Anki Card
```

`QuestionId` is the first Anki note field and remains the stable repository-owned identity. Prompt text is not identity.

AnkiConnect is accessed only through loopback by default. Sync with AnkiWeb is an explicit operation.

## Alternatives

### Official `anki` Python module as the first adapter

Rejected for the first live path because it requires tighter integration with Anki's collection/backend lifecycle and versioned Python package. It remains a candidate for future offline/package generation or a dedicated add-on.

### `.apkg` as the primary exchange mechanism

Rejected as the primary learning-loop adapter because it is batch-oriented and does not expose live review evidence. It remains a candidate secondary export/distribution adapter.

### Custom Anki add-on / direct backend bridge

Deferred. It may become justified if AnkiConnect lacks a required capability or compatibility becomes a material problem.

## Consequences

Positive:

- external `prep` tooling can remain an independent process;
- the first integration uses a small JSON/HTTP boundary;
- models, decks, notes, tags and review history are available through one adapter;
- Anki Desktop retains responsibility for its own collection mutations and scheduling;
- canonical IDs allow deterministic reconciliation rather than append-only generation.

Costs/risks:

- AnkiConnect is a third-party add-on and must be installed;
- Anki Desktop must be running for live operations;
- compatibility with Anki releases is an external dependency;
- review events still need domain interpretation; Anki button/ease values do not directly equal `Mastery`;
- adapter code must handle Anki search escaping and model/schema drift explicitly.

## Deferred decisions

- exact `ContentVersion`/hash algorithm;
- NoteType migration policy after v1;
- deletion/retirement semantics for canonical questions;
- mapping of baseline/reassessment sessions to imported review events;
- secondary `.apkg` adapter implementation;
- whether an API key becomes mandatory rather than optional for local AnkiConnect access.
