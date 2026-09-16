# AGENTS.md

## Purpose

This repository is the system of record for adaptive learning workflows.
Agents use repository artifacts as durable project state; chat history is not authoritative.

The repository currently contains two bounded learning use cases:

- technical interview preparation;
- English listening from authentic media.

## Read order

Before substantive work:
1. Read this file.
2. Read `docs/vision.md`.
3. Read `ARCHITECTURE.md` when the task crosses use-case or infrastructure boundaries.
4. Read the landing page and domain/process documents for the affected use case.
5. Check applicable ADRs under `docs/decisions/`.
6. For multi-step work, create or update a plan under `docs/plans/active/`.

Use progressive disclosure: read only the context needed for the task.

Use-case entrypoints:

- `use-cases/interview-preparation/README.md`;
- `use-cases/english-listening/README.md`.

## Source of truth

Priority order for project decisions and constraints:
1. Executable schemas, tests, and validators.
2. Accepted ADRs.
3. Bounded-context domain/process documentation.
4. This file.
5. Active implementation plans.
6. Current task instructions.
7. Agent assumptions.

If a current task intentionally changes an accepted decision, update the corresponding ADR or create a superseding ADR in the same pull request.

## Workflow

All repository changes after the bootstrap commit follow this workflow:
1. Start from current `main`.
2. Create a dedicated branch for one coherent task.
3. Make the smallest end-to-end change that proves value.
4. Validate affected artifacts.
5. Update documentation when behavior, domain model, process, or constraints change.
6. Open a pull request into `main`.
7. Merge only with squash so one task becomes one commit in `main`.

Do not push feature work directly to `main`.

## Project invariants

- Each learning use case keeps its own domain vocabulary and invariants.
- Do not introduce a universal learning-domain abstraction only to make use cases look structurally similar.
- Shared components must be demonstrably domain-independent before extraction.
- Anki is an execution adapter for presenting practice, scheduling reviews, recording review state, and storing media when needed.
- Anki note/card structures do not define bounded-context domain models.
- Stable learning-object identity must be repository/use-case owned rather than derived from mutable presentation text.
- Diagnostic baseline data must remain distinguishable from later learning/review data where the use case uses baseline assessment.
- Important decisions must be persisted in repository artifacts; do not leave them only in chat.
- Prefer machine-checkable constraints over prose-only rules when feasible.
- Keep structures simple and evolve them only after confirmed need.

## Agent vs deterministic code

Use the boundary proven by the English-listening pipeline:

- agent/LLM owns semantic decisions that require interpretation;
- deterministic code owns structural truth, stable identifiers, source coordinates, validation, migrations, and external side effects.

Do not let an agent invent or silently repair deterministic provenance such as IDs, timestamps, source references, or persisted mappings.

## Change discipline

For architecture or domain changes, record:
- problem,
- decision,
- alternatives considered when relevant,
- consequences.

For research, separate evidence from accepted project decisions:
- `docs/research/` = findings, sources, experiments, migration assessments, hypotheses;
- ADR/domain docs = accepted decisions.

For legacy migration:
- preserve the old behavior as a testable baseline;
- move one vertical slice at a time;
- extract shared infrastructure before copying duplicate implementations;
- do not retire the legacy behavior until equivalent validation passes.

## Completion checks

Before marking work complete:
- confirm the branch differs from `main` only by task-related changes;
- validate links/schemas/tests that exist for the affected area;
- ensure bounded-context ownership is clear;
- ensure durable decisions are documented;
- ensure the pull request explains purpose, scope, validation, and consequences.
