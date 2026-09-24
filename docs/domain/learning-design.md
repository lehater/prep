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

### Priority

A decision about which gaps deserve attention next under constraints such as importance, dependency, uncertainty, time and retention risk.

### Learning / Evidence Intent

The kind of learning, practice or evidence sought to address or reassess a gap. Concrete execution may occur inside Prep or in an external runtime.

## Ownership

Learning Design owns:

- learning targets;
- requirement frameworks and target-specific requirements;
- criteria and performance levels;
- alignments between target requirements and reusable knowledge/competency definitions;
- target-relative gaps;
- prioritization policy and decisions;
- learning/practice intent;
- evidence requirements used to reassess progress.

It consumes reusable subject semantics from Knowledge Model and evidence-backed state from Learner Model.

It does not own reusable subject truth or raw learner observations.

## Invariants

- a gap is always relative to a target;
- activity completion alone cannot close a gap without sufficient evidence;
- priority is a decision derived from target importance and current evidence, not a property of knowledge itself;
- changing learner evidence may change gaps and priorities without changing subject knowledge;
- changing a target, criterion or required performance level may change gaps without changing learner observations;
- Requirement != Criterion != Performance Level != Evidence;
- alignment does not merge the identities of a requirement and the knowledge it references.

## Open questions

- whether learning-material design develops independent invariants requiring a later context split;
- when requirement frameworks should be reusable versus target-specific;
- which criteria/performance-level structures are useful without importing a generic rubric system;
- how dependencies between requirements affect priority;
- how evidence strength required for a target should be expressed.
