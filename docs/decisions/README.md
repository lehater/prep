# Architecture Decision Records

This directory contains accepted durable decisions.

## Current decisions

| ADR | Decision |
|---|---|
| [`ADR-001`](ADR-001-anki-as-execution-adapter.md) | Anki is an execution adapter, not the domain model |
| [`ADR-002`](ADR-002-learning-task-question-type-boundary.md) | Separate LearningTask from QuestionType |
| [`ADR-003`](ADR-003-ankiconnect-primary-live-adapter.md) | AnkiConnect is the primary live Anki integration |
| [`ADR-004`](ADR-004-multi-use-case-learning-workspace.md) | Repository hosts multiple bounded learning use cases |
| [`ADR-005`](ADR-005-ddd-clean-hexagonal-architecture.md) | Use DDD + Clean/Hexagonal Architecture |
| [`ADR-006`](ADR-006-single-chat-agent-repository-harness.md) | Use one ChatGPT agent with repository-backed operating rules |
| [`ADR-007`](ADR-007-pinned-universal-harness.md) | Use the pinned universal Harness for engineering-knowledge control |
| [`ADR-008`](ADR-008-breadth-first-design-before-deep-slices.md) | Establish top-level design breadth before deep implementation slices |
| [`ADR-009`](ADR-009-controlled-semantic-graph.md) | Use uniform semantic nodes, first-class typed relations and controlled graph admission |
| [`ADR-010`](ADR-010-knowledge-assertions.md) | Represent node content as evidence-backed KnowledgeAssertions |
| [`ADR-011`](ADR-011-postgresql-primary-store.md) | Use PostgreSQL as the primary persistence platform |
| [`ADR-012`](ADR-012-local-anki-bridge.md) | Integrate Anki through a local desktop bridge |
| [`ADR-013`](ADR-013-modular-monolith-runtime.md) | Start as a modular monolith with worker and local bridge |
| [`ADR-014`](ADR-014-web-graph-interface-stack.md) | Use a browser React/TypeScript graph-first interface |
| [`ADR-015`](ADR-015-single-user-self-hosted-v1.md) | Use a single-user self-hosted-first v1 deployment posture |

## When to add an ADR

Create or supersede an ADR when a change establishes a durable architectural/process constraint, changes bounded-context ownership, selects/replaces a foundational integration, changes dependency direction/shared-kernel policy, or intentionally reverses an accepted decision.

Routine implementation details do not require ADRs.
