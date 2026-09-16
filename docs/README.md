# Project knowledge base

`docs/` is the durable knowledge base for `prep`. Chat history is working context, not project state.

## Read path

Use progressive disclosure:

```text
AGENTS.md
  -> docs/README.md
  -> relevant artifact class
  -> specific document / ADR / plan
  -> executable code or data
```

Do not scan the whole repository by default.

## Artifact routing

| Information | Authoritative location | Question answered |
|---|---|---|
| purpose, scope, direction | `docs/vision/` | Why does the system exist? |
| system structure and boundaries | `docs/architecture/` | How is the system decomposed? |
| bounded-context concepts/invariants | `docs/domain/` | What does the domain mean? |
| durable architectural decisions | `docs/decisions/` | Why was this choice made? |
| evidence, experiments, source reviews | `docs/research/` | What did we learn? |
| active/completed execution state | `docs/plans/` | What are we changing now? |
| operational/authoring instructions | `docs/guides/` | How do I perform this task? |

A durable fact should have one authoritative home. Other documents link to it instead of copying it.

## Current architecture

Start with:

- [`vision/vision.md`](vision/vision.md) — product/workspace intent;
- [`architecture/overview.md`](architecture/overview.md) — DDD + Clean/Hexagonal architecture;
- [`architecture/context-map.md`](architecture/context-map.md) — bounded contexts and external systems;
- [`architecture/dependency-rules.md`](architecture/dependency-rules.md) — dependency and port/adapter rules;
- [`domain/interview-preparation.md`](domain/interview-preparation.md) — Interview Preparation domain;
- [`domain/english-listening.md`](domain/english-listening.md) — English Listening domain.

## Decisions

Accepted ADRs live under [`decisions/`](decisions/). An ADR is required when a change creates a durable architectural constraint, changes bounded-context ownership, or supersedes an accepted decision.

## Research → decision → implementation

Preferred lifecycle:

```text
research/
  -> accepted ADR or domain/architecture update
  -> active plan
  -> implementation + executable checks
  -> completed plan
```

Research is evidence, not policy. A research conclusion becomes authoritative only when accepted into an ADR, domain model, architecture rule, or executable invariant.

## Chat-to-repository rule

Do not preserve conversations verbatim. Persist only durable outcomes:

```text
finding/evidence -> research/
durable choice   -> decisions/
domain meaning   -> domain/
system rule      -> architecture/
current work     -> plans/
how-to           -> guides/
```

Discard conversational branches that did not produce durable knowledge.

## Executable artifacts

Documentation does not replace executable truth. Schemas, validators, tests, and code override prose when they intentionally encode an accepted invariant. If prose and executable behavior diverge, reconcile them in the same pull request.
