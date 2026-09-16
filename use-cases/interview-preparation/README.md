# Interview Preparation

## Purpose

Prepare for technical interviews through explicit competency modeling, diagnostic questions, retrieval practice, reassessment, and gap-driven learning.

## Domain vocabulary

This bounded context owns:

- `Competency`;
- `Concept`;
- `LearningTask`;
- `QuestionType`;
- `Question`;
- interview-specific assessment and gap semantics.

## Current canonical artifacts

The implementation predates the `use-cases/` directory, so current artifacts remain at their existing paths until a later migration is justified:

```text
docs/domain-model.md
docs/question-types.md
docs/question-bank-format.md
model/question-taxonomy.json
questions/
tools/validate_questions.py
```

Do not move them only for directory symmetry. Migration should happen when it improves executable boundaries or packaging.

## Execution

Anki is the initial execution adapter for question practice. The bounded context maps its canonical `Question` objects to shared Anki infrastructure; Anki note/card types do not define the interview domain.
