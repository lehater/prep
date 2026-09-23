# Architecture overview

## Decision frame

`prep` uses:

- **DDD** to protect semantic ownership and bounded-context language;
- **Clean Architecture** to keep policy independent from frameworks/external systems;
- **Hexagonal Architecture** to express external interaction through ports/adapters;
- the pinned universal **Harness** to make top-level engineering knowledge ownership and coverage machine-checkable.

## Primary dependency rule

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

Anki, AnkiConnect, ffmpeg, Whisper, filesystems, databases, web frameworks and LLM SDKs are external mechanisms.

## Product-level semantic structure

```text
Knowledge Graph        -> reusable semantic truth
Learning Coordination -> learner intent/evidence over graph truth
Subject contexts      -> domain-specific learning semantics
Study adapters         -> external execution mechanisms
UI                     -> graph exploration and overlays
```

See [`context-map.md`](context-map.md), [`../domain/knowledge-graph.md`](../domain/knowledge-graph.md) and [`../domain/learning-platform.md`](../domain/learning-platform.md).

## Knowledge Graph boundary

The graph owns semantic nodes/relations/classification/evidence. It does not absorb Anki state, learner mastery, view layout or subject-specific exercise objects.

## Learning Coordination boundary

Learning Coordination owns target scopes, plans, publication intent, review/attempt evidence and derived learner overlays. It references domain learning objects and graph identities but does not redefine them.

## Shared infrastructure

Shared infrastructure is allowed only for domain-independent mechanics. Current example:

```text
src/prep/infrastructure/anki/
```

It owns AnkiConnect transport and generic reconciliation, not Interview or Listening semantics.

## Design progression

Current platform work is breadth-first:

```text
problem
-> product capabilities
-> strategic contexts
-> graph + learning semantics
-> user journeys
-> quality drivers
-> graph-first interface
-> black-box system landscape
```

Only after this top-level model is coherent should work descend into persistence, API, components, deployment, detailed verification and implementation slices.

Existing executable vertical slices remain valid evidence; this rule changes design sequencing, not the value of executable validation.

## Agent boundary

```text
Agent / LLM -> interpretation, semantic proposals, generation, critique
Code        -> IDs, schemas, structural validation, persistence, migration, external writes
```

Agents must not silently invent stable identifiers, source coordinates, persisted mappings or accepted graph relations.
