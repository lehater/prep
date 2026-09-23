# Plan 018 — Breadth-first implementation design

## Goal

Turn the accepted technical architecture into exact coding contracts across the whole repository before production feature slices begin.

Harness consumer: `IMPLEMENTATION-DESIGN`.

## Required breadth

- [x] physical PostgreSQL schema/identity/revision/index contract
- [x] durable worker job/outbox state machine
- [x] auth/session/CSRF/bridge-token contract
- [x] HTTP endpoint/DTO/error/idempotency contract
- [x] Anki local bridge lease/work/review protocol
- [x] frontend routes/state/query/renderer boundary
- [x] Docker Compose/process/configuration contract
- [x] backend package/UnitOfWork/composition contract
- [x] executable acceptance fixtures
- [x] implementation-ready repository shape and first skeleton milestone

## Review

- [x] cross-contract consistency review
- [x] implementation freedoms separated from architecture decisions
- [x] no blocking semantic Question found
- [x] IMPLEMENTATION-DESIGN validated COMPLETE through pinned Harness
- [x] platform-skeleton coding authorized after green CI

## Stop rule

Do not implement production feature slices until this plan closes.


## Evidence

- [Implementation Design Consistency Review](../../research/implementation-design-consistency-review.md)

## Status

Complete.


Final validation: GitHub Actions run `35888147120` passed all design consumers, documentation/architecture validators and unit tests.
