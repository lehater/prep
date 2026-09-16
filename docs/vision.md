# Vision

## Problem

Learning workflows easily fragment across chats, notes, media-processing scripts, ad-hoc question lists, and Anki decks. The durable model of what is being learned, how it is practiced, and what evidence exists about progress becomes scattered or implicit.

Two concrete use cases already demonstrate the problem:

- technical interview preparation from competencies, concepts, and diagnostic questions;
- English listening practice from authentic film/TV audio and lexical targets.

They share execution and lifecycle concerns, but have different domain vocabularies.

## Goal

Build a repository-centered adaptive learning workspace that:

- keeps each learning use case in its own bounded context;
- preserves domain-specific source data and learning objects;
- uses explicit diagnostic/practice artifacts instead of relying on chat history;
- integrates with Anki as an initial execution and spaced-repetition environment;
- records attempts/reviews as evidence that can later drive diagnostics and learning actions;
- shares infrastructure such as AnkiConnect only when it is truly domain-independent;
- keeps research, decisions, data, automation, and migration rules reproducible and versioned.

## Initial bounded contexts

### Interview Preparation

Purpose: prepare for technical interviews through competency modeling, question banks, baseline assessment, retrieval practice, and gap-driven learning.

Current slice:

```text
question taxonomy
  -> canonical question
  -> Anki representation
  -> attempt/review evidence
  -> gap analysis
```

### English Listening

Purpose: train recognition and understanding of authentic spoken English from film/TV media.

Existing behavioral slice from the legacy pipeline:

```text
media/transcript
  -> lexical target selection
  -> ASR/alignment
  -> stable ListeningSegment
  -> normalized audio
  -> Anki listening card
```

## Operating principle

The repository is the system of record. Chat sessions and agents operate on repository artifacts but do not replace them.

## Architecture principle

Do not invent a universal learning domain prematurely.

Interview `Question` and English `ListeningSegment` remain separate concepts until repeated behavior demonstrates a useful common abstraction. Shared infrastructure such as Anki transport, note reconciliation, media storage, and review ingestion can be extracted earlier because its responsibilities are already demonstrably common.

## Non-goals for the current stage

- building a full LMS;
- forcing every learning activity into one `Question`/`Exercise` schema;
- migrating the entire legacy English project in one change;
- coupling domain models to Anki internals;
- generating large content banks before vertical slices are validated.
