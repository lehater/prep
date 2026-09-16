# ADR-001: Anki as the initial execution adapter

- Status: Accepted
- Date: 2026-09-16

## Context

The preparation process needs a practical interface for presenting questions, collecting repeated attempts, and scheduling retrieval practice. Anki already provides mature spaced-repetition and review mechanics.

Coupling the preparation domain directly to Anki note/card structures would make the project optimize around an implementation detail and would constrain future assessment formats such as coding tasks, mock interviews, CLI exercises, or web flows.

## Decision

Use Anki as the initial execution adapter, not as the canonical domain model.

The canonical direction is:

```text
Preparation domain
  -> Question / QuestionType
  -> Anki mapping
  -> Note/Card representation
```

Review data may flow back from Anki as observations, but its button semantics do not directly define domain mastery.

## Consequences

Positive:
- the project can use Anki immediately;
- question modeling remains independent of Anki;
- future execution adapters can be added without redefining the domain;
- baseline and learning analytics can evolve independently from Anki scheduling semantics.

Costs:
- a mapping layer is required;
- imported Anki review data must be interpreted explicitly;
- some exercises may launch outside Anki while Anki remains the scheduling entrypoint.
