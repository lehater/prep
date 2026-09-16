# Domain Model

This document is intentionally minimal. It defines candidate domain entities and their responsibilities; details should be refined through research and vertical slices.

## Competency

Represents an interview-relevant capability expected for a target role.

Input: role/interview expectations.
Output: scoped capability that can be decomposed into concepts and tasks.

## Concept

Represents a unit of knowledge or mechanism that can be understood and tested from multiple angles.

Examples: MVCC, event loop, idempotency.

## LearningTask

Represents the cognitive operation expected from the learner.

Candidate tasks include:
- recall;
- explanation;
- purpose;
- causality;
- comparison;
- selection;
- application;
- prediction;
- debugging;
- trade-off analysis;
- design;
- verbal explanation.

## QuestionType

Defines a reusable way to test a LearningTask. It specifies expected prompt structure, answer form, and assessment semantics.

## Question

A concrete prompt tied to a concept, competency context, and QuestionType.

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

## Gap

Represents evidence that a concept/task combination requires remediation.

The intended analysis unit is not only a single card but primarily:

```text
Concept × LearningTask
```

## Mastery

Represents an inferred state derived from multiple attempts. The calculation method is not yet decided.

## LearningAction

Represents a response to an observed Gap, such as study, targeted retrieval practice, a new scenario question, or a mock-interview exercise.
