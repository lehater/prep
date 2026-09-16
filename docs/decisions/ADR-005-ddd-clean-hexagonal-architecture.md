# ADR-005: DDD with Clean/Hexagonal Architecture

- Status: Accepted
- Date: 2026-09-16

## Context

`prep` now contains two distinct learning use cases and one shared technical integration:

- Interview Preparation;
- English Listening;
- shared AnkiConnect infrastructure.

Without an explicit architectural model, there is a risk that shared tooling — especially Anki — becomes the organizing model of the repository. That would couple domain concepts to note/card schemas and make future adapters or learning workflows harder to evolve.

The repository also needs a stable rule for where domain logic, use-case orchestration, external integrations, and interfaces belong.

## Decision

Use three complementary architecture views:

1. **Domain-Driven Design** for strategic decomposition and bounded-context ownership.
2. **Clean Architecture** for inward dependency direction and policy/mechanism separation.
3. **Hexagonal Architecture** for explicit ports and adapters at external-system boundaries.

Current bounded contexts remain:

- Interview Preparation;
- English Listening.

There is no universal learning-domain shared kernel yet.

## Dependency rule

Core policy must not depend on external mechanisms.

```text
interface/delivery -> application -> domain
infrastructure     -> application ports/domain contracts
```

Anki, AnkiConnect, ffmpeg, Whisper, filesystems, web/CLI frameworks, and LLM providers are external mechanisms.

## Port rule

Ports are defined from the consumer/core point of view.

A use case asks for a capability such as publishing study material, processing media, or transcribing audio. It does not depend on an `AnkiPort`, `FfmpegService`, or `WhisperClient` unless that technology itself is genuinely domain language.

Infrastructure adapters implement those capability contracts.

## Shared infrastructure rule

Technical code may be shared before domain models are shared when the responsibility is demonstrably domain-independent.

The existing `src/prep/infrastructure/anki/` package is valid shared infrastructure because it owns transport and reconciliation mechanics without Interview Preparation or English Listening semantics.

Use-case-specific projections into Anki remain owned by their respective application/boundary code.

## Code-structure consequence

The target package shape is responsibility-first, approximately:

```text
src/prep/
├── interview/
│   ├── domain/
│   ├── application/
│   └── interface/
├── listening/
│   ├── domain/
│   ├── application/
│   └── interface/
└── infrastructure/
    ├── anki/
    ├── media/
    └── asr/
```

This ADR does not require a directory-only rewrite. Packages should move when a working vertical slice establishes the responsibility.

## Alternatives considered

### Organize around Anki

Rejected. Anki is an execution environment and external system, not the learning domain.

### One generic learning domain immediately

Deferred. `Question` and `ListeningSegment` currently have materially different semantics. A common abstraction should be extracted only from repeated equivalent behavior.

### Pure layered architecture without bounded contexts

Rejected as insufficient. Layers control dependencies but do not solve domain-language ownership between Interview Preparation and English Listening.

### Separate repositories

Not selected. The use cases can share harness, CI, technical adapters, and future integration analytics while preserving bounded contexts in one repository.

## Consequences

Positive:

- Anki remains replaceable infrastructure;
- domain models stay independent of delivery/storage concerns;
- port ownership follows use-case needs;
- shared infrastructure does not imply a shared domain model;
- agents get explicit architectural rails for future changes.

Costs:

- mapping code is required between bounded-context models and adapters;
- some apparently similar interfaces may remain duplicated until common semantics are proven;
- package migration must happen incrementally rather than through a cosmetic large refactor.

## Enforcement

The durable rules are documented in:

- `docs/architecture/overview.md`;
- `docs/architecture/context-map.md`;
- `docs/architecture/dependency-rules.md`.

As package boundaries stabilize, prose constraints should be replaced or supplemented with executable architecture tests.
