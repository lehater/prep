# Learning Design

## Purpose

Define target-relative learning semantics: what outcome is sought, what is required, where meaningful gaps exist, and what deserves attention next.

## Core concepts

### Learning Target

A desired future state with enough purpose, scope and depth to evaluate what is required.

### Target Requirement

A requirement applicable to a particular target. It may specialize or select a reusable requirement or competency owned by Learning Design and may align to reusable subject knowledge from Knowledge Model.

### Criterion

A statement of what must be demonstrated for a target requirement to count as satisfied. Criteria make the expected form of capability explicit rather than hiding it in a generic depth value.

### Performance Level

A meaningful level of performance against one or more criteria. Levels describe quality or degree of demonstrated capability; they are not learner observations themselves.

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
- target-specific requirements and competencies;
- criteria and performance levels;
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
- changing a target, criterion or required performance level may change gaps without changing learner observations;
- Requirement != Criterion != Performance Level != Evidence;
- alignment does not merge the identities of a requirement and the knowledge it references;
- a Question owns its `question_text` and direct `answer_text`;
- a Question's `knowledge` references reusable subject knowledge without taking ownership of it.

## Open questions

- whether learning-material design develops independent invariants requiring a later context split;
- which criteria/performance-level structures are useful without importing a generic rubric system;
- how dependencies between requirements affect priority;
- how evidence strength required for a target should be expressed.
