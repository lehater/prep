# Model Context Strategy

## Purpose

Define where Prep's independently modeled domain languages apply and how they relate, without re-owning strategic domain classification or tactical internals.

## Contexts

### Knowledge Model

Owns reusable subject knowledge and knowledge-based competency semantics independent of one learner, target, learning mechanism or presentation.

### Learning Design

Owns target-relative learning design over reusable knowledge: target requirements, scope and depth, gaps, priorities, learning/diagnostic intent, and concrete learning or diagnostic artifacts such as questions when those artifacts exist to serve that target-relative intent.

### Learner Model

Owns learner-specific observations, evidence-backed inferred state, uncertainty, retention and progress. Current revalidation preserves this boundary but intentionally postpones deeper Learner Model development.

## Relationships

- Knowledge Model provides reusable subject semantics to Learning Design and Learner Model.
- Learner Model provides evidence-backed learner state to Learning Design.
- Learning Design may define concrete learning or diagnostic artifacts, including prompt/reference-answer questions, when their meaning is target-relative learning or evidence intent; those artifacts do not become reusable subject truth.
- Learning Design may reference Knowledge Model identities but does not mutate reusable subject truth.
- A Gap exists only relative to a learning target and learner evidence or explicit uncertainty; it is not a property of subject knowledge.
- External inputs and learning runtimes may supply evidence or execute work but do not own these domain semantics.

## Boundary invariants

- subject truth and learner state remain distinct;
- target-relative policy cannot redefine reusable subject meaning;
- learner observations cannot directly mutate Knowledge Model semantics;
- context boundaries describe semantic ownership, not deployable-service boundaries;
- translation/alignment preserves the identities of the participating models rather than collapsing them.

## Current boundary decision

Learning Design remains one model context for the current scope. Target interpretation, prioritization, learning/practice intent, diagnostic intent, and the concrete artifacts used to realize those intents participate in the same target-relative decision: what the learner should work on or demonstrate next and why.

The presence of a `Question` with a concise reference answer does not by itself justify an Assessment Model or Learning Material model context. Its reusable subject semantics remain owned by Knowledge Model through referenced knowledge identities; its learner observations remain owned by Learner Model.

A future split is justified only when learning-material or assessment semantics demonstrate independently changing language or invariants that cannot be expressed as target-relative Learning Design without conflating ownership. No such evidence is currently established.

The name **Learning Design** is therefore intentional: unlike Knowledge Model and Learner Model, this context owns design decisions that transform target, reusable knowledge and learner-state evidence into learning/diagnostic intent and artifacts. It is not a model of learning as a phenomenon.

## Deferred questions

- what concrete evidence would establish independently changing learning-material or assessment language/invariants and therefore trigger a later split;
- whether reusable competency definitions belong fully to Knowledge Model or require a distinct model context;
- whether Learner Model needs further decomposition when its development resumes.
