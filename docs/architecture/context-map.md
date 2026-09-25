# Context Map

## Purpose

Define the strategic domain decomposition for Prep from the accepted Problem Space, Product Vision and Product Capabilities.

This map owns semantic boundaries and relationships. It does not imply services, processes, databases, UI surfaces, storage models or deployment units.

## Research basis

The decomposition is informed by established adaptive-learning and competency-modeling patterns:

- adaptive-learning literature commonly separates a domain model, learner model and instructional/adaptation responsibility;
- Knowledge Space Theory separates discipline knowledge structure from an individual's knowledge state;
- 1EdTech CASE models reusable competencies, learning outcomes, relationships and rubrics independently of learner records and delivery systems;
- learner-model research treats the learner model as a distinct representation of learner-specific state used by adaptive behavior.

These precedents are evidence for separation of responsibilities, not prescribed implementation models.

## Core bounded contexts

### Knowledge Model

Owns the reusable representation of subject knowledge independently of any particular learner, learning target or learning mechanism.

Its language concerns knowledge identity, concepts or other knowledge units, distinctions, relationships, explanatory meaning and coherence of the represented subject.

It does not own learning requirements or competencies, decide what a particular learner should do next, or own learner state.

The representation is deliberately undecided. This context is not synonymous with a graph, ontology, hierarchy or document model.

### Learning Design

Owns learning requirements and competencies together with target-specific interpretation and adaptation: what the learner is trying to achieve, what depth or evidence is required, which gaps matter for that target, and what learning or practice should be selected next.

Its language concerns reusable and target-specific requirements or competencies, learning target, required depth, target scope, gap, priority, learning intent, learning material, practice intent and evidence requirement.

It consumes reusable subject knowledge from Knowledge Model and learner-state information from Learner Model. It does not redefine subject knowledge or own observations about the learner.

This context currently keeps target interpretation, prioritization and learning/practice design together because they participate in one decision: what should the learner work on next and why. A later split requires evidence of independently changing language or invariants.

### Learner Model

Owns evidence about an individual learner and the changing interpretation of that evidence over time.

Its language concerns observation, attempt, retrieval/performance evidence, inferred state, confidence/uncertainty, retention, decay and demonstrated progress.

It references modeled knowledge and learning targets so evidence can be interpreted against them, but it does not mutate subject truth or decide target-specific learning policy.

## Context relationships

```text
                    reusable subject knowledge
Knowledge Model -------------------------------> Learning Design
      |                                                |
      | knowledge identity                             | learning / evidence intent
      v                                                v
Learner Model ---------------------------------> learning / practice execution
      ^                                                |
      |                                                | observations / results
      +------------------------------------------------+

Learner Model -------- evidence-backed state --------> Learning Design
Learning Design ------ target/evidence context ------> Learner Model
```

The diagram shows semantic information flow, not a required runtime pipeline.

## Supporting and external boundaries

### Authoring and input

People create and maintain Prep's modeled data through user-facing interfaces. This includes subject knowledge owned by Knowledge Model and requirements or other learning-design data owned by Learning Design. Prepared data may also be loaded through an input interface.

Authoring and loading do not create new semantic ownership: each bounded context continues to own the data defined by its model. Automatic source preparation, extraction, derivation, validation and conflict resolution are outside the current product scope. No separate acquisition bounded context is justified.

### Learning / practice execution

Actual learning activity may be executed inside Prep or delegated to external systems. Anki, assessment engines and other study runtimes are mechanisms outside the strategic core unless future evidence establishes product-owned semantics that require another bounded context.

### Subject specialization

Technical subjects and future domains may require specialized vocabulary or invariants. They remain specializations/subdomains until such differences cannot be expressed cleanly within the core contexts.

### Quality

Quality rules remain with the context whose truth they protect: knowledge quality with Knowledge Model, learning-design quality with Learning Design, and evidence/state quality with Learner Model. No independent Quality bounded context is currently justified.

## Relationship rules

- Knowledge Model owns reusable subject semantics; learner evidence cannot redefine them.
- Learner Model owns learner-specific evidence and inferred state; study activity is not automatically proof of knowledge.
- Learning Design owns target-relative gaps, priorities and next-learning decisions.
- A gap exists only relative to a target and learner-state evidence; it is not intrinsic subject knowledge.
- Learning Design references Knowledge Model rather than copying ownership of subject knowledge.
- Learner Model identifies evidence against stable knowledge/target references but does not own those definitions.
- Input mechanisms may propose or import knowledge but do not gain semantic ownership by doing so.
- External learning runtimes do not define Prep's domain semantics.
- No bounded context is automatically a deployable service.

## Strategic uncertainties

The following remain explicit questions for Domain Model Design:

- whether Learning Design later needs separation between target/planning semantics and learning-material/practice design;
- how learner-state uncertainty and evidence strength should be represented;
- how retention and evidence decay affect inferred learner state;
- which subject-specific semantics justify specialization or an additional bounded context;

## Research references

- ALEKS, Knowledge Space Theory: https://www.aleks.com/about_aleks/knowledge_space_theory
- 1EdTech, Competencies and Academic Standards Exchange (CASE): https://www.1edtech.org/standards/case
- Böck et al., "Learner models: design, components, structure, and modelling", systematic literature review, 2025: https://link.springer.com/article/10.1007/s11257-025-09434-4
- Normadhi et al., "Identification of personal traits in adaptive learning environment: Systematic literature review", Computers & Education 130 (2019): https://www.sciencedirect.com/science/article/pii/S0360131518303026
