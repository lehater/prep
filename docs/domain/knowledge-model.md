# Knowledge Model

## Purpose

Define the reusable subject-knowledge semantics owned by the Knowledge Model bounded context without choosing graph, ontology, hierarchy, document or persistence representation.

## Core distinctions

### Knowledge

A reusable statement, concept, distinction, relationship or other unit of subject meaning that can matter independently of one learner.

Knowledge is not a learning activity, observation, learner state or target-specific gap.

### Requirement / competency definition

A reusable statement of expected knowledge or knowledge-based capability that can be referenced by learning targets.

A requirement may align to one or more knowledge units but is not identical to the learner's state against that requirement.

### Relationship

A semantically typed association between reusable knowledge or requirement definitions.

Relationships are domain meaning, not visualization edges.

## Ownership

Knowledge Model owns:

- stable semantic identity of reusable subject knowledge;
- reusable requirement/competency definitions where they are meaningful beyond one target;
- semantic relationships and distinctions;
- explanatory meaning and coherence;
- provenance or support needed to judge subject-semantic quality.

It does not own:

- a learner's evidence or inferred state;
- target-relative gaps or priorities;
- learning activities or scheduling;
- import/extraction mechanics;
- UI representation.

## Research influence

1EdTech CASE demonstrates a mature separation between competency frameworks/items, their associations and rubrics, while allowing those definitions to be referenced by learning and assessment systems. Prep adopts the separation principle, not the CASE schema.

ALEKS / Knowledge Space Theory similarly distinguishes discipline knowledge structure from an individual learner's knowledge state. Prep does not currently adopt the KST mathematical model.

## Invariants

- reusable subject meaning must not change because one learner succeeds or fails;
- observations about a learner cannot directly mutate subject truth;
- semantic identity is independent of presentation and external study-system identity;
- a target may select or align requirements without taking ownership of reusable subject meaning.

## Open questions

- which kinds of reusable requirement belong here versus being target-specific in Learning Design;
- what minimum semantic unit is useful without forcing premature atomization;
- which relationship types have genuine domain semantics;
- how provenance and conflicting claims affect acceptance of reusable knowledge.
