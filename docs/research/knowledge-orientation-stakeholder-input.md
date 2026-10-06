# Stakeholder input — knowledge orientation and representation

Date: 2026-10-03
Status: accepted stakeholder source record; not itself Product/Domain/UI authority.

## Problem-space statements

The stakeholder clarified that Prep's learning problem includes more than target selection, prioritization, practice, and evidence.

Material input:

- In an unfamiliar subject it can be difficult to form a coherent mental map from isolated pieces of material.
- The learner may need to understand not only which concepts exist, but how many relevant concepts there are at a useful scope and how those concepts relate.
- Relationship meaning matters: understanding can depend on how concepts interact, constrain, compose, depend on, or otherwise relate to each other.
- Useful orientation may require movement between a high-level overview and deeper levels of detail; the useful depth is not yet known.
- The learner may need to narrow the considered knowledge surface by meaningful criteria such as subject area, relation meaning, target relevance, or other semantics. The exact filtering interaction is downstream.
- Supporting knowledge/capability/relation data does not appear automatically. It must be introduced and corrected incrementally by some actor or mechanism. Learner ownership is not assumed.
- Reusable subject semantics and their relationships are part of the learning support problem, not merely a persistence concern.

These statements are reflected in accepted Problem Evidence as OBS-P10..OBS-P13 and PE-KNOWLEDGE-ORIENTATION-OUTCOME.

## Downstream design hypothesis: spatial/3D knowledge exploration

The stakeholder reports that an interactive spatial graph appears promising for initial orientation because it can make concepts and their relationships inspectable as a whole and can support rotation, focus, traversal and filtering.

This is explicitly a downstream hypothesis, not Problem Evidence and not a Product Requirement.

The repository contains preserved donor evidence:

- `experiments/knowledge_representation/` — a historical interactive 3D renderer/interaction/performance experiment;
- deleted production renderer code is not a donor surface; any reusable spatial implementation evidence is preserved only under `experiments/knowledge_representation/`;
- historical interface artifacts that exercised knowledge search/filter/detail/spatial projections.

That evidence may support feasibility and future interface option exploration. It does not establish that 3D is the best representation, that spatial interaction improves learning, or that a graph is required.

## Existing domain donor material to preserve for revalidation

Do not discard these historical artifacts merely because the current accepted upstream chain temporarily removed a Subject Knowledge context:

- `docs/domain/knowledge-model.md`
- `docs/domain/relation-classification-catalog.yaml`
- historical Knowledge-related task/interface artifacts
- `experiments/knowledge_representation/`

They are donor material only until re-derived from the revised accepted upstream chain.

## Explicit layer boundaries

- Discovery owns the learning/orientation problem, not a visualization.
- User Needs own solution-independent learner outcomes.
- Product Requirements own observable product commitments.
- Domain/Model Context/Tactical Design own reusable subject semantics and relationship meaning.
- Human Interface Design owns representation and interaction choices, including whether a graph is appropriate.
- Data Design owns persistence realization; a graph database is not implied by graph-like subject semantics.
- Verification/Research must test whether candidate representations actually improve comprehension and remain usable at realistic density.
