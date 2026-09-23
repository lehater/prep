# Interview Preparation domain

## Bounded-context purpose

Prepare a learner for a target technical interview by modeling expected competencies, collecting diagnostic evidence, identifying gaps, and driving targeted learning/reassessment.

This context owns interview-specific elicitation, assessment and remediation semantics. Canonical reusable knowledge semantics belong to the Knowledge Graph.

## Core flow

```text
TargetRole
  -> Competency model
  -> GraphSubjectRefs
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

### Concept compatibility boundary

The existing executable question-bank model uses local `Concept` identifiers such as `backend.idempotency`. This remains a compatibility artifact until graph integration is migrated.

Target ownership:

```text
Knowledge Graph -> canonical semantic definition/identity
Interview       -> GraphSubjectRef + interview relevance/assessment semantics
```

Interview Preparation must not become a second semantic source of truth for Idempotency, MVCC, asyncio, etc.

Migration of existing `concept_id` fields is a later executable change; this document does not silently invalidate current question banks.

### LearningTask

Canonical interview cognitive operation:

```text
recall
explain
compare
apply
analyze
evaluate
design
```

### QuestionType

Reusable elicitation pattern for a LearningTask:

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

See [interview-question-types.md](interview-question-types.md).

### Question

A concrete interview prompt tied to one or more graph subjects (currently via compatibility `concept_id`) and a QuestionType.

Question identity is interview-domain identity; wording may evolve without changing it.

### Attempt

Observed response event for a Question.

### Assessment

Interview interpretation of Attempt evidence. Execution-system ratings/scheduler state are inputs, not the definition of correctness/mastery.

### Gap

Evidence that a required graph subject × LearningTask needs remediation.

### Mastery

Derived interview-specific interpretation from repeated evidence. Cross-platform learner-state projection is owned by Learning Coordination.

### LearningAction

Interview-specific remediation such as study/clarification, targeted retrieval, scenario practice, code exercise or mock interview.

## Process invariants

### Baseline

Initial diagnostic attempts stay distinguishable from later practice/reassessment.

### Gap-driven loop

```text
observed failure
  -> classify affected GraphSubjectRef × LearningTask
  -> remediation
  -> practice
  -> spaced reassessment
  -> update evidence
```

### Question bank is not the knowledge hierarchy

Questions are probes. Canonical semantic topology belongs to the Knowledge Graph. Multiple Questions may test one graph subject; one scenario may test several subjects/relations.

### Anki boundary

The bounded context does not know Anki Note/Card/Deck structures. Application code projects Questions through a study-system port; infrastructure maps them to Anki.

## Executable current sources

- `model/question-taxonomy.json`;
- `questions/*.json`;
- `tools/validate_questions.py`.

These are current executable Interview artifacts and will be migrated deliberately when GraphSubjectRef becomes executable.
