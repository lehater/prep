# Interview Preparation → Anki adapter

## Purpose

Define the first projection of canonical Interview Preparation Questions into Anki while preserving Clean/Hexagonal boundaries.

## Boundary

The application layer owns the use case and outbound capability. Anki remains an external system.

```text
canonical Question
      ↓
SyncInterviewQuestions
      ↓
StudySystemPort
      ↓
InterviewAnkiAdapter
      ↓
shared Anki infrastructure
      ↓
AnkiConnect
      ↓
Anki Desktop
```

The domain does not import Note, Card, Deck, NoteType, or AnkiConnect concepts.

## Responsibilities

### Interview application/use-case layer

Owns:

- selecting canonical Questions to publish;
- deriving LearningTask from QuestionType;
- deciding the semantic study projection;
- classifying sync outcomes for the use case;
- preserving Question identity;
- later associating review observations with AssessmentRun context.

### Interview Anki adapter/mapping

Owns:

- mapping the study-system port model to Anki fields/templates/tags;
- selecting the configured deck;
- defining the `Prep Question v1` NoteType schema;
- invoking shared reconciliation primitives;
- resolving Anki note/card IDs when required;
- converting Anki-specific failures into port-level results/errors.

### Shared Anki infrastructure

Owns transport, generic NoteType reconciliation, external-ID lookup, note upsert, and media mechanics. See [`anki-infrastructure.md`](anki-infrastructure.md).

## Initial Anki representation

Default deck:

```text
Prep
```

Initial NoteType:

```text
Prep Question v1
```

Fields in order:

1. `QuestionId`
2. `Prompt`
3. `ReferenceAnswer`
4. `RequiredPoints`
5. `ConceptId`
6. `QuestionType`
7. `LearningTask`
8. `Sources`
9. `ContentVersion`

`QuestionId` is repository-owned stable identity and should be the first field for Anki duplicate detection. Mutable prompt wording must not become identity.

## Card shape

One canonical Question initially produces one Anki Note and one scheduled Card.

```text
1 Question
  -> 1 Note
  -> 1 Card
```

Front:

```html
<div class="prep-prompt">{{Prompt}}</div>
```

Back renders:

```text
Prompt
ReferenceAnswer
RequiredPoints
Sources (secondary)
```

Do not add additional card templates merely for presentation variants: every card template changes scheduling/evidence semantics.

## QuestionType vs NoteType

`QuestionType` is domain metadata.

Anki NoteType is adapter structure.

They do not map 1:1. Ordinary text interview Questions use one NoteType until interaction semantics genuinely require another one (for example cloze or typed-answer behavior).

## Tags

Generated tags are deterministic projections:

```text
prep
prep::concept::<ConceptId>
prep::question-type::<QuestionType>
prep::learning-task::<LearningTask>
```

Tags do not define the domain model.

## Reconciliation

For each canonical Question:

```text
validate Question
  -> build study projection
  -> find by exact QuestionId
     ├─ absent    -> created
     ├─ one       -> updated / unchanged
     └─ duplicate -> conflict
```

Deleting a Question from the repository must not automatically destroy Anki review history in v0.1.

## Local Anki edits

Generated semantic content is repository-owned and may be overwritten by reconciliation.

User scheduling/review state is Anki-owned and must be preserved by normal content updates.

## Baseline vs later review

Anki review history alone does not know whether an event belongs to baseline, practice, or reassessment.

A future `AssessmentRun` application concept must provide that context before raw review observations become domain Attempts.

## Security

Initial rules:

- AnkiConnect endpoint defaults to `http://127.0.0.1:8765`;
- no remote binding by default;
- local API key/configuration only when required;
- no AnkiWeb credentials in repository files;
- explicit sync operation rather than hidden sync after every write.

## Next implementation slice

```text
Question bank
  -> SyncInterviewQuestions use case
  -> outbound port
  -> InterviewAnkiAdapter
  -> shared Anki primitives
  -> dry-run
  -> sync eight idempotency Questions
  -> second sync produces no duplicates
```
