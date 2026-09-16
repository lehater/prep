# Plan 009 — Interview content language policy

## Goal

Fix a durable authoring rule for Interview Preparation cards: technical terminology and stable identifiers remain English-first, while learner-facing explanatory prose is Russian.

## Scope

- document the language policy in Interview question authoring guidance;
- add a short invariant to `AGENTS.md` so agents apply the rule when generating/editing interview content;
- keep identifiers, taxonomy values, technology/product names, API names, protocol names, code, field names, and established technical terms in English;
- allow an optional Russian translation immediately after an English term in parentheses when useful for comprehension;
- write prompts, reference answers, required points, and other explanatory prose in Russian;
- convert the current `idempotency` question bank to the policy without changing stable IDs;
- make identifier ASCII/English form machine-checkable where practical;
- keep the rule specific to Interview Preparation unless another bounded context explicitly adopts it.

## Validation

- all existing stable IDs remain unchanged;
- question-bank validator enforces ASCII identifier syntax;
- current question bank uses Russian explanatory prose while retaining English technical terminology;
- docs, architecture, question validation, and unit tests remain green.

## Status

In progress.
