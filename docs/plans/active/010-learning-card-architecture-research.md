# Plan 010 — Learning card architecture research

## Goal

Research an evidence-informed model for Interview Preparation learning cards before changing the Anki NoteType or visual design.

The research must distinguish:

- what kind of knowledge is being learned;
- what cognitive operation is expected;
- how evidence is elicited;
- what instructional support/scaffolding is provided;
- what representation is shown to the learner;
- how feedback is structured;
- how visual design reduces unnecessary cognitive load.

## Inputs

- current `LearningTask` / `QuestionType` model in `prep`;
- the `knowledge-graph` Concept Card model and its `kind + areas + facets` research;
- retrieval-practice / testing-effect research;
- feedback research;
- worked-example, self-explanation, expertise-reversal and guidance-fading research;
- programming-education research on tracing, explaining, code writing and Parsons problems;
- multimedia-learning research on coherence/signaling.

## Deliverables

- evidence summary with source links;
- candidate orthogonal axes for learning objects/cards;
- candidate programming-specific exercise/representation forms;
- candidate content-block model for front/back feedback;
- risks of combinatorial type explosion and proposed control mechanism;
- two prototype families: `Idempotency` and `asyncio`;
- explicit recommendation for the next implementation experiment, without yet accepting a permanent schema.

## Constraints

- research is evidence, not an accepted architecture decision;
- do not change current question-bank schema or Anki NoteType in this PR;
- do not collapse `KnowledgeKind`, `LearningTask`, `QuestionType`, representation, and scaffolding into one type axis;
- preserve the Interview language policy: conventional technical terms and identifiers in English, explanatory prose in Russian.

## Validation

- research claims have inspectable source links;
- conclusions distinguish established evidence from project hypotheses;
- docs link validation remains green;
- existing architecture/question/unit tests remain green.

## Status

In progress.
