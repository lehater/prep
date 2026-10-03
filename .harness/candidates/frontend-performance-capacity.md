# Frontend Performance and Capacity Design

## Purpose

Own architecture-significant quality constraints for frontend Knowledge exploration without selecting a presentation form, renderer, component technology, or production architecture.

The accepted upstream requires inspectable overview, meaningful relationship inspection, scope change, and movement between orientation and detail. Reusable Subject Knowledge remains independent of graph layout or presentation.

## Applicable quality dimensions

The currently applicable dimensions are:

- interaction responsiveness while inspecting or changing the current Knowledge projection;
- capacity of the active presentation workload;
- graceful degradation when a richer presentation cannot remain usable;
- idle-resource behavior once a concrete runtime/presentation exists;
- semantic preservation across all performance adaptations.

These dimensions are applicable because downstream realization may otherwise make the accepted Knowledge exploration behavior unusable or semantically lossy. Their production numeric targets are not yet accepted.

## Semantic-preserving degradation

Performance adaptation may reduce presentation richness or the amount of information rendered simultaneously, but it must preserve:

- stable KnowledgeObject identity;
- KnowledgeProposition meaning;
- material predicate/direction semantics for relational propositions;
- the user's selected semantic scope;
- a task-complete way to inspect the accepted scope, relationships, and detail.

A richer renderer may therefore fall back to a simpler representation. The exact fallback is owned by Human Interface Design.

## Active working set

Accepted product/domain semantics do not require the entire reusable Knowledge corpus to be rendered simultaneously.

Realization may use a bounded active working set, progressive disclosure, filtering, query, focus/neighborhood restriction, grouping, pagination, virtualization, or another bounded technique provided that:

- changing the active presentation set does not mutate Knowledge identity;
- scope can still be narrowed and expanded using meaningful criteria;
- relationship meaning remains inspectable;
- movement between overview and detail remains possible.

No corpus-size or visible-item number is accepted here.

## Graph boundary

A 2D or 3D graph is a downstream presentation hypothesis.

Graph-specific quality measures such as visible node/link count, force-layout settle time, draw calls, triangle count, camera interaction FPS, or WebGL failure handling become applicable only if downstream Human Interface Design selects a graph presentation.

Quality Design therefore does not require a graph and does not turn graph nodes/edges into domain entities.

## Quantitative targets

Current canonical upstream provides no accepted production target for:

- interaction latency or p95 response time;
- frame rate;
- throughput;
- total corpus size;
- simultaneously visible items/relationships;
- memory use;
- CPU/GPU use;
- idle animation/render activity;
- power consumption.

These values are **DEFERRED_NONBLOCKING** for frontend design while presentation form and representative workload remain undecided.

Reopening condition: before any architecture, component, test, or implementation decision depends on one of these values, obtain representative benchmark/usage evidence and reopen QUALITY-DESIGN to accept a measurable boundary.

## Donor evidence

The historical experiments/knowledge_representation work remains donor evidence only.

It contains a measured optimized path around **1000 rendered items / 1500 rendered links at roughly 25–30 RAF FPS** on the recorded experiment environment, plus renderer ablations and diagnostics. That result demonstrates feasibility for that donor implementation/environment only.

It does not establish a production capacity envelope, a 30 FPS requirement, a 2k/5k target, a preferred graph dimensionality, or learning effectiveness.

## Verification obligations

When downstream presentation/architecture becomes concrete, verification must:

- identify the representative browser/device/workload;
- measure the quality dimensions that the selected presentation actually makes relevant;
- preserve semantic identity and relationship meaning under degradation;
- verify the task-complete alternative path when rich presentation is unavailable or reduced;
- distinguish headless structural checks from real browser/GPU performance evidence.

If quantitative evidence is needed to choose implementation structure, QUALITY-DESIGN must be reopened first rather than silently inventing a threshold.

## Implementation freedoms

Until reopened by evidence, downstream design may choose:

- graph or non-graph presentation;
- 2D or 3D when a graph is selected;
- bounded-working-set mechanism;
- rendering technology;
- batching/virtualization/progressive-disclosure strategy;
- adaptation mechanism;
- diagnostic instrumentation.

These choices may vary provided accepted product behavior and Subject Knowledge semantics remain preserved.
