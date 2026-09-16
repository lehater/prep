# Interview Preparation domain

## Bounded-context purpose

Prepare a learner for a target technical interview by modeling expected competencies, collecting diagnostic evidence, identifying gaps, and driving targeted learning/reassessment.

This bounded context owns the meaning of interview knowledge and assessment. It does not own Anki scheduling semantics.

## Core flow

```text
TargetRole
  -> Competency model
  -> Concepts
  -> Questions
  -> Baseline Attempts
  -> Assessments
  -> Gap map
  -> Learning Actions
  -> Reassessment
```

## Core entities

### Competency

An interview-relevant capability expected for a target role.

Input: target-role/interview expectations.
Output: scoped capability decomposable into concepts and tasks.

### Concept

A unit of knowledge or mechanism that can be understood and tested from multiple angles.

Examples: MVCC, event loop, idempotency.

### LearningTask

The cognitive operation the learner is expected to demonstrate.

Canonical v0.1 values:

- `recall`;
- `explain`;
- `compare`;
- `apply`;
- `analyze`;
- `evaluate`;
- `design`.

### QuestionType

A reusable elicitation pattern for a LearningTask. It describes prompt intent, expected answer shape, and minimum evidence of success.

Canonical v0.1:

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

Detailed semantics: [`interview-question-types.md`](interview-question-types.md).

### Question

A concrete prompt tied to a `Concept` and `QuestionType`.

Its stable identifier is domain identity. Presentation wording may evolve without creating a new Question identity.

### Attempt

An observed response event for a Question.

Important dimensions include:

- question ID;
- timestamp;
- assessment-run context;
- baseline vs later practice/reassessment;
- response time when available;
- raw execution-system observation where useful.

### Assessment

Interpretation of Attempt evidence. Execution-system buttons or scheduler state may be evidence but do not define domain correctness or mastery.

### Gap

Evidence that a concept/task combination requires remediation.

Primary analysis unit:

```text
Concept × LearningTask
```

### Mastery

An inferred state derived from repeated evidence. The formula remains intentionally deferred until real attempt data exists.

### LearningAction

A response to a Gap, for example:

- study/clarification;
- targeted retrieval practice;
- new scenario/diagnostic question;
- mock interview exercise;
- communication/time-box training.

## Process invariants

### Baseline

The first diagnostic pass occurs before targeted study for the selected scope. Baseline attempts remain distinguishable from later reviews.

### Gap-driven loop

```text
observed failure
  -> classify affected Concept × LearningTask
  -> choose remediation
  -> practice
  -> spaced reassessment
  -> update evidence
```

### Question bank is not the domain hierarchy

Questions are probes. Concepts/competencies are the knowledge model. Multiple Questions can contribute evidence about one capability.

### Anki boundary

The bounded context does not know about Anki Note/Card/Deck structures.

Application code projects canonical Questions through a study-system port. Infrastructure maps that projection to Anki.

## Executable sources of truth

- `model/question-taxonomy.json` — machine-readable LearningTask/QuestionType registry;
- `questions/*.json` — canonical question banks;
- `tools/validate_questions.py` — structural/project invariant validation.

Authoring guidance: [`../guides/interview-question-authoring.md`](../guides/interview-question-authoring.md).
