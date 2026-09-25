# Product Capabilities

## Purpose

Define the top-level capabilities Prep needs in order to deliver the accepted product vision, without choosing domain boundaries, knowledge representation, interface form, study runtime or implementation technology.

## Capability map

### Learning target definition

Establish a learning outcome with enough scope and depth to determine what knowledge is relevant and what kind of learner capability is expected.

### Knowledge authoring and input

Enable a person to create and maintain the product's modeled data through user-facing interfaces, including subject knowledge and learning requirements, and to load prepared data when useful. The product does not currently prepare, extract, derive or validate that content automatically.

### Knowledge organization

Turn fragmented knowledge into a coherent representation that makes important concepts, distinctions and relationships understandable, navigable and reusable.

This capability does not prescribe a graph, ontology, hierarchy or other representation.

### Learning material derivation

Produce learner-facing explanations, prompts, examples, questions, exercises or other learning forms appropriate to the knowledge and intended depth.

No single learning-object format is assumed to fit every subject or learning outcome.

### Learning prioritization

Use the target and available evidence about the learner to identify meaningful gaps and decide what deserves attention next under limited time and attention.

### Learning and practice

Support deliberate interaction with the material so that relevant knowledge can be acquired, reconstructed, retrieved and, where required, applied.

This capability may collaborate with external study systems rather than executing every learning mechanism itself.

### Learning evidence

Capture evidence from retrieval, practice or other relevant performance and relate it to the learning target without treating simple exposure as proof of learning.

### Retention support

Support keeping important knowledge available over time and detecting when earlier evidence is no longer sufficient to rely on.

This capability does not prescribe a particular repetition or scheduling algorithm.

### Progress and adaptation

Show the learner their current evidence-backed position relative to the target and use changing evidence to revise gaps, priorities and subsequent learning activity.

### Knowledge and learning quality control

Detect structural or semantic problems in accepted knowledge and problematic learning material that can undermine the learning process. Source validation, provenance assessment and conflicting-input resolution are outside the current product scope.

## Initial capability slice

For the initial product focus, the minimum coherent slice is:

```text
learning target
  -> author or load subject knowledge and requirements
  -> organize concepts and important relationships
  -> derive material for familiarity and retrieval
  -> learn / retrieve
  -> collect review observations/statistics
```

Interpretation of those observations into learner state, gaps, priorities or automatic replanning is explicitly deferred; therefore the initial slice does not claim evidence-driven priority updates yet.

The first slice may intentionally exercise only a subset of the full depth spectrum. In particular, proving useful terminology/concept familiarity and retrievability does not require solving every form of application, procedural performance or assessment.

## Current boundary

Prep is not currently defined as:

- a universal learning-management system;
- a universal system for teaching every kind of skill;
- a particular knowledge representation or visualization;
- a replacement for every external study tool;
- a universal exercise schema.

Bounded contexts, domain models, interfaces and technical realization are downstream decisions.
