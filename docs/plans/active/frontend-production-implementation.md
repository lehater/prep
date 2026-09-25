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
- [ ] FI-04 — Learning workspace.
- [ ] FI-05 — Curation workspace.
- [ ] FI-06 — HTTP adapters and query cache.
- [ ] FI-07 — verification evidence and deployable frontend.

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
