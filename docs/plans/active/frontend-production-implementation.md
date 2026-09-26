# Frontend Production Implementation

## Goal

Implement the canonical production frontend in dependency order without reopening accepted product/domain/interface semantics inside code.

Authority: `docs/implementation/frontend-implementation-design.md` plus its declared upstream canonical frontend artifacts.

## Constraints

- Work only in `research/problem-space-revalidation`.
- Do not merge or squash into `main` without explicit user authorization.
- Treat FI-01..FI-07 as implementation slices, not Harness stages/gates.
- Route any discovered semantic/ownership/dependency change back to the owning Authority before continuing that affected slice.
- Keep MUI replaceable and keep transport/renderer provider types behind their adapters.
- Prove FI-02 on mock adapters before production 3D renderer adoption.

## Execution

- [x] FI-01 — production frontend foundation.
- [x] FI-02 — minimum vertical Knowledge path.
- [x] FI-03 — 3D renderer adapter.
- [x] FI-04 — Learning workspace.
- [x] FI-05 — Curation workspace.
- [x] FI-06 — HTTP adapters and query cache.
- [x] FI-07 — verification evidence and deployable frontend.

## FI-01 scope

- fresh `web/` package with Node 24 / npm;
- React 19 / TypeScript 6 / Vite 8 boot;
- composition root, AppShell and routing skeleton;
- MUI ThemeProvider through `src/ui/theme`;
- Vitest, Playwright and oxlint;
- deterministic source-boundary checker with checker self-tests;
- production build and Dockerfile;
- CI commands based on `npm ci`;
- committed production `package-lock.json`.

## FI-01 validation

Verified by the FI-01 bootstrap workflow with Node 24, frontend unit/browser/build/container checks, Prep validators, strict semantic baseline and pinned Harness integration.

## CI cadence

Implementation feedback is intentionally tiered to avoid repeating expensive proof on every commit:

- non-`main` pushes that touch `web/**` run `frontend-fast`: reproducible install + typecheck + lint + boundary checks + Vitest;
- a newer push cancels an obsolete in-progress fast run for the same branch;
- pull requests to `main`, pushes to `main`, and manual validation are merge-candidate checkpoints;
- merge-candidate validation always runs repository/Harness checks;
- `frontend-full` runs at a merge-candidate checkpoint only when `web/**` or frontend CI rules changed, and adds production build + Playwright + Docker evidence;
- `test:e2e` assumes an already-built frontend so the host production build is not repeated inside the same full check.

During an FI slice, use targeted local tests while coding, rely on `frontend-fast` for branch-level feedback, and run the full merge-candidate validation only at a coherent slice checkpoint or before integration.

## FI-02 scope

- explicit Learning/Curation shell switch with one prepared LearningTarget context;
- target-scoped and global `KnowledgeScope` realization without changing canonical Knowledge identity;
- frontend-owned Knowledge models plus `KnowledgeQueryPort` and `TargetQueryPort`;
- `MockKnowledgeAdapter` / `MockTargetAdapter` as composition-root providers;
- server-style list/search by explicit scope, readable detail and non-graph keyboard access;
- loading, empty, unavailable and recoverable-failure presentation paths;
- URL-owned search/filter/selection/focus state so readable detail open/close preserves exploration context;
- renderer-neutral `GraphScene` / `buildGraphScene` projection and injected `GraphRenderer` contract;
- non-3D placeholder renderer only; no `react-force-graph-3d` or Three.js adoption before FI-03.

## FI-02 validation

The coherent FI-02 checkpoint at `16325a898233a8eeea32449accee167a2eb8b690` passed:

- TypeScript, oxlint and deterministic source-boundary checks;
- 4 Vitest files / 7 tests, including mock-port, route-context and graph-projection contracts;
- production Vite build;
- 4 Playwright browser tests covering shell boot, mode switching, target-context preservation, keyboard list/detail access, empty state and renderer-neutral fallback;
- production Docker image build;
- strict semantic baseline: 29/29 CURRENT-capable;
- pinned Harness integration with `FRONTEND-IMPLEMENTATION` COMPLETE, Engineering Coverage `completion_ready=true`, zero remaining work/questions, and strict semantic/currentness COMPLETE;
- documentation, architecture, question-bank validators and 28 Python unit tests.

No frontend semantic/ownership/dependency change was required during implementation, so no upstream Authority was reopened.

## FI-03 scope

- pinned `react-force-graph-3d@1.29.1`, `three@0.180.0` and matching `@types/three`;
- concrete provider imports confined to `src/adapters/graph-rfg3d/**`;
- renderer-private graph-data mapping so provider coordinates/forces/Three.js objects cannot mutate or escape into `GraphScene`;
- explicit relation direction/type through directional arrows and relation labels;
- semantic node identity preserved while layout geometry remains adapter-owned;
- deterministic click-without-drag versus drag gesture boundary using the experiment's proven pointer-threshold approach;
- drag mutates presentation coordinates only and never emits semantic activation;
- WebGL2 preflight and runtime error boundary with list/search/detail still available;
- opaque renderer-family viewport snapshots represented only as numeric camera/target data;
- trackball damping plus idle/visibility pause behavior adapted from experiment evidence to avoid permanent rendering load;
- no experimental PaymentGraph fixtures, routes, Storybook state ownership, instanced nodes or batched-link layers imported into production.

## FI-03 validation

The coherent FI-03 checkpoint at `6750bb491013f90dee2c78cc44ce1c9054ac6354` passed:

- TypeScript, oxlint and deterministic provider-boundary checks;
- 6 Vitest files / 12 tests, including renderer semantic-isolation and click-vs-drag contracts;
- production Vite build;
- 4 Playwright browser tests with the real RFG3D adapter or its WebGL fallback while non-graph Knowledge access remains usable;
- production Docker image build;
- npm audit: 0 vulnerabilities;
- strict semantic baseline: 29/29 CURRENT-capable;
- pinned Harness integration with `FRONTEND-IMPLEMENTATION` COMPLETE, Engineering Coverage `completion_ready=true`, zero remaining work/questions, and strict semantic/currentness COMPLETE;
- documentation, architecture, question-bank validators and 28 Python unit tests.

No upstream Authority was reopened. The historical experiment remains implementation evidence only.

## FI-04 scope

- prepared LearningTarget search/selection with no Learning-side target mutation;
- persistent target context with Overview, Knowledge, Study and Statistics sections;
- read-only Requirement/RequirementSet scope plus exact current Knowledge/Question material counts;
- consumer-owned Target, Question, Study and Learning Statistics ports with mock adapters;
- target Question browse/detail plus Question -> Knowledge navigation preserving the target and focusing every aligned canonical Knowledge id;
- Study Set build, exact inspected preview, materialization-token export, partial/conflict/unavailable/failure outcomes and retry/rebuild context preservation;
- factual ReviewObservation aggregates/history plus explicit user-triggered review sync, with no mastery/readiness/retention inference;
- Machine Interface collection result refinement to expose exact `total_count` for the current semantic query/scope while keeping opaque cursor representation transport-private.

## FI-04 validation

FI-04 completion evidence is intentionally split to avoid repeating expensive checks after a selector-only browser-test repair:

- repository/Harness checkpoint `2107fef0360532393c4f33623086990c274bcc32` proved the implementation and the initial Machine Interface refinement against repository validators;
- frontend recheck `0b2277ff8c979efb6f42c6d83dbfa38b88654f3f` passed typecheck, oxlint, deterministic boundary checks, 9 Vitest files / 19 tests, production Vite build, 9 Playwright browser tests, Docker build and npm audit with zero vulnerabilities;
- the Machine Interface acceptance identity change was propagated through its Engineering Graph dependency frontier: 16 affected capability reviews were explicitly revalidated, with downstream Verification/Test/Implementation contracts clarified where `total_count` crosses the adapter boundary;
- lifecycle recheck `66628a1c261a9ee17ddce11299c14f447f76b03b` passed strict semantic baseline with 29/29 CURRENT-capable lifecycle assertions, pinned Harness integration with `FRONTEND-IMPLEMENTATION` COMPLETE and `completion_ready=true`, documentation/architecture/question validators and all 28 Python tests.

No Learning implementation exposes Curation mutation behavior. The only upstream semantic change was the accepted collection-count contract needed by the already-canonical Overview responsibility; dependent capabilities were revalidated rather than silently left current.

## FI-05 scope

- dedicated Curation-owned frontend models and consumer ports for LearningTargets, Knowledge mutation, Requirements/RequirementSets, Questions and prepared-data Import; no Curation dependency on Learning internals;
- one composition-root mock state shared by Curation and learner/query adapters so accepted Curation mutations are observable through the same canonical Learning/Knowledge identities;
- learner material is derived from the current target -> Requirement/RequirementSet -> Knowledge -> Question chain rather than frozen target fixture lists;
- Targets collection/editor with search, create/update, Requirement/RequirementSet scope composition and Preview in Learning;
- Knowledge collection/graph plus create/update, semantic-kind editing, typed relation add/remove and contextual Import;
- Requirements/RequirementSets collection/editors with definition/content ownership, deterministic display labels, Requirement-to-Knowledge alignment and acyclic RequirementSet membership;
- Questions collection/editor with accepted structural aligned/unaligned filtering, direct-answer editing and explicit Knowledge alignment;
- contextual prepared-data document intake with aggregate/item outcomes, validation preservation and representative typed KnowledgeRelation import behavior;
- recoverable validation/operation feedback preserves current input/editor context;
- no mastery/readiness/coverage-grade semantics introduced by Curation.

## FI-05 validation

FI-05 used tiered validation so expensive proof was not repeated after every implementation commit:

- data-boundary and UI iterations used the permanent `frontend-fast` path; the final semantic-alignment fast run passed after deriving learner material from current Curation state and removing the unaccepted independent Requirement title field;
- repository/Harness checkpoint `846307c5b1c0719536b3c3e4769364ec9c73eea8` passed strict semantic baseline with 29/29 CURRENT-capable lifecycle assertions, pinned Harness integration with `FRONTEND-IMPLEMENTATION` COMPLETE and `completion_ready=true`, documentation/architecture/question validators and all 28 Python tests;
- no canonical product/domain/interface/architecture knowledge changed during the later code-only FI-05 fixes, so the repository/Harness semantic checkpoint remained applicable and was not rerun;
- final frontend recheck `f28791c82332b36e49c91add3fb52315cd770c04` passed typecheck, oxlint, deterministic boundary checks, 10 Vitest files / 25 tests, production Vite build, all 15 Playwright browser tests, Docker build and npm audit with zero vulnerabilities.

Semantic audit before completion corrected three implementation defects rather than promoting them into authority: lost operation feedback after Knowledge detail refresh, frozen learner material that ignored Curation scope/alignment changes, and an independently editable Requirement title absent from the accepted Requirement contract.

## FI-06 scope

- pinned `@tanstack/react-query@5.103.2` behind the HTTP data-access boundary, with query keys based on Machine Interface operation identity plus semantic input;
- versioned `HttpOperationClient` that executes accepted Machine Interface operation IDs while keeping concrete HTTP path/verb and cache mechanics implementation-local;
- adapter-private DTO definitions and runtime-validating DTO -> frontend-model mappers; incompatible enum/relationship representation becomes frontend failure rather than silent coercion;
- exact collection `total_count` preserved as consumer-owned `totalCount`, while opaque `next_cursor` is validated and terminated inside the HTTP boundary;
- production HTTP implementations for Learning Target, Knowledge, Question, Study, Statistics, Curation Target/Knowledge/Requirement/Question/Import and external-runtime status ports;
- accepted machine outcomes translated into existing frontend-owned success/not-found/validation/conflict/unavailable/partial/failure states, including semantic envelopes returned with non-2xx HTTP status;
- successful mutations invalidate cached machine reads coarsely and safely; recoverable non-success query outcomes are not retained as reusable cached success;
- composition-root-only provider selection between mock and HTTP implementations through `VITE_PREP_DATA_PROVIDER` / `VITE_PREP_API_BASE_URL`;
- shell runtime-status affordance backed by the accepted `integration.external_runtime.status.get` operation;
- production Docker build defaults to the HTTP provider while deterministic host/browser evidence retains the mock provider;
- Knowledge list input narrowed to the already-accepted single active `semantic_kind`, avoiding client-side union/filtering of arbitrary partial server pages.

## FI-06 validation

The coherent FI-06 checkpoint at `6447acd92ef0fecd26a0f69f5a6b18b8fca8ab75` passed:

- TypeScript, oxlint and deterministic source-boundary checks;
- 11 Vitest files / 32 tests, including DTO identity/`total_count`, cursor isolation, mock/HTTP substitutability for Knowledge/Target/Question/runtime status, cache invalidation, accepted machine-outcome translation, partial external failure and incompatible-semantic rejection;
- production Vite build;
- all 15 Playwright browser tests, including the shell external-runtime status affordance;
- production Docker image build with the HTTP provider as the container-build default;
- npm audit: zero vulnerabilities;
- strict semantic baseline: 29/29 CURRENT-capable;
- pinned Harness integration with `FRONTEND-IMPLEMENTATION` COMPLETE, Engineering Coverage `completion_ready=true`, zero remaining work/questions, and strict semantic/currentness COMPLETE;
- Frontend UX closure ACCEPTED with 19 topology views and Frontend Test Design ACCEPTED with 13 executable contracts;
- documentation, architecture, question-bank validators and all 28 Python tests.

The FI-06 implementation did not change canonical product/domain/interface/architecture meaning. Concrete HTTP serialization/routing, query-key construction and coarse cache invalidation remained implementation freedoms; the single-kind Knowledge query shape was aligned to the existing Machine Interface rather than reopening that Authority.

## FI-07 scope

- close every applicable Frontend Verification / Frontend Test Design / Presentation Verification obligation with concrete implementation evidence rather than new semantics;
- add a real Tab/Enter-only Knowledge browser scenario with visible-focus assertions;
- add an HTTP-provider browser scenario for loading, loaded, empty, recoverable operational failure/retry/context preservation and external-runtime unavailable/recovery states;
- preserve the permanent authoritative release gate while adding dependency audit and image identity verification;
- pin Node/nginx container bases by immutable digest and record the frontend commit identity in an OCI image label;
- record neutral 3D-vs-list task evidence, explicitly separating automated correctness/action-count proxies from unmeasured human time/disorientation;
- audit and remove prototype-only diagnostics/settings/Storybook/PaymentGraph/snapshot-sync residue from the production module inventory;
- keep `Q-KNOWLEDGE-GRAPH-3D-VALUE` unresolved because current evidence does not establish a human task-performance advantage.

## FI-07 validation

The final FI-07 checkpoint at `260a614df945164f51f7f72474e9007a99339412` (workflow run `36197719886`) passed:

- permanent `frontend-fast` on the same commit passed reproducible install, typecheck, oxlint, deterministic source-boundary checks and Vitest;
- 11 Vitest files / 32 tests passed;
- npm audit reported zero vulnerabilities;
- production Vite build passed;
- 17/17 Playwright browser tests passed across mock-provider and production-HTTP-provider projects, including real Tab/Enter-only Knowledge access with `:focus-visible` assertions and deterministic server-backed loading/loaded/failure-retry/empty/runtime-unavailable states;
- digest-pinned production Docker image built successfully and embedded OCI revision `260a614df945164f51f7f72474e9007a99339412`; built image id was `sha256:3c3d1e4fafbfbaa4a28705e95e6a9bd89ef77d42851664ae99fee215180d3d7a`;
- strict semantic baseline passed with 29/29 CURRENT-capable lifecycle assertions;
- Frontend UX closure remained ACCEPTED with 19 topology views and Frontend Test Design remained ACCEPTED with 13 executable contracts;
- pinned Harness integration reported `CURRENT-REVALIDATION`, `FRONTEND-PROTOTYPE` and `FRONTEND-IMPLEMENTATION` COMPLETE; `FRONTEND-IMPLEMENTATION` Engineering Coverage remained `completion_ready=true`, `remaining_work=0`, `questions=0`, with strict semantic/currentness COMPLETE;
- documentation validation passed for 158 Markdown files, architecture validation passed, question-bank validation passed, and all 28 Python tests passed;
- production-tree residue audit found no PaymentGraph, KnowledgeGraphSnapshot/source-sync, Storybook tuning, diagnostics/settings workspace or experiment-named production module.

FI-01 through FI-07 are complete on this branch. The 3D renderer remains a first-class but non-exclusive presentation hypothesis: current automated evidence proves semantic correctness and equivalent canonical access, but does not establish a human task-performance advantage, so `Q-KNOWLEDGE-GRAPH-3D-VALUE` remains intentionally unresolved.

## Reopened frontend correction — spatial/performance closure

Manual review of the running frontend exposed an upstream design defect rather than a local CSS defect:

- low-fidelity frames visually suggested a dominant graph, but Screen/View Design explicitly left responsive layout unconstrained;
- the Harness Screen/View skill required responsive transformations, while machine validation did not enforce them;
- `docs/architecture/performance-capacity.md` contained valuable graph scale/degradation targets but was not registered in Core/Engineering Graph, so downstream frontend knowledge could remain COMPLETE without consuming it.

The canonical frontend closure has therefore been reopened. FI-01..FI-07 remain historical implementation evidence against the previous baseline; they are not the current completion frontier.

- [ ] FRC-01 — Knowledge workspace spatial/performance correction and renewed evidence — REOPENED by post-qualification live UX review.

FRC-01 must implement the revised dominant-graph frames, graph control surface and semantic-preserving performance profiles; adapt eligible renderer mechanics from `experiments/knowledge-representation-3d`; and record hardware-accelerated 1k/2k/5k evidence before production frontend closure is claimed again.

## FRC-01 implementation and CI evidence

Checkpoint `240dc04f14f9b1a853aa3917e5a545989aa91b5f`, workflow run `36205548385`, passed the previously defined FRC-01 evidence. That completion claim was later invalidated by live interface review because the evidence did not cover renderer lifetime across Knowledge selection and exercised wide spatial dominance only at 1920px.

Passed evidence:

- permanent `Frontend fast`: PASS;
- pinned Harness strict semantic baseline: **30/30 CURRENT-capable**;
- Frontend UX closure: **19 topology views ACCEPTED**;
- Frontend Test Design: **17 executable contracts ACCEPTED**;
- `FRONTEND-IMPLEMENTATION`: COMPLETE, Engineering Coverage `completion_ready=true`, `remaining_work=0`, `questions=0`, strict semantic/currentness COMPLETE;
- repository docs/architecture/questions validators and **28/28 Python tests**;
- frontend deterministic checks: **14 Vitest files / 41 tests PASS**;
- npm audit: **0 vulnerabilities**;
- production Vite build: PASS;
- browser verification: **21/21 Playwright PASS**;
- production Docker build and OCI revision identity: PASS;
- software-rendered stress evidence: **1k/5k, 2k/10k, 5k/25k PASS** with optimized strategy, pixel ratio 1, 2 draw calls and deterministic idle pause.

Observed CI stress measurements used ANGLE SwiftShader and therefore are **not** accepted as hardware FPS evidence:

- 1k nodes / 5k edges: ~38.5 sampled FPS, 36k triangles, settle ~5.25s;
- 2k nodes / 10k edges: ~16.7 sampled FPS, 72k triangles, settle ~5.34s;
- 5k nodes / 25k edges: ~7.45 sampled FPS, 180k triangles, settle ~5.52s;
- all three reached `idlePaused=true`.

The optimized path materially reduces renderer object/draw pressure, but these frame-rate values describe SwiftShader software rendering only.

### Physical hardware qualification — COMPLETE

The final hardware benchmark was executed from the production branch state using the strict `npm run benchmark:graph:hardware` gate with headed Chromium and software rasterization disabled.

Renderer identity:

- vendor: `Google Inc. (VMware, Inc.)`;
- renderer: `ANGLE (VMware Inc., SVGA3D; build: RELEASE; LLVM;, OpenGL ES 3.0)`;
- `softwareRenderer=false`.

Measured Performance-profile results:

- **1k nodes / 5k edges:** ~56.5 FPS, 2 draw calls, 36k triangles, idle pause PASS;
- **2k nodes / 10k edges:** ~57.1 FPS, 2 draw calls, 72k triangles, settle ~5.48s, idle pause PASS;
- **5k nodes / 25k edges:** ~23.8 FPS, 2 draw calls, 180k triangles, settle ~5.48s, idle pause PASS.

The accepted ordinary **2k / 10k ≥30 FPS** hardware target is satisfied. The 5k / 25k workload is a stress envelope rather than an ordinary-frame-rate target; its measured degradation is recorded and remains semantically correct/responsive enough for stress evidence.

### Post-qualification live-review correction — REOPENED

Live use exposed a concrete state-lifetime defect: Curation passed a semantically identical but referentially new global Knowledge scope on selection. KnowledgeExplorer effects depended on object identity, so selecting a Knowledge item re-entered list/graph loading and replaced the live renderer, producing visible page/graph jitter.

Correction commit `603e7114ade6aa311a232f13c61ed9fec79249ef`:

- stabilizes Knowledge scope by semantic value before query effects;
- preserves the live graph renderer across ordinary selection/detail changes;
- narrows supporting wide-layout panes and reduces shell edge padding so the graph receives a larger share on 1366px-class desktops;
- moves the wide responsive executable check from 1920x1080 to 1366x768;
- adds a browser regression asserting that Knowledge selection does not disconnect/replace the live graph renderer.

Permanent `Frontend fast` run `36207434077` passed the selection-lifetime correction.

A subsequent manual screenshot exposed a second implementation defect: the graph region itself expanded correctly, but the WebGL canvas remained at the renderer's initial `960x600` fallback size. Root cause: the ResizeObserver effect ran only on the first render while WebGL availability was still unknown, found no mounted renderer container, and never retried.

Viewport correction commit `e8c10e3ba47145c8e8a0c3f18061466b681e0659`:

- starts graph measurement only after WebGL availability mounts the renderer container;
- applies an immediate measured size and keeps it synchronized with ResizeObserver;
- adds browser assertions that the actual canvas fills the renderer viewport at ordinary desktop and mobile sizes;
- preserves the previously added renderer-lifetime regression.

Requalification workflow run `36208046392` passed:
- strict semantic baseline **30/30 CURRENT-capable**;
- Frontend UX closure **19 topology views ACCEPTED**;
- Frontend Test Design **18 executable contracts ACCEPTED**;
- `FRONTEND-IMPLEMENTATION` COMPLETE with Engineering Coverage `completion_ready=true`, `remaining_work=0`, `questions=0`;
- repository validators and **28/28 Python tests**;
- **14 Vitest files / 41 tests PASS**;
- production Vite build PASS;
- **22/22 Playwright PASS**, including selection renderer continuity and canvas-to-viewport sizing.

Permanent `Frontend fast` run `36208046305` also passed on the viewport correction commit.

FRC-01 remains reopened only for manual confirmation of the corrected running UI. No new frontend feature slice is implied.


### Visual-density/live-design correction

Manual review at browser 100% zoom confirmed that the spatial regions were technically responsive but the realization still looked like unstyled provider defaults: oversized workspace typography, tall controls, redundant explanatory copy, excessive chrome height and no explicit density system.

The implementation correction therefore treats exact typography, spacing, control density and breakpoint numbers as the downstream Implementation Design responsibility already allowed by Presentation System. The first realization pass establishes a compact 13–14px workspace text scale, 18–22px headings, 28–32px controls, normal-case buttons, 1280px-class wide frame, 900px-class narrow transition, approximately 200/280px supporting panes and viewport-derived graph height. Product/domain/interface semantics are unchanged.


Visual-density checkpoint workflow run `36208874015` passed after preserving the full accessible Curation heading context while keeping the visible chrome compact:

- strict semantic baseline: **30/30 CURRENT-capable**;
- Frontend UX closure: **19 topology views ACCEPTED**;
- Frontend Test Design: **18 executable contracts ACCEPTED**;
- `FRONTEND-IMPLEMENTATION`: COMPLETE, Engineering Coverage `completion_ready=true`, `remaining_work=0`, `questions=0`;
- repository validators and **28/28 Python tests**;
- **14 Vitest files / 41 tests PASS**;
- production Vite build PASS;
- **22/22 Playwright PASS**.

The correction is not yet accepted as a successful visual design outcome until manual review of the running 100%-zoom desktop UI confirms the density, hierarchy and workspace proportions.


### Live graph/navigation correction

Manual use exposed three implementation defects not caught by the previous closure:

- the ordinary graph inherited a `settle-and-pause` default and a hard 5.5-second renderer pause from performance work, reproducing a visible freeze after approximately five seconds;
- graph node activation passed `focus=true`, so simple selection implicitly narrowed topology, despite the accepted distinction between selection/detail and explicit focus;
- global Knowledge browsing rendered the whole collection as a persistent list, which does not scale to large corpora.

Correction commit `7678e449986bc58648b53fe7210af65e1e792c9e` separates selection from focus, keeps standard Auto graphs interaction-ready, preserves wakeable idle pause for optimized/degraded paths, makes global browse/results collapsed and bounded, and moves desktop mode/section navigation into a persistent left rail.

The experimental R2 implementation was used as donor evidence for these interaction mechanics. Its PaymentGraph semantics, Storybook tuning and experiment-specific product state remain excluded.


Live-interaction checkpoint workflow run `36210994698` passed after the graph/navigation/list correction:

- strict semantic baseline: **30/30 CURRENT-capable**;
- Frontend UX closure: **19 topology views ACCEPTED**;
- Frontend Test Design: **19 executable contracts ACCEPTED**;
- `FRONTEND-IMPLEMENTATION`: COMPLETE with Engineering Coverage `completion_ready=true`, `remaining_work=0`, `questions=0`;
- repository validators and **28/28 Python tests**;
- **14 Vitest files / 42 tests PASS**;
- production Vite build PASS;
- **22/22 Playwright PASS**.

The temporary checkpoint workflow is removed after recording this evidence. Manual live-use confirmation remains required before FRC-01 is reclaimed as COMPLETE, specifically for sustained graph interaction and navigation/list usability.


### Canonical visual-specification pass

The accepted design sketch is now translated into buildable canonical presentation knowledge rather than retained as a visual-only reference.

Presentation System revision 4 now specifies:

- compact typography hierarchy and control density;
- spacing rhythm, surface/border/elevation roles and icon usage;
- persistent approximately 200-220 px desktop left navigation rail;
- wide Knowledge workspace geometry with optional approximately 200-240 px results pane, flexible dominant graph and approximately 280-320 px detail/editor pane;
- compact header/actions and one graph toolbar task band;
- bounded/search-first Knowledge results behavior;
- dark graph workspace treatment, selected-node emphasis without implicit focus and optional compact status/minimap utilities;
- wide >= approximately 1280 px, compact approximately 900-1279 px and narrow < approximately 900 px transformations.

Screen/View Design, Presentation Verification, Frontend Test Design and Implementation Design are revalidated downstream. The specification intentionally uses accepted ranges/roles rather than pixel-perfect screenshot equality so provider/CSS mechanics remain replaceable without reopening product semantics.


Visual-specification checkpoint run `36212315132` passed after canonicalizing the sketch into Presentation/Screen contracts:

- strict semantic baseline: **30/30 CURRENT-capable**;
- Frontend UX closure: **19 topology views ACCEPTED**;
- Frontend Test Design: **20 executable contracts ACCEPTED**;
- `FRONTEND-IMPLEMENTATION`: COMPLETE with Engineering Coverage `completion_ready=true`, `remaining_work=0`, `questions=0`;
- documentation, architecture and question validators PASS;
- **28/28 Python tests PASS**.

The temporary checkpoint workflow is removed after recording this evidence. This validates documentation/currentness consistency; it does not claim the existing frontend already realizes the newly accepted visual specification.


### Canonical visual-spec reference implementation

The Curation / Knowledge screen is now being used as the reference implementation for Presentation System revision 4. The pass aligns the running UI with the accepted sketch/specification rather than merely preserving structural responsiveness:

- quieter persistent left navigation rail with explicit selection hierarchy and bottom runtime status;
- compact Curation Knowledge header/helper with authoring actions visually aligned to the header area;
- one bordered graph toolbar containing search, browse, filters, graph commands and visible Auto/Quality/Performance segmented profile control;
- bounded results with explicit selected-row treatment;
- graph title/status moved onto the dark graph surface so the canvas reads as one continuous primary workspace;
- bounded white detail/editor support pane with denser relation presentation;
- browser assertions extended for shell/profile visibility and selection-without-focus behavior.


Canonical visual reference checkpoint run `36213841539` passed for the Curation / Knowledge reference implementation:

- strict semantic baseline: **30/30 CURRENT-capable**;
- Frontend UX closure: **19 topology views ACCEPTED**;
- Frontend Test Design: **20 executable contracts ACCEPTED**;
- `FRONTEND-IMPLEMENTATION`: COMPLETE with Engineering Coverage `completion_ready=true`, `remaining_work=0`, `questions=0`;
- repository validators and **28/28 Python tests**;
- **14 Vitest files / 42 tests PASS**;
- production Vite build PASS;
- **23/23 Playwright PASS**.

The browser suite now includes explicit evidence that bounded Knowledge-result selection produces a visible selected row while preserving graph membership and not introducing implicit focus. The temporary checkpoint workflow is removed after recording this evidence.

This establishes Curation / Knowledge as the first reference implementation of Presentation System revision 4. Manual visual review remains the acceptance gate before propagating the same visual system to the remaining screens.


### P0 Auto graph freeze correction

Manual use on the canonical visual reference exposed a duplicated configuration source that reintroduced the previously fixed five-second freeze.

Root cause:

- `DEFAULT_GRAPH_RENDER_PREFERENCES` had already been corrected to `physics: "on"`;
- `graphPreferencesForProfile("auto")` still returned `physics: "settle-and-pause"`;
- the renderer therefore considered ordinary Auto mode eligible for the 5.5-second settle timer and called `pauseAnimation()`.

The correction removes implicit physics degradation from Auto entirely:

- Auto profile now requests `physics: "on"`;
- renderer strategy no longer converts optimized Auto physics to `settle-and-pause`;
- timed idle pause is keyed only by an explicit non-live physics preference, not by optimized renderer family;
- Performance may still request `settle-and-pause` explicitly;
- regression coverage waits beyond the former 5.5-second threshold and verifies the public Auto settings remain `physics: on`.


Auto live-physics checkpoint run `36214168456` passed after removing the hidden Auto pause:

- strict semantic baseline: **30/30 CURRENT-capable**;
- Frontend UX closure: **19 topology views ACCEPTED**;
- Frontend Test Design: **20 executable contracts ACCEPTED**;
- `FRONTEND-IMPLEMENTATION`: COMPLETE with Engineering Coverage `completion_ready=true`, `remaining_work=0`, `questions=0`;
- repository validators and **28/28 Python tests**;
- **14 Vitest files / 44 tests PASS**;
- production Vite build PASS;
- **24/24 Playwright PASS**.

The browser suite now waits beyond the former 5.5-second pause threshold in public Auto mode and verifies that live physics remains `on` and the graph continues accepting graph commands. The temporary checkpoint workflow is removed after recording this evidence.
### Mock Knowledge corpus refresh

The global frontend mock corpus now uses two bounded groups of real Concept Cards from `lehater/knowledge-graph@main` instead of the synthetic payment donor snapshot:

- Asynchronous Programming: Asynchronous Programming, asyncio, Async Runtime, Event Loop, Coroutine, Task, async/await, Cancellation;
- Access Control: Access Control Policy, Access Control Matrix, Access Control List, Capability List, Role-Based Access Control, Attribute-Based Access Control.

The fixture preserves the Knowledge Graph immutable Concept Card IDs and source paths. Knowledge Graph V2 human-facing wikilinks remain explanatory links rather than a required typed-relation registry, so the Prep fixture projects only relations whose source prose explicitly supports Prep's accepted `realizes` meaning. Broader Knowledge Graph `kind` values are retained as fixture provenance and narrowed only at the frontend-model boundary.


### Knowledge relation vocabulary expansion

- Revalidated Prep relation semantics against the pre-V2 Knowledge Graph typed-relation research and current V2 external-consumer boundary.
- Canonical Prep relation vocabulary now includes `addresses` plus the eight historically admitted Knowledge Graph types: `uses`, `specializes`, `part_of`, `depends_on`, `realizes`, `produces`, `derives_from`, `enables`.
- Historical Knowledge Graph candidates without sufficient admission evidence remain excluded; no generic `related_to` fallback is introduced.
- Real Knowledge Graph mock fixtures now preserve source-supported `uses` as well as `realizes` edges instead of collapsing all imported relations to one type.
- Research evidence: `docs/research/knowledge-relation-vocabulary-evaluation.md`.
