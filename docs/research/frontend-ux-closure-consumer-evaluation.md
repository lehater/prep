# Prep consumer evaluation — granular frontend UX closure

Status: completed experimental consumer evaluation for Harness branch `research/frontend-ux-closure-v1`.

Prep remains isolated in `research/frontend-ux-closure-v1`. This document does not authorize merging Prep or Harness into `main`.

## Tested Harness

Prep is pinned to:

`7ea02e9bb64c2b8a91c0fa08d4a3c9bb2af96919`

The full Prep `Validate` workflow is the consumer acceptance test for this Harness revision.

## Consumer result

The granular frontend UX model materially improves Prep's engineering knowledge model without changing accepted product/domain semantics.

Prep now carries separate project-owned contracts for:

- Task Model;
- Conceptual Interface Model;
- Information Architecture;
- Interaction Design;
- Interface Topology;
- Presentation System;
- Screen/View Design;
- early interface verification intent;
- later presentation verification intent.

The previous broad `prep.human-interface` capability is removed from the experimental Engineering Graph/Core. `docs/interface/human-interface.md` remains only a non-canonical synthesis projection.

## Defects the real project exposed

### Missing Task Model

Prep previously had User Journeys but no explicit Task Model capability. The experiment made USER work explicit before journey/interface realization.

### Hidden structural frames

The initial site map contained three material frames not represented in canonical topology:

- Application Shell;
- LearningTarget Workspace;
- Curation Workspace.

They are now explicit `structural: true` Interface Topology subjects.

### Interaction / IA accidental coupling

The first evaluator made Interaction contexts depend on IA locations despite the intended parallel production branches.

The refined model keeps:

- Interaction Design responsible for actions/responses/states/task coverage;
- Information Architecture responsible for organization/findability;
- Interface Topology responsible for mapping the two into views.

### Duplicate Screen/View coverage sidecar

The first Prep adaptation introduced `screen-view-subject-coverage.yaml`.

That duplication has been removed.

Canonical Interface Topology owns the expected 19 material view/frame subjects. Stable subject ids are embedded directly in the existing canonical `screen-view-design.md`, and the project integration adapter extracts those ids for the generic Harness topology→screen coverage evaluator.

## Current Prep topology

The experimental Prep topology has 19 material Screen/View subjects:

- 3 structural frames;
- 5 Learning views;
- 9 Curation views;
- 2 secondary surfaces.

This includes the full Learning/Curation responsibility split while keeping site/app maps as projections.

## What did not change

The experiment did not change the accepted Prep product/domain direction:

- Learning and Curation remain separate task modes;
- learner selects a prepared target and does not edit target scope;
- Question-first Study/Anki remains the current concrete learning slice;
- Knowledge Graph remains a frontend learning/exploration hypothesis;
- 3D superiority remains unproven and must be evaluated in the frontend prototype;
- learner-state graph overlay remains blocked by missing accepted learner-state inference;
- learning/evidence coverage semantics remain an unresolved domain research question.

## Harness behavior validated through Prep

The real consumer confirms that:

- canonical topology can own complete view/frame identity without making sitemap a semantic owner;
- structural frames can participate in navigation/screen coverage without claiming USER tasks;
- broad Human Interface synthesis is not required downstream when granular contracts exist;
- project-native artifact formats remain allowed;
- project-specific parsing stays behind the integration adapter boundary;
- the same Harness evaluator works without Prep-specific branches.

## Migration / existing-project behavior

The Harness experiment also closes the migration problem non-destructively.

A legacy FRONTEND graph that lacks granular conceptual/IA/interaction/topology production contracts is diagnosed by Engineering Coverage as missing those semantic contracts. Reconciliation does not silently modify project topology.

A project may then either:

1. adopt granular capabilities; or
2. intentionally retain one broad `human-interface-design` capability and explicitly claim/semantically accept the required granular concerns.

## Semantic quality boundary

Passing structural UX closure does not mean an IA is usable or a conceptual model is good.

Harness explicitly requires semantic acceptance evidence for the new conceptual/IA/interaction/topology claims. Provider existence alone yields `VALIDATE_SEMANTICS`, not `COVERED`.

Later task/findability/accessibility/usability evidence remains separate verification work.

## Consumer verdict

Prep provides positive evidence for canonicalizing the Harness direction.

The model fixed real gaps, removed hidden sitemap ownership, eliminated the manual Screen/View sidecar, and allowed the broad Human Interface capability to disappear without losing required semantics.

No Prep-specific Harness code was needed.

If the Harness change is approved, the appropriate next Prep action is to reconcile these project-owned knowledge changes back into the normal `research/problem-space-revalidation` line and revalidate downstream knowledge there. That should happen only after the Harness canonicalization decision.

No merge is performed by this experiment.
