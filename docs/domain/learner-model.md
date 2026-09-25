# Learner Model

## Purpose

Define learner-specific evidence and inferred state independently of reusable subject knowledge and target-specific learning policy.

## Core distinctions

### Question Evidence Subject

Question is the canonical subject of directly imported or recorded learning evidence. External learning items such as Anki cards are bound to Prep Questions, and their review history or externally computed statistics are recorded as facts about those Questions.

KnowledgeNode and Requirement state are not direct imports from an external card. Any state attributed to them is a later inference derived from evidence about related Questions.

### Observation

A record that something relevant occurred: an answer, retrieval, explanation, solution, implementation, assessment result or other performance event.

An observation is historical fact about an interaction, not by itself a claim that knowledge is mastered.

### Evidence

An interpretation of one or more observations for a particular knowledge/requirement claim, including relevance, strength and context.

### Inferred State

The current evidence-backed estimate of a learner's state with respect to knowledge or a requirement.

The state may include uncertainty; absence of evidence is not automatically evidence of absence.

### State Uncertainty

The explicit uncertainty of an inferred learner state. Uncertainty is first-class domain information: the system may know that it does not yet know whether a learner can satisfy a requirement.

Reducing uncertainty can therefore be a legitimate reason to request new evidence independently of a learning intervention.

### Retention / Decay

The degree to which older evidence remains predictive of present availability. This affects confidence in inferred state rather than rewriting historical observations.

## Ownership

Learner Model owns:

- learner-specific observations;
- evidence derived from observations;
- inferred state;
- explicit state uncertainty;
- retention/decay interpretation;
- evidence history needed to explain current state.

It references Questions from Learning Design as the canonical subjects of direct learning evidence. Knowledge Model identities and Requirements may receive derived interpretations only through analysis of evidence from their related Questions.

It does not own subject meaning, target policy, gaps or learning priorities.

## Research influence

ALEKS / Knowledge Space Theory supports the distinction between observable responses and latent knowledge state.

Moodle Competencies separates activities/evidence from competency proficiency and supports evidence from multiple sources, including prior learning.

xAPI and 1EdTech Caliper provide precedents for treating learning interactions as typed event records rather than direct mastery claims. Prep adopts this evidence-layer separation without adopting either event schema at this stage.

## Invariants

- Observation != Evidence != Inferred State.
- historical observations are not rewritten when an inference changes;
- inferred state must be traceable to evidence;
- uncertainty must be representable independently of positive or negative capability estimates;
- unknown != not known / not capable;
- evidence may become less predictive with time without deleting the underlying observation;
- learner state cannot redefine reusable subject semantics;
- directly imported learning evidence is attached to Question identity;
- state about KnowledgeNode or Requirement is derived rather than treated as a direct external observation.

## Open questions

- what evidence-strength model is sufficient for the initial product;
- how context and transfer limitations affect evidence reuse;
- what decay/retention model is justified before sufficient empirical data exists.
