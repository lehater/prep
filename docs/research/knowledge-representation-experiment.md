# Knowledge Representation Experiment

## Status

The formal scored experiment remains planned under Plan 019. The disposable R2 renderer-capability spike has been implemented and manually exercised, but no user-study, learning or product-superiority result is claimed by this document.

This document defines the experiment design for deciding when Prep should use search/list/detail, a 2D graph, or a 3D graph, and records the current R2 capability baseline. Raw observations belong under `docs/evidence/knowledge-representation/`; accepted product policy belongs in UX/architecture/ADR artifacts only after evidence exists.

## Decision questions

The experiment must answer, in order:

1. Does a graph materially improve relevant knowledge tasks over a strong textual/domain-specific baseline?
2. Does any graph advantage survive a learning/sensemaking check rather than only a graph-reading benchmark?
3. If a graph helps, does desktop 3D materially improve those tasks over 2D?
4. For which task classes and graph density tiers does the answer change?
5. What representation should be the default, optional, or absent for each validated task class?

The experiment does not choose a renderer library for production.

## Experiment boundary

Use one coherent Payment Processing fixture so semantic content is held constant.

The fixture must include realistic relations among concepts such as:

- idempotency;
- retry;
- deduplication;
- transaction boundaries;
- concurrency;
- duplicate payment/double processing;
- payment lifecycle;
- Transactional Outbox;
- Saga.

The fixture must include irrelevant/context nodes as well as the intended answer path.

## Representation conditions

```text
R0 = Search + structured concept cards/list + typed relation table + Detail
R1 = R0 + 2D graph exploration
R2 = R0 + 3D graph exploration
```

The graph is an additional representation, not a replacement for searchable textual access. R0 must be a credible product baseline, not a deliberately weak control.

"R1 = R0 + graph" and "R2 = R0 + graph" mean **capability inclusion**, not pixel-identical simultaneous layout. Search, exact textual concept/relation inspection and Detail remain available in every condition; the central primary representation changes by condition. The graph condition must not receive semantic information unavailable to R0.

External evidence review: [graph-representation-evidence-review.md](graph-representation-evidence-review.md).

### Fair-comparison invariants

All conditions receive the same:

- semantic nodes and typed/directional relations;
- labels and visual semantic encoding;
- search results and filters;
- detail content;
- semantic information budget;
- select/focus semantics;
- bounded working set;
- task instructions;
- fixture revision.

A condition does not receive credit for semantic information unavailable in the others. Each condition may use interaction aids natural to its representation (for example, camera reset in 3D), provided those aids do not reveal additional semantic answers.

The product claim is therefore comparative and pragmatic: which candidate interface better supports a task. Do not claim that dimensionality alone caused an observed difference.

## Prototype stack for the experiment

Use the accepted React/TypeScript frontend shell and shared project-owned view models.

Conceptually:

```text
Payment fixture
    |
    v
FrontendDataPort
    |
    v
shared Knowledge/Graph view model
    |
    +--> R0 project UI: search/list/detail
    +--> R1 experiment adapter: react-force-graph-2d
    +--> R2 experiment adapter: react-force-graph-3d
```

For R1/R2, the initial evaluation tools are:

- `react-force-graph-2d`;
- `react-force-graph-3d`.

They are paired experiment tools because the same open-source project exposes closely aligned 2D/3D React interfaces while using Canvas for 2D and ThreeJS/WebGL for 3D. This reduces implementation differences that could otherwise confound the 2D-vs-3D comparison.

Source: <https://github.com/vasturiano/react-force-graph>

This is **not** a production dependency decision. If a graph representation survives validation, renderer selection is a separate technical evaluation.

## R2 capability spike — baseline v1

Implementation:

- `experiments/knowledge_representation/src/r2/R2GraphSpike.tsx`;
- `experiments/knowledge_representation/src/r2/r2GraphConfig.ts`;
- provisional `paymentGraphFixture.ts`: 60 nodes / 90 typed edges.

The baseline-v1 tuning snapshot is:

```yaml
visual:
  nodeDimOpacity: 0.78
  linkDimOpacity: 0.65
  highlightIntensity: 1.3
  hoverTransitionInMs: 900
  hoverTransitionOutMs: 1400
  hoverLeaveDelayMs: 120
  nodeSize: 4
  linkThickness: 1
  particleSize: 0.8
  particleCount: 1
  baseLinkWidth: 1
  highlightedLinkWidth: 3
  dimmedLinkWidth: 0.7
  linkOpacity: 0.78
  selectedRingRadius: 6.4
  selectedRingTube: 0.8
  focusHaloRadius: 8.5
  focusHaloOpacity: 0.18
  labelTextHeight: 4.5
  labelOffset: 10
  dragHitRadiusMin: 10
  dragHitRadiusMax: 18
  dragHitRadiusMultiplier: 2.5

physics:
  centerForce: 1
  repelForce: 90
  linkForce: 1
  linkDistance: 38

rendererCamera:
  antialias: true
  maxPixelRatio: 2
  nodeResolution: 16
  linkResolution: 8
  fitViewPadding: 20
  fitOrbitSafetyFactor: 1.045
  fitTransitionMs: 500
  focusTransitionMs: 3600
  nodeDragThresholdPx: 5
  rotationDampingFactor: 0.12
  zoomSpeed: 0.5
  backgroundColor: "#0b1220"
  initialCamera: { x: 0, y: 0, z: 1000 }
```

Exact executable values remain owned by `r2GraphConfig.ts`; this snapshot names the experiment baseline revision.

Manually verified capability at this baseline:

- real 3D orbit with depth/parallax, zoom and pan;
- TrackballControls inertia/damping without auto-rotation;
- search -> fly/focus;
- distinct selected/focused state;
- hover emphasis for hovered node, direct neighbors and incident links while unrelated nodes/links are dimmed;
- click vs node-drag separation using a 5 px threshold; drag release does not also select/open;
- live node dragging with force-simulation reheat;
- relation filtering removes disabled edges from the active topology, removes their link forces and reheats the simulation;
- fit/reset camera controls;
- tight fit computed from visible node bounds, viewport aspect ratio and node decoration radius without changing physics positions;
- semantic Area/relation colors;
- WebGL2 fallback;
- antialiasing and device-pixel-ratio synchronization capped at 2.

The owner assessment is that the 3D exploration interaction is promising enough to continue. That is directional capability feedback only; it is not learning evidence and does not establish R2 superiority over R0/R1.

### Renderer density/stress gate

Before investing in formal learning evidence, exercise the same interaction model at approximately:

- 60 nodes;
- 250 nodes;
- 1000 nodes.

Observe FPS/interaction responsiveness, settling time, orbit, node drag, hover-neighborhood behavior, search/focus, filtering + reheat, cluster legibility, hairball onset, label strategy and WebGL/browser stability.

These are renderer stress tiers, not the controlled task-density tiers below.

The implemented Storybook harness exposes `Initial`, `Density250` and `Density1000` stories over the same `R2GraphSpike`. The larger tiers use deterministic synthetic load fixtures and development-only diagnostics for node/edge counts, approximate browser RAF rate and force-settling time. Headless automation validates wiring only; performance observations must be collected in a hardware-accelerated browser.

Current owner-only directional observations at the 1000-node / 1500-edge stress tier:

- the original per-object renderer dropped to about 7 RAF fps with all relations active and reported about 4412 draw calls;
- instanced nodes plus batched relation links reduced the scene to about 15 draw calls and raised responsiveness to roughly 25-30 RAF fps;
- lowering node sphere resolution from 16 to 8 reduced triangle count from roughly 367k to about 95k and contributed about +10 RAF fps in the optimized path;
- disabling live physics after the renderer optimizations produced only a small additional increase, with peaks around 39-41 RAF fps, so force simulation is no longer the dominant observed bottleneck;
- arrow/link visibility ablations after batching produced only small additional gains.

These figures are machine/browser-specific stress observations, not a product performance requirement or learning evidence.

## Reproducibility of layouts and viewpoints

Per fixture/layout-policy revision:

- the force/layout policy is documented: participating relation types, force weights, charge/link-distance assumptions and explicit relayout rules;
- the default layout is not hand-tuned to reveal an expected answer;
- graph coordinates/layout seed are deterministic and frozen for evidence runs;
- initial 2D viewport and 3D camera/viewpoint are deterministic;
- reset restores those exact states;
- camera/viewport changes are logged;
- force simulation must not generate materially different layouts between matched runs.

A layout policy, coordinates or viewpoint change creates a new recorded layout-policy/viewpoint revision.

## Density tiers

Exercise the same semantic fixture through bounded working sets:

| Tier | Visible working set | Purpose |
|---|---:|---|
| small | about 12-25 nodes | determine whether graph overhead is justified at low complexity |
| normal | about 40-80 nodes | representative topology exploration |
| dense | about 120-250 nodes | expose occlusion, orientation and scaling behavior |

These are experiment inputs, not permanent product limits.

## Validation stages

Detailed task definitions: the historical Plan 019 test battery (not carried forward as canonical design).

Candidate interaction contract: the historical Plan 019 interaction model (not carried forward as canonical design).

### Stage A — representation mechanics

Use graph-task categories grounded in established graph-visualization taxonomies:

1. locate/filter a concept or relation;
2. adjacency: identify direct neighbors/relations;
3. common connection: identify concepts linking two subjects where meaningful;
4. connectivity/path: identify or explain a meaningful path;
5. browsing/orientation: move through local context and recover the previous focus;
6. overview: characterize clusters/areas only when the task genuinely requires a global view.

Stage A primarily measures correctness, completion, interaction/navigation cost and orientation.

### Stage B — learning and sensemaking

After the relevant exploration view is hidden, test whether the representation supported an internal model:

1. explain relation direction/type in the participant's own words;
2. reconstruct the relevant local path/structure;
3. recall the key concepts/relations after intervening activity;
4. transfer the structure to a new but analogous payment-processing scenario.

Stage B is primary evidence for Prep's learning claim. A representation that is fast for Stage A but produces no comprehension/transfer advantage does not automatically become the product default.

### Stage C — exploratory discovery

Use bounded free exploration to test whether the representation helps the participant notice useful, semantically valid relationships/structures they were not explicitly instructed to find.

For each reported discovery record whether it is valid, whether it was already known, and which interaction exposed it (search, hover-neighbor, orbit, filter, relayout, expansion, detail, other).

A discovery is stronger evidence when the participant can explain/reconstruct it after the representation is hidden.

### Pilot

Before scored evidence runs, execute an unscored pilot to validate task wording, bundle difficulty, answer rubrics, logging, deterministic layouts/viewpoints, semantic parity and discovery attribution. Pilot results are not decision evidence.

## Matched task bundles

Do not repeat the exact same semantic question in R0, R1 and R2 for the same participant; that would measure memorization.

Create matched bundles with similar topology characteristics.

Initial bundle centers:

- **A — Idempotency**
- **B — Transactional Outbox**
- **C — Saga**

Each bundle must contain comparable Stage A tasks and a matched Stage B comprehension/transfer check. Stage C uses an equivalent bounded exploration window and working-set tier across conditions. For the same participant, Stage C must use matched substantially non-overlapping semantic slices; repeated free exploration of the same content cannot be scored as novel discovery. Independent participants may instead receive the same slice under different conditions.

At minimum:

1. locate the concept;
2. identify important immediate neighbors/typed relations;
3. reconstruct a meaningful multi-hop structural or causal path;
4. inspect detail and return to the prior exploration context;
5. hide the representation and explain/reconstruct the relevant structure;
6. apply the learned structure to one analogous scenario.

Before a run, record why the bundles are considered comparable: relevant-degree range, path length, distractor count, relation-type count and working-set tier.

Record participant prior familiarity with the bundle concepts. Payment Processing may still be used for UX/mechanics when familiar, but do not interpret Stage B/C as learning evidence under a ceiling effect.

## Order control

With one representative user, rotate matched bundles across representations rather than repeating one answer:

```text
run/order example:
R0 -> bundle A
R1 -> bundle B
R2 -> bundle C

later counterbalanced run:
R2 -> bundle A
R0 -> bundle B
R1 -> bundle C
```

Reset transient selection/camera/filter state before every condition.

With multiple independent participants, counterbalance both representation and bundle order.

## Measures

### Primary

- Stage A task completion: `pass | assisted | fail`;
- Stage A graph-reading correctness;
- Stage B semantic correctness;
- Stage C count/quality of valid novel discoveries and unsupported interpretations;
- correctness of relation direction/type;
- structure/path reconstruction after the representation is hidden;
- transfer to an analogous scenario;
- orientation loss/recovery events;
- blocking or wrong-model confusion.

### Secondary

- interaction count;
- elapsed time;
- prompts/help required;
- dead ends;
- post-task ease rating 1-5;
- reported cognitive load;
- representation preference, recorded only after task evidence.

Preference and speed alone do not establish usefulness.

## Decision rules

Use the simplest representation that achieves the required comprehension and task outcome.

A graph becomes primary for a task class only if evidence shows a repeatable topology/comprehension benefit over R0.

Desktop 3D becomes primary for a task class only if Prep-specific evidence shows a repeatable benefit over R1 without a material regression in:

- completion;
- semantic correctness;
- orientation;
- interaction cost;
- cognitive load;
- keyboard/textual alternative availability.

Possible valid conclusions include:

- R0 is the default and graph is unnecessary;
- R0 is best for lookup while R1 is better for neighborhood/path understanding;
- R2 helps only at a particular density/task class;
- graph is useful only as an optional secondary representation.

An owner-only run may select the next prototype direction but does not establish general usability for broader users.

Do not use positive VR/stereoscopic 3D results from the literature as evidence for a monoscopic mouse-controlled browser implementation.

## Evidence location

Each completed run gets an immutable run directory:

```text
docs/evidence/knowledge-representation/
    run-001/
    run-002/
    ...
```

Use `docs/evidence/knowledge-representation/run-template.md` for the run record.

Raw observations are preserved even when later evidence changes the conclusion. Corrections are appended/explained rather than rewriting history.

## Promotion path

```text
experiment design
    -> raw run evidence
    -> synthesis
    -> accepted UX/architecture decision
    -> ADR when the decision is durable/architecturally significant
```

Plan 019 remains open until representation evidence and the rest of Gate B are acceptable.
