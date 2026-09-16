# ADR-004: Multi-use-case learning workspace

- Status: Accepted
- Date: 2026-09-16

## Context

`prep` began as a repository-centered system for technical interview preparation. A prior project, `anki_codex_pipeline_v09`, already implements a different but related learning use case: spoken-English listening practice from film/TV material.

The English project contains mature AnkiConnect behavior, stable card identity, idempotent upsert, note-type migration, scheduler-history preservation, media upload, and 43 passing unit tests.

There is clear technical overlap, but the two learning domains are not the same:

- interview preparation is centered on competencies, concepts, question types, and explicit technical answers;
- English listening is centered on media provenance, lexical targets, acoustic segments, audio stimulus, and recognition/understanding.

Forcing both into the current `Question` model would mix bounded contexts and create premature abstractions.

## Decision

Evolve `prep` into a repository-centered learning workspace containing multiple bounded learning use cases.

Initial bounded contexts:

1. **Interview Preparation** — preserves the existing competency/concept/question model.
2. **English Listening** — owns media, lexical, ASR/alignment, and listening-card concepts.

Shared functionality is extracted only when it is demonstrably domain-independent.

The first shared component is the Anki integration layer:

```text
Interview Preparation ─┐
                      ├─> Shared AnkiConnect adapter -> Anki
English Listening ────┘
```

The repository does not introduce a universal `Exercise` or `LearningItem` domain entity in this ADR.

## Shared adapter responsibilities

The shared Anki layer may own:

- AnkiConnect transport/version handling;
- deck existence;
- note-type creation and safe evolution;
- stable external identity lookup;
- create/update/conflict reconciliation;
- tag reconciliation;
- media upload;
- note/card inspection;
- review-history access;
- migration helpers that preserve scheduler history.

Use-case-specific code owns the mapping from its domain objects to Anki fields/templates/tags.

## Boundaries

Interview-specific concepts remain local:

```text
Competency
Concept
LearningTask
QuestionType
Question
```

English-listening-specific concepts remain local:

```text
MediaSource
TranscriptOccurrence
LexicalTarget
ListeningSegment
ASR/alignment/audio policy
```

Anki note/card structures remain infrastructure concepts and do not define either domain.

## Alternatives considered

### Keep separate repositories

Rejected for now because the same user workflow, Anki adapter, review data, harness practices, and future analytics would be duplicated. The projects already share enough technical lifecycle to benefit from one workspace.

### Merge the old project wholesale into the repository root

Rejected because it would preserve accidental structure and mix English pipeline concerns with interview-preparation files.

### Generalize the domain immediately around `LearningItem` / `Exercise`

Deferred because one use case models explicit questions while the other models audio recognition. The apparent common abstraction is not yet proven.

## Consequences

Positive:

- Anki infrastructure can be implemented and tested once;
- English-learning work is preserved as a real use case rather than discarded;
- each bounded context keeps its own vocabulary;
- the repository can discover shared learning abstractions from evidence;
- agent harness and CI conventions are reused.

Costs:

- repository navigation needs explicit use-case boundaries;
- some domain concepts such as `Attempt` and `Assessment` may temporarily exist with use-case-specific semantics;
- migrating the English pipeline will require staged moves rather than a single copy.

## Migration rule

The 43-test legacy English pipeline is the behavioral baseline. During migration, equivalent slices should remain testable before legacy code is retired.
