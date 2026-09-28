# Product Capabilities

## Purpose

Define the observable capabilities Prep needs to deliver the accepted product vision without choosing domain boundaries, knowledge representation, interface form, study runtime or implementation technology.

Stable capability IDs below are product-level trace anchors. They do not imply screens, services or implementation modules.

## Capability map

### [PC-01] Target definition and requirement preparation

Enable a person to establish a concrete but refinable target context, such as a professional role, vacancy, company/interview process, certification or other desired outcome, with enough capability scope, conditions and required standard to support assessment and learning decisions.

Related target purposes must remain distinguishable. In particular, professional-role capability and selection/interview performance may share CapabilitySpecifications but interview-specific tasks or conditions must not silently redefine the professional-role target. Target requirements may be curated manually or prepared from external source material before import. The learner must be able to understand the resulting related target profiles without needing to know internal modeling details.

**Observable acceptance:** target contexts can express reviewable capability profiles with explicit purpose/provenance and optional related-target context sufficient for assessment, gap derivation and learning focus, while preserving unresolved/refinable expectations.

### [PC-02] Structured data input and curation

Enable a curator/operator, external preparation workflow or explicitly self-curating learner to bootstrap and maintain modeled data through two complementary paths:

- bulk loading of prepared structured data conforming to a supported import contract;
- incremental creation, correction and relationship maintenance.

The modeled corpus may include targets, capabilities, knowledge, learning/practice material and assessment/evidence design data.

**Observable acceptance:** accepted modeled data can be loaded in bulk or maintained incrementally with explicit validation/rejection outcomes. A concrete import schema belongs to downstream machine-interface design. Automatic extraction from arbitrary source material is not required for the first frontend prototype.

### [PC-03] Knowledge organization and exploration

Turn fragmented subject knowledge into a coherent representation that makes important concepts, distinctions and relationships understandable, navigable and reusable.

**Observable acceptance:** reusable knowledge identities and meaningful accepted relationships can be inspected globally and in target-relevant scope without requiring any one visualization form.

This capability does not prescribe a graph, ontology, hierarchy or other representation.

### [PC-04] Learning and assessment support preparation

Make learner-facing explanations, prompts, examples, questions, exercises, tasks or other learning/assessment forms available as appropriate to the required capability and intended evidence.

**Observable acceptance:** prepared support can be related to the intended capability/target without treating material existence or completion as evidence that the capability has been achieved.

Automatic generation/derivation is not a current requirement.

### [PC-05] Gap identification and learning prioritization

Use the target requirement profile and accepted learner state to identify target-relative gaps or unresolved uncertainty and decide what deserves attention next under limited time and attention.

**Observable acceptance:** the learner can distinguish satisfied, unresolved and materially challenged target requirements where accepted semantics support those conclusions, and can establish an explicit next focus with rationale.

Priority must remain target-relative and evidence/uncertainty-aware rather than a property of Knowledge or Capability. Deadline, upcoming selection stage, available time/energy and preparation cost may legitimately affect focus when recorded as explicit constraints rather than capability semantics.

### [PC-06] Learning and practice

Support deliberate interaction with material or tasks so relevant knowledge and knowledge-dependent capability can be acquired, reconstructed, retrieved and, where required, applied.

**Observable acceptance:** the product can support or delegate learning/practice activity without allowing a particular runtime, question format or exercise mechanism to define Prep's product semantics.

### [PC-07] Assessment and learning evidence

Capture contextual evidence from diagnostic, retrieval, practice or other relevant performance, preserve enough context and provenance to bound what can be inferred, and derive learner-state conclusions only through accepted evidence semantics.

**Observable acceptance:** the learner can perform or import supported assessment/practice evidence and inspect which capability claims are supported, challenged or still unresolved. Recorded observations remain distinguishable from inferred conclusions.

### [PC-08] Retention support

Support keeping important knowledge and knowledge-dependent capability available over time and detecting when earlier evidence is no longer sufficient to rely on.

**Observable acceptance:** temporal relevance of evidence may constrain what current learner-state conclusions are justified. Retention activity may be delegated to an external study runtime; Prep does not prescribe a repetition/scheduling or learner-state inference algorithm.

### [PC-09] Progress and adaptation

Show the learner their current evidence-backed position relative to the active target purpose/context and use changing evidence to revise gaps, priorities and subsequent learning/diagnostic activity. Separately, new recruiter/company/interview information may refine target expectations without being treated as learner-state evidence.

**Observable acceptance:** after new evidence or target information is accepted, the learner can distinguish learner-state change from target refinement and revise what to work on next. Progress must preserve material scope, uncertainty and temporal limits.

### [PC-10] Knowledge and learning quality control

Detect structural or semantic problems in accepted knowledge and problematic learning, practice or assessment material that can undermine the learning process.

**Observable acceptance:** the product may expose supported structural curation diagnostics. Source validation, provenance assessment, conflicting-input resolution and a universal semantic coverage score are not product behavior unless separately accepted.

## Initial end-to-end capability slice

The minimum coherent user-centered prototype slice is:

```text
PC-01 establish/refine purpose-explicit related target profiles
  -> PC-02 provide representative prepared corpus data
  -> PC-07 establish/import enough learner evidence for an initial state
  -> PC-05 derive visible target-relative gaps/uncertainty and choose a next focus
  -> PC-03 inspect target-relevant knowledge and relationships
  -> PC-04 provide suitable learning/diagnostic support
  -> PC-06 learn/practise/diagnose
  -> PC-07 capture new evidence
  -> PC-09 show changed target-relative state, separate target refinement, and revise focus
```

For the first frontend prototype, PC-02 may be realized by mocks rather than a production import path. The import contract remains a required later capability realization, not a prerequisite for validating the frontend flow.

Question/Anki-based study may remain one compatibility slice of PC-04/PC-06/PC-07; it must not define the whole product flow.

## Current boundary

Prep is not currently defined as:

- a universal learning-management system;
- a universal system for teaching every kind of skill;
- a particular knowledge representation or visualization;
- a fixed set of graph views;
- a replacement for every external study or assessment tool;
- a universal exercise, assessment or evidence schema.

Bounded contexts, domain models, interfaces and technical realization are downstream decisions.
