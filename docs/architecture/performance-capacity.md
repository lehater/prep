# Frontend Performance and Capacity Design

## Purpose

Define the frontend quality constraints that are actually supported by accepted Product Capabilities and Knowledge Model semantics, without selecting a presentation form or inventing MVP performance targets.

This is a QUALITY-DESIGN contract. It constrains the quality of a selected realization; it does not decide whether Knowledge is presented as a graph, 3D graph, 2D diagram, list, tree, table or mixed representation.

## Accepted quality constraints

### Information access survives presentation degradation

Prep must preserve access to canonical Knowledge identity, semantic kind, relation type/direction and the user's explicit exploration scope when a presentation has to reduce rendering work or visual richness.

A performance fallback may change presentation fidelity. It must not change subject meaning.

This follows from:

- `PC-03 Knowledge organization`, which requires important concepts and accepted relationships to remain understandable and navigable without prescribing one visualization form;
- Knowledge Model identity and relationship semantics, which are independent of UI position or graph layout.

### Full-corpus simultaneous rendering is not required

No accepted capability requires the browser to render every canonical KnowledgeNode or KnowledgeRelation at once.

A selected presentation may use bounded subsets, search, filtering, focus, progressive disclosure, pagination, neighborhood expansion or another strategy consistent with its Human Interface Design.

The exact strategy belongs to the selected presentation and implementation design.

### Current MVP has no accepted numeric performance envelope

There is currently no accepted product or quality evidence establishing an MVP requirement for:

- frames per second;
- visible node count;
- visible relation count;
- draw-call or triangle budget;
- force-layout settle time;
- exact interaction-latency percentile;
- exact idle CPU/GPU budget.

Therefore no numeric value in those dimensions is a semantic acceptance target for the current MVP.

Such targets may be introduced later only from representative benchmark evidence or an accepted product/quality need.

## Representation-specific quality

Representation-specific quality constraints are conditional on Human Interface Design first selecting that representation.

Examples:

- if a 3D node-link projection is selected, renderer responsiveness, camera interaction, occlusion handling and graceful fallback become applicable quality/verification concerns for that projection;
- if a list/table/tree projection is selected, its own density, navigation and rendering constraints apply instead.

QUALITY-DESIGN does not make any of those representations mandatory.

## Routing of the previous 3D experiment

The existing 3D experiment is useful downstream donor evidence because a working renderer and interaction mechanics already exist.

It is not an upstream requirement that Prep use 3D.

Route its reusable knowledge as follows:

- **HUMAN-INTERFACE-DESIGN / presentation-system**: decide whether a 3D projection materially helps accepted Knowledge exploration tasks and, if selected, which user-facing graph interactions/settings are actually needed;
- **SCREEN-VIEW-DESIGN**: place the selected projection and its controls in concrete views;
- **FRONTEND-SYSTEM-ARCHITECTURE / COMPONENT-DESIGN**: define renderer/provider seams only after the presentation decision exists;
- **VERIFICATION / TEST-DESIGN**: reuse stress fixtures and renderer measurements when they prove an accepted selected presentation;
- **IMPLEMENTATION-DESIGN**: reuse the existing 3D implementation where compatible instead of rebuilding equivalent mechanics.

Existing 3D work should therefore reduce implementation cost if 3D remains a viable selected presentation. Its existence does not by itself establish user value.

## Deferred non-blocking measurements

The current frontend may collect performance measurements during prototyping and implementation, including FPS, interaction latency, idle activity, renderer workload and dataset-size behavior.

These measurements are evidence for later quality refinement, not pass/fail requirements until a Quality Authority accepts corresponding targets.

Reopen numeric quality targets when at least one of the following becomes true:

- representative user/task testing identifies a responsiveness threshold that affects task completion;
- realistic corpus size demonstrates a material capacity constraint;
- a selected presentation technology requires a bounded envelope to remain usable;
- deployment/device constraints make resource limits architecture-significant.

## Implementation freedoms

Until an accepted quality target says otherwise, downstream design may choose:

- renderer and rendering technology;
- batching/instancing strategy;
- pixel ratio and visual-detail policy;
- animation/physics strategy;
- progressive rendering or pagination approach;
- caching and projection strategy;
- benchmark fixture sizes and diagnostics.

These choices must preserve accepted semantic meaning and task access.

## Resolution of Q-FRONTEND-GRAPH-CAPACITY-SCOPE

The previous graph-specific contract was over-scoped.

Graph and Graph settings are not QUALITY-DESIGN requirements. Graph-specific quality becomes applicable only if Human Interface Design selects a graph projection. Numeric graph envelopes and FPS values from the previous experiment are evidence, not current MVP acceptance criteria.
