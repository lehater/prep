# Prep canonical engineering knowledge

The current engineering meaning of Prep is defined only by the artifacts registered in `.harness/core.yaml` and their dependency topology in `.harness/engineering-graph.yaml`.

This file is an index, not a semantic authority.

## Read order

1. `AGENTS.md`
2. `.harness-version`
3. `.harness/core.yaml`
4. `.harness/engineering-graph.yaml`
5. the smallest set of Core artifacts required by the affected capability

Do not infer current product, domain, interface or architecture semantics from Git history, old branches, experiments, commit messages or removed documentation.

## Canonical rule

Every project-owned engineering-knowledge file under `docs/`, except this index, must be registered as an artifact in `.harness/core.yaml`.

If durable engineering meaning is needed, either:
- add or update the appropriate Harness capability and canonical artifact; or
- keep the information out of `docs/`.

Unresolved semantic decisions belong in the `questions` section of `.harness/core.yaml`.

## Current dependency topology

The normative dependency graph is machine-readable in:

- `.harness/engineering-graph.yaml`
- `.harness/core.yaml`
- `.harness/semantic-baseline.yaml`

Harness controls ownership, dependencies, currentness and closure. Canonical project artifacts supply the Prep-specific meaning.
