# Capability / Goal semantics — working handoff

**Checkpoint:** 2026-10-12. **Repository:** `lehater/prep`. **Research branch:** `research/prep-capability-goal-semantics`. Branch originally forked from `mvp-vertical-slice` at `781f6aad64f0c98b165ffcdbde3e87f81952920d`.

This file records a **research handoff**, not authoritative product/domain status. For per-item state use [open questions](open-questions.md) and [open experiments](open-experiments.md). Always refresh GitHub/Harness state on the branch relevant to an engineering task.

## Where to resume

**Suggested next bounded check:** [EX-GF-01](open-experiments.md#ex-gf-01--goal-first-domain-model-stress-test), a Goal-first **semantic model stress test without frontend**. First freeze its S1–S4 fixture facts, alternative interpretations and falsification criteria; perform the same checks against the competing candidate models; then link the actual observations and limitations to the question/experiment lists. Do not report it as complete until the check has been carried out.

[EX-GF-02](open-experiments.md#ex-gf-02--goal-return-and-flat-versus-composed-user-workflow) concerns observed user behaviour and is separate; it is not implied by a semantic desk test. This suggested starting point does not impose a global order on unrelated questions.

Reference [baseline](research-baseline-2026-10-12.md), [Iterations 01–03](README.md), [research workflow](../WORKFLOW.md), [local AGENTS index](../AGENTS.md), and the current [question](open-questions.md) and [experiment](open-experiments.md) lists.

## Repository evidence boundary at this checkpoint

`mvp-vertical-slice` and Draft/BLOCKED [PR #101](https://github.com/lehater/prep/pull/101) have different candidate/canonical Core contents in the recorded snapshot. The candidate branch `prep/preparation-information-model-candidate` (head at snapshot `336b97969e964b30640f2367fcd2cb8488ff6e67`) was NOT the basis of the research branch. The three Tactical Questions in PR #101 — `Q-PREP-PREPARATION-IDENTITY-STRUCTURE`, `Q-PREP-PREPARATION-RELATIONSHIP-SEMANTICS`, and `Q-PREP-PREPARATION-REMOVAL-INTEGRITY` — were **candidate** questions; do not describe them as accepted or as published on the integration base without fresh verification.

## Canonical sources to recheck

- [.harness/core.yaml](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/core.yaml)
- [.harness/engineering-graph.yaml](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/engineering-graph.yaml)
- [.harness/project-publication.yaml](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/project-publication.yaml)
- [Product Intent](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/knowledge/product-intent.yaml)
- [Product Capabilities](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/knowledge/product-capabilities.yaml)
- [Domain Strategy](https://github.com/lehater/prep/blob/mvp-vertical-slice/docs/architecture/context-map.md)
- [Problem Evidence](https://github.com/lehater/prep/blob/mvp-vertical-slice/docs/discovery/problem-evidence.yaml)
- [User Needs](https://github.com/lehater/prep/blob/mvp-vertical-slice/docs/discovery/user-needs.yaml)

Branch links in this section identify the checkpoint source, NOT a permanent declaration of currentness.

## Explicit authority boundaries

**Owner-approved as source input, still not Harness-admitted tactical semantics:**
- IDENTITY = INSTANCE;
- STRUCTURE = DISTINCT-CONCEPTS (Knowledge, Goal, CapabilityDescription, PracticeMaterial);
- RELATION-IDENTITY = INSTANCE;
- D1 = SELECTIVE-ADMISSIBILITY of relation kinds.
These are four distinct approvals, not approval of an entire domain schema.

**Owner-confirmed product direction, not yet a Goal-first Product Requirements commitment:** the primary MVP learning scenario begins with a concrete Goal, explores what attaining it involves, uses knowledge/material outside Prep, incorporates recorded activity/results, then identifies the next preparation step.

**Research recommendations only:** Capability decomposition, Goal requires/targets, composition semantics, direction, multiplicity, cycles, removal behavior, procedure modeling, import mappings, and the order of admission.

**Accepted upstream scope, subject to recheck:** exploration of preparation information and relationships, differing perspectives, external selection/use, recorded activity/results, all-kind manual CRUD and bulk-loading. No mandatory fixed relationship taxonomy, source/provenance system, mastery/readiness estimation, automated Goal completion, or prescribed UI graph.

## Owner question captured after Iteration 03 (2026-10-12)

Owner selected **Capability-oriented Goal-first preparation (GF-01 option A)** with initially incomplete Goals, as Product Requirements input only. Owner also proposes optional progressive recursive Capability decomposition and asks whether an ordered composition would become an instruction. Existing desk research distinguishes Capability composition, prerequisite and Procedure but did not close ordering.

[Open questions](open-questions.md) now include **CD-06 (P1): composition versus execution order, prerequisite, and learning sequence**, referencing existing PR-01/02. Next narrow research pass: architecture, communication, strict-protocol and learning-order counterexamples; preserve Iterations 01–03 and still-open P0 owner gates. No new canonical or approved model decisions.

## Previous research checkpoints (historical; not current work instructions)

## Iteration 01 checkpoint (2026-10-12)

[Iteration 01](iteration-01-goal-capability-predicates.md) advances GD-00/GD-01/GD-02 by testing targeted outcomes, necessary conditions and user-selected current focus against learning, interviewing, personally performed protocol and outsourced certification Goals. It highlights the *overlap* of R/T for ability-outcome Goals, **unknown** necessity for underspecified interview criteria, and a Product Requirements gate for saved Goal-relative return/focus. No link type, scope invariant, relation catalogue or Core Question is approved or resolved; GD-03/04/05 and CD series remain open. Next owner decision: GD-00, then scoped GD-01/02.

## Iteration 02 checkpoint (2026-10-12)

[Iteration 02](iteration-02-conditional-relation-catalogue-and-mutation-tests.md) researches GD-03/04/05 **conditionally**: compares four Goal types, isolates material-purpose vs user-selected use, separates relation identity from proposition multiplicity, and tests deletion effects against the distinct Recorded Activity/Result context obligation. It makes no relationship admission, uniqueness, self-link, cascading deletion, reintroduction, Product Requirements, or Harness acceptance decision. Owner gates remain GD-00/01/02 and then the GD-03/04/05 decisions; next independent research may investigate CD-01..05 with a flat-vs-composed experimental comparison.

## Iteration 03 checkpoint (2026-10-12)

[Iteration 03](iteration-03-capability-description-composition-and-context.md) tests CD-01..05 concept boundaries, performance-aspect vs weak semantic inclusion, specialization/prerequisite/procedure confusions, flat-versus-recursive Goal-first using identical records, conditional DAG/shared-child/reachability invariants, and global composition versus Goal-specific focus. No empirical A/B user data, Owner admission, relation meaning, graph constraint or Harness acceptance. At this historical checkpoint an observed Goal-return/next-practice comparison was proposed; it was subsequently separated into the deferred EX-GF-02. The current semantic check is EX-GF-01; optional C–C remains unapproved.

## Transfer boundary

The research branch must not directly alter canonical Core, engineering graph or Publication, merge the Draft PR, or declare Harness acceptance/currentness. If owner choices become actionable engineering inputs, route them via the owning Authority and pinned Harness procedures. Keep future handoff updates short and rely on the question and experiment lists for item states rather than copying them here.
