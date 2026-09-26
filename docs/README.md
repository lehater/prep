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

The exact normative topology is `.harness/engineering-graph.yaml` + `.harness/core.yaml`. A useful frontend-oriented projection is:

```text
Problem / Product
  -> Domain Strategy / Model Context
  -> Knowledge + Learning + Learner models
  -> Application Design
  -> Task Model
  -> User Journeys
  -> Conceptual Interface Model
       -> Information Architecture
       -> Interaction Design <--- Machine Interface
            -> Interface Topology
                 -> Presentation System <--- Frontend Performance/Capacity (Quality Design)
                      -> Screen/View Design <--- Frontend Performance/Capacity
                           -> Frontend System Architecture
                                -> Frontend Engineering Policy
                                     -> Frontend Component Design

Interface Topology + Interaction
  -> Interface Verification
Presentation System + Screen/View
  -> Presentation Verification

Application + Machine Interface
  -> Import Consistency
       -> System Architecture
            -> Data Design
```

This is an engineering-knowledge dependency graph, not a project-management stage sequence.

## Current interface/frontend frontier

Current human-interface truth is granular rather than owned by the legacy broad `human-interface.md` document:

- `docs/interface/conceptual-interface-model.yaml`;
- `docs/interface/information-architecture.yaml`;
- `docs/interface/interaction-design.yaml`;
- `docs/interface/interface-topology.yaml`;
- `docs/interface/presentation-system.md`;
- `docs/interface/screen-view-design.md`.

Current frontend realization constraints additionally include:

- `docs/architecture/performance-capacity.md` — registered Quality Design for graph scale/responsiveness/degradation;
- `docs/architecture/frontend-system-architecture.md`;
- `docs/engineering/frontend-engineering-policy.md`;
- `docs/implementation/frontend-component-design.md`;
- `docs/verification/presentation-verification.md`;
- `docs/verification/frontend-verification.md`;
- `docs/verification/frontend-test-design.yaml`;
- `docs/implementation/frontend-implementation-design.md`.

Current noncanonical implementation evidence is recorded in `docs/verification/frontend-release-evidence.md`. FRC-01 code/CI evidence is renewed there; the remaining qualification item is the accepted real-GPU 2k/10k performance run.

The 3D graph remains a first-class prototype hypothesis, not a graph-first whole-product invariant. UI providers/renderers are downstream replaceable dependencies and may not redefine product/interface semantics.

Do not use legacy React/3D-graph technical documents as authority for the current frontend merely because their historical ADR/status text says "Accepted".

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
