# Frontend Performance and Capacity Design

## Purpose

Define the accepted performance/capacity envelope for interactive frontend Knowledge exploration and the degradation rules that keep Prep usable as the explored corpus grows.

This is a QUALITY-DESIGN contract. It does not select a presentation form, dimensionality, renderer, batching strategy, physics engine or user-control layout.

A spatial/node-link presentation may consume this contract downstream. Terms such as `visual item` and `visual link` below are measurement units for a presentation workload; they are not domain entities. Canonical reusable subject semantics remain `KnowledgeObject` and `KnowledgeProposition`, and a rendered relationship is only a presentation encoding of relational proposition semantics.

The previous 3D experiment is feasibility evidence only. Its useful stress findings are adopted here only where they support this accepted quality contract; they do not make 3D or its implementation mechanics upstream requirements.

## Workload envelope

For an interactive spatial/node-link projection, the browser must not assume that the whole canonical Knowledge corpus is rendered at once.

Reference visible-workload envelopes:

- ordinary interactive view: up to approximately **2,000 visual items / 10,000 visual relationship encodings**;
- stress view: up to approximately **5,000 visual items / 25,000 visual relationship encodings**;
- larger corpora require a bounded active working set through query, filtering, focus/neighborhood restriction, clustering or progressive expansion rather than an unbounded live full-corpus projection.

These numbers are engineering validation envelopes, not expected initial corpus size and not domain cardinality constraints.

A visual item may project a `KnowledgeObject` or another explicitly represented semantic item. A visual relationship encoding may project the predicate/participants of a relational `KnowledgeProposition`. Neither creates a `KnowledgeNode` or `KnowledgeRelation` domain entity.

## Interaction target

On a modern hardware-accelerated desktop browser at a normal desktop viewport, when a rich spatial projection is active:

- ordinary manipulation, navigation, focus and filtering should remain approximately **30 FPS or better** in the ordinary envelope;
- rendering must become demand-driven when idle: once layout, navigation inertia and explicit visual transitions stop, it must not keep an avoidable continuous animation loop alive;
- performance degradation must not change canonical Knowledge identity, proposition predicate/participant semantics, the semantic result set selected by the user, or the availability of a task-complete alternative access path.

Exact p95 interaction budgets may be refined only from representative benchmark evidence.

## Degradation model

Performance degradation is presentation-only and follows a semantic-preservation rule: **reduce rendering cost before reducing semantic access**.

A downstream presentation/renderer may adapt rendering richness or execution strategy to visible workload and device capability. Allowed realization tactics include:

- instanced rendering;
- batched relationship rendering;
- demand-driven rendering;
- reduced device-pixel ratio;
- reduced geometry/detail resolution;
- fewer simultaneously rendered labels;
- removal of decorative effects;
- shortening or pausing dynamic layout after it settles.

When relation direction or predicate class is material to the current task, degradation may simplify its visual encoding only if the same semantics remain inspectable through another explicit presentation path.

If a rich/spatial renderer is unavailable or cannot remain usable, the interface must preserve task-complete access to the same canonical Knowledge through an alternative representation. The exact fallback presentation and controls are owned downstream by Human Interface Design.

## Presentation and control boundary

QUALITY-DESIGN owns the measurable workload, responsiveness, idle-resource and semantic-preservation constraints above.

HUMAN-INTERFACE-DESIGN owns:

- whether the primary Knowledge representation is 2D, 3D, list-based or coordinated across forms;
- user-visible performance/profile controls;
- fit/reset/focus/filter control placement and interaction semantics;
- label, direction and detail disclosure semantics.

COMPONENT/IMPLEMENTATION-DESIGN owns renderer-private choices such as standard-vs-instanced objects, batching layout, internal buffers, shaders, force implementation and diagnostics plumbing.

Those downstream choices may vary provided this quality contract remains satisfied.

## Donor evidence retained from the 3D experiment

The experimental R2 spike established useful feasibility evidence:

- deterministic 60 / 250 / 1000-item density fixtures;
- standard vs instanced-item A/B;
- standard vs batched-link A/B;
- performance ablations for particles, arrowheads, low-detail geometry, thin links, link visibility and physics;
- demand-driven idle rendering;
- developer diagnostics for RAF rate, force-settle time, draw calls, triangles, CSS/buffer size and pixel ratio;
- interaction parity checks for search/focus, hover-neighborhood, click-vs-drag and relation filtering;
- an optimized approximately **1000-item / 1500-link** path at roughly **25–30 RAF FPS** on the recorded experiment machine/browser.

This evidence supports feasibility and implementation search space. It does not prove the accepted 2k/5k envelopes on arbitrary hardware, does not prove learning effectiveness, and does not make the donor implementation production architecture.

Production must map any reused mechanics to current `KnowledgeObject` / `KnowledgeProposition` semantics.

## Verification obligations

When a spatial/node-link presentation is selected downstream, production verification must include representative hardware-accelerated stress runs at **1k / 2k / 5k visual items** with proportionate relationship density.

Record at minimum, where applicable:

- active interaction FPS/RAF rate;
- idle renderer activity;
- dynamic-layout settle time after load/filter/drag when such layout is enabled;
- perceived navigation/manipulation responsiveness;
- search/query -> focus latency and usability;
- filter -> visible-set/topology update behavior;
- draw calls and triangle count when available;
- renderer/context failure;
- whether each degradation strategy preserves Knowledge identity, proposition semantics and alternative access.

The benchmark report must identify the browser/device environment so results are not generalized beyond the measured setup.

Headless tests may prove fixture counts, configuration transitions and semantic preservation. They must not claim real GPU/browser performance.

If downstream design requires a materially larger ordinary working set or a different interaction class whose performance cannot be inferred from this envelope, reopen QUALITY-DESIGN with new evidence rather than silently changing the target.

## Implementation freedoms

The following remain downstream presentation/renderer choices:

- exact automatic adaptation thresholds;
- item/link batching implementation;
- WebGL/Three.js or alternative renderer object layout;
- shader/material choices;
- exact pixel-ratio policy;
- exact dynamic-layout/force constants when such layout is used;
- exact camera/navigation constants when a spatial view is used.

Changing these does not require upstream redesign unless user-visible semantics or the accepted performance envelope changes.
