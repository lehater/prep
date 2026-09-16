# Learning Card Architecture for Technical Interview Preparation

Date: 2026-09-17
Status: research candidate; not an accepted domain/schema decision

## Research question

What should a learning card/object contain and how should it behave so that Interview Preparation can support:

- conceptual knowledge;
- technical terminology;
- scenario reasoning;
- code reading/tracing;
- code completion/debugging/writing;
- architecture/design reasoning;
- retrieval practice and spaced review;
- progressively reduced instructional support?

The central modeling question is whether a small set of orthogonal dimensions can produce useful learning interactions without creating one hard-coded card type for every combination.

## Executive finding

The evidence does **not** support designing one universal `Question -> Answer` card or one flat enum such as `text-card`, `code-card`, `scenario-card`, `design-card`.

A better candidate model is compositional:

```text
Concept
  + KnowledgeKind        what kind of referent is being learned?
  + LearningTask         what cognitive operation is intended?
  + QuestionType         how is evidence elicited, when this is a question?
  + GuidanceLevel        how much solution support is provided?
  + StimulusFormat       what representation is presented?
  + ResponseFormat       what observable learner action is requested?
  -> LearningObject/Card projection
```

Presentation presets such as `code-trace` or `worked-code-example` should initially be **recipes over these dimensions**, not new domain taxonomies.

The strongest additional implication is that future learning content may need to be broader than `Question`: worked examples and completion tasks are instructional objects even when they are not pure retrieval questions.

## Input from `knowledge-graph`

The `knowledge-graph` repository already separates the semantic referent from questions and classification.

Its Concept Card contract treats a concept as the persistent knowledge object and questions as an adaptive explanatory interface. Questions are selected because they reveal important aspects such as boundary, purpose, mechanism, structure, conditions, consequences or trade-offs; they are not generated mechanically from graph edges or a fixed heading taxonomy.

Relevant source:

- `lehater/knowledge-graph/specs/node.md`

The classification pilot separately introduced:

```text
kind   = broad form of referent
areas  = topical browse membership
facets = optional subject-specific dimensions
```

Candidate `kind` vocabulary from the 40-card trial:

```text
artifact
construct
mechanism
model
pattern
practice
problem
property
result
structure
technology
```

Relevant sources:

- `lehater/knowledge-graph/project/evidence/node-classification-facet-trial.md`
- `lehater/knowledge-graph/project/evidence/formal-facet-analysis-trial.md`

### Consequence for `prep`

`KnowledgeKind` is a plausible additional axis because it answers a different question from `LearningTask` and `QuestionType`:

```text
KnowledgeKind -> what is the subject/referent?
LearningTask  -> what should the learner do cognitively?
QuestionType  -> what prompt/evidence shape is used?
```

Do not derive card structure directly from `KnowledgeKind`. A `property` can be recalled, explained, applied, diagnosed or used in design; a `technology` can be explained, traced, debugged or compared.

## Evidence base

### 1. Retrieval practice is valuable, but card design should target more than recognition

Rowland's meta-analysis of testing versus restudy found a robust testing effect and reported larger benefits for initial recall tests than recognition tests. This supports requiring learners to retrieve/explain rather than merely recognize an answer.

Source:

- Rowland, 2014, *Psychological Bulletin*: https://pubmed.ncbi.nlm.nih.gov/25150680/

Pan & Rickard's transfer meta-analysis found that retrieval practice can transfer beyond the practiced item (`d = 0.40` overall), with stronger transfer in conditions including application/inference questions and elaborated retrieval. Transfer is therefore possible, but should not be assumed from simple fact recall alone.

Source:

- Pan & Rickard, 2018, *Psychological Bulletin*: https://pubmed.ncbi.nlm.nih.gov/29733621/

Project implication:

- keep free retrieval as the default for concepts that should be producible in an interview;
- include application/inference/diagnostic questions, not only definitions;
- avoid designing the system around recognition-only multiple choice.

### 2. Feedback quality matters; the back of the card should be structured feedback

A meta-analysis of 435 feedback studies (`N > 61,000`) found an overall medium effect (`d = 0.48`) but substantial heterogeneity: effectiveness depended strongly on the information conveyed by feedback.

Source:

- Wisniewski, Zierer & Hattie, 2020: https://pubmed.ncbi.nlm.nih.gov/32038429/

A 2024 meta-analysis of digitally delivered instructional feedback found a positive summary effect and identified feedback focus/content and task factors as moderators.

Source:

- Brummer et al., 2024: https://link.springer.com/article/10.1007/s10984-024-09501-4

Project implication:

The back side should not be only `ReferenceAnswer`. Candidate feedback blocks should separate:

```text
ShortAnswer
Explanation
ReasoningSteps        optional
KeyPoints             current RequiredPoints, learner-facing after reveal
CorrectArtifact       code/diagram/SQL/etc., optional
Pitfall               optional
Alternatives          optional
Sources
```

Blocks should render only when they add instructional value.

### 3. Worked examples are useful scaffolds, especially for lower prior knowledge

Worked-example research within Cognitive Load Theory shows that examples can reduce unproductive problem-solving search and help learners acquire solution schemas. The effect is strongest when learners lack prior knowledge.

Sources:

- van Gog, Paas & Sweller, 2010: https://link.springer.com/article/10.1007/s10648-010-9145-4
- Sweller, van Merriënboer & Paas, 2019: https://link.springer.com/article/10.1007/s10648-019-09465-5

However, support should not remain fixed. Expertise-reversal and guidance-fading research indicates that instructional aids useful to novices can become redundant or counterproductive as knowledge increases. A common progression is:

```text
worked example
  -> completion / faded example
  -> independent problem
```

Source:

- Sweller, van Merriënboer & Paas, 2019: https://link.springer.com/article/10.1007/s10648-019-09465-5

Project implication:

`GuidanceLevel` should be treated separately from `QuestionType`.

Candidate values for experiments:

```text
worked       full solution/process is visible; learner studies/explains it
faded        partial solution; learner completes missing steps
independent  learner constructs the answer/solution without solution scaffold
```

This is a better foundation than calling worked examples a special `QuestionType`.

### 4. Self-explanation can improve transfer from examples

Research on worked examples shows that prompting learners to explain underlying principles can improve transferable knowledge. Generative-learning research also treats explaining as a distinct sense-making activity rather than passive exposure.

Sources:

- Renkl et al., 1998: https://pubmed.ncbi.nlm.nih.gov/9514690/
- Fiorella, 2023: https://link.springer.com/article/10.1007/s10648-023-09769-7

Project implication:

A worked example should not necessarily be a passive card. A useful pattern is:

```text
show example
  -> ask learner to predict/explain a step or governing principle
  -> reveal structured explanation
```

This suggests `ResponseFormat = self-explanation` as a useful experimental interaction.

### 5. Programming learning benefits from separating tracing, explaining and writing

Computing-education research has repeatedly investigated the relationship between code tracing, explaining code and writing code. A 2009 ICER study found results broadly consistent with earlier work in which tracing and explaining performance were associated with later code-writing performance. A separate replication using Python reported that students who could not trace code usually could not explain it, while stronger code writers usually had tracing and explaining competence.

Sources:

- Venables, Tan & Lister, 2009: https://doi.org/10.1145/1584322.1584336
- Lister, Fidge & Teague, 2009 (open repository record): https://opus.lib.uts.edu.au/handle/10453/12063

Programming worked-example research also distinguishes evaluating/reading existing code from writing code and reports benefits from subgoal-labelled examples.

Source:

- Margulieux et al., 2020: https://link.springer.com/article/10.1186/s40594-020-00222-7

Project implication:

Code snippets are not merely decoration. We should support at least these different learner actions:

```text
trace      simulate execution / state changes
explain    state what/why code does
complete   fill a missing fragment
repair     diagnose and correct defective code
write      construct code from requirements
```

They should not be collapsed into one `code-card` type.

### 6. Parsons-style tasks are promising as an intermediate scaffold

Recent programming-education studies treat Parsons problems (ordering provided code blocks) as scaffolding between examples and code writing. Evidence is promising, especially for learners needing more support, but the sources reviewed here are less mature than the retrieval/worked-example literature and should be treated as lower-confidence design evidence.

Sources:

- Hou, Ericson & Wang, 2023: https://arxiv.org/abs/2311.18115
- Wu & Smith, 2024: https://arxiv.org/abs/2405.19460

Project implication:

`ordering` / `parsons` is worth prototyping as a `ResponseFormat`, but should not be a required first-version Anki interaction because native Anki interaction and mobile usability may constrain it.

### 7. Visual design should reduce extraneous processing, not maximize decoration

Multimedia-learning research supports the coherence principle (exclude irrelevant material) and signaling/cueing (visually highlight organization and relevant information). This supports semantic hierarchy, proximity and restrained emphasis rather than decorative complexity.

Sources:

- Mayer & Fiorella, *Cambridge Handbook of Multimedia Learning*: https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/CD5B7AE1279A9AB81F8EEBB53DBEC86E
- van Gog, signaling/cueing principle: https://www.cambridge.org/core/books/cambridge-handbook-of-multimedia-learning/signaling-or-cueing-principle-in-multimedia-learning/3972D4ACC628D5B53F7B2B4785DB2B06

Project implication:

Visual design requirements should include:

- clear distinction between prompt, stimulus, answer and feedback;
- code/log/diagram visually separated from prose;
- emphasis only on instructionally relevant information;
- related explanation placed near the artifact/line it explains when practical;
- no persistent empty sections;
- restrained color and decoration;
- readable light/dark-mode typography;
- no visual element whose only purpose is "making the card look richer".

## Candidate conceptual model

### Axis A — `KnowledgeKind`

Candidate values borrowed as a hypothesis from `knowledge-graph`:

```text
artifact
construct
mechanism
model
pattern
practice
problem
property
result
structure
technology
```

This describes the referent, not the exercise.

Examples:

```text
Idempotency          -> property
Transaction Atomicity -> property
Snapshot Isolation   -> model
Write-Ahead Logging  -> mechanism
Outbox Pattern       -> pattern
asyncio              -> technology
Bloom Filter         -> structure
Continuous Integration -> practice
Architecture Decision Record -> artifact
Distributed Consensus -> problem
FLP Impossibility    -> result
```

Do not accept these classifications into the domain schema before a local Interview Preparation pilot checks whether the vocabulary is useful for learning decisions rather than merely descriptive metadata.

### Axis B — `LearningTask`

Already accepted in `prep`:

```text
recall
explain
compare
apply
analyze
evaluate
design
```

This is the cognitive target.

### Axis C — `QuestionType`

Already accepted in `prep`:

```text
direct-recall  -> recall
explain        -> explain
compare        -> compare
scenario-apply -> apply
predict        -> analyze
diagnose       -> analyze
choose-justify -> evaluate
design         -> design
```

This is an elicitation/evidence pattern. It should remain independent from presentation technology.

### Axis D — `GuidanceLevel` (candidate)

```text
worked
faded
independent
```

This captures instructional support and enables guidance fading.

It is intentionally not equivalent to difficulty: a difficult concept can have a worked example, and a simple concept can be independently retrieved.

### Axis E — `StimulusFormat` (candidate)

What the learner receives before responding:

```text
prose
code
scenario
log
trace
diagram
table
query
execution-plan
mixed
```

This should probably be multi-block rather than one strict enum in implementation. For example, a scenario may include code + log output.

### Axis F — `ResponseFormat` (candidate)

What observable action is requested:

```text
free-recall
self-explanation
trace-table
code-completion
code-repair
code-writing
ordering
comparison
architecture-sketch
```

This is an interaction/delivery dimension, not a substitute for `LearningTask`.

Example:

```text
Concept: asyncio.create_task
KnowledgeKind: technology
LearningTask: analyze
QuestionType: predict
GuidanceLevel: independent
StimulusFormat: code
ResponseFormat: free-recall
```

The display preset may be called `code-trace`, but `code-trace` is derived from the combination rather than becoming the semantic truth.

## Why not one `InteractionType` enum?

A flat enum quickly mixes unrelated dimensions:

```text
text-recall
scenario
code-trace
code-explain
code-complete
diagnose
design
```

Problems:

- `scenario` describes stimulus/context;
- `diagnose` already exists as `QuestionType`;
- `code` describes representation;
- `complete` describes requested response/scaffolding;
- `design` already exists as `LearningTask` and `QuestionType`.

This creates duplicated semantics and combinatorial growth (`scenario-code-diagnose`, `diagram-design`, `log-diagnose`, ...).

Prefer orthogonal fields plus a small library of validated presets.

## Candidate presentation presets

Presets are UX/configuration recipes, not domain taxonomies.

### `concept-recall`

```text
GuidanceLevel: independent
Stimulus: prose
Response: free-recall
Typical tasks: recall/explain
```

### `scenario-reasoning`

```text
GuidanceLevel: independent
Stimulus: scenario (+ optional code/log)
Response: free-recall
Typical tasks: apply/analyze/evaluate/design
```

### `worked-code-example`

```text
GuidanceLevel: worked
Stimulus: code + reasoning steps
Response: self-explanation
Typical tasks: explain/analyze
```

### `code-trace`

```text
GuidanceLevel: independent or faded
Stimulus: code
Response: free-recall or trace-table
Typical tasks: analyze/predict
```

### `code-completion`

```text
GuidanceLevel: faded
Stimulus: partial code
Response: code-completion
Typical tasks: apply
```

### `code-diagnose`

```text
GuidanceLevel: independent
Stimulus: code + optional traceback/log
Response: code-repair or free-recall diagnosis
Typical tasks: analyze/diagnose
```

### `code-write`

```text
GuidanceLevel: independent
Stimulus: requirements/scenario
Response: code-writing
Typical tasks: apply/design
```

### `architecture-case`

```text
GuidanceLevel: independent
Stimulus: requirements + constraints + optional diagram
Response: free-response / architecture-sketch
Typical tasks: evaluate/design
```

## Candidate content-block model

The Anki NoteType should eventually render semantic blocks conditionally rather than encode one giant answer string.

### Front blocks

```text
HeaderMetadata       optional; concept/task, visually quiet
Context              optional
Prompt               required for retrieval object
Stimulus[]            optional; code/log/diagram/table/etc.
ResponseInstruction  optional; only when interaction is non-obvious
```

### Feedback/back blocks

```text
ShortAnswer          concise target answer
Explanation          why/how
ReasoningSteps       optional stepwise reasoning or execution trace
KeyPoints            checklist after reveal
CorrectArtifact      optional code/diagram/query/etc.
Pitfall              optional misconception/error pattern
Alternatives         optional trade-offs/valid variants
Sources              secondary/provenance
```

Current `ReferenceAnswer` can initially feed `Explanation`; current `RequiredPoints` can feed `KeyPoints`. Do not migrate until prototype cards show that the split adds value.

## Prototype family A — `Idempotency`

`Idempotency` is a useful concept-heavy sample because it stresses semantics, scenario reasoning and design more than syntax.

Candidate progression:

1. `concept-recall`
   - What property does `idempotency` guarantee?
2. `scenario-reasoning`
   - Response lost after committed `POST /payments`; what must retry do?
3. `scenario-reasoning` + `diagnose`
   - Two concurrent requests both observe missing idempotency key.
4. `worked-example`
   - Show transaction with unique key reservation and explain why each step exists.
5. `faded completion`
   - Provide transaction flow with missing concurrency/uniqueness step.
6. `architecture-case`
   - Payment + PostgreSQL + broker; design idempotency + Outbox boundary.

This family tests whether the same Concept/KnowledgeKind can support multiple LearningTasks without multiplying semantic card types.

## Prototype family B — `asyncio`

`asyncio` is a useful code-heavy sample because it stresses technology concepts, code representations, execution tracing and scaffold fading.

Candidate progression:

```text
worked code example
  -> self-explain create_task/await behavior
  -> code trace / predict output and scheduling
  -> code completion
  -> diagnose blocking call / forgotten await / lost Task
  -> write small concurrent solution
  -> compare alternatives / design concurrency boundary
```

Example candidate sequence:

1. Worked code example: `asyncio.create_task()` + `await` with annotated scheduling points.
2. Explain: why `create_task()` changes when execution can overlap.
3. Trace: predict observable order for a small deterministic snippet.
4. Complete: add `await asyncio.gather(...)` or equivalent missing fragment.
5. Diagnose: synchronous blocking operation inside an async path.
6. Write: concurrently call independent I/O operations with bounded error handling.
7. Evaluate: choose between direct `await`, `create_task`, `gather`, `TaskGroup` under explicit constraints.

The exact API examples must be verified against the Python version targeted by the learning plan before becoming canonical cards.

## KnowledgeKind as a recommendation signal, not a mapping rule

Candidate affinity examples:

| KnowledgeKind | Often useful learning interactions |
| --- | --- |
| `property` | recall, scenario, predict, compare |
| `mechanism` | explain, trace, diagnose |
| `model` | explain, compare, predict |
| `pattern` | scenario, evaluate, design |
| `technology` | worked example, trace, complete, diagnose, write |
| `structure` | diagram/trace, explain, construct |
| `practice` | scenario, evaluate, critique |
| `artifact` | inspect, critique, create |
| `problem` | analyze, compare solutions, design |
| `result` | explain, consequence/inference |

These are priors for content design, not allowed/forbidden combinations.

## Adaptive implication

The research suggests that adaptation should eventually vary **support**, not only review interval.

A possible learning path is:

```text
low evidence / new Concept
  -> worked example
  -> faded/completion
  -> independent retrieval/application
  -> transfer/design
```

As evidence improves, instructional support can be reduced. This is a different adaptation axis from Anki's spacing schedule.

This is a project hypothesis grounded in guidance-fading/expertise-reversal evidence; it is not yet implemented.

## Visual UX requirements derived from evidence

Visual styling should follow content semantics.

Recommended principles:

1. **Coherence** — remove decorative or repeated material that does not support the task.
2. **Signaling** — use typography, spacing and restrained highlighting to show what is prompt, evidence, result and explanation.
3. **Proximity** — keep explanations near the code/log/diagram element they refer to when possible.
4. **Progressive disclosure** — front shows only what is required to attempt retrieval; feedback blocks appear after reveal.
5. **Conditional blocks** — no empty headings such as `Pitfall` or `Example` when absent.
6. **Code is code** — preserve conventional English identifiers/API names, monospace formatting and indentation; Russian prose explains around it.
7. **Visual quietness** — metadata (`QuestionType`, source, ID) is secondary and must not compete with the prompt.
8. **Dark/light compatibility** — semantic contrast must survive both.

Do not choose color palette, borders, icons or syntax-highlighting implementation until the semantic prototype is accepted.

## What should remain unchanged now

This research does **not** justify changing immediately:

- current `LearningTask` taxonomy;
- current `QuestionType` taxonomy;
- current Question IDs;
- `Prep Question v1` fields;
- Anki synchronization identity/reconciliation;
- Gap/Mastery model.

The next step should validate the content model before migration.

## Recommended next experiment

Create a bounded `Prep Card v2` prototype without replacing v1.

Use approximately 12–16 prototype learning objects:

```text
Idempotency: 6–8
asyncio:     6–8
```

Ensure the sample covers:

```text
concept-recall
scenario-reasoning
worked-code-example
code-trace
code-completion
code-diagnose
code-write or architecture-case
```

For every prototype record explicitly:

```text
Concept
KnowledgeKind (candidate)
LearningTask
QuestionType (when applicable)
GuidanceLevel
StimulusFormat(s)
ResponseFormat
front blocks
feedback blocks
```

Then render the same prototypes in HTML/CSS and inspect them in Anki desktop/mobile.

### Acceptance questions

1. Do the axes describe every prototype without semantic duplication?
2. Does any axis repeatedly have only one value implied by another axis?
3. Are presets sufficient, or do users need many custom card types?
4. Does `KnowledgeKind` improve authoring decisions or only add metadata?
5. Does separating `ShortAnswer` from `Explanation` make review faster without losing depth?
6. Are code/log/diagram blocks readable on desktop and mobile?
7. Can worked -> faded -> independent objects coexist without confusing Anki scheduling semantics?
8. Which blocks belong to canonical learning content versus Anki-only presentation?

Only after this experiment should we decide whether to create a permanent schema/ADR and `Prep Question/Card v2` NoteType.

## Confidence summary

High-confidence evidence:

- retrieval practice;
- information-rich feedback;
- worked examples for lower prior knowledge;
- expertise reversal / guidance fading;
- coherence and signaling in instructional presentation.

Moderate-confidence application to this project:

- `GuidanceLevel` as an explicit content dimension;
- structured feedback blocks;
- tracing/explaining/completion as distinct programming activities.

Experimental/project hypotheses:

- reusing `knowledge-graph` `KnowledgeKind` directly in Interview Preparation;
- exact `StimulusFormat` / `ResponseFormat` vocabulary;
- Parsons/ordering tasks inside Anki;
- adaptive switching among worked/faded/independent objects based on evidence.
