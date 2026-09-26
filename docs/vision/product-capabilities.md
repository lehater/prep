# Product Capabilities

## Purpose

Define the observable capabilities Prep needs to deliver the accepted product vision without choosing domain boundaries, knowledge representation, interface form, study runtime or implementation technology.

Stable capability IDs below are product-level trace anchors. They do not imply screens, services or implementation modules.

## Capability map

### [PC-01] Learning target definition

Establish a learning outcome with enough scope and depth to determine what knowledge is relevant and what kind of learner capability is expected.

**Observable acceptance:** a prepared target can express the intended outcome and reusable required scope clearly enough for later learning preparation without requiring the learner workflow to author that scope.

### [PC-02] Knowledge authoring and input

Enable a person to create and maintain the product's modeled data through user-facing interfaces, including subject knowledge and learning requirements, and to load prepared data when useful.

**Observable acceptance:** accepted modeled data can be created/edited or loaded as prepared input with validation/rejection outcomes. Automatic preparation, extraction, derivation or source validation is not required in the current slice.

### [PC-03] Knowledge organization

Turn fragmented knowledge into a coherent representation that makes important concepts, distinctions and relationships understandable, navigable and reusable.

**Observable acceptance:** reusable knowledge identities and meaningful accepted relationships can be inspected and navigated without the product requiring any one visualization form.

This capability does not prescribe a graph, ontology, hierarchy or other representation.

### [PC-04] Learning material preparation

Make learner-facing explanations, prompts, examples, questions, exercises or other learning forms available as appropriate to the knowledge and intended depth.

**Observable acceptance:** the current slice can maintain and resolve Question material relevant to a target. Material may be manually authored or loaded as prepared data; automatic generation/derivation is not a current requirement.

No single learning-object format is assumed to fit every subject or learning outcome.

### [PC-05] Learning prioritization

Use the target and available evidence about the learner to identify meaningful gaps and decide what deserves attention next under limited time and attention.

**Observable acceptance:** when this capability is activated, priority must be target-relative and evidence/uncertainty-aware rather than a property of subject knowledge. Automatic prioritization is deferred from the current initial slice.

### [PC-06] Learning and practice

Support deliberate interaction with material so relevant knowledge can be acquired, reconstructed, retrieved and, where required, applied.

**Observable acceptance:** the current slice can prepare currently resolvable Question material and delegate supported study activity to an external runtime without letting that runtime define Prep semantics.

### [PC-07] Learning evidence

Capture evidence from retrieval, practice or other relevant performance and relate it to the learning target without treating simple exposure as proof of learning.

**Observable acceptance:** the current slice records Question-attributable review observations/statistics as factual evidence and does not relabel them as mastery/readiness/retention.

### [PC-08] Retention support

Support keeping important knowledge available over time and detecting when earlier evidence is no longer sufficient to rely on.

**Observable acceptance:** retention activity may be delegated to an external study runtime; Prep does not prescribe a repetition/scheduling algorithm. Interpretation of review facts into retention state is deferred.

### [PC-09] Progress and adaptation

Show the learner their current evidence-backed position relative to the target and use changing evidence to revise gaps, priorities and subsequent learning activity.

**Observable acceptance:** any future progress/adaptation claim must be derived from accepted learner-state semantics. Automatic statistics -> learner state -> gaps -> priorities -> replanning is explicitly deferred from the current slice.

### [PC-10] Knowledge and learning quality control

Detect structural or semantic problems in accepted knowledge and problematic learning material that can undermine the learning process.

**Observable acceptance:** the current slice may expose supported structural curation diagnostics. Source validation, provenance assessment, conflicting-input resolution and a semantic coverage score are not current product behavior unless separately accepted.

## Initial capability slice

The minimum coherent current slice is:

```text
PC-01 learning target
  -> PC-02 author/load subject knowledge and requirements
  -> PC-03 organize concepts and important relationships
  -> PC-04 maintain/resolve Question material for familiarity and retrieval
  -> PC-06 learn/retrieve through the supported external runtime
  -> PC-07 collect review observations/statistics
```

PC-05 automatic prioritization, PC-08 Prep-owned retention-state interpretation and PC-09 adaptive replanning remain deferred. The product may collaborate with an external runtime for repetition while keeping its own evidence semantics factual.

The first slice may intentionally exercise only a subset of the full depth spectrum. Proving useful terminology/concept familiarity and retrievability does not require solving every form of application, procedural performance or assessment.

## Current boundary

Prep is not currently defined as:

- a universal learning-management system;
- a universal system for teaching every kind of skill;
- a particular knowledge representation or visualization;
- a replacement for every external study tool;
- a universal exercise schema.

Bounded contexts, domain models, interfaces and technical realization are downstream decisions.
