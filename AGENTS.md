# AGENTS.md

## Purpose

This repository is the system of record for the Prep learning platform. Chat history is working context, not authoritative project state.

## Required read order

Before substantive engineering work:

1. Read this file.
2. Read `.harness/core.yaml` and `.harness/engineering-graph.yaml` when the task creates/changes top-level engineering knowledge or crosses an Authority boundary.
3. Read `docs/README.md` and route to the smallest relevant canonical artifact set.
4. Read applicable ADRs.
5. For multi-step work, create/update an active plan under `docs/plans/active/`.

Use progressive disclosure; do not scan all docs/code by default.

## Canonical Harness

`lehater/harness` is the engineering-knowledge evaluator. `.harness-version` pins the immutable runtime used locally and in CI.

Prep owns:

- product/domain/architecture semantic truth in `docs/**`;
- project-specific Authorities/Capabilities/Consumer topology in `.harness/engineering-graph.yaml`;
- artifact realization in `.harness/core.yaml`;
- project-specific integration assertions.

Harness owns generic graph/core validation and target-state evaluation. Do not implement a second Harness evaluator inside Prep.

Bootstrap/validate:

```text
python tools/bootstrap_harness.py
python tools/check_harness_integration.py
```

## Current design strategy

ADR-008 remains authoritative: complete breadth at one design depth before descending.

`TOP-LEVEL-DESIGN` and `LOGICAL-DESIGN` are complete. The active phase is Plan 017 and Harness consumer `TECHNICAL-DESIGN`.

Work horizontally across persistence/data lifecycle, external dependencies, machine/UI interfaces, security, performance/reliability, runtime topology, components, operability and test design. Do not start implementation slices until this whole technical layer is coherent.

## Source-of-truth priority

1. Executable schemas/tests/validators and accepted code invariants.
2. Accepted ADRs.
3. Canonical domain/architecture/vision documentation.
4. `.harness/engineering-graph.yaml` and `.harness/core.yaml` for engineering ownership/routing.
5. This file.
6. Active plans.
7. Agent assumptions.

If a task changes an accepted decision, update/supersede the ADR in the same PR.

## Documentation routing

Persist durable outcomes according to `docs/README.md`. Do not copy the same authoritative statement into several files.

## Development workflow

1. Start from current `main`.
2. Create a dedicated branch for one coherent task.
3. Update the relevant Harness-visible canonical artifact(s) or plan.
4. Work at the current permitted design depth.
5. Validate affected artifacts and Harness closure.
6. Open a pull request into `main`.
7. Merge with squash.

Do not push feature/design work directly to `main`.

## Agent execution model

ADR-006 remains active: one ChatGPT chat agent coordinates work unless a demonstrated workflow requires more.

```text
agent/model        -> semantic interpretation, research, proposals, generation, critique
scripts/validators -> IDs, schemas, validation, migration, synchronization, deterministic writes
```

Human approval protects meaningful decisions, not routine workflow ceremony.

## Architecture model

Use DDD, Clean Architecture and Hexagonal Architecture.

Primary dependency rule:

```text
interface -> application -> domain
infrastructure -> application ports
```

### Domain invariants

- Each bounded context owns its vocabulary/invariants.
- Subject contexts do not import each other's domain entities.
- Knowledge Graph semantic truth is independent of Anki/UI/learner state.
- Learning Coordination may reference graph/domain identities but must not absorb subject-specific exercise semantics.
- Domain code does not depend on concrete external systems/frameworks.

### Infrastructure invariants

- Shared infrastructure remains domain-independent.
- Anki Note/Card/Deck structures never define bounded-context domain models.
- External synchronization preserves repository-owned stable identity and surfaces conflicts.

## Identity and provenance

Semantic identity is distinct from storage/display identifiers. Stable canonical NodeId/learning-object identifiers are system-owned and never derived from mutable display text.

Agents may propose semantic graph changes. Deterministic code owns stable representation IDs, structural graph validation, source coordinates and persistence.

## Completion checks

Before marking work complete:

- changed artifacts have explicit Authority ownership;
- work stays at or above the currently authorized design depth;
- Harness integration validation passes;
- documentation links and affected validators/tests pass;
- the PR explains purpose, scope, validation and consequences.
