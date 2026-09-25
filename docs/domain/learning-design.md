# Learning Design

## Purpose

Define target-relative learning semantics: what outcome is sought, what is required, where meaningful gaps exist, and what deserves attention next.

## Core concepts

### Learning Target

A desired future state with enough purpose, scope and depth to evaluate what is required.

### Requirement

A reusable statement of capability that may be required by one or more learning targets. It preserves the capability actually demanded in the real world—for example, explaining a concept, diagnosing a situation, choosing an approach or performing an operation—rather than reducing that demand to a topic label.

A Requirement has stable identity and may align to reusable subject knowledge from Knowledge Model.

### Requirement Set

A reusable composition of Requirements and other Requirement Sets. Composition is recursive but acyclic, so larger requirement profiles can be assembled from smaller reusable groups without duplicating their members.

Its structure exists for learning-design composition and does not imply the structure of subject knowledge.

### Target Requirement

A Requirement or Requirement Set selected for a particular Learning Target. Additional criterion, rubric or performance-level semantics are introduced only when a concrete real-world requirement needs them; they are not mandatory structure of every Requirement.

### Alignment

An explicit semantic correspondence between a target requirement and reusable subject knowledge or reusable competency definitions. Alignment preserves separate identities rather than collapsing requirements into knowledge units.

### Gap

A target-relative difference between required capability and the evidence-backed learner state.

A gap is not intrinsic to subject knowledge and cannot exist without both a target requirement and learner-state evidence or explicit uncertainty.

### Readiness

A target-relative judgment about whether the learner's current evidence-backed state supports productive work on a requirement. Readiness may depend on prerequisite or enabling knowledge but is not itself mastery of the requirement.

### Priority

A decision about what deserves attention next under constraints such as target importance, gap size, readiness, dependency, state uncertainty, time and retention risk.

Priority is not restricted to known gaps: reducing important uncertainty may itself deserve priority.

### Learning Intent

An intent to change learner capability through learning or practice.

### Diagnostic Intent

An intent to reduce material uncertainty about learner state by eliciting evidence. A diagnostic action may be valuable even when it is not the highest-priority content to learn.

Concrete execution of either intent may occur inside Prep or in an external runtime.

### Question

A concrete learning or diagnostic artifact:

```text
Question
  id
  question_text
  answer_text
  knowledge: KnowledgeNode[]
```

`question_text` is the text of the question.

`answer_text` is the direct answer to that question.

`knowledge` contains references to one or more reusable Knowledge Model objects that provide the subject knowledge behind the question and answer.

Example:

```text
Question
  question_text: "Which file descriptor number is stdin?"
  answer_text: "0"
  knowledge:
    - Standard streams
```

The mapping is many-to-many: one question may reference several knowledge objects and one knowledge object may support many questions.

Question organization remains deliberately minimal. Classification, collections, difficulty, tags, duplicate/variant relationships and dedicated corpus-navigation structures are not part of the current model. They should be introduced only when a demonstrated use case requires semantics beyond `knowledge` references and ordinary retrieval.

## Ownership

Learning Design owns:

- learning targets;
- reusable requirements and competencies;
- reusable Requirement Sets and their acyclic composition;
- target-specific selection of Requirements and Requirement Sets;
- alignments between requirements/competencies and reusable subject knowledge;
- target-relative gaps;
- prioritization policy and decisions;
- learning/practice intent;
- evidence requirements used to reassess progress;
- questions, their direct answers, and their references to reusable subject knowledge.

It consumes reusable subject semantics from Knowledge Model and evidence-backed state from Learner Model.

It does not own reusable subject truth or raw learner observations.

## Invariants

- a gap is always relative to a target;
- activity completion alone cannot close a gap without sufficient evidence;
- priority is a decision derived from target importance, current evidence, readiness and uncertainty, not a property of knowledge itself;
- a learning intent aims to change learner capability; a diagnostic intent aims to reduce uncertainty about learner state;
- an unknown state is not automatically a learning gap;
- changing learner evidence may change gaps and priorities without changing subject knowledge;
- changing a target or its requirements may change gaps without changing learner observations;
- Requirement != Requirement Set != Evidence;
- Requirement Set composition is acyclic;
- alignment does not merge the identities of a requirement and the knowledge it references;
- a Question owns its `question_text` and direct `answer_text`;
- a Question's `knowledge` references reusable subject knowledge without taking ownership of it.

## Deferred prioritization semantics

How dependencies between requirements should affect learning priority is intentionally left undefined. The model should not prescribe dependency-driven ordering or priority until experience with real use provides evidence for useful semantics.

## Deferred evidence-threshold semantics

How much or what kind of learning evidence is sufficient for a Learning Target is intentionally left undefined. Evidence thresholds, repeated demonstrations, delayed retrieval, explanation quality, and practical performance should be modeled only after experience with real questions and system use provides evidence for useful semantics.

## Deferred learning-material boundary

Whether learning-material design eventually develops independent invariants that justify a separate model context is intentionally left unresolved. Learning Design remains the current owner until real usage provides evidence for a split.

## Open questions

