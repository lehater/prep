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

## Owner correction — sequence of concept and comparison (2026-10-13)

**Owner-confirmed research sequencing input, not user evidence or production acceptance:** The previous recommendation to begin EX-PLD-06 comparative user-value testing from the currently available minimal A/B/C prototype is **withdrawn**. Multiple early implementation attempts lacked a sufficiently coherent and usable integrated Prep interface. A bad result from those instruments would confound product utility with predictable UX shortcomings; technical operability, chat wireframes and individually polished panes do not establish comparison readiness.

**Priority now, clarified by Owner:** first examine a *coherent conceptual information model and adversarial fixture*, then elaborate an integrated user-facing concept over that model — Goal, Capability Description, reusable Knowledge (including meaningful K–K relationships), study materials and their contextual scopes/connections. [Q-PLD-17 / EX-PLD-10 protocol](model-fixture-investigation-brief-2026-10-13.md). Establish which relations are actually supported by data, what the user sees, and how they traverse, select and prepare material across all four sections. This is an exploratory **interaction/information model**, not an invitation to silently accept a canonical ontology or to infer measured personal abilities from Capability descriptions.

**Order of work:**

1. Assemble and reconcile model alternatives and representative interconnected data for **all four sections**; distinguish owned object properties, semantic links, context-specific objectives and assumptions, without inventing relation types.
2. Define the **end-to-end user journeys and information hierarchy** for navigating Goals, Capabilities, Knowledge and Materials, including what selection/context persists, how cross-section navigation works, and how a study subset is assembled. Reuse the agreed L0/L1 and coarse L2 shell.
3. Validate the entire concept as **connected clickable flows** (chat wireframes first) with realistic, consistent example data. Walk through normal, ambiguous and inconvenient scenarios; refine composition and clarity before writing a browser frontend.
4. Implement a coherent **browser prototype of that already-tested interaction concept**. Check internally that task paths are genuinely usable, interactions connected, and no comparable information is withheld by test arms.
5. **Only then** consider executing the original **EX-PLD-06 comparative study** against realistic existing-tool alternatives. Keep A/B/C/D task conditions and data parity when designing those later comparison arms.

**Stop rule for premature detail:** do not spend the current phase refining graph FPS, 3D camera controls, precise table columns, pixel geometry or a speculative Materials graph. These remain follow-on decisions unless they block a full journey. Conversely, do not classify integrated model/UX work as optional merely because an earlier limited prototype was technically built.

The existing A/B/C implementation and stress-renderer experiments remain useful **technical donors and negative design feedback**, not a validated comparative instrument, user observation or disproof of Prep. Graph-specific 2D/3D superiority tests remain optional/conditional; representative Knowledge relationships may nonetheless be necessary to make the integrated concept credible.

Detailed unknowns and statuses live **only** in [open questions](open-questions.md) and [open experiments](open-experiments.md); this report is neither a second decision registry nor an experiment status file.
