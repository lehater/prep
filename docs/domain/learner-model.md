# Learner Model

## Purpose

Define the minimal learner-specific record of learning statistics independently of reusable subject knowledge and target-specific learning policy.

## Core distinctions

### Question Evidence Subject

Question is the canonical subject of directly recorded learning observations and evidence.

KnowledgeNode and Requirement state are not direct observations. Any state attributed to them is a later inference derived from evidence about related Questions.

### Observation

A record that something relevant occurred: an answer, retrieval, explanation, solution, implementation, assessment result or other performance event.

An observation is historical fact about an interaction, not by itself a claim that knowledge is mastered.


## Ownership

Learner Model owns:

- learner-specific historical observations and statistics about Questions;
- evidence history needed to reproduce those statistics.

Interpretation of those statistics into evidence strength, inferred learner state, uncertainty, retention/decay, knowledge state or requirement state is deferred.

It references Questions from Learning Design as the canonical subjects of recorded learning observations and statistics. Knowledge Model identities and Requirements may receive derived interpretations later, but such interpretation is outside the current model.

It does not own subject meaning, target policy, gaps or learning priorities.

## Research influence

ALEKS / Knowledge Space Theory supports the distinction between observable responses and latent knowledge state.

Moodle Competencies separates activities/evidence from competency proficiency and supports evidence from multiple sources, including prior learning.

xAPI and 1EdTech Caliper provide precedents for treating learning interactions as typed event records rather than direct mastery claims. Prep adopts this evidence-layer separation without adopting either event schema at this stage.

## Invariants

- historical observations are not rewritten;
- absence of observations is not a negative learning result;
- recorded statistics remain attributable to Question identity;
- learner statistics cannot redefine reusable subject semantics;
- interpretation of statistics into learner, KnowledgeNode or Requirement state is not part of the current model.

## Deferred questions

- what evidence-strength model should interpret recorded statistics;
- whether and how statistics should produce inferred learner state;
- how inferred state may propagate from Questions to KnowledgeNodes or Requirements;
- how context and transfer limitations affect evidence reuse;
- what decay/retention model is justified before sufficient empirical data exists.
