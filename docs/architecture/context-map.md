# Context Map

## Purpose

Define semantic ownership for the graph-centered multi-domain learning platform without implying service/process boundaries.

## Platform bounded contexts

### Knowledge Graph

Owns canonical knowledge identity, first-class semantic relations, classification and supporting evidence. It controls semantic admission and does not own learner progress or UI layout.

### Learning Coordination

Owns learner target scopes, learning plans, desired publication state, imported learning evidence and learner-specific progress/gap projections onto graph identities.

Learning Coordination does not define subject-specific Question, ListeningSegment or future mathematics exercise semantics.

## Subject bounded contexts

### Interview Preparation

Owns technical-interview semantics including competencies, concepts as interview targets, LearningTasks, QuestionTypes, Questions, Attempts, Assessments and interview gaps.

Where interview concepts correspond to canonical Knowledge Graph nodes, integration uses stable identities rather than copying semantic truth.

### English Listening

Owns media provenance, transcript occurrences, lexical targets, ASR/alignment policy, ListeningSegments and playback/audio policy.

Lexical concepts may reference graph knowledge where useful; acoustic segments and source coordinates remain local to English Listening.

## Relationship rules

```text
Knowledge Graph
    ^
    | canonical knowledge references
    |
Interview Preparation ----\
                           > Learning Coordination -> Study-system adapters
English Listening --------/
```

- Subject contexts do not import each other's domain entities.
- Learning Coordination integrates through explicit references/projections rather than owning subject learning objects.
- Knowledge Graph semantic truth is independent of Anki note/card/deck structures.
- A bounded context is not automatically a deployable service.

## External systems

- Anki / AnkiConnect;
- ffmpeg;
- Whisper / other ASR providers;
- source files/documents and future connected sources;
- LLM/model providers;
- future web/desktop delivery mechanisms.

These are external mechanisms accessed through ports/adapters where the application needs them.

## Shared-abstraction rule

Do not create a universal Exercise/StudyItem merely because multiple contexts publish to Anki. Shared learning semantics are limited to target scope, plan, publication intent/evidence and graph-level progress until further equivalence is demonstrated.
