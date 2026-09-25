# Project knowledge base

`docs/` is the durable knowledge base for Prep. Chat history is working context, not project state.

## Read path

Use progressive disclosure:

```text
AGENTS.md
  -> .harness/core.yaml / engineering-graph.yaml / authority-assessments.yaml
  -> docs/README.md
  -> smallest relevant current canonical artifact set
  -> legacy evidence/code only when the task requires it
```

The current canonical artifact inventory is defined by `.harness/core.yaml`. Files outside that inventory may still contain useful evidence, previous decisions or implementation experiments, but they are not automatically current truth.

## Current canonical dependency path

```text
docs/vision/problem-space.md
  -> docs/vision/vision.md
  -> docs/vision/product-capabilities.md
  -> docs/architecture/context-map.md
  -> docs/architecture/model-context-map.md
  -> docs/domain/knowledge-model.md
  -> docs/domain/learning-design.md
  -> docs/domain/learner-model.md
  -> docs/application/application-design.md
  -> docs/application/user-journeys.md
  -> docs/interface/human-interface.md
     -> docs/interface/presentation-system.md
     -> docs/interface/screen-view-design.md
  -> docs/interface/machine-interface.md
  -> docs/architecture/import-consistency.md
  -> docs/architecture/system-architecture.md
  -> docs/architecture/data-design.md
```

This is an engineering-knowledge dependency graph, not a project-management stage sequence.

## Current interface frontier

`docs/interface/human-interface.md` contains the accepted task and interaction baseline.

`docs/interface/presentation-system.md` and `docs/interface/screen-view-design.md` are current canonical artifacts under active revalidation. Their existing navigation decomposition, catalogue/detail/editor assumptions and graph role must not be treated as final UX decisions until task-first IA is confirmed.

Do not use legacy React/3D-graph technical documents as authority for the current frontend.

## Current product slice

```text
learning target
  -> author/load subject knowledge and requirements
  -> organize concepts/relationships
  -> derive/use questions
  -> learn/retrieve through external runtime
  -> collect review observations/statistics
```

Statistics are recorded facts. Automatic `statistics -> learner state -> gaps -> priorities -> replanning` remains deferred.

## Artifact routing

| Information | Current authoritative location |
|---|---|
| problem, product intent, capabilities | `docs/vision/` canonical files in Core |
| strategic/model-context boundaries | `docs/architecture/context-map.md`, `model-context-map.md` |
| tactical domain semantics | `docs/domain/knowledge-model.md`, `learning-design.md`, `learner-model.md` |
| application orchestration and journeys | `docs/application/application-design.md`, `user-journeys.md` |
| human/machine interfaces | `docs/interface/` |
| consistency, system and persistence design | current canonical files under `docs/architecture/` |
| evidence/experiments/legacy solution material | `docs/research/`, non-Core legacy docs, code and experiments |
| current execution context | `docs/plans/active/` |

One durable fact should have one authoritative home; other artifacts should reference it rather than restating it.

## Harness

`lehater/harness` is pinned by `.harness-version`.

```text
.harness/engineering-graph.yaml   -> project producer/consumer engineering topology
.harness/core.yaml                -> current canonical artifact realization and Questions
.harness/authority-assessments.yaml -> Authority applicability evidence
docs/**                           -> project-owned semantic truth/evidence
```

When accepted upstream truth changes, use Harness impact/revalidation semantics before trusting downstream artifacts.
