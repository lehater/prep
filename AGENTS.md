# AGENTS.md

## Purpose

This repository is the system of record for adaptive technical interview preparation.
Agents use repository artifacts as durable project state; chat history is not authoritative.

## Read order

Before substantive work:
1. Read this file.
2. Read `docs/vision.md`.
3. Read the domain/process document relevant to the task.
4. Check applicable ADRs under `docs/decisions/`.
5. For multi-step work, create or update a plan under `docs/plans/active/`.

Use progressive disclosure: read only the context needed for the task.

## Source of truth

Priority order for project decisions and constraints:
1. Executable schemas, tests, and validators.
2. Accepted ADRs.
3. Domain and process documentation.
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

- The preparation model is independent of Anki-specific storage and UI concepts.
- Anki is an execution adapter for presenting prompts, scheduling reviews, and recording attempts.
- Learning tasks and question types are defined before mapping them to Anki note/card types.
- Diagnostic baseline data must remain distinguishable from later learning/review data.
- Important decisions must be persisted in repository artifacts; do not leave them only in chat.
- Prefer machine-checkable constraints over prose-only rules when feasible.
- Keep structures simple and evolve them only after confirmed need.

## Change discipline

For architecture or domain changes, record:
- problem,
- decision,
- alternatives considered when relevant,
- consequences.

For research, separate evidence from accepted project decisions:
- `docs/research/` = findings, sources, hypotheses;
- ADR/domain docs = accepted decisions.

## Completion checks

Before marking work complete:
- confirm the branch differs from `main` only by task-related changes;
- validate links/schemas/tests that exist for the affected area;
- ensure durable decisions are documented;
- ensure the pull request explains purpose, scope, validation, and consequences.
