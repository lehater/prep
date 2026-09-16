# Architecture

## System responsibility

`prep` is the durable workspace for modeling, executing, and improving multiple adaptive learning workflows.

The repository owns:

- bounded-context domain models;
- canonical learning/practice data for each use case;
- mappings to shared execution adapters such as Anki;
- research, decisions, plans, migration rules, and validation.

## Context map

```text
┌─────────────────────────────┐
│ Interview Preparation       │
│                             │
│ Competency                  │
│ Concept                     │
│ LearningTask                │
│ QuestionType                │
│ Question                    │
└──────────────┬──────────────┘
               │
               │ maps to
               v
        ┌───────────────┐
        │ Shared Anki   │
        │ infrastructure│
        └───────────────┘
               ^
               │ maps to
               │
┌──────────────┴──────────────┐
│ English Listening           │
│                             │
│ MediaSource                 │
│ TranscriptOccurrence        │
│ LexicalTarget               │
│ ListeningSegment            │
│ audio/alignment policy      │
└─────────────────────────────┘
```

## Bounded context: Interview Preparation

Purpose: prepare for technical interviews with explicit competency/question diagnostics.

Current flow:

```text
Target role
  -> competency model
  -> concepts
  -> learning tasks
  -> question types
  -> canonical questions
  -> Anki adapter
  -> attempts/reviews
  -> diagnostics
  -> gaps
  -> learning actions
  -> reassessment
```

The existing `docs/domain-model.md`, question taxonomy, question banks, and validator belong to this bounded context even though they currently live at legacy root paths.

## Bounded context: English Listening

Purpose: create listening-comprehension practice from authentic media.

Target flow, based on the proven legacy pipeline:

```text
media source
  -> authoritative transcript
  -> lexical target selection
  -> ASR/alignment
  -> stable ListeningSegments
  -> normalized audio
  -> Anki adapter
  -> review evidence
```

Media provenance, lexical selection, ASR, acoustic segments, and playback policy remain English-specific.

## Shared infrastructure

### Anki / AnkiConnect

This is the first shared technical adapter.

Candidate shared responsibilities, already demonstrated across the two use cases:

- HTTP transport and API version handling;
- deck creation;
- note-type creation and safe evolution;
- stable external identity lookup;
- create/update/conflict reconciliation;
- tag reconciliation;
- media upload;
- note/card verification;
- review-history ingestion;
- migration helpers that preserve scheduler history.

Each bounded context owns its own mapping from domain objects to Anki fields/templates/tags.

## No shared learning kernel yet

Do not introduce a generic `LearningItem`, `Exercise`, or universal question schema merely to make the directory tree uniform.

Potentially shared concepts such as `Attempt`, `Assessment`, `ReviewObservation`, `Gap`, or `Mastery` should be extracted only after both bounded contexts demonstrate materially equivalent semantics.

## Agent boundary

Adopt the useful rule proven in the legacy English pipeline:

```text
Agent / LLM owns semantic decisions.
Deterministic code owns structural truth and side effects.
```

Examples:

- semantic: question generation, explanation quality, lexical selection, contextual meaning;
- deterministic: IDs, source coordinates, schemas, validation, media processing, Anki writes, migrations.

## Architectural rule

Domain semantics must not be derived from Anki note/card structures. Mapping direction is from each bounded context to shared Anki infrastructure.

## Evolution rule

Start with the smallest vertical slice that can be executed end-to-end. Reuse existing proven code where responsibilities match exactly; do not generalize domain concepts until repeated concrete duplication justifies it.
