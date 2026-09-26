# Frontend Performance and Capacity Design

## Purpose

Define the accepted performance/capacity envelope for the interactive Knowledge graph and the user-visible degradation rules that keep Prep usable as graph density grows.

This is a QUALITY-DESIGN contract. It is not a product SLA and it does not make any concrete renderer, batching strategy or physics engine canonical.

The previous 3D experiment is evidence only. Its useful stress findings are adopted here only where they support this accepted contract.

## Workload envelope

The browser must not assume that every canonical KnowledgeNode/KnowledgeRelation is rendered at once.

Reference visible-graph envelopes:

- ordinary interactive view: up to approximately **2,000 visible nodes / 10,000 visible edges**;
- stress view: up to approximately **5,000 visible nodes / 25,000 visible edges**;
- larger corpora must use search, semantic/relation filtering, focus/neighborhood restriction and later clustering/progressive expansion rather than requiring an unbounded live full-corpus graph.

These numbers are engineering validation envelopes, not expected initial corpus size.

## Interaction target

On a modern hardware-accelerated desktop browser at a normal desktop viewport:

- ordinary orbit/pan/zoom/focus/filter interaction should remain approximately **30 FPS or better** in the ordinary envelope;
- the renderer must become demand-driven when idle: once physics/camera inertia and explicit visual transitions stop, it must not keep an avoidable continuous animation loop alive;
- performance degradation must never change canonical Knowledge identity, relation type/direction, selected scope or the availability of list/search/detail access.

Exact p95 interaction budgets may be refined only from representative benchmark evidence.

## Degradation model

Performance degradation is presentation-only and follows a semantic-preservation rule: **reduce rendering cost before reducing information access**.

### Auto profile — default

The renderer selects an implementation strategy appropriate to visible graph size and device capability.

Allowed tactics include:

- instanced node rendering;
- batched relation rendering;
- demand-driven rendering;
- reduced device-pixel ratio;
- reduced polygon/detail resolution;
- fewer always-visible labels;
- disabling decorative particles;
- pausing or shortening live force simulation after layout settles.

### Quality profile

Prefer presentation richness when the visible graph remains comfortably responsive.

May keep:

- richer node geometry;
- more labels;
- directional arrowheads;
- decorative relation particles/effects;
- live physics for longer.

### Performance profile

Prefer interaction responsiveness under large/stress graphs.

May:

- use instanced nodes and batched links;
- render lower-detail node geometry;
- suppress mass directional particles;
- reduce link thickness/effect work;
- show labels only for selected/focused/hovered nodes;
- pause physics after settling or allow the user to disable live physics;
- lower render pixel ratio.

Directional arrowheads may be disabled only when relation direction remains inspectable through another explicit encoding such as selected-relation detail/legend.

### Fallback

If WebGL/rendering is unavailable or the graph cannot remain usable, list/search/detail remain the canonical access path. Failure of the 3D presentation must not block Knowledge access.

## User-visible graph controls

The Knowledge workspace exposes a compact **Graph settings** surface.

Stable user-facing controls:

- Performance profile: **Auto / Quality / Performance**;
- fit visible graph to viewport;
- reset camera/view;
- relation-type visibility;
- semantic-kind visibility;
- focus/clear focus.

An **Advanced rendering** disclosure may expose presentation-only tuning useful for large graphs:

- labels: normal / focused-only / off;
- directional arrowheads: on/off;
- decorative particles: on/off;
- live physics: on / settle-and-pause / off;
- node visual detail: normal / reduced.

These settings may affect beauty and renderer workload but must not redefine domain semantics.

Implementation-specific switches such as standard-vs-instanced node objects, standard-vs-batched link objects, internal buffer strategy, Three.js object counts or shader choices remain renderer implementation details. They may exist in developer diagnostics but are not required product vocabulary.

## Donor evidence retained from the 3D experiment

The experimental R2 spike established useful renderer evidence:

- deterministic 60 / 250 / 1000-node density fixtures;
- standard vs instanced-node A/B;
- standard vs batched-link A/B;
- performance ablations for particles, arrowheads, low-poly nodes, thin links, link visibility and physics;
- demand-driven idle rendering;
- developer diagnostics for RAF rate, force settle time, draw calls, triangles, CSS/buffer size and pixel ratio;
- interaction parity checks for search/focus, hover-neighborhood, click-vs-drag and relation filtering.

Production must adapt the mechanics to canonical Prep Knowledge semantics rather than copying PaymentGraph/product assumptions.

## Verification obligations

Production graph verification must include representative hardware-accelerated stress runs at **1k / 2k / 5k visible nodes** with proportionate relation density.

Record at minimum:

- active interaction FPS/RAF rate;
- idle renderer activity;
- force/layout settle time after load/filter/drag where physics is enabled;
- perceived orbit/zoom/drag responsiveness;
- search -> focus latency/usability;
- filter -> topology-update behavior;
- draw calls and triangle count when available;
- WebGL/context failure;
- whether each degradation profile preserves relation/selection/detail semantics.

Headless tests may prove fixture counts, configuration transitions and semantic preservation. They must not claim real GPU/browser performance.

## Implementation freedoms

The following remain downstream renderer choices:

- exact force constants;
- exact automatic profile thresholds;
- node/link batching implementation;
- WebGL/Three.js object layout;
- shader/material choices;
- exact pixel-ratio policy;
- exact numeric camera damping/zoom constants.

Changing these does not require upstream redesign unless user-visible semantics or the accepted performance envelope changes.
