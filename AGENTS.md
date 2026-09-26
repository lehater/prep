# AGENTS.md

## Purpose

This repository is the system of record for Prep. Chat history is transient working context.

## Canonical engineering knowledge

Harness is the only routing mechanism for current engineering meaning.

Before substantive engineering work:

1. read `.harness-version`;
2. read `.harness/core.yaml` and `.harness/engineering-graph.yaml`;
3. identify the affected capability and its prerequisites;
4. read only the registered canonical artifacts required by that closure;
5. persist durable semantic changes back through the owning Harness capability/artifact;
6. rerun Harness and repository validation.

`docs/README.md` is an index only. Every other engineering-knowledge file under `docs/` must be registered in `.harness/core.yaml`.

Do not use Git history, removed documentation, experimental branches, commit messages or implementation details to reconstruct product/domain/interface/architecture semantics unless the task explicitly asks for archaeology or evidence review.

Maintained reference implementations under `experiments/` may be reused as donor code only after checking them against current canonical contracts. Their tests prove implementation behavior, not current product/domain/interface/architecture meaning.

## Open decisions

Durable unresolved semantic decisions belong in the `questions` section of `.harness/core.yaml`.

Do not create parallel ADR, research, plan or design-document systems that can become an alternative source of truth. Implementation execution state belongs in the branch/PR/commit workflow unless Harness requires a canonical artifact.

## Canonical Harness

`lehater/harness` is pinned by `.harness-version`.

Prep owns:
- project Authority/Capability/Consumer topology in `.harness/engineering-graph.yaml`;
- canonical artifact realization and Questions in `.harness/core.yaml`;
- Authority applicability evidence in `.harness/authority-assessments.yaml`;
- semantic acceptance/currentness baseline in `.harness/semantic-baseline.yaml`;
- project engineering-coverage policy in `.harness/engineering-coverage.yaml`.

Harness owns generic validation, routing, semantic admission/currentness and target-state evaluation.

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

```text
python tools/bootstrap_harness.py
python tools/semantic_baseline.py
python tools/check_harness_integration.py
python tools/validate_docs.py
```
