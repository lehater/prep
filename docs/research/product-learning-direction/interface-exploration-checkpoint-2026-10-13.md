# UI exploration checkpoint — workspace and graph mechanism (2026-10-13)

**Nature of evidence:** dated Owner discussion / interactive in-chat concept checks and inspection of an older technical donor. **No real participant, measured task, usability finding or comparison** is represented by this record; it is not Harness-accepted UI/Product/Domain knowledge. Do not count as an EX-PLD-06 outcome.

## Boundaries and material reviewed

- Owner-approved *exploratory* L0/L1 wireframe and L2 principles: [workspace candidate](../../../experiments/prep_study_loop/prototype/WORKSPACE_LAYOUT_CANDIDATE.md).
- EX-PLD-06 fixture and modes: [brief](../../../experiments/prep_study_loop/PROTOTYPE_BRIEF.md), [prototype README](../../../experiments/prep_study_loop/prototype/README.md), [current framing](research-framing.md).
- Historical technical donor: [knowledge_representation](https://github.com/lehater/prep/tree/main/experiments/knowledge_representation) and [historical research protocol](https://github.com/lehater/prep/blob/45c193ac0a50b6023a29e9a87f404b794a24a955/docs/research/knowledge-representation-experiment.md); prior investigations are **not** semantic/UI authority.

## Confirmed direction for further exploration (not production acceptance)

1. Bounded desktop workbench, not landing page or an endlessly scrolling document. Minimal persistent sidebar (icon + readable section name, no unused width); compact global header/filter/context above replaceable 4-panel workspace, optional compact footer.
2. Four simultaneous cooperating panels in a shared 65/35 *initial candidate* split: [1] current-type table above [2] tabbed related-entity tables, same width; [3] own-entity details above [4] optional graph, right column spans workspace height. Shared resizers; collapse/maximize/restore without covering filters; independent panel scroll. Exact pixels and persistence after restart remain undecided.
3. **Bidirectional selection is a functional requirement** for appropriate same-type graph/list projections: table ↔ graph, with [2] related items and [3] details updating from one selection state. Selection, hover, focus/view center and semantic filters are distinct. No automatic scope change from selection. Navigation on a different-type graph node remains an open behavior.
4. Do not overdesign property cards or relation summaries. In [3], first show entity's own meaningful fields; [2] owns inspectable relationships. Actual columns and fine behavior should follow realistic sample data.
5. Graph richness should be proven with **Knowledge–Knowledge**, supporting distinct node types, typed directed edges, compact legend/tooltips, readable relation meaning, selection, search, local focus, filtering and recoverable expansion. This does **not** imply that all C/K/M/Goal relations belong in one graph. C–C, Material and cross-entity graphs are unresolved, not missing implementation obligations.
6. A table/search/typed-relation path must remain usable without spatial graph. 2D vs 3D is **not decided**; overview, local focus and incremental exploration are candidate graph interactions only. Graph must not infer truth/completeness, learning attainment or required Capability from visual adjacency.

## Donor findings (technical evidence, not experience evidence)

Historical Storybook scenarios exercise 60 nodes/90 edges, 250/375 and 1000/1500 deterministic *synthetic* renderer workloads; no verified 5000-node benchmark. Machine/browser-specific report: naive 1000/1500 at ~7 RAF FPS and ~4412 draw calls; instanced nodes plus typed batched links at ~25–30 RAF FPS and ~15 calls. Low-poly spheres, directional-arrow batching, stopping idle rendering, raycast picking, hover-neighborhood, search/focus and relation-filter reheat are reusable technical ideas **only if the selected renderer requires them**. The real knowledge-graph snapshot path primarily uses wikilinks, not the richer typed Knowledge–Knowledge semantics envisioned here. No human result validates 3D over 2D/list.

## High-level decision and next evidence

**Stop this in-chat design branch at L0/L1 + coarse L2.** More detailed graph camera controls, million-edge strategies, panel geometry, material modeling and field catalogs have low decision value before observed user-value evidence.

First, carry out a *bounded instrument-readiness / parity review* of the existing EX-PLD-06 A/B/C prototype against the current framing and its comparative tasks. The prototype runs, but the agreed workspace remains **not implemented**; do not silently apply the new structured navigation to flat arm C or make graph richness an untested advantage for A/B. Fix only blockers to a fair, comprehensible human task (with owner authorization for implementation); leave a 3D graph out of the critical path.

Then run a **real EX-PLD-06 comparative task** with an authentic learner Goal and controlled same information, including the existing-tools D baseline, to observe whether orientation and packet selection/transfer actually add value. If the value/need for graph-based orientation remains material, evaluate nonspatial list/relation inspection vs 2D vs 3D on meaningful *typed* Knowledge–Knowledge data in a separate bounded experiment. Do not claim closure based on chat clickthroughs, synthetic fixtures or renderer FPS.

Detailed unknowns and statuses live **only** in [open questions](open-questions.md) and [open experiments](open-experiments.md); this report is neither a second decision registry nor an experiment status file.
