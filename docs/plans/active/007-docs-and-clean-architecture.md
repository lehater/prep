# Plan 007 — Documentation system and Clean Architecture boundaries

## Goal

Turn `docs/` into the durable project knowledge base and make DDD + Clean/Hexagonal Architecture explicit before further feature work.

## Scope

- add `docs/README.md` as the documentation map and artifact-routing contract;
- normalize durable docs into `vision/`, `architecture/`, `domain/`, `guides/`, `decisions/`, `research/`, and `plans/`;
- define the Context Map for Interview Preparation and English Listening;
- define Clean/Hexagonal dependency rules and port/adapter ownership;
- record an ADR adopting DDD for domain boundaries and Clean/Hexagonal Architecture for dependency direction;
- update `AGENTS.md`, root `README.md`, and `ARCHITECTURE.md` to use progressive disclosure through `docs/README.md`;
- preserve executable model/data paths unless moving them provides concrete value;
- do not refactor production Python package layout in this PR.

## Validation

- Anki is described as an external system reached through infrastructure adapters, not as a domain/application layer;
- bounded-context domain vocabulary remains isolated;
- ports are owned by the core/use case that needs them, not by adapters;
- documents have a clear artifact class and authoritative location;
- stale root-doc links are removed or replaced with compatibility pointers;
- existing question validation and unit tests remain green.

## Status

In progress.
