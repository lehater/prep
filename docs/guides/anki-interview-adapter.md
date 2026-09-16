# Interview Preparation → Anki adapter

## Purpose

Define and operate the projection of canonical Interview Preparation Questions into Anki while preserving Clean/Hexagonal boundaries.

## Boundary

The application layer owns the use case and outbound capability. Anki remains an external system.

```text
canonical Question
      ↓
SyncInterviewQuestions
      ↓
StudySystem port
      ↓
InterviewAnkiStudySystem
      ↓
shared Anki infrastructure
      ↓
AnkiConnect
      ↓
Anki Desktop
```

The domain does not import Note, Card, Deck, NoteType, or AnkiConnect concepts.

## Implementation

```text
src/prep/interview/domain/                 domain Question/QuestionBank model
src/prep/interview/application/            use case + outbound StudySystem port
src/prep/interview/infrastructure/         JSON and Anki adapters
src/prep/infrastructure/anki/              shared domain-independent Anki mechanics
tools/sync_interview_questions.py          composition root / CLI
```

Dependency direction is checked by `python tools/validate_architecture.py` and CI.

## Responsibilities

### Interview application/use-case layer

Owns:

- selecting canonical Questions to publish;
- deriving LearningTask from QuestionType;
- creating the Interview-specific study projection;
- classifying/aggregating sync outcomes;
- preserving Question identity;
- later associating review observations with AssessmentRun context.

### Interview Anki adapter/mapping

Owns:

- mapping the study-system port model to Anki fields/templates/tags;
- selecting the configured deck;
- defining the `Prep Question v1` NoteType schema;
- invoking shared reconciliation primitives;
- comparing desired content with existing Anki notes;
- converting Anki-specific failures into port-level `created`, `updated`, `unchanged`, `conflict`, or `error` outcomes.

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

`QuestionId` is repository-owned stable identity and is the first field for Anki duplicate detection. Mutable prompt wording must not become identity.

`ContentVersion` is an adapter-generated deterministic hash of the rendered generated fields. It is not domain identity.

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

Back renders Prompt context plus reference answer, required points, and secondary sources.

Do not add card templates merely for presentation variants: every additional template creates another scheduled card and changes evidence semantics.

## QuestionType vs NoteType

`QuestionType` is domain metadata. Anki NoteType is adapter structure. They do not map 1:1.

Ordinary text interview Questions use one NoteType until interaction semantics genuinely require another one (for example cloze or typed-answer behavior).

## Tags

Generated tags are deterministic projections:

```text
prep
prep::concept::<ConceptId>
prep::question-type::<QuestionType>
prep::learning-task::<LearningTask>
```

Unknown/user tags are preserved. Stale generated classification tags are removed when canonical classification changes.

## Reconciliation

For each canonical Question:

```text
validate/load Question
  -> build study projection
  -> find by exact QuestionId
     ├─ absent    -> created
     ├─ equal     -> unchanged
     ├─ changed   -> updated
     └─ duplicate -> conflict
```

Normal updates mutate the existing note rather than recreate it, preserving note/card identity and scheduler history.

Deleting a Question from the repository does not automatically destroy Anki review history in v0.1.

## Dry-run

Dry-run is the default CLI mode and performs no Anki mutation.

With Anki Desktop running and AnkiConnect installed:

```bash
python tools/sync_interview_questions.py
```

The command reads canonical `questions/*.json`, inspects the local collection, and prints a JSON reconciliation plan.

## Apply

Explicitly enable writes:

```bash
python tools/sync_interview_questions.py --apply
```

Optional overrides:

```bash
python tools/sync_interview_questions.py \
  --endpoint http://127.0.0.1:8765 \
  --deck Prep \
  --questions "questions/*.json"
```

Expected first vertical-slice behavior for the current eight idempotency Questions:

```text
first apply  -> created: 8
second apply -> unchanged: 8
```

A changed prompt/reference answer should update the same note rather than create a duplicate.

## Local Anki requirement

The live endpoint is local to the machine running Anki Desktop. GitHub Actions and remote agents cannot reach the user's `127.0.0.1:8765` endpoint.

CI therefore verifies the same reconciliation behavior against a deterministic fake Anki backend; live verification is intentionally a local explicit step.

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
- no AnkiWeb credentials in repository files;
- live write requires explicit `--apply`;
- no hidden Anki sync after every mutation.

## Deferred next slice

After local question synchronization is verified, implement review-history ingestion behind a separate outbound/inbound boundary and introduce explicit `AssessmentRun` context for baseline/practice/reassessment classification.
