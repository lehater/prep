# Model Context Strategy

## Purpose

Define where Prep's independently modeled domain languages apply and how they relate, without re-owning strategic domain classification or tactical internals.

## Contexts

### Knowledge Model

Owns reusable subject knowledge and knowledge-based competency semantics independent of one learner, target, learning mechanism or presentation.

### Learning Design

Owns target-relative interpretation of reusable knowledge: target requirements, scope and depth, gaps, priorities, and learning/diagnostic intent.

### Learner Model

Owns learner-specific observations, evidence-backed inferred state, uncertainty, retention and progress. Current revalidation preserves this boundary but intentionally postpones deeper Learner Model development.

## Relationships

- Knowledge Model provides reusable subject semantics to Learning Design and Learner Model.
- Learner Model provides evidence-backed learner state to Learning Design.
- Learning Design may reference Knowledge Model identities but does not mutate reusable subject truth.
- A Gap exists only relative to a learning target and learner evidence or explicit uncertainty; it is not a property of subject knowledge.
- External inputs and learning runtimes may supply evidence or execute work but do not own these domain semantics.

## Boundary invariants

- subject truth and learner state remain distinct;
- target-relative policy cannot redefine reusable subject meaning;
- learner observations cannot directly mutate Knowledge Model semantics;
- context boundaries describe semantic ownership, not deployable-service boundaries;
- translation/alignment preserves the identities of the participating models rather than collapsing them.

## Deferred questions

- whether Learning Design later splits when learning-material or assessment design develops independent language and invariants;
- whether reusable competency definitions belong fully to Knowledge Model or require a distinct model context;
- whether Learner Model needs further decomposition when its development resumes.
