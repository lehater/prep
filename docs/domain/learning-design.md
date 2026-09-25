# Learning Design

## Purpose

Define target-relative learning semantics: what outcome is sought, what is required, where meaningful gaps exist, and what deserves attention next.

## Core concepts

### Learning Target

A desired future state with enough purpose, scope and depth to evaluate what is required.

### Target Requirement

A requirement applicable to a particular target. It may reference a reusable competency/requirement definition from Knowledge Model or be specific to the target.

### Requirement Framework

An organized, reusable or target-specific set of requirements used to describe what a target expects. A framework groups requirements but does not imply that its structure is the structure of subject knowledge.

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

A concrete learning or diagnostic artifact may pair a prompt with a concise reference answer and map the question to reusable subject knowledge:

```text
Question
  id
  prompt
  answer
  requires: KnowledgeNode[]
```

`answer` is the concise reference answer for this concrete question. It belongs to the question artifact; it is not promoted into Knowledge Model merely because it states a correct fact.

`requires` references the reusable explanatory knowledge a learner should command to understand and answer the question. It does not point to an answer literal or require Knowledge Model to atomize every fact.

Example:

```text
Question:
  prompt: "What does 7 mean in Unix permissions?"
  answer: "read + write + execute (4 + 2 + 1)"
  requires:
    - Unix permission representation
```

The referenced knowledge object may explain the complete notation and surrounding theory. The question remains a focused retrieval/check artifact over that theory.

The mapping is many-to-many: several questions may require the same knowledge object, and one question may require several knowledge objects.

## Ownership

Learning Design owns:

- learning targets;
- requirement frameworks and target-specific requirements;
- criteria and performance levels;
- alignments between target requirements and reusable knowledge/competency definitions;
- target-relative gaps;
- prioritization policy and decisions;
- learning/practice intent;
- evidence requirements used to reassess progress;
- question/answer learning artifacts and their mapping to reusable subject knowledge.

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
- a question's concise answer is distinct from the reusable explanatory knowledge referenced by `requires`;
- `requires` identifies supporting subject knowledge, not a literal answer.

## Open questions

- whether learning-material design develops independent invariants requiring a later context split;
- when requirement frameworks should be reusable versus target-specific;
- which criteria/performance-level structures are useful without importing a generic rubric system;
- how dependencies between requirements affect priority;
- how evidence strength required for a target should be expressed.
