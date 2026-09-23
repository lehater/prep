# Agent harness architecture

## Purpose

Separate two concerns that were previously both called "harness":

1. the Prep agent operating model;
2. the repository-independent engineering-knowledge Harness.

## Agent operating model

ADR-006 defines the interaction topology:

```text
User -> ChatGPT chat -> one coordinating agent -> repository tools -> Prep repository
```

The repository is durable state; chat reasoning is transient. Context is loaded progressively from the smallest relevant canonical artifact set.

Agent/model work covers interpretation, research, proposal, generation and critique. Deterministic scripts own stable IDs, structural validation, migrations, synchronization and external writes.

## Universal Harness integration

ADR-007 adopts `lehater/harness` at the immutable commit in `.harness-version`.

Prep currently uses Harness direct-declaration mode:

```text
.harness/engineering-graph.yaml
        +
.harness/core.yaml
        |
        v
pinned Harness evaluator
        |
        v
TOP-LEVEL-DESIGN target state
```

Harness does not interpret arbitrary Prep prose as truth. Prep documents remain canonical and are registered explicitly in Core.

## Current design depth

ADR-008 makes `TOP-LEVEL-DESIGN` the current consumer. It covers problem/product/domain/journey/UI/quality/system-landscape knowledge and deliberately excludes detailed component, persistence, API, deployment, test and implementation design.

## Context minimization

For one engineering task:

1. identify the affected Harness Authority/capability;
2. load its provider artifact and direct prerequisites;
3. avoid unrelated bounded contexts/research/completed plans;
4. persist durable decisions to the owning canonical artifact;
5. rerun Harness validation.

## Local-only systems

AnkiConnect remains machine-local. Repository artifacts are prepared centrally; local deterministic tooling performs live synchronization.
