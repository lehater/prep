# Prep: Capability / Goal semantics — research handoff

**Status:** NONCANONICAL RESEARCH HANDOFF. Not an Authority decision, accepted artifact, approved relationship catalog, Harness acceptance, currentness evidence, or alternative registry of engineering truth.

**Research checkpoint:** 2026-10-12. **Repository:** lehater/prep.
**Research branch:** research/prep-capability-goal-semantics, forked from mvp-vertical-slice at 781f6aad64f0c98b165ffcdbde3e87f81952920d.
**Related candidate:** Draft/BLOCKED PR #101, head prep/preparation-information-model-candidate, snapshot 336b97969e964b30640f2367fcd2cb8488ff6e67. The candidate is NOT the base of this research branch.

## Why these notes exist

Preserve the conclusions, counterexamples, external precedents, owner-confirmed inputs, and unresolved questions of a long multi-chat investigation. Another chat can resume at the next decision without treating past chat history as canonical domain meaning.

This research branch is isolated from mvp-vertical-slice, the PR #101 head, main, Core, and Publication. Files in docs/research/ are explicitly classified as noncanonical by tools/validate_docs.py. Do not allow this folder to become a competing artifact inventory, domain model, decision ledger, or progress authority.

## Read in this order

1. [Research baseline](research-baseline-2026-10-12.md): the substantive findings, proposed concepts, test cases, primary references, evidence boundaries.
2. [Iteration 01: Goal–Capability and incompleteness](iteration-01-goal-capability-predicates.md): completed research pass on GD-00/01/02, explicit counterexamples, smallest Goal-first walkthrough and owner decision cards; **no decisions approved**.
3. [Iteration 02: Conditional relation catalogue, direction/duplicates, and removal](iteration-02-conditional-relation-catalogue-and-mutation-tests.md): research-only GD-03/04/05 test cases and candidate scope, **no admitted types or rules**.
4. [Iteration 03: Capability meaning, recursion and context](iteration-03-capability-description-composition-and-context.md): CD-01..05 desk investigation, controlled comparison design, owner cards, no admitted composition.
5. [Open experiments](open-experiments.md): bounded hypothesis checks, conditions, owner questions and result links. Unlike the canonical Core Questions or an implementation task tracker, these are research instruments.
5. [Open questions and closure sequence](open-questions.md): owner decision queue, priorities, alternatives, and next experiment.
6. Read AGENTS.md from the current **task branch**; follow its pinned Harness consumer procedure when performing Harness-controlled engineering work.
7. Independently inspect the current .harness/core.yaml, .harness/engineering-graph.yaml, .harness/project-publication.yaml, and affected canonical source artifacts at the CURRENT working revision.
8. Separately read [PR #101](https://github.com/lehater/prep/pull/101) and [.harness/candidates/preparation-information-model-decision-proposal.md in the candidate branch](https://github.com/lehater/prep/blob/prep/preparation-information-model-candidate/.harness/candidates/preparation-information-model-decision-proposal.md). Candidate material is not accepted authority.

**Critical branch difference at this checkpoint:** mvp-vertical-slice Core contains a legacy PRODUCT-REQUIREMENTS information-lifecycle Question and does not yet contain the three Tactical Questions; the Draft PR branch Core additionally has Q-PREP-PREPARATION-IDENTITY-STRUCTURE, Q-PREP-PREPARATION-RELATIONSHIP-SEMANTICS and Q-PREP-PREPARATION-REMOVAL-INTEGRITY. Do not describe those three as published in the base branch. PR #101 remains OPEN, DRAFT, BLOCKED by its own candidate review; no claim of independently verified Harness currentness is made here.

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

## Continuation instruction for a new chat

> Continue the Prep Capability/Goal semantics investigation from this noncanonical research handoff: https://github.com/lehater/prep/tree/research/prep-capability-goal-semantics/docs/research/capability-goal-semantics . Read its research baseline and open-questions queue. First check AGENTS.md and fresh canonical GitHub/Harness state on the task branch; reconcile any drift with PR #101. Work through unresolved questions in the prescribed semantic-first order, starting from the three research iterations and the **still-open** owner GD-00..05 and CD-01..05 decision gates. Review the controlled Goal-return/flat-vs-composed experiment before recommending further admission. Distinguish external precedents, hypotheses, owner approvals, and Harness acceptance. Do not choose material alternatives on the owner's behalf, silently modify Core/Publication, merge branches, or declare CURRENT. Update the handoff on the research branch when a meaningful group of results is complete; prefer one coherent commit.

## Owner question captured after Iteration 03 (2026-10-12)

Owner selected **Capability-oriented Goal-first preparation (GF-01 option A)** with initially incomplete Goals, as Product Requirements input only. Owner also proposes optional progressive recursive Capability decomposition and asks whether an ordered composition would become an instruction. Existing desk research distinguishes Capability composition, prerequisite and Procedure but did not close ordering.

[Open questions](open-questions.md) now include **CD-06 (P1): composition versus execution order, prerequisite, and learning sequence**, referencing existing PR-01/02. Next narrow research pass: architecture, communication, strict-protocol and learning-order counterexamples; preserve Iterations 01–03 and still-open P0 owner gates. No new canonical or approved model decisions.

## Experiment evidence queue (2026-10-12)

A small [open-experiments list](open-experiments.md) has been added beside the questions. Its first proposed check is **EX-GF-01**, a non-UI Goal-first domain-model stress test using fixed semantic fixtures. **EX-GF-02** is a separate, deferred user-workflow comparison; it cannot be reported as validated until observed user evidence exists. Neither has been executed by merely adding the record. Each may be taken up independently when its prerequisites are available; decisions and Harness acceptance remain with the owning authorities.

## Update cadence

No mechanical commit per conversation turn. Update after a meaningful change in conclusions, a new materially discriminating counterexample, or 2–4 substantive investigation iterations, whichever comes first. Record the new checkpoint date, what changed, what remains open, and evidence. One cohesive commit for related updates; avoid repeated duplicate files and unsupported claims of currentness. On migration/admission, reference the corresponding canonical artifact, then clearly mark superseded research claims as historical rather than silently overwriting their status.

## Iteration 01 checkpoint (2026-10-12)

[Iteration 01](iteration-01-goal-capability-predicates.md) advances GD-00/GD-01/GD-02 by testing targeted outcomes, necessary conditions and user-selected current focus against learning, interviewing, personally performed protocol and outsourced certification Goals. It highlights the *overlap* of R/T for ability-outcome Goals, **unknown** necessity for underspecified interview criteria, and a Product Requirements gate for saved Goal-relative return/focus. No link type, scope invariant, relation catalogue or Core Question is approved or resolved; GD-03/04/05 and CD series remain open. Next owner decision: GD-00, then scoped GD-01/02.

## Iteration 02 checkpoint (2026-10-12)

[Iteration 02](iteration-02-conditional-relation-catalogue-and-mutation-tests.md) researches GD-03/04/05 **conditionally**: compares four Goal types, isolates material-purpose vs user-selected use, separates relation identity from proposition multiplicity, and tests deletion effects against the distinct Recorded Activity/Result context obligation. It makes no relationship admission, uniqueness, self-link, cascading deletion, reintroduction, Product Requirements, or Harness acceptance decision. Owner gates remain GD-00/01/02 and then the GD-03/04/05 decisions; next independent research may investigate CD-01..05 with a flat-vs-composed experimental comparison.

## Iteration 03 checkpoint (2026-10-12)

[Iteration 03](iteration-03-capability-description-composition-and-context.md) tests CD-01..05 concept boundaries, performance-aspect vs weak semantic inclusion, specialization/prerequisite/procedure confusions, flat-versus-recursive Goal-first using identical records, conditional DAG/shared-child/reachability invariants, and global composition versus Goal-specific focus. No empirical A/B user data, Owner admission, relation meaning, graph constraint or Harness acceptance. Immediate next is a cheap observed Goal-return/next-practice experiment and P0 owner decisions; optional C–C should be driven by demonstrated benefit.
