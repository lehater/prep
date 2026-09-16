# Repository harness

`harness/` contains reusable execution guidance for the single ChatGPT agent that operates `prep` through repository tools.

Start with:

1. [`../AGENTS.md`](../AGENTS.md) for global invariants and repository navigation;
2. [`../docs/architecture/agent-harness.md`](../docs/architecture/agent-harness.md) for the harness boundary and responsibility split;
3. the concrete workflow/skill relevant to the current user intent, when one exists.

## v0.1 rules

- one chat agent coordinates work;
- repository state is authoritative, chat history is not;
- use progressive disclosure and minimal task-relevant context;
- pass durable information between stages through repository artifacts;
- use model reasoning for semantic work;
- use deterministic scripts/tests/validators for mechanical work;
- keep meaningful user decisions as explicit human gates;
- do not add extra agents, skills, or framework abstractions without a demonstrated workflow need.

## Planned growth

Concrete structure should emerge from real user journeys, for example:

```text
harness/
  workflows/
  skills/
  evals/
```

Those directories are intentionally not pre-populated in v0.1. A workflow or skill should be added only when its purpose, inputs, outputs, context requirements, and validation are understood.

## Local external systems

The cloud chat agent prepares repository artifacts but does not directly reach local AnkiConnect. Use the repository's local sync scripts for Anki publication.
