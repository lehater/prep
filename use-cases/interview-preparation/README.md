# Interview Preparation

Purpose: prepare for technical interviews through competency modeling, diagnostic questions, retrieval practice, reassessment, and gap-driven learning.

## Canonical documentation

- domain model and process: [`../../docs/domain/interview-preparation.md`](../../docs/domain/interview-preparation.md)
- LearningTask / QuestionType semantics: [`../../docs/domain/interview-question-types.md`](../../docs/domain/interview-question-types.md)
- question authoring: [`../../docs/guides/interview-question-authoring.md`](../../docs/guides/interview-question-authoring.md)
- Interview → Anki mapping: [`../../docs/guides/anki-interview-adapter.md`](../../docs/guides/anki-interview-adapter.md)

## Executable artifacts

```text
model/question-taxonomy.json
questions/
tools/validate_questions.py
```

## Architecture boundary

This bounded context owns `Competency`, `Concept`, `LearningTask`, `QuestionType`, `Question`, and interview-specific assessment/gap semantics.

Application use cases depend on capability ports; concrete Anki infrastructure remains outside the bounded-context core.
