# Plan 009 — Interview content language policy

## Goal

Fix a durable authoring rule for Interview Preparation cards: technical terminology and stable identifiers remain English-first, while learner-facing explanatory prose is Russian.

## Completed work

- documented the language policy in `docs/guides/interview-question-authoring.md`;
- added the Interview-specific language invariant to `AGENTS.md`;
- kept identifiers, taxonomy values, technology/product names, API names, protocol names, code identifiers, and established technical terms in English;
- allowed optional Russian translation after an English term in parentheses;
- defined prompts, reference answers, required points, and other learner-facing explanatory prose as Russian;
- converted the current `idempotency` bank without changing stable IDs;
- added lowercase English/ASCII machine-ID validation to `tools/validate_questions.py`;
- kept the policy scoped to Interview Preparation rather than applying it to English Listening or repository documentation.

## Validation

GitHub Actions run `35150707293` passed all repository checks after the policy and bank changes.

Key invariants:

- existing stable IDs are unchanged;
- machine identifiers are validated as lowercase ASCII with `.` / `-` separators;
- current card prose is Russian while technical vocabulary remains English-first;
- semantic term/prose classification remains an authoring/review responsibility rather than a brittle automatic language check.

## Status

Completed.
