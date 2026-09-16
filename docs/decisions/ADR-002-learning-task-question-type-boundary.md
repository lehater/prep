# ADR-002: Separate LearningTask from QuestionType

- Status: Accepted
- Date: 2026-09-16

## Context

The initial domain model listed recall, explanation, purpose, causality, comparison, selection, application, prediction, debugging, trade-off analysis, design, and verbal explanation as candidate learning tasks.

That list mixed multiple abstraction levels:
- cognitive operations (`recall`, `application`, `design`);
- prompt/assessment patterns (`prediction`, `debugging`, `selection`);
- explanation variants (`purpose`, `causality`);
- response modality (`verbal explanation`).

If these are treated as peers, gap analytics become difficult to interpret and question wording starts defining the domain model.

## Decision

Use two separate concepts:

- `LearningTask` = the cognitive operation that the learner must demonstrate;
- `QuestionType` = a reusable elicitation pattern that defines prompt intent, expected answer shape, and minimum evidence of success.

Canonical LearningTask v0.1:

```text
recall
explain
compare
apply
analyze
evaluate
design
```

Canonical QuestionType v0.1:

```text
direct-recall   -> recall
explain         -> explain
compare         -> compare
scenario-apply  -> apply
predict         -> analyze
diagnose        -> analyze
choose-justify  -> evaluate
design          -> design
```

For v0.1, each Question has one primary LearningTask through its QuestionType.

Response modality such as oral, text, code, or diagram is orthogonal and is not a LearningTask. It may become a separate `ResponseMode` when an adapter or exercise requires it.

Classification is based on the reasoning/evidence required for success, not on a verb appearing in the prompt.

## Rationale

The seven LearningTasks provide enough resolution for interview-oriented gap analysis while avoiding premature fragmentation.

`compare` is kept separately from general explanation/understanding because discriminating between similar technologies, mechanisms, and patterns is especially useful for technical interviews and for targeted practice.

`predict` and `diagnose` remain separate QuestionTypes because they elicit meaningfully different evidence while both exercising analysis.

`choose-justify` captures selection and trade-off reasoning under evaluation.

## Alternatives considered

### Keep every candidate as a LearningTask

Rejected because the list mixes cognitive operations, prompt patterns, and response modality and would produce inconsistent analytics.

### Adopt revised Bloom categories verbatim

Rejected as the project taxonomy. Bloom is used as an evidence-informed reference, but technical-interview diagnostics benefit from explicit `compare`, and the project does not need to claim a strict educational hierarchy.

### Allow multiple primary LearningTasks per Question immediately

Deferred. Real interview questions often exercise multiple operations, but multi-label analytics add ambiguity before the project has attempt data. Secondary tagging can be added later if evidence shows value.

## Consequences

Positive:
- gap analysis has a stable unit: `Concept × LearningTask`;
- prompt variety can evolve without changing mastery dimensions;
- Anki/card formats remain outside the domain taxonomy;
- future oral, coding, or diagram exercises can reuse the same LearningTasks.

Costs:
- some questions must be assigned a single dominant task even when they exercise several operations;
- question authors need classification guidance;
- a later migration may be required if secondary task tagging proves useful.

## References

Evidence and source analysis are recorded in `docs/research/question-taxonomy.md`.
Detailed semantics are defined in `docs/question-types.md`.
