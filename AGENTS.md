# AGENTS.md

## Purpose

This repository is the system of record for adaptive learning workflows. Chat history is working context, not authoritative project state.

Current bounded contexts:

- Interview Preparation;
- English Listening.

## Required read order

Before substantive work:

1. Read this file.
2. Read `docs/README.md` to route the task to the correct artifact class.
3. Identify the affected bounded context(s).
4. Read only the relevant vision/domain/architecture/guide documents.
5. Check applicable ADRs under `docs/decisions/`.
6. For multi-step work, create/update a plan under `docs/plans/active/`.

Use progressive disclosure. Do not scan all docs/code by default.

For agent-operated user workflows, [`harness/README.md`](harness/README.md) is the harness entrypoint. The accepted interaction model is documented in [`docs/architecture/agent-harness.md`](docs/architecture/agent-harness.md).

### Context minimization

Each task or workflow stage must use the smallest practical task-relevant context:

- load only canonical rules and artifacts needed for the current stage;
- do not preload unrelated bounded contexts, completed plans, research, code, or adapters;
- when one stage feeds another, prefer persisted repository artifacts over carrying the full previous reasoning trace;
- if a workflow/skill is introduced, document its required inputs/context rather than relying on repository-wide context.

Use-case entrypoints:

- `use-cases/interview-preparation/README.md`;
- `use-cases/english-listening/README.md`.

Architecture entrypoints:

- `docs/architecture/overview.md`;
- `docs/architecture/context-map.md`;
- `docs/architecture/dependency-rules.md`;
- `docs/architecture/agent-harness.md`.

## Source-of-truth priority

1. Executable schemas, tests, validators, and accepted code invariants.
2. Accepted ADRs.
3. Canonical domain/architecture documentation.
4. This file.
5. Active execution plans.
6. Current task instructions.
7. Agent assumptions.

If a task intentionally changes an accepted decision, update/supersede the ADR in the same pull request.

## Documentation routing

Persist durable outcomes according to `docs/README.md`:

```text
finding/evidence -> docs/research/
durable decision -> docs/decisions/
domain meaning   -> docs/domain/
system structure -> docs/architecture/
goal/scope        -> docs/vision/
current work      -> docs/plans/
how-to            -> docs/guides/
```

Do not copy the same authoritative statement into multiple locations. Link to its canonical artifact.

## Development workflow

All repository changes after bootstrap:

1. Start from current `main`.
2. Create a dedicated branch for one coherent task.
3. Create/update an active plan for multi-step work.
4. Make the smallest end-to-end change that proves value.
5. Validate affected artifacts.
6. Update durable documentation when behavior/domain/architecture changes.
7. Open a pull request into `main`.
8. Merge only with squash so one task becomes one commit in `main`.

Do not push feature work directly to `main`.

## Agent execution model

Harness v0.1 uses one ChatGPT chat agent as the coordinator. Do not introduce specialist/supervisor agents unless a concrete workflow demonstrates that one agent is insufficient.

Responsibility split:

```text
agent/model       -> semantic interpretation, research, proposals, generation, critique
scripts/validators -> IDs, schemas, provenance mechanics, validation, migration, synchronization, deterministic writes
```

A model-driven skill may call a deterministic tool, but the tool remains a tool rather than becoming a skill by naming convention.

Human approval points are workflow gates for meaningful judgment, not separate agents.

Local Anki publication remains a deterministic local-tool boundary: repository artifacts are prepared by the agent; local sync scripts communicate with AnkiConnect.

## Architecture model

Use:

- DDD for bounded-context decomposition and ubiquitous language;
- Clean Architecture for inward dependency direction;
- Hexagonal Architecture for ports/adapters around external systems.

Primary dependency rule:

```text
interface -> application -> domain
infrastructure -> application ports
```

### Domain invariants

- Each bounded context owns its own vocabulary/invariants.
- Do not import another bounded context's domain entities directly.
- Domain code must not depend on Anki, HTTP, filesystem implementations, ffmpeg, Whisper, UI frameworks, or provider SDKs.
- Do not introduce a universal learning-domain abstraction merely to make use cases structurally similar.

### Application invariants

- Application owns use-case orchestration.
- Application defines outbound ports from the consumer/core perspective.
- Application must not import concrete infrastructure adapters.
- Prefer capability names (`StudySystem`, `MediaProcessor`, `Transcriber`) over technology-driven names (`AnkiPort`, `FfmpegService`) unless technology is genuinely domain language.

### Infrastructure invariants

- Infrastructure implements ports and external-system mechanics.
- Shared infrastructure must remain domain-independent.
- `src/prep/infrastructure/anki/` must not acquire Interview Preparation or English Listening policy.
- Anki Note/Card/Deck structures never define bounded-context domain models.

## Interview content language

For Interview Preparation learning content, follow `docs/guides/interview-question-authoring.md`:

- stable IDs and machine-readable values are lowercase English/ASCII;
- technical terms, established names, product/protocol/API/library/framework names, code identifiers, and abbreviations remain English-first;
- learner-facing explanatory prose is Russian;
- a Russian translation may optionally follow an English term in parentheses, but never replace the canonical English term.

This is a bounded-context content policy, not a repository-wide documentation-language rule and not an English Listening rule.

## Identity and provenance

Stable learning-object identity is owned by the bounded context/repository, never derived from mutable display text.

Use the boundary proven by the English-listening pipeline:

```text
agent/LLM       -> semantic interpretation/proposals
code/validators -> IDs, coordinates, provenance, schemas, migration, writes
```

Agents must not invent or silently repair deterministic provenance such as IDs, timestamps, source references, or persisted mappings.

## Research and decisions

Research is evidence, not policy.

Preferred lifecycle:

```text
research
  -> ADR/domain/architecture acceptance
  -> implementation plan
  -> implementation + executable checks
```

For architecture/domain changes record:

- problem/context;
- decision;
- alternatives when relevant;
- consequences.

## Legacy migration

- preserve old behavior as a testable baseline;
- move one vertical slice at a time;
- extract shared infrastructure only where responsibilities match;
- do not retire legacy behavior until equivalent validation passes.

## Completion checks

Before marking work complete:

- branch differs from `main` only by task-related changes;
- bounded-context ownership is explicit;
- dependency direction follows `docs/architecture/dependency-rules.md`;
- durable outcomes are persisted in the correct docs artifact class;
- relative Markdown links pass `python tools/validate_docs.py`;
- affected validators/tests pass;
- PR explains purpose, scope, validation, and consequences.
