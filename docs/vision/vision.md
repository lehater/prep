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

- The Knowledge Graph is semantic authority for reusable knowledge identities, assertions and relations.
- Cards are learning projections, not units of canonical knowledge.
- Learning plans and learner progress are references/overlays over graph knowledge rather than semantic mutations.
- Subject domains keep their own learning-object semantics; common platform abstractions are extracted only when meaning is shared.
- Anki is an execution/spaced-repetition runtime, not the architectural center.
- Agents may interpret/propose semantics; deterministic code owns stable representation IDs, structural validation, persistence and external reconciliation.

## Initial learning domains

### Interview Preparation

Technical-interview competencies, elicitation, assessment and gap-driven learning over canonical graph subjects.

### English Listening

Recognition and understanding of authentic spoken English through source-backed lexical targets and stable acoustic segments.

Future domains such as mathematics may add their own learning-object models.

## Engineering source of truth

The Git repository is authoritative for **project engineering knowledge**: accepted design, schemas, executable invariants, migrations and implementation.

The future runtime system will own operational canonical graph/learner state through a persistence design not yet selected. The architecture must not assume Git files remain the production database.

## Design principle

Use DDD for semantic ownership, Clean Architecture for dependency direction, Hexagonal Architecture for external systems, and the pinned Harness for engineering-knowledge coverage.

## Current delivery principle

During graph-centered platform design, establish broad closure at each design depth before descending further. Current depth covers product/domain/black-box architecture; implementation slices resume only after this layer is coherent.

## Current non-goals

- choosing graph/persistence technology;
- detailed APIs, deployment or components;
- forcing all domains into one Question/Exercise schema;
- replacing Anki scheduling;
- building a full LMS.
