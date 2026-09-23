# Project knowledge base

`docs/` is the durable knowledge base for `prep`. Chat history is working context, not project state.

## Read path

Use progressive disclosure:

```text
AGENTS.md
  -> .harness/core.yaml when engineering ownership/coverage matters
  -> docs/README.md
  -> relevant canonical artifact
  -> code/data only when the task requires it
```

## Top-level design path

- [`vision/problem-space.md`](vision/problem-space.md) — problems and constraints;
- [`vision/vision.md`](vision/vision.md) — product intent;
- [`vision/product-capabilities.md`](vision/product-capabilities.md) — product capability surface;
- [`architecture/context-map.md`](architecture/context-map.md) — bounded-context ownership;
- [`domain/knowledge-graph.md`](domain/knowledge-graph.md) — semantic nodes/classification/cluster boundary;
- [`domain/relation-registry.md`](domain/relation-registry.md) — controlled edge semantics;
- [`domain/source-evidence.md`](domain/source-evidence.md) — provenance integration contract;
- [`domain/graph-admission.md`](domain/graph-admission.md) — semantic mutation/admission policy;
- [`domain/graph-lifecycle.md`](domain/graph-lifecycle.md) — revision/rename/merge/retirement guarantees;
- [`domain/learning-platform.md`](domain/learning-platform.md) — shared learning-coordination boundary;
- [`domain/learning-targets-plans.md`](domain/learning-targets-plans.md) — TargetScope/Curriculum/LearningPlan semantics;
- [`domain/learning-state.md`](domain/learning-state.md) — learner evidence and graph overlays;
- [`domain/graph-subject-integration.md`](domain/graph-subject-integration.md) — subject-context to canonical graph mapping;
- [`domain/learner-boundary.md`](domain/learner-boundary.md) — personal/shared state separation;
- [`architecture/user-journeys.md`](architecture/user-journeys.md) — top-level learner/operator journeys;
- [`architecture/quality-drivers.md`](architecture/quality-drivers.md) — architecture-significant qualities;
- [`architecture/graph-interface.md`](architecture/graph-interface.md) — graph-first interaction concept;
- [`architecture/system-landscape.md`](architecture/system-landscape.md) — black-box system landscape.

These artifacts are wired into `.harness/core.yaml`; `.harness/engineering-graph.yaml` derives the `TOP-LEVEL-DESIGN` closure.

## Logical design path

- [`application/logical-use-cases.md`](application/logical-use-cases.md) — application command/query responsibilities;
- [`application/knowledge-ingestion.md`](application/knowledge-ingestion.md) — staged ingestion/admission workflow;
- [`application/study-runtime.md`](application/study-runtime.md) — publication/reconciliation/evidence workflow;
- [`data/logical-data-ownership.md`](data/logical-data-ownership.md) — authoritative state owners and atomic boundaries;
- [`data/graph-read-model.md`](data/graph-read-model.md) — bounded graph query/read requirements;
- [`architecture/access-privacy.md`](architecture/access-privacy.md) — logical access/privacy policy;
- [`architecture/logical-interfaces.md`](architecture/logical-interfaces.md) — command/query/port boundaries;
- [`architecture/consistency-reliability.md`](architecture/consistency-reliability.md) — consistency/failure semantics;
- [`architecture/logical-system-boundaries.md`](architecture/logical-system-boundaries.md) — logical module responsibilities;
- [`architecture/operability.md`](architecture/operability.md) — diagnostic/operational semantics;
- [`verification/logical-verification-strategy.md`](verification/logical-verification-strategy.md) — evidence obligations.

Harness consumer `LOGICAL-DESIGN` requires this layer to remain structurally complete.

## Artifact routing

| Information | Authoritative location |
|---|---|
| purpose, problem, scope, product capabilities | `docs/vision/` |
| system structure, journeys, UI/quality boundaries | `docs/architecture/` |
| bounded-context concepts/invariants | `docs/domain/` |
| durable architectural decisions | `docs/decisions/` |
| evidence/experiments/source reviews | `docs/research/` |
| active/completed execution state | `docs/plans/` |
| operational/authoring instructions | `docs/guides/` |

One durable fact has one authoritative home; other artifacts link to it.

## Harness

`lehater/harness` is pinned by `.harness-version`. Prep uses direct declaration because it does not currently have another canonical machine-readable artifact graph.

```text
.harness/engineering-graph.yaml -> producer/consumer engineering policy
.harness/core.yaml              -> accepted canonical artifact realization
docs/**                         -> semantic truth
```

See [`architecture/agent-harness.md`](architecture/agent-harness.md) and [`../harness/README.md`](../harness/README.md).

## Research → decision → design/implementation

```text
research
  -> ADR/domain/architecture acceptance
  -> Harness-visible canonical artifact when applicable
  -> active plan
  -> lower-level design/implementation only when upstream knowledge is sufficient
```

Research is evidence, not policy.
