# Plan 014 — Harness v0.1 baseline

## Goal

Persist the agreed agent interaction model and harness invariants before designing concrete learning workflows or skills.

## Scope

- establish ChatGPT chat as the initial user interface;
- establish one chat agent as the initial coordinator/orchestrator;
- keep the repository as system of record;
- define the repository harness as the agent's execution contract;
- make progressive disclosure / minimal task-relevant context explicit;
- distinguish semantic agent work from deterministic scripts, validators, and writes;
- define human gates without introducing a multi-agent system;
- keep local Anki synchronization as a deterministic local tool boundary;
- add only the minimum harness entrypoint needed for future workflows/skills.

## Non-goals

- no concrete `add-topic` workflow yet;
- no permanent list of skills;
- no multi-agent architecture;
- no new learning-domain abstractions;
- no changes to card schemas or Anki synchronization behavior.

## Validation

- documentation links pass;
- architecture validator remains green;
- question-bank validator remains green;
- unit tests remain green;
- branch contains only harness-baseline documentation changes.

## Status

In progress.
