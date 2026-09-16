# Plan 014 — Harness v0.1 baseline

## Goal

Persist the agreed agent interaction model and harness invariants before designing concrete learning workflows or skills.

## Completed work

- established ChatGPT chat as the initial user interface;
- established one chat agent as the v0.1 coordinator/orchestrator;
- kept the repository as system of record;
- accepted ADR-006 for the single-agent repository-harness interaction model;
- added `docs/architecture/agent-harness.md`;
- added `harness/README.md` as the operational harness entrypoint;
- made progressive disclosure / minimal task-relevant context explicit in `AGENTS.md`;
- defined persisted repository artifacts as the preferred handoff between workflow stages instead of carrying full prior reasoning context;
- separated semantic agent/model work from deterministic scripts, validators, migration, synchronization, and writes;
- defined human approvals as workflow gates rather than extra agents;
- kept local Anki synchronization as a deterministic local-tool boundary;
- intentionally deferred concrete workflows and skills until user journeys establish their real inputs, outputs, and context needs.

## Non-goals preserved

- no concrete `add-topic` workflow;
- no permanent list of skills;
- no multi-agent architecture;
- no new learning-domain abstractions;
- no card-schema or Anki behavior changes.

## Validation

GitHub Actions run `35161660551` completed successfully:

```text
documentation links : passed
architecture         : passed
question model       : passed
unit tests           : passed
```

Branch comparison against `main` contained only harness-baseline documentation changes.

## Status

Completed.
