# Learning tasks and question types

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

Responsibility: retrieve relevant knowledge from memory without supplied alternatives.

Typical evidence:
- definition;
- fact;
- property;
- invariant;
- named component or rule.

Example: `What does MVCC stand for and what is it?`

### `explain`

Responsibility: construct a coherent model of meaning, purpose, mechanism, rationale, or causality.

Typical evidence:
- relevant entities;
- relationships or causal chain;
- why the mechanism produces the stated behavior.

Example: `Why does PostgreSQL need VACUUM when it uses MVCC?`

### `compare`

Responsibility: discriminate related concepts using dimensions that matter for a decision or understanding.

Typical evidence:
- common comparison dimensions;
- meaningful similarities/differences;
- conditions under which the distinction matters.

Example: `How do threads and coroutines differ for concurrency in Python?`

### `apply`

Responsibility: use a known concept, rule, mechanism, or pattern in a concrete scenario.

Typical evidence:
- recognition of the relevant concept;
- correct application to the case;
- rationale connecting case facts to the chosen operation.

Example: `How would you make this payment endpoint idempotent?`

### `analyze`

Responsibility: infer behavior, decompose a situation, trace consequences, or diagnose causes from evidence.

Typical evidence:
- relevant observations/state;
- reasoning chain;
- predicted outcome or plausible cause;
- verification path when diagnosis is involved.

Example: `Why might PostgreSQL choose a sequential scan even though an index exists?`

### `evaluate`

Responsibility: judge or choose among alternatives using explicit constraints, criteria, and trade-offs.

Typical evidence:
- decision criteria;
- considered alternatives;
- selected option;
- material trade-offs and conditions that could change the choice.

Example: `Would you use Kafka or RabbitMQ for this workload, and why?`

### `design`

Responsibility: synthesize a coherent solution or structure under stated constraints.

Typical evidence:
- clarified requirements/assumptions;
- decomposition;
- interfaces/data flow;
- key decisions and trade-offs;
- failure/boundary considerations appropriate to scope.

Example: `Design an idempotent asynchronous payment-processing flow.`

## QuestionType v0.1

### `direct-recall`

Primary task: `recall`.

Prompt intent: request a definition, fact, property, invariant, or named item without answer alternatives.

Expected answer shape: concise retrieval of the requested information plus only the context required for correctness.

Minimum evidence of success: the essential information is independently retrieved and materially correct.

Typical failure: recognition after seeing the reference answer but inability to produce it unaided.

### `explain`

Primary task: `explain`.

Prompt intent: ask what a concept means, why it exists, how it works, or why one event causes another.

Common prompt variants:
- purpose;
- mechanism;
- causality;
- rationale.

Expected answer shape: a coherent explanatory model rather than a disconnected list of facts.

Minimum evidence of success: the answer connects the relevant entities and relationships correctly enough to explain the behavior.

### `compare`

Primary task: `compare`.

Prompt intent: distinguish two or more related concepts, mechanisms, or technologies.

Expected answer shape: comparison on shared dimensions followed by conditions under which differences matter.

Minimum evidence of success: at least the decision-relevant distinctions are correct; parallel lists of unrelated facts are insufficient.

### `scenario-apply`

Primary task: `apply`.

Prompt intent: present a concrete case and require use of a known concept, rule, or mechanism.

Expected answer shape: selected concept/action plus case-specific reasoning.

Minimum evidence of success: the learner correctly maps the scenario to the relevant concept and applies it without relying on a memorized generic answer.

### `predict`

Primary task: `analyze`.

Prompt intent: ask what will happen when a system, program, protocol, transaction, or mechanism reaches a stated state.

Expected answer shape: predicted outcome plus reasoning chain from initial conditions.

Minimum evidence of success: both the outcome and the material causal/mechanical reasoning are correct.

### `diagnose`

Primary task: `analyze`.

Prompt intent: provide symptoms, logs, behavior, or constraints and ask for the likely cause and next verification/fix.

Expected answer shape: hypotheses -> evidence -> verification -> remediation.

Minimum evidence of success: the diagnosis is evidence-based and includes a reasonable way to confirm or falsify it.

### `choose-justify`

Primary task: `evaluate`.

Prompt intent: require a choice among alternatives under explicit or discoverable constraints.

Expected answer shape: criteria -> alternatives -> choice -> trade-offs -> conditions that would change the choice.

Minimum evidence of success: the answer is constraint-driven rather than a context-free preference.

### `design`

Primary task: `design`.

Prompt intent: require construction of a solution or architecture from requirements and constraints.

Expected answer shape: assumptions -> decomposition -> interactions/data flow -> key decisions -> trade-offs/failures.

Minimum evidence of success: a coherent solution addresses the core requirements and exposes material reasoning, not merely technology names.

## Classification rules

1. Classify by the reasoning and evidence required for a correct answer, not by a single verb in the prompt.
2. Assign one primary `LearningTask` in v0.1 so analytics remain interpretable.
3. A question may exercise secondary skills, but secondary task tagging is deferred until real data proves it useful.
4. Purpose, mechanism, and causality are `explain` variants rather than separate LearningTasks.
5. Prediction and debugging/diagnosis are separate QuestionTypes but both map to `analyze`.
6. Selection and trade-off prompts map to `choose-justify` / `evaluate`.
7. Oral/text/code/diagram delivery is not a LearningTask. Response modality is orthogonal and will be modeled only when required by an adapter or exercise.
8. Anki note/card type is not a QuestionType. Mapping to Anki belongs to the adapter layer.

## Initial coverage rule

A concept does not need all eight QuestionTypes. Coverage is driven by interview relevance.

For a concept central to a target competency, prefer at least:

```text
direct-recall or explain
+ one transfer-oriented type (scenario-apply / predict / diagnose)
+ compare or choose-justify when alternatives matter
```

This is a heuristic for question-bank design, not a mastery formula.
