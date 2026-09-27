# Product Capabilities

## Purpose

Define the observable capabilities Prep needs to deliver the accepted product vision without choosing domain boundaries, knowledge representation, interface form, study runtime or implementation technology.

Stable capability IDs below are product-level trace anchors. They do not imply screens, services or implementation modules.

## Capability map

### [PC-01] Learning target definition

Establish a learning outcome with enough scope and depth to determine what knowledge is relevant, what the learner is expected to be able to do, and which material conditions or standards distinguish success when they matter.

**Observable acceptance:** a prepared target can express the intended outcome and reusable required scope clearly enough for later learning, practice and evidence design without requiring the learner workflow to author that scope.

### [PC-02] Knowledge authoring and input

Enable a person to create and maintain the product's modeled data through user-facing interfaces, including subject knowledge and learning requirements, and to load prepared data when useful.

**Observable acceptance:** accepted modeled data can be created/edited or loaded as prepared input with validation/rejection outcomes. Automatic preparation, extraction, derivation or source validation is not required in the current slice.

### [PC-03] Knowledge organization

Turn fragmented knowledge into a coherent representation that makes important concepts, distinctions and relationships understandable, navigable and reusable.

**Observable acceptance:** reusable knowledge identities and meaningful accepted relationships can be inspected and navigated without the product requiring any one visualization form.

This capability does not prescribe a graph, ontology, hierarchy or other representation.

### [PC-04] Learning material preparation

Make learner-facing explanations, prompts, examples, questions, exercises, tasks or other learning and assessment forms available as appropriate to the knowledge and intended outcome.

**Observable acceptance:** prepared material can be related to the intended learning outcome without treating the existence or completion of material as evidence that the outcome has been achieved. Question material may be one supported form; no single learning-object format is assumed to fit every subject or outcome.

Automatic generation/derivation is not a current requirement.

### [PC-05] Learning prioritization

Use the target and available evidence about the learner to identify meaningful gaps and decide what deserves attention next under limited time and attention.

**Observable acceptance:** when this capability is activated, priority must be target-relative and evidence/uncertainty-aware rather than a property of subject knowledge. Automatic prioritization may remain deferred from the current initial slice.

### [PC-06] Learning and practice

Support deliberate interaction with material or tasks so relevant knowledge and knowledge-dependent capability can be acquired, reconstructed, retrieved and, where required, applied.

**Observable acceptance:** the product can support or delegate learning/practice activity without allowing a particular runtime, question format or exercise mechanism to define Prep's product semantics.

### [PC-07] Learning evidence

Capture contextual evidence from retrieval, practice or other relevant performance, preserve enough context and provenance to bound what can be inferred, and relate that evidence to the intended learning outcome.

**Observable acceptance:** recorded observations remain distinguishable from conclusions about learner state. Evidence-backed learner-state conclusions may be derived only through accepted semantics; a single success, failure, repeated exposure or runtime rating does not automatically establish broad mastery or incapability.

Question-attributable review observations from an external runtime remain an admissible evidence source, not the universal evidence model.

### [PC-08] Retention support

Support keeping important knowledge and knowledge-dependent capability available over time and detecting when earlier evidence is no longer sufficient to rely on.

**Observable acceptance:** temporal relevance of evidence may constrain what current learner-state conclusions are justified. Retention activity may be delegated to an external study runtime; Prep does not prescribe a repetition/scheduling or learner-state inference algorithm.

### [PC-09] Progress and adaptation

Show the learner their current evidence-backed position relative to the target and use changing evidence to revise gaps, priorities and subsequent learning activity.

**Observable acceptance:** progress/adaptation must consume accepted learner-state semantics and preserve material scope, uncertainty and temporal limits. Automatic prioritization or replanning may remain deferred from the initial slice.

### [PC-10] Knowledge and learning quality control

Detect structural or semantic problems in accepted knowledge and problematic learning, practice or assessment material that can undermine the learning process.

**Observable acceptance:** the product may expose supported structural curation diagnostics. Source validation, provenance assessment, conflicting-input resolution and a universal semantic coverage score are not product behavior unless separately accepted.

## Initial capability slice

The minimum coherent product slice is:

```text
PC-01 establish a target outcome
  -> PC-02 author/load reusable subject and learning-design data
  -> PC-03 organize relevant knowledge
  -> PC-04 prepare suitable learning/practice/assessment material
  -> PC-06 execute or delegate supported learning/practice
  -> PC-07 capture contextual evidence
```

A prototype may realize part of this slice with Questions and an external study runtime. That realization is evidence about implementation usefulness; it does not redefine the product capability model around Question or Anki semantics.

PC-05 automatic prioritization, PC-08 Prep-owned scheduling and PC-09 automatic replanning may remain deferred while their product semantics stay defined. The first slice may intentionally exercise only a subset of the full depth spectrum.

## Current boundary

Prep is not currently defined as:

- a universal learning-management system;
- a universal system for teaching every kind of skill;
- a particular knowledge representation or visualization;
- a replacement for every external study tool;
- a universal exercise, assessment or evidence schema.

Bounded contexts, domain models, interfaces and technical realization are downstream decisions.
