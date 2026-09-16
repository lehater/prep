# Interview question authoring

## Purpose

Define the machine-readable format and authoring rules for Interview Preparation question banks.

The format is domain/application data and remains independent of Anki.

## Source-of-truth split

- `model/question-taxonomy.json` — executable registry of canonical `LearningTask` and `QuestionType` identifiers/mapping;
- `docs/domain/interview-question-types.md` — human-readable semantics;
- `questions/*.json` — canonical question-bank data;
- `tools/validate_questions.py` — executable structural/project invariant checks.

If executable registry values and prose disagree, fix both in the same pull request. Accepted ADRs govern model boundaries.

## Bank structure

```json
{
  "version": "0.1",
  "bank_id": "backend.idempotency",
  "title": "Idempotency",
  "concepts": [
    {
      "id": "backend.idempotency",
      "title": "Idempotency",
      "sources": ["https://example.org/source"]
    }
  ],
  "questions": []
}
```

### `version`

Format version. v0.1 validators accept exactly `0.1`.

### `bank_id`

Stable identifier for a question-bank file. Prefer lowercase dot-separated domain naming.

### `concepts`

Concepts declared locally by the bank. Each Question references one declared `concept_id`.

Source URLs are provenance for question content, not runtime dependencies.

## Question structure

```json
{
  "id": "backend.idempotency.explain.001",
  "concept_id": "backend.idempotency",
  "question_type": "explain",
  "prompt": "Why is idempotency important after a timeout?",
  "assessment": {
    "reference_answer": "...",
    "required_points": ["..."]
  }
}
```

### Stable `id`

Recommended convention:

```text
<concept-id>.<question-type>.<sequence>
```

The identifier is identity, not display text. Improving wording does not by itself justify changing identity.

### `question_type`

Must exist in `model/question-taxonomy.json`. Primary LearningTask is derived from QuestionType and is not duplicated per Question.

### `prompt`

Learner-facing prompt. Classify it by the reasoning/evidence required rather than a particular verb.

### `assessment.reference_answer`

A strong reference answer used for self-checking, review, future assisted assessment, or adapter rendering. It is not the only acceptable wording.

### `assessment.required_points`

Observable semantic points for materially correct evidence. Keep them separate from prose to avoid exact-text assessment.

## Authoring algorithm

```text
Concept
  -> intended LearningTask
  -> QuestionType
  -> prompt
  -> reference answer
  -> required evidence points
  -> provenance
  -> validation
```

## Rules

1. Start from the target Concept and intended LearningTask, then choose QuestionType.
2. Require production of evidence without hidden answer cues.
3. Keep one primary LearningTask per Question in v0.1.
4. Prefer a small number of high-value probes over wording variants.
5. Use `required_points` for material correctness, not preferred phrasing.
6. Link authoritative sources for technical claims when practical.
7. Do not encode Anki deck/note/template/review semantics in canonical Question data.
8. Do not encode computed mastery in question files.

## Validation

Run:

```bash
python tools/validate_questions.py
```

Current checks cover parseability, supported versions, taxonomy references, stable/unique IDs, concept references, prompt/assessment evidence, and bootstrap coverage of canonical QuestionTypes.

## Deferred until concrete need

- response mode (`oral`, `text`, `code`, `diagram`);
- difficulty;
- estimated answer time;
- secondary LearningTasks;
- execution-adapter mapping;
- rubric levels;
- mastery state;
- prerequisite graph.
