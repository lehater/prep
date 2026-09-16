# Architecture overview

## Decision frame

`prep` uses:

- **DDD** to discover and protect bounded-context domain models;
- **Clean Architecture** to keep policy independent from frameworks and external systems;
- **Hexagonal Architecture** to express external interaction through ports and adapters.

These are complementary views, not competing directory templates.

## Primary rule

Dependencies point inward toward business policy.

```text
Interfaces / delivery
        |
        v
Application / use cases
        |
        v
Domain

Infrastructure implements outward-facing ports required by the core.
```

Anki, AnkiConnect, ffmpeg, Whisper, file systems, databases, CLIs, web APIs, and LLM providers are external mechanisms. They do not define domain concepts.

## Logical layers

### Domain

Owns business meaning and invariants inside one bounded context.

Examples:

- Interview Preparation: `Competency`, `Concept`, `Question`, `LearningTask`;
- English Listening: `MediaSource`, `LexicalTarget`, `ListeningSegment`.

Domain code must not import Anki, HTTP, filesystem, subprocess, SDK, or presentation concepts.

### Application

Owns use cases and orchestration. It decides *what must happen* without knowing *how an external mechanism performs it*.

Examples:

```text
SyncInterviewQuestions
BuildBaselineAssessment
PublishListeningExercise
ExtractListeningSegment
```

Application defines outbound ports when a use case needs an external capability.

### Interface / delivery

Translates an external request into an application use case and presents its result.

Possible adapters:

- CLI;
- web/API;
- agent command;
- scheduled job.

Delivery does not contain domain policy.

### Infrastructure

Implements technical capabilities required through ports.

Examples:

- `AnkiConnectAdapter`;
- ffmpeg media adapter;
- Whisper/ASR adapter;
- filesystem/JSON repositories.

Infrastructure may depend on application/domain contracts. Application/domain must not depend on infrastructure implementations.

## Port ownership

A port belongs conceptually to the core that needs the capability.

Do not create a global interface merely because two adapters look similar.

Preferred evolution:

```text
use case needs capability
  -> define local application port
  -> implement adapter
  -> observe repeated equivalent semantics
  -> extract shared port only when proven
```

This prevents an external system such as Anki from dictating the internal model.

## Bounded contexts

Current bounded contexts:

1. **Interview Preparation**
2. **English Listening**

They may share infrastructure while retaining different domain models. There is intentionally no universal `LearningItem` or `Exercise` shared kernel yet.

See [`context-map.md`](context-map.md).

## Shared infrastructure

Shared infrastructure is permitted when the responsibility is demonstrably domain-independent.

Current example:

```text
src/prep/infrastructure/anki/
```

It owns AnkiConnect transport and generic reconciliation mechanics. It must not know about `Question`, `ListeningSegment`, competency semantics, lexical selection, or mastery.

Each bounded context/application layer owns its mapping into the shared infrastructure.

## Target code shape

The exact package tree may evolve, but dependency ownership should converge toward:

```text
src/prep/
├── interview/
│   ├── domain/
│   ├── application/
│   │   └── ports/
│   └── interface/
├── listening/
│   ├── domain/
│   ├── application/
│   │   └── ports/
│   └── interface/
└── infrastructure/
    ├── anki/
    ├── media/
    └── asr/
```

Do not perform a directory-only refactor before use cases require these packages. Structure should follow stable responsibilities, not precede them.

## Vertical-slice rule

Architecture is validated by working slices, not diagrams alone.

Preferred order:

```text
Domain invariant
  -> application use case
  -> port
  -> adapter
  -> executable validation/test
```

For example, Interview Preparation should next prove:

```text
canonical Question
  -> SyncInterviewQuestions
  -> study-system port
  -> AnkiConnect adapter
  -> stable upsert in Anki
```

## Agent boundary

Agents may make semantic proposals and transformations. Deterministic code owns structural truth and external side effects.

```text
Agent / LLM: interpretation, generation, critique
Code: IDs, schemas, provenance, validation, migration, writes
```

An agent must not silently invent stable identifiers, source coordinates, persisted mappings, or migration state.
