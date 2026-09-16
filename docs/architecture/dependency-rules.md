# Dependency rules

## Purpose

Convert Clean/Hexagonal Architecture from a preference into explicit repository constraints.

## Allowed dependency direction

```text
interface/delivery
      -> application
      -> domain

infrastructure
      -> application ports
      -> domain types only when required by the port contract
```

The core never imports adapters.

## Domain rules

Domain modules may depend on:

- Python standard-library primitives where they do not introduce technical coupling;
- other domain types inside the same bounded context.

Domain modules must not depend on:

- `src/prep/infrastructure/**`;
- Anki / AnkiConnect concepts;
- HTTP clients;
- filesystem persistence implementations;
- subprocess/ffmpeg integration;
- Whisper/ASR SDKs;
- CLI/web frameworks;
- LLM provider SDKs.

Domain entities/value objects express business meaning, not serialized transport shapes.

## Application rules

Application modules may depend on:

- their bounded-context domain;
- port/protocol definitions required by their use cases;
- simple application DTOs/results.

Application modules must not depend directly on concrete infrastructure implementations.

Bad:

```python
from prep.infrastructure.anki import AnkiConnect
```

inside an application use case.

Preferred:

```python
class StudySystem(Protocol):
    ...
```

owned by the application/core, with an infrastructure adapter implementing it.

## Port ownership

Ports are driven by core needs.

Rule:

> The consumer owns the abstraction; the adapter implements it.

Therefore an `AnkiPort` is usually a smell. The core needs capabilities such as publishing practice material or storing media, not "calling Anki".

Prefer capability-oriented contracts:

```text
StudySystem
MediaProcessor
Transcriber
QuestionRepository
AttemptRepository
```

Names and granularity must remain bounded-context specific until common semantics are proven.

## Infrastructure rules

Infrastructure owns:

- SDK/API protocol details;
- HTTP envelopes;
- external identifiers returned by providers;
- serialization needed only for an external system;
- retries/timeouts/connection errors;
- technical migrations;
- external side effects.

Infrastructure must not decide:

- which questions are educationally valuable;
- what a competency means;
- which lexical target is worth studying;
- whether a learner has mastery;
- how domain identity is derived.

## Shared infrastructure

`src/prep/infrastructure/` is technical sharing, not a shared domain kernel.

A shared adapter must remain usable without importing either bounded context.

Current invariant for `src/prep/infrastructure/anki/`:

```text
no interview domain vocabulary
no English-listening domain vocabulary
no educational decision policy
```

## Cross-context rules

Bounded contexts do not import each other's domain packages.

If data must cross a boundary:

1. define an explicit integration DTO/event/contract;
2. translate at the boundary;
3. keep each context's internal model private.

Do not reuse an entity class from another bounded context merely because fields look similar.

## Interface rules

CLI/web/agent entrypoints may:

- parse/validate delivery input;
- construct application requests;
- invoke use cases;
- render results/errors.

They must not contain domain rules or perform external writes that bypass application use cases.

## Agent/LLM rule

LLM calls are external capabilities, even when they perform semantic work.

Core policy decides why/when semantic interpretation is required. An adapter/provider implementation decides how the model is invoked.

Persisted structural truth must be validated deterministically before external side effects.

## Enforcement strategy

Initially enforce through:

- code review/agent rules;
- package boundaries;
- focused tests;
- architecture docs.

When the package structure stabilizes, add executable architecture checks (for example import-boundary tests) instead of relying permanently on prose.

## Change test

Before adding a dependency, ask:

1. Is this domain meaning or a technical mechanism?
2. Which bounded context owns the need?
3. Is the dependency pointing inward?
4. Should this be a port instead of a concrete dependency?
5. Are we extracting sharing from evidence or guessing future reuse?
