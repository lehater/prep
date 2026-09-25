# Prep consumer evaluation — granular frontend UX closure

Status: experimental consumer evidence for Harness research branch `research/frontend-ux-closure-v1`.

Prep remains experimental and does not adopt these changes into its normal revalidation branch or `main` by this document.

## Tested Harness

Prep is pinned to:

`02770055e1f56d96520f44cda9da264957ef0d83`

The full Prep Validate workflow passes against that Harness revision.

## What changed in Prep

Prep now materializes project-owned frontend knowledge as separate contracts:

- Task Model;
- Conceptual Interface Model;
- Information Architecture;
- Interaction Design;
- Interface Topology;
- early interface verification intent;
- later presentation verification intent.

The existing site map is explicitly a human review projection of Interface Topology plus coarse Screen/View frames.

## Concrete findings from applying the model

### Missing Task Model

Prep previously had User Journeys but no explicit Task Model in its Engineering Graph.

The experiment made current USER work explicit before journeys/interface realization.

### Hidden structural frames

The site map contained three materially important shared frames:

- Application Shell;
- LearningTarget Workspace;
- Curation Workspace.

They were not present in the first canonical Interface Topology attempt.

The real project therefore revealed the need for explicit structural topology views rather than allowing a projection to own hidden navigation/composition knowledge.

### Interaction and IA are independent before Topology

The first Harness evaluator required Interaction contexts to reference IA locations even though the experimental production graph allowed IA and Interaction to be produced in parallel.

Prep exposed this mismatch. The refined model leaves interaction context independent; Interface Topology maps accepted interaction contexts into accepted IA locations/views.

### View completeness is now explicit

Current Prep topology contains 19 material view subjects:

- 3 structural frames;
- 5 Learning views;
- 9 Curation views;
- 2 secondary surfaces.

The Harness integration test derives the expected Screen/View subject set from topology and compares it with the project's declared Screen/View coverage.

## What did not change

The experiment did not change Prep's accepted product semantics:

- Learning and Curation remain separate task modes;
- learner selects a prepared target and does not edit target scope;
- Knowledge Graph remains a frontend learning/exploration hypothesis;
- Question-first Study/Anki slice remains current;
- learner-state graph overlay and learning/evidence coverage semantics remain deferred research.

## Consumer verdict

The granular model improves Prep's ability to distinguish:

- user-facing concepts from domain concepts;
- information organization from interaction behavior;
- interaction behavior from view partitioning;
- complete interface topology from local Screen/View composition.

It also prevents the site map from becoming accidental canonical truth.

The main remaining costs are Harness-level rather than Prep-specific:

- legacy projects do not yet get automatic diagnostics for missing granular frontend capabilities;
- Screen/View subject proof currently uses a manually maintained coverage sidecar;
- the retained broad `human-interface-design` capability overlaps the new granular knowledge;
- structural closure does not substitute for real usability/findability/accessibility evidence.

Therefore this Prep branch is positive consumer evidence for the direction, but not evidence that the current Harness patch should be merged unchanged.
