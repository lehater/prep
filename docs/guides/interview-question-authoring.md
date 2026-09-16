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

## Language policy

Interview Preparation cards use an English-first technical vocabulary with Russian explanatory prose.

### English

Keep the following in English:

- stable identifiers and machine-readable values;
- technical terms and established names;
- technology, product, protocol, standard, library, framework, API, method, field, header, command, pattern, and algorithm names;
- code, paths, SQL, configuration fragments, and literals;
- canonical abbreviations and acronyms.

Examples:

```text
idempotency
MVCC
race condition
unique constraint
transactional outbox
at-least-once delivery
PostgreSQL
Kafka
AnkiConnect
POST /payments
QuestionId
```

Do not replace an established English technical term with a Russian-only equivalent when the English term is what the learner is expected to recognize in documentation, code, interviews, or professional communication.

### Russian

Write learner-facing explanatory prose in Russian:

- question wording around the technical terms;
- explanations and causal reasoning;
- reference answers;
- `required_points`;
- hints or explanatory labels if they are added later.

Example:

```text
Почему `idempotency` особенно важна, когда client повторяет request после timeout?
```

A natural Russian sentence is preferred; only the actual technical terminology needs to remain English.

### Optional translation

A Russian translation may follow the English term in parentheses when it improves comprehension:

```text
idempotency (идемпотентность)
race condition (состояние гонки)
```

Rules:

1. English term comes first.
2. Translation is supplementary and never replaces the canonical English term.
3. Prefer adding the translation at the first useful occurrence rather than repeating it everywhere on the same card.
4. Do not translate product names, code identifiers, API paths, protocol tokens, field names, or commands.

### Identity language

All machine identifiers remain English/ASCII regardless of card prose language.

Examples:

```text
backend.idempotency
backend.idempotency.diagnose.001
scenario-apply
choose-justify
```

The validator enforces lowercase ASCII identifier syntax where the current schema exposes stable IDs.

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
  "prompt": "Почему `idempotency` важна после timeout?",
  "assessment": {
    "reference_answer": "После timeout client может не знать, был ли первый request успешно обработан...",
    "required_points": ["client не знает результат первого request"]
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

Learner-facing prompt. Classify it by the reasoning/evidence required rather than a particular verb. Follow the language policy above: Russian explanatory prose, English technical vocabulary.

### `assessment.reference_answer`

A strong reference answer used for self-checking, review, future assisted assessment, or adapter rendering. It is not the only acceptable wording. Explanatory prose is Russian; technical terms remain English-first.

### `assessment.required_points`

Observable semantic points for materially correct evidence. Keep them separate from prose to avoid exact-text assessment. Write them as concise Russian explanatory statements while preserving English technical terms.

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
7. Follow the Interview language policy: English technical vocabulary and identifiers; Russian explanatory prose.
8. Do not encode Anki deck/note/template/review semantics in canonical Question data.
9. Do not encode computed mastery in question files.

## Validation

Run:

```bash
python tools/validate_questions.py
```

Current checks cover parseability, supported versions, taxonomy references, lowercase ASCII stable IDs, concept references, prompt/assessment evidence, and bootstrap coverage of canonical QuestionTypes.

The validator intentionally does not try to infer whether arbitrary prose is Russian or whether a phrase is a technical term. That distinction is semantic and remains an authoring/review rule.

## Deferred until concrete need

- response mode (`oral`, `text`, `code`, `diagram`);
- difficulty;
- estimated answer time;
- secondary LearningTasks;
- execution-adapter mapping;
- rubric levels;
- mastery state;
- prerequisite graph.
