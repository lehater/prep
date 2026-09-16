# Question bank format v0.1

## Purpose

Define the smallest machine-readable format required to author, validate, and later export interview-preparation questions.

The format is intentionally independent of Anki. Anki mapping will consume these artifacts rather than define them.

## Source-of-truth split

- `model/question-taxonomy.json` — executable registry of canonical `LearningTask` and `QuestionType` identifiers and their mapping.
- `docs/question-types.md` — human-readable semantics and authoring guidance for the taxonomy.
- `questions/*.json` — canonical question-bank data.
- `tools/validate_questions.py` — executable structural/project invariant checks.

If executable registry values and prose documentation disagree, fix the inconsistency in the same pull request. Accepted ADRs still govern the meaning and boundaries of the model.

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

Stable identifier for a question-bank file. Use lowercase dot-separated domain naming where practical.

### `concepts`

Concepts declared locally by the bank. Each Question must reference one declared `concept_id`.

`source` URLs are evidence/provenance for question content, not runtime dependencies.

## Question structure

```json
{
  "id": "backend.idempotency.explain.001",
  "concept_id": "backend.idempotency",
  "question_type": "explain",
  "prompt": "Why is idempotency important after a timeout?",
  "assessment": {
    "reference_answer": "...",
    "required_points": [
      "..."
    ]
  }
}
```

### `id`

Stable globally unique question identifier.

Recommended convention:

```text
<concept-id>.<question-type>.<sequence>
```

The identifier is identity, not display text. Do not change it merely because wording is improved.

### `question_type`

Must exist in `model/question-taxonomy.json`. The primary `LearningTask` is derived from the QuestionType and is therefore not duplicated on each Question.

This prevents drift such as:

```text
question_type = diagnose
learning_task = recall
```

### `prompt`

The learner-facing question. Classification is based on required reasoning/evidence rather than the presence of a particular verb.

### `assessment.reference_answer`

A strong reference answer used for self-checking, review, future LLM-assisted assessment, or adapter rendering.

It is not assumed to be the only acceptable wording.

### `assessment.required_points`

Observable semantic points that a materially correct answer should cover. These points are deliberately separate from the prose reference answer so later assessment can reason about evidence rather than exact text matching.

## Authoring rules

1. Start from the target Concept and intended LearningTask, then choose the QuestionType.
2. Write the prompt so the learner must produce the intended evidence without hidden answer cues.
3. Keep one primary LearningTask per Question in v0.1.
4. Prefer a small number of high-value questions over exhaustive wording variants.
5. Use `required_points` for material correctness, not trivia or preferred phrasing.
6. Link authoritative sources for technical claims when practical.
7. Do not encode Anki note type, deck, template, review interval, or button semantics in canonical question data.
8. Do not encode computed mastery in question files.

## Validation

Run:

```bash
python tools/validate_questions.py
```

Current checks include:
- JSON parseability;
- supported model version;
- non-empty taxonomy registry;
- every QuestionType maps to a known LearningTask;
- non-empty bank/concept/question identities;
- unique concept IDs within a bank;
- globally unique question IDs across banks;
- known concept and QuestionType references;
- prompt and assessment evidence presence;
- coverage of all canonical QuestionTypes by the current sample banks.

The final coverage check is a bootstrap invariant for the vertical slice, not a permanent rule that every future individual bank must contain all QuestionTypes.

## Deferred fields

The following are intentionally absent from v0.1 until a concrete adapter/use case requires them:
- response mode (`oral`, `text`, `code`, `diagram`);
- difficulty;
- estimated answer time;
- secondary LearningTasks;
- Anki deck/note/card mapping;
- assessment score/rubric levels;
- mastery state;
- prerequisite graph.
