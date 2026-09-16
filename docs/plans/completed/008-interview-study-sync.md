# Plan 008 — Interview study-system sync

## Goal

Implement the first Clean/Hexagonal vertical slice from canonical Interview Preparation questions to a study-system port and an Anki adapter, without leaking Anki concepts into domain/application code.

## Completed work

- added Interview domain types: `Concept`, `Question`, `QuestionAssessment`, `QuestionBank`;
- added application-owned `StudySystem` port and `SyncInterviewQuestions` use case;
- added JSON infrastructure adapters for canonical question-bank and taxonomy files;
- added `InterviewAnkiStudySystem` over shared Anki reconciliation primitives;
- added deterministic Anki field/tag projection with repository-owned `QuestionId` identity;
- added created/updated/unchanged/conflict/error reconciliation;
- preserved unknown/user tags and removed stale generated classification tags;
- added safe-by-default CLI: dry-run unless `--apply` is explicit;
- added `tools/validate_architecture.py` and wired it into CI;
- added deterministic fake-Anki vertical-slice tests;
- updated architecture and operational documentation.

## Validation

GitHub Actions run `35110381497` passed:

```text
documentation links : 42 Markdown files resolved
architecture         : passed
question model       : 8 question types, 1 bank, 8 questions
unit tests           : 14 passed
```

Behavior covered by tests:

- application projection contains no Anki concepts;
- dry-run performs no Anki mutations;
- first apply creates eight canonical idempotency notes;
- second equivalent apply reports eight unchanged notes;
- changed canonical content updates the existing note instead of creating a new identity;
- duplicate `QuestionId` is surfaced as a conflict;
- existing shared Anki tests continue to pass.

## Environment limitation

Remote CI/agents cannot access the user's local Anki Desktop `127.0.0.1:8765` endpoint. Live verification remains an explicit local operation:

```bash
python tools/sync_interview_questions.py
python tools/sync_interview_questions.py --apply
```

## Deferred

- live local Anki verification;
- review-history ingestion;
- `AssessmentRun` semantics for baseline/practice/reassessment;
- mastery/gap calculation from imported attempts.

## Status

Completed.
