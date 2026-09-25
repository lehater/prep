# Learning and Knowledge Representation Synthesis

## Purpose

Capture research evidence relevant to Prep before product or architecture decisions are made. This document is evidence, not policy and does not prescribe a graph, card format, study system, UI, or implementation.

## Two different questions

The literature separates two concerns that Prep must not collapse:

1. **How knowledge can be represented** — concepts, propositions, classifications, properties, formal relations and explanatory language.
2. **What a learner can do with knowledge** — recall it, understand it, apply it, reason with it and retain access to it over time.

A representation of a subject and a learner's state with respect to that subject are therefore different models.

## Knowledge representation

### Concept mapping

Novak and Cañas describe concept maps as representations built from concepts and propositions. A proposition connects two or more concepts with linking words to form a meaningful statement. They also stress that a map is constructed in a context, commonly expressed by a focus question.

Evidence:
- IHMC, *The Theory Underlying Concept Maps and How to Construct and Use Them*: https://cmap.ihmc.us/docs/theory-of-concept-maps
- IHMC, *What are Propositions?*: https://cmap.ihmc.us/docs/proposition.php

Implication for later design: concepts and explicit propositions are established candidates for structured representation, but this does not imply that all explanation should become graph structure.

### RDF and formal semantic models

RDF defines a graph as a set of subject-predicate-object triples. This demonstrates a standardized way to externalize explicit assertions into machine-readable structure.

Evidence:
- W3C, *RDF 1.1 Concepts and Abstract Syntax*: https://www.w3.org/TR/rdf11-concepts/

OWL and ontology engineering add stronger semantics such as classes, properties and constraints. They are useful reference points for the upper end of formalization, not evidence that Prep requires ontology-level formality.

### Scope before formalization

Ontology engineering uses competency questions to determine what a knowledge base must be able to answer and therefore what information needs representation.

Evidence:
- Noy & McGuinness, Stanford, *Ontology Development 101*: https://protege.stanford.edu/publications/ontology_development/ontology101-noy-mcguinness.html

Working research conclusion: formalization should be justified by operations or questions that benefit from it, rather than by a goal of converting the maximum possible amount of prose into structure.

## Structure versus explanatory text

The reviewed approaches support a continuum rather than a binary choice:

`prose -> concepts -> propositions -> typed semantic structures -> formal ontology`

Good candidates for explicit structure include stable identity, classification, properties and compact relations or propositions whose explicit representation enables useful operations.

Natural language remains useful for explanation, reasoning, examples, context, qualifications, exceptions and trade-offs. These can sometimes be decomposed further, but decomposition has a modeling and comprehension cost.

This boundary is a design question to be revisited under the appropriate domain/architecture authority. Research does not justify choosing a maximal level of formalization now.

## Learning and durable access

### Cognitive objectives

Educational taxonomies distinguish qualitatively different outcomes. Revised Bloom distinguishes cognitive processes such as remembering, understanding and applying, and also distinguishes factual, conceptual, procedural and metacognitive knowledge. SOLO provides a complementary view of increasing structural depth of understanding.

These taxonomies are useful evidence that a single scalar notion of “knowledge level” can hide materially different learner capabilities. They do not prescribe Prep's domain model.

### Retrieval and spacing

A 2022 review in *Nature Reviews Psychology* summarizes substantial evidence that retrieval practice and spacing enhance learning across domains and applied educational settings.

Evidence:
- Carpenter, Pan & Butler (2022), *The science of effective learning with spacing and retrieval practice*: https://doi.org/10.1038/s44159-022-00089-1

Implication: exposure to information is not equivalent to durable availability from memory. Retrieval and retention are legitimate problem dimensions independent of any particular study tool.

## Combined research map

The literature can be overlaid as complementary concerns:

```text
learning purpose / required outcome
        |
        v
scope of relevant knowledge
        |
        v
knowledge representation
  concepts / propositions / properties / explanatory text
        |
        v
required learner capability
  remember / understand / apply / deeper performance
        |
        v
learning activity
        |
        v
retrieval / practice / spacing
        |
        v
evidence of changed learner state
        |
        v
retention and later use
```

No reviewed method covers this whole chain. Knowledge-representation methods mainly address subject structure; educational taxonomies characterize learning outcomes; retrieval/spacing research addresses durable learning mechanisms.

## Research conclusions safe to carry upward

- Learning has a target state and a current learner state; the difference between them matters.
- The relevant body of knowledge has scope and depth that depend on the learning purpose.
- Knowledge contains both relationships that can be made explicit and explanatory/contextual content that may remain natural language.
- Representation of subject knowledge is distinct from evidence about an individual learner.
- Recall, understanding, application and deeper performance should not be assumed equivalent.
- Initial exposure is insufficient evidence of durable learning.
- Retention and later availability are part of the problem, not implementation details.
- No evidence reviewed here requires a graph UI, 3D visualization, Anki, flashcards or a particular persistence model.

## Questions deliberately deferred

- Exact bounded contexts and ubiquitous language.
- Exact structured-vs-text boundary.
- Closed versus extensible relation vocabulary.
- Graph, RDF/OWL, property graph or another storage/model realization.
- Learning-object/card schemas.
- Assessment model.
- Scheduling algorithm and external study-system integration.
- UI projections, including 2D/3D graph views.
