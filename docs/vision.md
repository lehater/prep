# Vision

## Problem

Technical interview preparation easily fragments across chats, notes, courses, ad-hoc question lists, and Anki decks. This makes progress hard to measure and causes the preparation process itself to be repeatedly reinvented.

## Goal

Build a repository-centered, adaptive preparation system that:
- derives preparation scope from target roles and interview expectations;
- diagnoses current knowledge before broad study;
- models concepts separately from the questions used to test them;
- uses different question types to test recall, understanding, comparison, application, debugging, trade-offs, and design;
- uses Anki initially as the primary execution interface for repeated practice;
- records evidence of weak areas and turns it into a learning backlog;
- keeps research, decisions, question data, and automation reproducible and versioned.

## Operating principle

The repository is the system of record. Chat sessions and agents operate on it but do not replace it.

## Initial outcome

The first useful vertical slice is:

```text
question-type model
  -> small canonical question set
  -> Anki representation
  -> baseline attempt
  -> observable gap
```

The project should prove this slice before building a larger platform.

## Non-goals for the initial stage

- building a full learning management system;
- implementing every interview format;
- generating hundreds of questions before validating the model;
- coupling the domain model to Anki internals.
