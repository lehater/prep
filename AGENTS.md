# AGENTS.md

## Purpose

This repository is the system of record for Prep. Chat history is working context, not authoritative project state.

Prep is currently undergoing Harness-guided revalidation. Legacy graph-centered, Anki-centered and implementation-first artifacts may be retained as evidence, but they are not premises for current canonical design unless they are explicitly wired into `.harness/core.yaml`.

## Required read order

Before substantive engineering work:

1. Read this file.
2. Read `.harness-version`, `.harness/core.yaml`, `.harness/engineering-graph.yaml` and `.harness/authority-assessments.yaml` when work creates or changes engineering knowledge or crosses an Authority boundary.
3. Read `docs/README.md` and the smallest relevant current canonical artifact set.
4. Read applicable current ADRs only when the canonical artifact depends on them.
5. For multi-step work, create or update the active plan under `docs/plans/active/`.

Use progressive disclosure. Do not recover old solution assumptions merely because legacy files or code still exist.

## Canonical Harness

`lehater/harness` is the normative engineering-knowledge process. `.harness-version` pins the immutable Harness revision used locally and in CI.

Prep owns:

- project semantic truth in current canonical `docs/**` artifacts;
- project-specific Authority/Capability/Consumer topology in `.harness/engineering-graph.yaml`;
- canonical artifact realization and unresolved Questions in `.harness/core.yaml`;
- project Authority applicability evidence in `.harness/authority-assessments.yaml`.

Harness owns generic graph/core validation, applicability semantics, routing and target-state evaluation. Do not create project-specific stages, gates or a second Harness evaluator.

Bootstrap/validate:

```text
python tools/bootstrap_harness.py
python tools/check_harness_integration.py
```

## Current engineering frontier

Current canonical knowledge has been re-established through Product, strategic/tactical domain design, Application Design, granular Human/Machine Interface, Import Consistency, Interface/Presentation Verification, System Architecture and Data Design.

The current frontier is a **mock/static frontend prototype** used to exercise the accepted Interface Topology and Screen/View contracts before production backend/frontend implementation is committed.

Use `docs/interface/interface-topology.yaml`, `docs/interface/screen-view-design.md` and `docs/interface/presentation-system.md` as semantic inputs. The prototype must cover the accepted Learning/Curation task contexts and material view/frame subjects, but prototype routing, component structure and provider/library choices remain downstream realization details.

This prototype is evidence, not a substitute for a production frontend implementation Consumer. Before treating frontend code as production closure, declare the appropriate implementation Consumer and satisfy the applicable Harness frontend architecture/component/verification/test/implementation-design dependencies.

Knowledge Graph and 3D visualization remain optional projections. They are accepted only when they improve a concrete user task; core tasks and KnowledgeNode access must remain possible without graph manipulation. Existing graph experiments are implementation evidence only and may be reused selectively when they conform to current canonical semantics.

## Current product constraints

- first version is a browser-based single-user application;
- frontend and backend are separate Docker containers;
- canonical data survive ordinary restarts;
- multi-user/auth/tenant isolation, backup/restore/PITR and HA/failover are future scope;
- automatic interpretation of review statistics into mastery, gaps, priorities or replanning is deferred;
- Anki is the first external study runtime;
- backend integrates through `ExternalStudyRuntimePort -> AnkiConnectAdapter`; browser does not call AnkiConnect directly.

## Source-of-truth rules

1. `.harness/core.yaml` identifies current canonical artifacts and unresolved semantic Questions.
2. Current canonical artifacts own product/domain/application/interface/architecture semantics.
3. Current accepted ADRs may constrain those artifacts where explicitly referenced.
4. Legacy docs, code, tests, screenshots and experiments are evidence unless current canonical truth explicitly adopts them.
5. Active plans describe current work but do not override canonical semantic truth.

When upstream canonical knowledge changes, use Harness dependency/lifecycle rules to revalidate affected downstream knowledge rather than preserving consistency by importing old assumptions upward.

## Architecture discipline

Use DDD, Clean Architecture and Hexagonal Architecture where applicable.

Primary dependency rule:

```text
interface -> application -> domain
infrastructure -> application ports
```

Current semantic boundaries include:

- Knowledge Model owns reusable subject semantics;
- Learning Design owns Requirements, LearningTargets, Questions and target-relative learning design;
- Learner Model owns Question-level ReviewObservations/statistics only;
- external runtimes and UI projections do not define canonical domain semantics.

## Development workflow

Work only on the branch explicitly selected by the user/task. Do not merge or squash into `main` without explicit user authorization.

Commit coherent semantic blocks. Validate Harness realization and affected project checks after material changes.
