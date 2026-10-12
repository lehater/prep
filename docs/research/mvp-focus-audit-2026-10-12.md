# Prep MVP focus audit — 2026-10-12

> NONCANONICAL, dated research/priority audit. Not a live project status register, Owner decision, Product Requirements revision, Harness semantic admission/currentness audit, implemented MVP or new mandatory workflow. Source snapshot and limitations follow.

## Executive finding

**The depth of semantic investigation has outrun evidence of first user value.** Three detailed Goal/Capability iterations and one bounded semantic desk check yielded useful constraints but did not establish that an actual person can use Prep to resume a Goal, review practice, and choose the next preparation action. Further ontology, recursion/cycle and procedure-order research now has diminishing MVP value.

**Recommended change of sequence:** choose one Goal-first user task → observe a cheap same-data mock walkthrough → make only bounded owner/product/domain decisions forced by that task → admit governed semantics and implement the vertical slice → finish full contractual MVP obligations. This recommendation does **not** approve a new scope or waive already accepted CRUD/bulk requirements.

## Evidence-based repository state

Checked 2026-10-12:
- `mvp-vertical-slice` @ `c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2`; `main` @ `6598bea6f77ed5719ff5f912d60e5e0e204382b2`. Research head before audit `0018683c7b5eedc34e13ea172f4361ce2fefafa2`. Draft [PR #101](https://github.com/lehater/prep/pull/101) open/blocked at head `336b97969e964b30640f2367fcd2cb8488ff6e67`.
- [Core](https://github.com/lehater/prep/blob/c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2/.harness/core.yaml) registers **five** canonical artifacts/Capabilities: Problem Evidence, User Needs, Product Intent, Product Capabilities and Domain Strategy. [Publication](https://github.com/lehater/prep/blob/c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2/.harness/project-publication.yaml) records five accepted semantic evaluations/lifecycle providers. Tactical Domain and later design/implementation Capabilities have not been admitted on this base. No independent pinned Harness CURRENT operation was run for this audit.
- [Product Capabilities](https://github.com/lehater/prep/blob/c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2/.harness/knowledge/product-capabilities.yaml) include **15 ACCEPTED** and **4 RETIRED** entries. Current released-MVP obligations include manual full CRUD and externally supplied bulk-load for **every admitted entity and relation kind**, exploration of information/relations/perspectives, material selection for external use, activity/result intake, and their time/subject-context examination. A tiny prototype is **not** the whole contracted MVP.
- [Domain Strategy](https://github.com/lehater/prep/blob/c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2/docs/architecture/context-map.md) distinguishes DS-01 Preparation Information from DS-02 Recorded Activity/Results; neither requires inferred learner mastery.
- [Legacy-document triage](https://github.com/lehater/prep/blob/c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2/docs/research/mvp-legacy-documents-2026-10-10.md) lists **28 unregistered/noncurrent** documents under docs/, including earlier learner gap/state semantics. The triage reports a docs inventory failure; this audit **did not rerun** the validator.
- There is a React/Vite [frontend composition root](https://github.com/lehater/prep/blob/c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2/frontend/src/app/composition/FrontendCompositionRoot.tsx) wired to [mock data/adapter](https://github.com/lehater/prep/blob/c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2/frontend/src/adapters/mock/scenario.ts), plus [e2e test source](https://github.com/lehater/prep/blob/c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2/frontend/e2e/preparation-shell.spec.ts). It demonstrates UI scaffolding, **not** a verified integrated backend or a user-validated current MVP. Current mock uses richer old Target/Gap/Evidence/learner-state assumptions that are **not** admitted by current Core.
- Owner-confirmed source inputs (not Tactical Harness acceptance): `IDENTITY=INSTANCE`, `STRUCTURE=DISTINCT-CONCEPTS`, `RELATION-IDENTITY=INSTANCE`, `D1=SELECTIVE-ADMISSIBILITY`, `GF-01 option A` = Capability-oriented Goal-first preparation with initially incomplete Goals. **GF-01 A does not settle GD-00** on saved goal-specific focus/return. The three blocking Tactical Questions remain in candidate PR #101, not base Core.

## Research value audit

| Work | Contribution | Priority disposition |
| --- | --- | --- |
| Goal-first; incomplete Goal; distinct core concepts | Defines correct initial product direction and avoids conflation | **P0 keep**, translate to one observable acceptance |
| Instance identity and selective admissibility | Simple already owner-confirmed source inputs | **Enough for now**; do not reopen without a falsifying issue |
| GD-00/01/02 on `requires` vs `targets` vs `focus`, unknown vs false | Important guardrail against false necessity in interview goals | **P0**: choose only the one fact needed by the first user task |
| GD-03/04/05 on relation kinds, duplicates, direction, deletion | Exposed admitted-kind CRUD/bulk cost, material-designed vs learner-selected use, DS-02 deletion boundary | **Stop open-ended exploration**; resolve actual chosen-kind integrity before contractual release |
| CD-01..06 on composition, specialization, prerequisites, cycles, sequence | Protects from conflating ability aspects and ordered protocols | **P1/later**; optional recursion only if flat Goal-first task is hindered |
| EX-GF-01 semantic model stress test | Conditional flat/composed representability; shared C does not identify Goal for Activity; procedural steps ≠ child ability order | **Completed desk check**, not user validation or engineering acceptance |
| CTDL-ASN/CASE/CaSS, provenance/equivalence, recursive ontology, 3D UI, procedure engine, inferred mastery | Future design options, not necessary for first proof | **Indefinite defer** until explicit task/use evidence |
| EX-GF-02 observed user task | Can answer whether Goal-return and optional composition aid meaningful user decisions | **Not run**, suitable cheap next evidence only if experiment question warrants it |

## One proposed value-validation task (not approved Product Requirements)

The person wants to prepare for a system design interview and does not yet know every required skill:
1. Create or reopen Goal G **with zero known C links**.
2. Identify/choose C = "estimate peak traffic"; choosing to work on it does **not** assert it is necessary for all such interviews.
3. Find/add M = workload estimation exercise; select material for external use.
4. Perform exercise externally; record Activity A and dated Result E in Prep.
5. Return to G and see **what actually happened for this G**, even if C is reused under another Goal.
6. Make an informed human next choice: repeat M, change focus or explore another C. No automatic mastery, readiness, score, inferred completion or prescribed learning path.

**Proposed success criterion:** user can explain Goal, what they practised, what was recorded and why they chose the next action. **Not tested with users**. The obligation to restore focus across sessions requires its own GD-00 owner/product choice; do not infer it from generic Goal-first wording.

**Prototype vs released MVP:** a small UI/mock can validate this scenario without backend or complete CRUD/bulk, but must be named *proof of value*, not a finished MVP under existing accepted [Product Intent](https://github.com/lehater/prep/blob/c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2/.harness/knowledge/product-intent.yaml). Omitting accepted capabilities from a released MVP requires explicit Product Requirements/Authority review and Harness routing.

## Recommended order and stop rules

**Now / P0**
- Owner review of this first user-visible loop and whether saved return/focus across sessions is necessary.
- Small same-data mock/paper UI test, using existing frontend shell/components only if legacy semantics stay isolated; gather actual behaviour/errors instead of more semantic hypotheticals.
- Determine minimum explicit Activity→Goal context with reused Capability, without inventing mastery or permanent history requirements.
- Select the first meaningful G–C link only if the tested journey requires it, then Product Requirements alignment and routed Harness Tactical decision/admission.

**Before calling anything the accepted MVP**
- Full user CRUD and externally supplied bulk-load for every admitted kind, consistency and delete/relationship integrity, history context/time, external selection/use and alternate relationship perspectives as current Product Requirements demand.
- Revalidate required canonical artifacts, published currentness via pinned Harness, actual tests, and classify/reconcile 28 legacy documents; do not merge blocked PR #101 as if complete.

**Later only when observed need arises**
- Optional recursive Capability composition, richer perspectives/search/multi-goal support, specialized import/export/adapters, strict procedure representation, proficiency inference, semantic equivalence, knowledge/competency framework interoperability, 3D graph UI.

**Stop rule:** Do not open another standalone GD/CD/ontology sub-investigation until a concrete user scenario or acceptance check fails for a specific semantic reason. Keep unresolved questions open in their **existing topic lists**, not in this snapshot.

## Compact owner decision packet — open, not silently selected

1. **V1 / Product:** Confirm that the first value check is one incomplete Goal → Capability → external practice → recorded Result → human next-step loop, not a planning/mastery engine.
2. **V2 / Product:** Is persisted, cross-session Goal-relative selected focus an MVP must-have or can initial experiment use a manually continued session?
3. **V3 / Tactical:** Which *exact* minimal G–C assertion solves the experiment's user query: `focus`, `targets`, bounded `requires`, or no admitted link yet? Do not mistake absence for false.
4. **V4 / DS-02:** If one C belongs to two Goals, what explicit Goal context must an Activity/Result retain while those items exist? Deletion aftermath is a separate later issue.
5. **V5 / Scope:** Keep a cheap proof-of-value milestone distinct from all presently accepted released-MVP commitments **or** formally reopen Product Requirements scope; do not silently shrink the contractual MVP.

**Handoff:** [research agent index](AGENTS.md), [workflow](WORKFLOW.md), [topic handoff](capability-goal-semantics/HANDOFF.md), [open questions](capability-goal-semantics/open-questions.md), [open experiments](capability-goal-semantics/open-experiments.md), [completed EX-GF-01](capability-goal-semantics/experiment-01-goal-first-model-stress-test.md). No application execution, human usability observations, validator rerun or Harness sync were performed in this audit.
