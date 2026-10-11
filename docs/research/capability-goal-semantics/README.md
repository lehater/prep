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
2. [Open questions and closure sequence](open-questions.md): owner decision queue, priorities, alternatives, and next experiment.
3. Read AGENTS.md from the current **task branch**; follow its pinned Harness consumer procedure when performing Harness-controlled engineering work.
4. Independently inspect the current .harness/core.yaml, .harness/engineering-graph.yaml, .harness/project-publication.yaml, and affected canonical source artifacts at the CURRENT working revision.
5. Separately read [PR #101](https://github.com/lehater/prep/pull/101) and [.harness/candidates/preparation-information-model-decision-proposal.md in the candidate branch](https://github.com/lehater/prep/blob/prep/preparation-information-model-candidate/.harness/candidates/preparation-information-model-decision-proposal.md). Candidate material is not accepted authority.

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

> Continue the Prep Capability/Goal semantics investigation from this noncanonical research handoff: https://github.com/lehater/prep/tree/research/prep-capability-goal-semantics/docs/research/capability-goal-semantics . Read its research baseline and open-questions queue. First check AGENTS.md and fresh canonical GitHub/Harness state on the task branch; reconcile any drift with PR #101. Work through unresolved questions in the prescribed semantic-first order, beginning with whether Goal–Capability asserts an outcome target, a necessary condition, or a preparation focus. Distinguish external precedents, hypotheses, owner approvals, and Harness acceptance. Do not choose material alternatives on the owner's behalf, silently modify Core/Publication, merge branches, or declare CURRENT. Update the handoff on the research branch when a meaningful group of results is complete; prefer one coherent commit.

## Update cadence

No mechanical commit per conversation turn. Update after a meaningful change in conclusions, a new materially discriminating counterexample, or 2–4 substantive investigation iterations, whichever comes first. Record the new checkpoint date, what changed, what remains open, and evidence. One cohesive commit for related updates; avoid repeated duplicate files and unsupported claims of currentness. On migration/admission, reference the corresponding canonical artifact, then clearly mark superseded research claims as historical rather than silently overwriting their status.
