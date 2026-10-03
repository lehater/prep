# Domain Strategy

## Purpose

Define Prep's strategic problem-space responsibilities from accepted product capabilities. This artifact decides investment and isolation attention only. It does not define bounded contexts, tactical entities, APIs, storage, interface form, or deployment units.

## Strategic subdomain landscape

### DS-01 Preparation Direction — CORE

Owns the problem-space responsibility for maintaining usable preparation direction: active target, target purpose, explicit uncertainty, target-relative next focus, and adaptation when accepted evidence or external target information changes.

**Derived from:** REQ-CAP-TARGET, REQ-CAP-TARGET-PURPOSE, REQ-CAP-FOCUS, REQ-CAP-ADAPT.

**Why CORE:** deciding what the learner is preparing toward and what deserves attention next under uncertainty is central to Prep's differentiating value.

### DS-02 Capability & Performance Semantics — CORE

Owns reusable problem-space meaning for what a person is expected to be able to perform, including material conditions or constraints, acceptable quality, and the performance meaning that targets, practice, evidence, and learner-state conclusions must reference consistently.

**Derived from:** REQ-CAP-PERFORMANCE-REQUIREMENT, REQ-CAP-DURABLE-TRANSFER, REQ-CAP-SUPPORT-FIT.

**Why CORE:** accepted behavior now requires a stable performance referent that is distinct from subject knowledge, one target, one learner, and one practice activity. Without it, target requirements, evidence relevance, support fit, and transfer judgments collapse into incompatible meanings.

### DS-03 Learner Evidence and State — CORE

Owns contextualized learner observations and evidence-bounded conclusions about current target-relative capability, including demonstrated, challenged, and unknown state; evidence justification; material limits from performance context, provenance, coverage, age, and transfer conditions.

**Derived from:** REQ-CAP-EVIDENCE-CONTEXT, REQ-CAP-STATE, REQ-CAP-EVIDENCE-JUSTIFICATION, REQ-CAP-DURABLE-TRANSFER, REQ-CAP-ADAPT.

**Why CORE:** trustworthy preparation depends on separating observations from conclusions and making capability judgments reviewable and bounded by evidence.

### DS-04 Subject Knowledge — CORE

Owns reusable subject meaning needed for orientation and learning: important concepts, meaningful relationships, relevant subject scope, and coherent movement between overview and deeper detail.

**Derived from:** REQ-CAP-KNOWLEDGE-OVERVIEW, REQ-CAP-KNOWLEDGE-RELATIONSHIPS, REQ-CAP-KNOWLEDGE-SCOPE, REQ-CAP-KNOWLEDGE-DEPTH.

**Why CORE:** Prep must help learners understand unfamiliar subject structure itself, not only manage preparation around external material.

### DS-05 Practice & Learning Enablement — SUPPORTING

Owns enabling or delegating learning, practice, and diagnostic opportunities appropriate to the required performance and capable of producing relevant observations, while keeping support completion distinct from evidence of developed capability.

**Derived from:** REQ-CAP-PRACTICE, REQ-CAP-SUPPORT-FIT, REQ-CAP-EVIDENCE-CONTEXT.

**Why SUPPORTING:** Prep needs the support contract and fit to required outcomes, but accepted behavior does not require Prep to own one specific study runtime, exercise representation, or assessment execution mechanism.

### DS-06 Preparation Bootstrap — SUPPORTING

Owns turning fragmented or incomplete sources into enough usable preparation support to begin work and allowing target, capability, knowledge, and evidence-design support data to be introduced or corrected incrementally without making corpus maintenance a learner obligation.

**Derived from:** REQ-CAP-BOOTSTRAP, REQ-CAP-TARGET.

**Why SUPPORTING:** bootstrap is necessary to make the core responsibilities usable from imperfect inputs, but current behavior does not establish a separate curation product or independently valuable corpus-management lifecycle.

## Strategic relationship constraints

- Preparation Direction selects and relates target purposes and target-relative requirements but does not own reusable Capability & Performance meaning.
- Capability & Performance Semantics defines reusable performance meaning independently of a particular target, learner, practice event, or interface representation.
- Subject Knowledge owns reusable subject truth; Capability & Performance may refer to knowledge that performance focuses on, but knowledge and capability remain different strategic responsibilities.
- Learner Evidence and State may reference Capability & Performance and Subject Knowledge when interpreting evidence, but learner observations do not redefine reusable subject truth or reusable performance meaning.
- Practice & Learning Enablement consumes required performance and relevant knowledge to provide suitable opportunities; activity completion does not itself establish learner capability.
- Preparation Bootstrap may introduce or correct candidate supporting data, but accepted reusable meaning remains owned by the corresponding core responsibility.
- Assessment/evidence-design semantics are not yet an independently classified strategic subdomain. Reopen if reusable evidence-design rules acquire independent lifecycle, consumers, or product behavior beyond learner-evidence interpretation and practice enablement.
- None of these responsibilities implies a service, package, database, bounded context, graph database, or UI area.

## Explicitly not established

Current accepted product capabilities do not independently justify strategic subdomains for:

- standalone Assessment/Evidence Design;
- standalone corpus-curation/authoring product;
- mandatory curator/operator workflow;
- graph/spatial visualization;
- spaced-repetition scheduling;
- standalone quality-control system;
- production import subsystem.

## Reopening conditions

Revisit the decomposition when:

- reusable Capability & Performance meaning no longer changes coherently as one responsibility;
- evidence-design rules gain independent lifecycle/consumers distinct from learner evidence and practice enablement;
- learning/practice execution becomes a product-owned differentiator;
- Subject Knowledge orientation/relations/scope/depth split into independently changing responsibilities;
- corpus authoring/curation gains an accepted actor and independently valuable workflow;
- new accepted product capabilities establish additional strategic responsibilities.
