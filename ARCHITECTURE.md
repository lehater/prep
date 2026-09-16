# Architecture

## System responsibility

`prep` is the durable workspace for modeling, executing, and improving technical interview preparation.

The repository owns:
- competency and concept models;
- learning-task and question-type definitions;
- canonical question data;
- assessment semantics;
- mappings to execution adapters such as Anki;
- research, decisions, plans, and validation rules.

## High-level flow

```text
Target role
  -> competency model
  -> concepts
  -> learning tasks
  -> question types
  -> canonical questions
  -> execution adapter (initially Anki)
  -> attempts/reviews
  -> diagnostics
  -> gaps
  -> learning actions
  -> reassessment
```

## Layers

### Domain

Core concepts independent of Anki or storage:
- Competency
- Concept
- LearningTask
- QuestionType
- Question
- Assessment
- Attempt
- Gap
- Mastery
- LearningAction

### Application

Use cases coordinating the domain:
- build question bank;
- generate execution artifacts;
- import attempts/reviews;
- calculate diagnostics;
- detect gaps;
- build learning backlog.

### Infrastructure

Adapters and persistence:
- Anki / AnkiConnect;
- YAML/JSON schemas;
- reporting/export formats;
- future CLI or web interfaces.

## Architectural rule

Domain semantics must not be derived from Anki card/note structures. Mapping direction is from the preparation model to Anki, not the reverse.

## Evolution rule

Start with the smallest vertical slice that can be executed end-to-end. Add automation, analytics, and richer models only after observed value or a concrete failure mode justifies them.
