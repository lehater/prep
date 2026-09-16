# Architecture Decision Records

This directory contains accepted durable decisions. Research notes are evidence; ADRs record what the project actually chose.

## Current decisions

| ADR | Decision |
|---|---|
| [`ADR-001`](ADR-001-anki-as-execution-adapter.md) | Anki is an execution adapter, not the domain model |
| [`ADR-002`](ADR-002-learning-task-question-type-boundary.md) | Separate LearningTask from QuestionType |
| [`ADR-003`](ADR-003-ankiconnect-primary-live-adapter.md) | AnkiConnect is the primary live Anki integration |
| [`ADR-004`](ADR-004-multi-use-case-learning-workspace.md) | Repository hosts multiple bounded learning use cases |
| [`ADR-005`](ADR-005-ddd-clean-hexagonal-architecture.md) | Use DDD + Clean/Hexagonal Architecture |

## When to add an ADR

Create or supersede an ADR when a change:

- establishes a durable architectural constraint;
- changes bounded-context ownership;
- selects/replaces a foundational external integration;
- changes dependency direction or shared-kernel policy;
- intentionally reverses an accepted decision.

Do not create ADRs for routine implementation details that can be changed locally without architectural consequences.

## Required content

An ADR should capture:

- context/problem;
- decision;
- alternatives when relevant;
- consequences;
- supersession relationship when replacing an older ADR.
