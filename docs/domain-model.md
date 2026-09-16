# Domain Model

This document defines the current preparation-domain entities and their responsibilities. Details should evolve through evidence from vertical slices rather than speculative platform design.

## Competency

Represents an interview-relevant capability expected for a target role.

Input: role/interview expectations.
Output: scoped capability that can be decomposed into concepts and tasks.

## Concept

Represents a unit of knowledge or mechanism that can be understood and tested from multiple angles.

Examples: MVCC, event loop, idempotency.

## LearningTask

Represents the cognitive operation the learner is expected to demonstrate.

Canonical v0.1 values:
- `recall`;
- `explain`;
- `compare`;
- `apply`;
- `analyze`;
- `evaluate`;
- `design`.

The taxonomy is diagnostic rather than a strict hierarchy. Detailed semantics are defined in `docs/question-types.md`.

Prompt variants such as purpose, mechanism, causality, prediction, debugging, selection, and trade-off analysis do not automatically become separate LearningTasks. They are represented by QuestionTypes or their future variants where that distinction is useful.

## QuestionType

Defines a reusable way to elicit evidence for a LearningTask. It specifies prompt intent, expected answer shape, and minimum evidence of success.

Canonical v0.1 values:
- `direct-recall` -> `recall`;
- `explain` -> `explain`;
- `compare` -> `compare`;
- `scenario-apply` -> `apply`;
- `predict` -> `analyze`;
- `diagnose` -> `analyze`;
- `choose-justify` -> `evaluate`;
- `design` -> `design`.

QuestionType is independent of Anki note/card types and independent of response presentation such as oral, text, code, or diagram.

## Question

A concrete prompt tied to a concept, competency context, and QuestionType.

In v0.1, each Question has one primary LearningTask through its QuestionType so diagnostic aggregation remains interpretable. Secondary task tagging is deferred until evidence shows it is needed.

## Attempt

An observed response event for a question.

Important attributes will likely include:
- question identifier;
- timestamp;
- assessment result;
- attempt kind (baseline or learning/review);
- response time when available.

## Assessment

Represents the interpretation of an Attempt. Anki review buttons may be one input, but assessment semantics belong to this domain.

QuestionType defines the kind of evidence expected; a later slice will define reusable rubrics or assessment levels.

## Gap

Represents evidence that a concept/task combination requires remediation.

The primary analysis unit is:

```text
Concept × LearningTask
```

This allows multiple differently worded Questions to contribute evidence about the same underlying capability.

## Mastery

Represents an inferred state derived from multiple attempts. The calculation method is intentionally undecided until real attempt data exists.

## LearningAction

Represents a response to an observed Gap, such as study, targeted retrieval practice, a new scenario question, or a mock-interview exercise.

## Candidate future entity: ResponseMode

Oral answer, text answer, code, and diagram describe *how evidence is produced*, not *what cognitive operation is tested*.

`ResponseMode` should become a first-class entity only when the Anki adapter or a non-Anki exercise requires this distinction. Until then, response modality remains adapter/exercise metadata rather than another LearningTask.
