# AGENTS.md

## Purpose

This repository is the system of record for Prep. Chat history is transient working context.

## Harness Consumer API v1

This repository uses the Harness Consumer Surface with `consumer_api: v1`.

Before Harness-controlled engineering work:

1. Run `python .harness/harnessw.py sync`.
2. Treat the printed directory as the active pinned Harness Consumer Pack.
3. From that directory invoke the typed procedure router through `python -m harness.application.skill_router ...`.
4. Load the returned `instruction_contracts` before consuming project/tool payloads, then read the returned `SKILL.md`.
5. Do not discover Harness procedures from remote GitHub links, the vendored legacy `harness/` directory, or a different checkout. Development/dogfooding uses only explicit `--dev-source`.

The project binding is `.harness/harness-binding.json`: tooling metadata, not project semantic truth. `.harness-version` is retained only as a legacy compatibility pin for old repository tooling and is not a procedure-discovery surface.

## Canonical engineering knowledge

Harness is the only routing mechanism for current engineering meaning.

Prep owns:
- project Authority/Capability/Consumer topology in `.harness/engineering-graph.yaml`;
- canonical artifact realization and Questions in `.harness/core.yaml`;
- Authority applicability evidence in `.harness/authority-assessments.yaml`;
- semantic acceptance/currentness evidence in project Harness records;
- project engineering-coverage policy in `.harness/engineering-coverage.yaml`.

Harness owns generic validation, routing, semantic admission/currentness, Engineering Coverage, target-state evaluation and materialization mechanisms.

`docs/README.md` is an index only. Every engineering-knowledge file under `docs/` that carries canonical meaning must be registered through the active Harness/Core realization.

Do not create parallel ADR, research, plan, workflow-state or design-document systems that can become an alternative source of truth. Candidate artifacts may exist only where the routed Harness procedure explicitly permits them; accepted knowledge must be materialized through the owning CanonicalArtifact.

Do not use Git history, removed documentation, experimental branches, commit messages or implementation details to reconstruct product/domain/interface/architecture semantics unless the routed procedure explicitly admits them as evidence.

## Architecture discipline

Use DDD, Clean Architecture and Hexagonal Architecture where applicable.

Primary dependency direction:

```text
interface -> application -> domain
infrastructure -> application ports
```

Frameworks, persistence, external study runtimes, renderers and UI projections do not define domain semantics.

## Development workflow

Work on the branch selected for the task. Do not merge or squash into `main` without explicit user authorization.

Commit coherent semantic blocks. When canonical upstream knowledge changes, revalidate affected downstream capabilities through Harness instead of copying assumptions across documents.

## Validation

Use the active Consumer Pack returned by `.harness/harnessw.py sync` and the routed Harness operations/artifact procedures. Repository-specific tests remain downstream evidence and do not replace Harness semantic closure.

Do not treat Engineering Graph `COMPLETE`, Graph Doctor health or green repository-fast checks as sufficient semantic acceptance. Before declaring a Harness-controlled semantic branch complete, verify the selected Consumer closure against the current atomically published `.harness/project-publication.yaml`; affected capabilities must have matching ACCEPTED semantic admission and CURRENT lifecycle assertions. Final large-branch validation still uses the routed/heavy Harness revalidation path.
