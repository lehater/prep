# Plan 008 — Interview study-system sync

## Goal

Implement the first Clean/Hexagonal vertical slice from canonical Interview Preparation questions to a study-system port and an Anki adapter, without leaking Anki concepts into domain/application code.

## Scope

- add an Interview Preparation domain representation for canonical question-bank data;
- add `SyncInterviewQuestions` application use case;
- define an application-owned outbound study-system port;
- implement the port with an Interview-specific Anki adapter built on shared `prep.infrastructure.anki` primitives;
- add JSON question-bank/taxonomy loading at the infrastructure boundary;
- add a CLI composition root with `--dry-run` and write modes;
- classify sync outcomes as `created`, `updated`, `unchanged`, `conflict`, or `error`;
- add executable architecture-boundary validation;
- cover use case and adapter behavior with standard-library tests;
- do not add review-history ingestion or assessment-run semantics yet.

## Validation

- interview domain/application packages do not import `prep.infrastructure`;
- shared Anki infrastructure remains free of Interview vocabulary;
- dry-run performs no Anki mutations;
- first write creates canonical notes and a second equivalent write reports `unchanged` without duplicates;
- changed canonical content updates the existing note and preserves its identity/scheduling state;
- existing question/docs validators and shared Anki tests remain green;
- new architecture check runs in CI.

## Environment limitation

CI and this agent environment cannot access the user's local Anki Desktop endpoint. Live `127.0.0.1:8765` verification is therefore exposed as a CLI workflow and covered with deterministic fake-Anki tests in CI.

## Status

In progress.
