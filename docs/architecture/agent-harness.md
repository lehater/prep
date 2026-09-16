# Agent harness architecture

## Purpose

The harness makes agent behavior reproducible enough to use the repository as an interactive learning system from ChatGPT chat without turning chat history into project state.

Authoritative decision: [`ADR-006`](../decisions/ADR-006-single-chat-agent-repository-harness.md).

## Boundary

Initial topology:

```text
User
  -> ChatGPT chat
  -> one chat agent
  -> repository adapter/tools
  -> prep repository
```

The agent is responsible for orchestration and semantic reasoning. The repository contains the durable execution contract and resulting artifacts.

Local-only systems remain separate:

```text
prep repository
  -> local deterministic sync script
  -> AnkiConnect (localhost)
  -> Anki Desktop
```

## Harness primitives

Use the minimum distinction needed to keep responsibilities clear:

- **workflow** — an end-to-end or multi-stage procedure for a user intent;
- **skill** — reusable model-driven instructions for semantic/reasoning work;
- **tool/script** — deterministic operation the agent or user may invoke;
- **validator/test** — deterministic check of structural/executable invariants;
- **human gate** — a workflow stop where user judgment/approval is required;
- **artifact** — persisted output/state passed between stages.

These are conceptual roles, not a mandate to create a framework class or directory for every term.

## Context minimization

Context engineering follows progressive disclosure.

For every task or workflow stage:

1. start from `AGENTS.md` and the current user intent;
2. identify the bounded context and relevant workflow/skill;
3. read only canonical rules and artifacts required for that stage;
4. avoid loading unrelated bounded contexts, completed plans, research, code, or adapters;
5. persist durable output as an artifact;
6. let the next stage consume that artifact plus its own declared inputs rather than the full earlier reasoning trace.

Desired shape:

```text
User intent
  -> minimal global invariants
  -> workflow/stage instructions
  -> declared input artifacts
  -> task execution
  -> persisted output artifact
```

Not:

```text
User intent
  -> entire repository
  -> entire project history
  -> all prior reasoning
```

## Responsibility split

### Agent / model

Use for work that needs interpretation or judgment, for example:

- research and synthesis;
- defining or challenging topic boundaries;
- semantic decomposition;
- proposing learning objects;
- critique and semantic review.

### Deterministic code

Use when behavior can be made mechanical and checkable, for example:

- stable identifiers;
- schema validation;
- enum/reference checks;
- provenance mechanics;
- duplicate detection;
- file transformation;
- migration;
- Anki synchronization.

A model-driven skill may invoke a deterministic tool. This does not turn the tool itself into a skill.

## Human gates

A workflow may require user review when a decision materially affects scope or learning intent. Typical examples may include accepting a proposed topic scope or selecting between legitimate alternatives.

Do not add a gate merely because the agent performed a step. Gates should protect meaningful human decisions, not create approval ceremony.

## Repository layout

Harness v0.1 starts deliberately small:

```text
AGENTS.md
harness/
  README.md

docs/
  architecture/agent-harness.md
  decisions/ADR-006-single-chat-agent-repository-harness.md
```

Future concrete workflows/skills may be added under `harness/` when a real user journey establishes their inputs, outputs, and validation requirements. Do not create empty taxonomies or placeholder skills in advance.

## Evolution rule

Prefer this sequence:

```text
real user journey
  -> observed repeated agent task
  -> explicit workflow/stage boundary
  -> reusable skill/tool only if justified
  -> eval/validator where the requirement is checkable
```

Do not solve an unclear product workflow by adding more agents or more harness primitives.
