# Frontend Decision Rebuild — Final OLD vs NEW Comparison

## Experiment boundary

This report is noncanonical experiment evidence. It is written only after the clean rebuild reached terminal completion.

- Prep original checkpoint: `eebaac86297a3e6a9bc1d9673838c619ddfc9f76`
- Prep rebuilt head: `d3a34f2e39ac313af9917a87a5c70a1a4e6e7539`
- Harness original checkpoint: `68c76bb92ceeedaa477041e38af86ff45134a53e`
- Harness final experiment head: `a13740421f33f6993baa6fc5235e6d26c33b28ee`
- Prep PR: #35, draft, base `experiment/decision-governance`
- Harness PR: #88, draft
- Final isolated validation run: `36286119812` — SUCCESS
- Production frontend code was intentionally not changed by this rebuild pass.

Final Roadmap:

- CURRENT rebuilt capabilities: **18 / 18**
- READY: **0**
- BLOCKED: **0**
- WAITING_UPSTREAM: **0**
- new blocking Core Questions introduced by the rebuild: **1**
- owning Authorities across the 18 rebuilt capabilities: **9**
- additional upstream Authority corrected during the experiment: **QUALITY-DESIGN**

## Evaluation method

The NEW chain was produced before reading the OLD versions of the 18 downstream artifacts.

The old artifacts were read only after all 18 rebuilt capabilities were semantically admitted CURRENT. Differences below are therefore classified after completion rather than used as NEW baseline inputs.

A difference is called **substantial** when it changes task responsibility, information architecture, navigation/view identity, presentation responsibility, runtime/deployment structure, component ownership, or implementation/release obligations. Wording/detail-only changes are not counted.

## Substantial differences

| # | Capability / decision cluster | OLD | NEW | Why the NEW chain changed | Classification |
|---|---|---|---|---|---|
| 1 | Task model: Knowledge representation | `TASK-L-EXPLORE-KNOWLEDGE` already required “list/search/detail and graph access” and graph/rendering degradation handling. | Knowledge tasks require find, focus, typed-relation inspection and traversal while explicitly leaving graph/3D/2D/list/tree/table/mixed presentation undecided. | Presentation choice was removed from Application/Task ownership and deferred to Human Interface Design. | **Substantial — earliest divergence** |
| 2 | Task model: external runtime status | Separate user goal/task existed to inspect runtime reachability/compatibility. | External study is an explicit user task outside Prep UI; review-result recording is SYSTEM work. Runtime failure is an operation state, not an independent product destination/task. | Rebuilt Task Model separated user learning work from integration/operational state. | **Substantial** |
| 3 | Knowledge information architecture | Separate target Knowledge and Curation Knowledge locations/workspaces. | One shared `IA-KNOWLEDGE` / `V-KNOWLEDGE` with explicit global vs target-relevant scope and explicit Learning/Curation context. | Canonical Knowledge identity is shared; mode/scope are context rather than duplicated information spaces. | **Substantial** |
| 4 | Learning topology | Target workspace contained Overview, Knowledge, Study and Statistics plus target selection. | Learning has Target, Study and Evidence task views; Knowledge is the shared root Knowledge view entered with target scope. Separate Overview is eliminated. | New task/journey structure no longer justified a four-section target mini-application. | **Substantial** |
| 5 | Curation topology / editor destinations | Collection and editor were separate product destinations for Targets, Knowledge, Requirements, RequirementSets and Questions. | Targets, Requirements and Questions each use one semantic task view; wide layouts may use master/detail and narrow layouts a focused substate. Knowledge curation actions occur in shared Knowledge under explicit Curation context. | Screen identity now follows task responsibility, not collection/editor UI mechanics. | **Substantial** |
| 6 | View count / navigation complexity | 19 topology nodes: 3 structural + **16 non-structural** screens/views, including runtime-status and separate collection/editor views. | 10 topology nodes: 1 structural + **9 non-structural** task views. | New topology removed duplicated/technical destinations and consolidated task-continuous work. | **Substantial** |
| 7 | Presentation shell | Persistent left rail, concrete desktop/narrow shell behavior, pixel/density ranges and exact graph workspace geometry were canonical Presentation System decisions. | Presentation System does not mandate rail/tabs/menu; it defines semantic hierarchy and lets Screen/View choose composition. Exact style values remain controlled freedom absent accepted visual/brand evidence. | Old Presentation System owned Screen/View and implementation-level decisions. | **Substantial** |
| 8 | Role of 3D / graph | Graph was “first-class”, graph-centered and the primary Knowledge workspace; toolbar/settings/performance profiles were canonical. | Textual/search/detail is the semantic/accessibility backbone. A **local 3D relational projection** is selected later through governed Presentation decision review; it is not universal UI or the only Knowledge path. | FORM/REVIEW compared graph vs non-graph, 2D vs 3D and single vs mixed access after upstream tasks stayed representation-neutral. | **Substantial** |
| 9 | Quality / graph performance ownership | QUALITY-DESIGN required graph-specific visible-node/edge envelopes, ~30 FPS, Graph Settings and Auto/Quality/Performance controls. | No current MVP numeric FPS/node/edge envelope. Representation-specific quality is conditional on HCI selecting that representation; graph controls belong downstream. | `Q-FRONTEND-GRAPH-CAPACITY-SCOPE` exposed a cross-Authority ownership leak. | **Substantial upstream correction** |
| 10 | System deployment topology | Separate frontend and backend Docker containers were required architectural runtime/deployable boundaries. | One Prep backend/server deployable plus browser-delivered static code is sufficient; independent frontend/backend deployment/scaling is not required. | System Architecture option review found no accepted driver for an independently deployable frontend boundary. | **Substantial** |
| 11 | Frontend architecture / component ownership | Knowledge Exploration and graph performance/profile state dominated frontend architecture; component design was initially centered on the Knowledge visualization prototype and concrete graph-oriented physical roots. | Browser architecture is task-oriented: Learning, shared Knowledge, Curation, backend adapter and isolated 3D projection adapter. Component boundaries follow user work; textual Knowledge exists independently of renderer. | Governed System Architecture + new Component Design decision review kept provider/renderer evidence below task ownership. | **Substantial** |
| 12 | Implementation design | Canonically selected exact Node/React/Vite/MUI/graph/test toolchain, specific production paths, graph performance correction slice, FPS/stress release obligations and frontend Docker release details. | Reuses the repository’s versioned tool environment as implementation context rather than semantic design; logical feature/task ownership drives slices; Knowledge semantic backbone precedes 3D donor integration; numeric graph benchmarks are diagnostic, not release gates; no independent migration contract is invented. | Implementation option review separated repository reality from upstream semantics and corrected an initially over-specified transition plan. | **Substantial** |

**Substantial changed decision clusters: 12.**

## Major decisions independently confirmed

The clean pass did not simply invert all prior work. It independently reconfirmed these substantial principles:

1. Learning and Curation are distinct work contexts.
2. Learning consumes prepared target scope read-only; canonical maintenance is explicit Curation work.
3. Canonical product/domain state remains backend-owned; browser state is interaction/cache state.
4. The browser must not integrate directly with Anki/external runtime.
5. Renderer/provider-specific objects and camera/physics state must stay behind an adapter seam.
6. Knowledge search/list/detail must remain usable independently of the 3D renderer.
7. A default universal mutable global frontend store is not justified; state stays at the narrowest appropriate owner.

**Independently reconfirmed major decision clusters: 7.**

## Earliest causal divergence

The first material difference is **`prep.task-model`**.

OLD Task Model had already embedded the solution form:

> learner Knowledge exploration requires graph access and graph/rendering fallback.

NEW Task Model instead specifies the information/work contract:

> find Knowledge, establish explicit global/target scope, focus a canonical item, inspect typed directed relationships, and traverse them.

That change propagates downstream:

```text
representation-neutral task
  -> representation-neutral journey
  -> shared Knowledge conceptual/IA model
  -> one shared Knowledge topology view
  -> presentation decision space becomes genuinely open
  -> mixed textual + local 3D presentation chosen
  -> task-oriented frontend architecture
  -> 3D becomes an adapter/donor, not product architecture
```

This is evidence that the original frontend problem was not only “bad CSS” or implementation quality. Solution assumptions were present above Presentation/Screen Design.

## Question / Authority result

New Core Question:

- **ID:** `Q-FRONTEND-GRAPH-CAPACITY-SCOPE`
- **Capability blocked at discovery:** `prep.presentation-system`
- **Authority:** `QUALITY-DESIGN`
- **Problem:** accepted Quality Design both measured graph quality and implicitly required a graph + Graph Settings UI before Human Interface Design selected a representation.
- **Resolution:** revise `prep.frontend-performance-capacity` so representation-independent quality stays canonical, numeric MVP graph targets are unaccepted, and graph-specific constraints become conditional on downstream representation selection.
- **Result:** Question resolved; no final blockers remain.

The existing `Q-KNOWLEDGE-GRAPH-3D-VALUE` was then resolved by the governed Presentation System decision: 3D is retained as a local relational projection paired with non-spatial semantic access.

## Where Harness caught problems

Harness/Core Question semantics successfully exposed the Quality/HCI ownership conflict once Presentation System depended on the graph-specific quality provider.

The sequential System Architecture pipeline also forced explicit alternatives and rejected, among other things:

- mandatory separate frontend/backend deployables;
- browser-owned canonical state;
- default WebSocket/duplex interaction;
- background worker/broker without an accepted driver;
- browser-direct external-runtime integration.

The final Implementation Design pipeline also forced migration/tooling/gate applicability to be explicit. During review, an invented “incremental internal cutover” transition policy was removed and the migration-transition axis was classified NOT_APPLICABLE for the current whole-artifact frontend scope.

## Where Harness initially missed problems

The initial Harness checkpoint did **not** decision-govern three knowledge kinds that materially choose frontend shape:

- `presentation-system-design`
- `screen-view-design`
- `component-design`

Without manual inspection, those capabilities would have used only:

`PRODUCE_CANDIDATE -> SEMANTIC_ADMISSION`

and the first semantically acceptable UI/component answer could have been admitted without FORM/REVIEW/CHOOSE.

This was a reproducible Harness coverage defect for the experiment goal.

Harness was changed only in:

- `spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml`
- `validators/validate_decision_governance.py`

Three decision contracts were added with tests:

- Presentation: knowledge representation, information density, control surface.
- Screen/View: view composition, detail/edit placement, responsive composition.
- Component: responsibility boundaries, provider seams, state ownership.

No Decision Pipeline engine/Core workflow mechanism was changed.

## Where option review prevented premature choice

Concrete cases:

1. **System Architecture** — rejected mandatory independent frontend/backend deployment, workers, duplex channels and dual-master state.
2. **Presentation System** — prevented inherited “graph-primary” assumptions; compared graph/non-graph, 2D/3D and single/mixed presentation before selecting textual backbone + local 3D.
3. **Screen/View Design** — prevented automatic recreation of collection/editor destinations and forced explicit wide/narrow composition and context preservation.
4. **Component Design** — challenged feature/task ownership against generic technical/horizontal component organization and provider leakage.
5. **Implementation Design** — challenged big-bang vs bounded slices, repository mapping, tooling, migration applicability, verification enforcement and delivery gates.

## Metrics

| Metric | Result |
|---|---|
| 1. CURRENT of 18 | **18 / 18** |
| 2. BLOCKED | **0 final** |
| 3. New Core Questions | **1** |
| 4. Authorities | **9 owning the 18; 10 touched including upstream QUALITY-DESIGN correction** |
| 5. Earliest difference | **prep.task-model** |
| 6. Substantial old decisions changed | **12 decision clusters** |
| 7. Independently confirmed | **7 major decision clusters** |
| 8. Harness missed without manual help | **decision-governance coverage for Presentation, Screen/View and Component Design** |
| 9. Review prevented premature choice | **5 concrete capability stages documented above** |
| 10. Harness changed | **Yes — 3 decision contracts + validator coverage; no pipeline-engine/Core mechanism change** |
| 11. Better problem formulation vs only docs | **Better problem formulation and architecture; not merely documentation. Production UX still needs implementation/prototype evidence.** |

## Experiment outcome

This experiment satisfies **Success A**.

The new pipeline materially changed the result through:

- a Core Question that exposed an upstream ownership error;
- explicit option formation/review for architecture and, after Harness correction, UI/component decisions;
- removal of graph-specific assumptions from Task/Journey/IA levels;
- changed topology and screen responsibilities;
- changed deployment/frontend architecture;
- changed component ownership and implementation slicing.

Therefore the original frontend difficulty cannot be attributed only to visual polish or code implementation quality.

At the same time, the clean pass independently preserved several sound old architectural principles, including backend canonical authority, explicit Learning/Curation separation and isolation of renderer/provider mechanics.

## Required stop

Per experiment rules, stop before major production frontend implementation.

The next experiment should implement/prototype the NEW Screen/View + Presentation decisions and compare user task performance / interface quality against the existing frontend. No merge to `main` is authorized by this report.
