# Interview learning tasks and question types

## Purpose

Define the canonical v0.1 vocabulary for describing what a technical-interview question tests and how the question elicits evidence.

The model intentionally separates:

```text
Concept
  × LearningTask
  -> QuestionType
  -> concrete Question
  -> Attempt
  -> Assessment
```

A `LearningTask` describes the cognitive operation to be demonstrated. A `QuestionType` describes a reusable elicitation pattern with expected answer evidence.

## LearningTask v0.1

### `recall`

Retrieve relevant knowledge from memory without supplied alternatives.

Typical evidence: definition, fact, property, invariant, named component/rule.

### `explain`

Construct a coherent model of meaning, purpose, mechanism, rationale, or causality.

Typical evidence: relevant entities, relationships/causal chain, why the mechanism produces the behavior.

### `compare`

Discriminate related concepts using dimensions that matter for a decision or understanding.

Typical evidence: shared dimensions, meaningful similarities/differences, conditions under which the distinction matters.

### `apply`

Use a known concept, rule, mechanism, or pattern in a concrete scenario.

Typical evidence: recognition of the relevant concept, correct case-specific application, rationale.

### `analyze`

Infer behavior, decompose a situation, trace consequences, or diagnose causes from evidence.

Typical evidence: observations/state, reasoning chain, predicted outcome or plausible cause, verification path.

### `evaluate`

Judge or choose among alternatives using explicit constraints, criteria, and trade-offs.

Typical evidence: decision criteria, alternatives, selected option, material trade-offs, conditions that could change the choice.

### `design`

Synthesize a coherent solution or structure under stated constraints.

Typical evidence: assumptions, decomposition, interfaces/data flow, key decisions/trade-offs, failure/boundary considerations.

## QuestionType v0.1

### `direct-recall`

Primary task: `recall`.

Prompt intent: request a definition, fact, property, invariant, or named item without answer alternatives.

Minimum evidence: essential information is independently retrieved and materially correct.

### `explain`

Primary task: `explain`.

Prompt variants include purpose, mechanism, causality, rationale.

Minimum evidence: relevant entities and relationships form a materially correct explanatory model.

### `compare`

Primary task: `compare`.

Minimum evidence: decision-relevant distinctions are correct and expressed on shared dimensions.

### `scenario-apply`

Primary task: `apply`.

Minimum evidence: the learner maps the scenario to the relevant concept and applies it correctly.

### `predict`

Primary task: `analyze`.

Minimum evidence: predicted outcome and the material causal/mechanical reasoning are correct.

### `diagnose`

Primary task: `analyze`.

Expected shape: hypotheses -> evidence -> verification -> remediation.

Minimum evidence: diagnosis is evidence-based and includes a reasonable confirmation/falsification path.

### `choose-justify`

Primary task: `evaluate`.

Expected shape: criteria -> alternatives -> choice -> trade-offs -> conditions that would change the choice.

Minimum evidence: the answer is constraint-driven rather than a context-free preference.

### `design`

Primary task: `design`.

Expected shape: assumptions -> decomposition -> interactions/data flow -> key decisions -> trade-offs/failures.

Minimum evidence: a coherent solution addresses the core requirements and exposes material reasoning.

## Classification rules

1. Classify by the reasoning/evidence required, not a verb in the prompt.
2. Assign one primary `LearningTask` in v0.1 so analytics remain interpretable.
3. Secondary task tagging is deferred until real data proves it useful.
4. Purpose, mechanism, and causality are `explain` variants, not separate LearningTasks.
5. Prediction and diagnosis are separate QuestionTypes that both map to `analyze`.
6. Selection/trade-off prompts map to `choose-justify` / `evaluate`.
7. Oral/text/code/diagram delivery is response modality, not LearningTask.
8. Anki Note/Card type is infrastructure mapping, not QuestionType.

## Initial coverage heuristic

A concept does not need all QuestionTypes. Coverage is driven by interview relevance.

For a central concept, prefer at least:

```text
direct-recall or explain
+ one transfer type (scenario-apply / predict / diagnose)
+ compare or choose-justify when alternatives matter
```

This is question-bank guidance, not a mastery formula.
