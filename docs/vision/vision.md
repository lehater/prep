# Vision

## Product intent

Build a graph-centered adaptive learning platform that maintains a trustworthy semantic model of knowledge, lets a learner select meaningful knowledge scopes, turns them into learning plans and domain-specific practice, executes repetition through external study systems, and projects learning evidence back onto the graph.

## Core model

```text
Knowledge Sources
      -> controlled semantic curation
      -> Knowledge Graph
      -> target subgraph / curriculum
      -> Learning Plan
      -> domain-specific learning objects
      -> Study System (initially Anki)
      -> review / attempt evidence
      -> learner-specific graph overlay
```

## Product principles

- The Knowledge Graph is the semantic source of truth for reusable knowledge identities and relations.
- Cards are learning projections, not units of canonical knowledge.
- Learning plans and learner progress are overlays/references to graph knowledge rather than mutations of semantic truth.
- Subject domains keep their own learning-object semantics; common platform abstractions are extracted only when meaning is genuinely shared.
- Anki is an execution and spaced-repetition runtime, not the architectural center of Prep.
- Agents may perform semantic interpretation and propose changes; deterministic code owns stable identity, validation, persistence and external reconciliation.

## Initial learning domains

### Interview Preparation

Prepare for technical interviews through competency/concept coverage, questions, scenarios, code tasks, assessment evidence and gap-driven learning.

### English Listening

Train recognition and understanding of authentic spoken English through source-backed lexical targets and stable acoustic listening segments.

Future domains such as mathematics may add their own learning-object models without changing the graph and learning-coordination foundations.

## Operating principle

The repository is the system of record for accepted engineering and learning artifacts. Chat sessions and agents operate on repository truth but do not replace it.

## Design principle

Use DDD for semantic ownership, Clean Architecture for dependency direction, and Hexagonal Architecture for external systems.

## Current delivery principle

During the graph-centered platform design phase, establish broad top-level closure before deep implementation slices. Cover problem, product capabilities, contexts, graph/learning semantics, journeys, interface concept, quality drivers and system landscape first. After that boundary is coherent, implementation returns to small coherent slices.

## Current non-goals

- choosing the graph database or persistence technology;
- defining detailed APIs, deployment topology or component boundaries;
- forcing all learning domains into one Question/Exercise schema;
- replacing Anki scheduling;
- building a full LMS.
