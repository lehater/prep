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
- [ ] FI-02 — minimum vertical Knowledge path.
- [ ] FI-03 — 3D renderer adapter.
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
