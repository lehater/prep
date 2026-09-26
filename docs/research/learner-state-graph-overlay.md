# Learner-state overlay on Knowledge Graph

Status: future UX/product hypothesis; not current canonical learner-state semantics.

## Motivation

A target-scoped Knowledge Graph can potentially show not only the knowledge required for a LearningTarget but also the learner's inferred state over that knowledge.

Illustrative presentation ideas include:

- low-opacity nodes for knowledge with weak/unknown inferred state;
- progressively stronger emphasis for stronger evidence-backed state;
- size, fill, saturation, border or another redundant visual encoding for different state dimensions;
- filters that compare the target knowledge surface with the learner's inferred state.

The concrete visual encoding is not decided.

## User value

The intended task is to answer visually:

> Across the knowledge relevant to this target, what appears well-supported by learning evidence and what still lacks strong evidence?

This could make a target-scoped graph serve as both a structural map and a progress/evidence projection.

## Current blocker

The current Learner Model records Question-level ReviewObservations only.

It deliberately does not infer:

- mastery;
- proficiency;
- readiness;
- retention;
- confidence/evidence strength;
- KnowledgeNode state;
- Requirement state.

Therefore Prep cannot currently label a KnowledgeNode as "learned 70%" or visually encode degrees of learned knowledge as canonical truth.

A graph overlay representing learning degree becomes valid only after accepted upstream semantics define how Question-level evidence is interpreted and propagated to KnowledgeNodes (and possibly target-relative requirements).

## Safe current boundary

Raw review facts may be displayed as review activity when clearly labeled as such, but review counts/ratings must not be visually reinterpreted as mastery or knowledge state.

The future overlay should consume an accepted learner-state projection; it must not invent that projection inside visualization code.

## Reopening condition

Revisit this hypothesis when Learner Model and Learning Design define evidence strength / inferred learner state and its propagation to KnowledgeNode or target-relative knowledge projections.

At that point compare the usefulness of graph overlay against simpler list/coverage views before making 2D/3D or visual-encoding choices.
