# Knowledge Representation Experiment

> Preserved implementation evidence. Restored from the former `design/task-centered-ux` line at commit `2d51c98912f15c48194d641150389bf60cc2ff2e` after branch retirement. This code is retained as a technical foundation for future product implementation; its product/UX assumptions are not canonical unless revalidated against the current model.

Disposable frontend-only prototype for Plan 019. It validates the Payment Processing knowledge workspace and the R2 3D renderer capability without introducing backend dependencies.

## Run

```bash
npm install
npm run storybook
```

Use `npm run lint`, `npm run build`, and `npm run build-storybook` before committing changes.

The implementation is experimental evidence infrastructure, not a production frontend or a source of domain truth. Canonical UX and experiment contracts remain under `docs/ux/` and `docs/research/`.


## R2 density/stress harness

Storybook exposes the same R2 interaction implementation at three deterministic renderer-load tiers:

- `Initial` — 60 nodes / 90 edges; existing provisional capability baseline;
- `Density250` — 250 nodes / 375 edges; synthetic renderer-stress fixture;
- `Density1000` — 1000 nodes / 1500 edges; synthetic renderer-stress fixture.

The 250/1000 fixtures repeat provisional concept shapes only to create deterministic renderer load. They are not Payment Processing domain truth and must not be used as learning evidence.

For a manual stress pass, open each density story in an external hardware-accelerated Chrome/Firefox window. In **Settings -> Developer diagnostics**, record:

- RAF rate while idle and while orbiting;
- settle time after initial load, relation filtering and node drag;
- perceived orbit/zoom/drag responsiveness;
- hover-neighborhood latency/legibility;
- search -> focus usability;
- filter -> topology reheat behavior;
- visible cluster structure vs hairball behavior;
- label readability;
- WebGL/context failures or browser instability.

Headless Storybook tests validate fixture wiring/counts only. They intentionally do not claim WebGL performance.


### Instanced-node A/B renderer spike

The R2 Storybook settings expose a development-only `Node renderer` toggle:

- `standard` — existing per-node ForceGraph3D objects and decorations;
- `instanced` — one `THREE.InstancedMesh` for ordinary node spheres while keeping the same graph data, force simulation and link renderer.

Developer diagnostics also report Three.js draw calls and triangle count. This allows an in-place A/B comparison after applying the same visual tuning (for example, `particleCount = 0`) without changing graph density or physics.

The R2 renderer is demand-driven when idle. After force settling and camera/control inertia stop, the ForceGraph animation loop is paused. Pointer/hover, wheel, orbit/pan, node drag, search/focus camera transitions, filter/reheat and tuning changes resume it. Browser tab hiding or window blur pauses rendering immediately; focus/visibility restores rendering only long enough to continue active work. The comparative RAF diagnostic sampler now exists only while the renderer is active and is cancelled together with the renderer, so an idle paused graph reports `Renderer paused` / `RAF 0` instead of keeping its own perpetual RAF loop alive.

The instanced mode now restores the R2 interaction contract without recreating one render object per node:

- raycast hover resolves an instance back to the canonical graph node;
- hover-neighborhood emphasis updates the shared `instanceColor` buffer and existing link emphasis;
- click-vs-drag continues to use the same graph-node state and drag threshold;
- selected/focused/hovered labels, selection ring and focus halo are rendered in a small interaction overlay containing only active nodes;
- search/focus, live force physics and relation filtering stay on the same R2 graph state.

This remains an experimental renderer path. Manual hardware-accelerated checks must confirm both interaction parity and the retained performance benefit before it replaces the standard path.


### Batched-link renderer spike

The R2 Storybook settings now also expose a development-only `Link renderer` toggle:

- `standard` — existing ForceGraph3D per-link rendering;
- `batched` — one `THREE.LineSegments` batch plus one instanced-arrowhead batch per relation type.

The batched path keeps the same active link set for force physics and relation filtering. Hover-neighborhood emphasis updates vertex/instance colors on the batches instead of creating per-link objects. Mass directional particles are intentionally disabled on this path because the density test showed them to be a dominant renderer cost; directional arrowheads remain batched and visible.

Use `Density1000InstancedBatched` for the full optimized stress path. Compare RAF and draw calls against `Density1000InstancedNodes` under the same viewport and browser conditions.


### Performance experiment switches

Storybook **Settings -> Performance experiments** centralizes the renderer ablations used during the 1000-node stress pass:

- `Instanced nodes` — standard per-node objects vs one `InstancedMesh`;
- `Batched links` — standard per-link objects vs relation-type batches;
- `Mass particles` — configured particles vs zero particles; unavailable on the batched-link path;
- `Arrowheads` — directional arrows on/off for both renderer paths;
- `Low-poly nodes (resolution 8)` — node resolution 8 vs the configured renderer resolution;
- `Thin-line links (standard renderer)` — `linkWidth = 0` line rendering vs configured standard link thickness;
- `Render links` — render links on/off while preserving the active link set;
- `Physics simulation` — live force simulation on/off while keeping the current positions renderable and draggable.

The batched-link path coalesces link-buffer position updates to at most one update per animation frame. When `Arrowheads` is off, it also skips arrow direction/quaternion/matrix calculations rather than merely hiding the arrow meshes.

`Reset experiments` restores the original renderer baseline without resetting the ordinary visual/physics tuning sliders. Developer diagnostics report the effective node/link mode, particles, arrows, node resolution, link visibility, physics state, RAF, draw calls and triangles.


### Real Knowledge Graph snapshot

`KnowledgeGraphSnapshot` is the primary real-data R2 story. It uses a generated snapshot of the separate `lehater/knowledge-graph` repository rather than a hand-authored fixture.

When `npm run storybook` or `npm run build-storybook` starts, the package runs `scripts/sync-knowledge-graph.mjs --optional`. The importer searches for a sibling Knowledge Graph checkout (or `KNOWLEDGE_GRAPH_REPO` / `--source <path>`), reads every current `graph/*.md` `concept-card-v2`, and regenerates `src/r2/generated/knowledgeGraphSnapshot.ts`.

The snapshot preserves source-owned data:

- immutable card ID and canonical name;
- persisted `kind`, `areas`, aliases and sources where present;
- full description;
- question headings and answer bodies;
- human-facing wikilink labels and explanations;
- every authored outgoing wikilink, including unresolved targets;
- source path and Git revision; a dirty graph working tree is marked with `+working-tree`.

R2 renders one neutral `wikilink` relation because Knowledge Graph V2 does not require controlled typed relations. Node colors use persisted source metadata only: first `area`, then `kind`, otherwise `unclassified`. No domain classification is invented by the R2 adapter.

Selecting a node opens the real Concept Card body in the Detail overlay. Questions, answers, link explanations and sources remain visible there; materialized wikilinks are clickable and focus the linked graph node directly.

A small committed Payments fallback remains solely so CI and clean clones can build without access to the private Knowledge Graph repository. The fallback is not the intended local UX dataset. To force a refresh manually:

```bash
npm run sync-knowledge-graph -- --source /path/to/knowledge-graph
```

The 60/250/1000 synthetic stories remain separate and exist only for renderer stress testing.
