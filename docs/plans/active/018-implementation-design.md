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

## Remaining

- [ ] run cross-contract consistency review
- [ ] validate IMPLEMENTATION-DESIGN through pinned Harness
- [ ] register any blocking Questions
- [ ] close design phase and authorize platform-skeleton coding only

## Stop rule

Do not implement production feature slices until this plan closes.
