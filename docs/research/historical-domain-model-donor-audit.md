# Historical Domain Model Donor Audit

Date: 2026-10-03
Status: research / donor evidence; noncanonical for current design authority.

## Purpose

Recover the most mature historical Prep semantic model from repository history and compare it against the current Harness-derived chain.

This audit does **not** restore the old model by authority. Historical artifacts are donor evidence and counterexamples. Any current semantic responsibility must still be re-derived from accepted upstream evidence.

## Historical model lineage reviewed

### Early interview-preparation model

Key commits:

- `5c35d8c206ded7fdc8a51da6da5b5a2f18314165` — Bootstrap project harness.
- `7c031ce2c0bbc1c6d5b787b3c99a1330b0769a0e` — Define learning task and question taxonomy.
- `d49980c35421f022d276f4122321a3bd37d88d4f` — Adopt multi-use-case learning architecture.

The early model used:

- Competency;
- Concept;
- LearningTask;
- QuestionType;
- Question;
- Attempt;
- Assessment;
- Gap;
- Mastery;
- LearningAction.

This model was useful but mixed reusable capability, subject knowledge, elicitation mechanism, runtime event and inferred learner state.

### Top-level revalidation

Key commit:

- `00a18f71baf4e4b254fa03aeb6d748645e35eff1` — Revalidate Prep top-level product and domain knowledge.

This established three independently modeled languages:

1. Knowledge Model — reusable subject meaning.
2. Learning Design — target-relative/normative learning semantics.
3. Learner Model — learner-specific evidence and inferred state.

The corresponding Model Context Strategy explicitly kept reusable subject truth, target-relative normative meaning and learner-specific descriptive/epistemic meaning separate.

### Capability-evidence refinement

Key commits:

- `431d2bd5a636481a5c93d404e237d16c9ce98dcf` — Replace tactical domain model with capability-evidence semantics.
- `221adb726b6bed9b6c21b6fddf324ddd7198f54e` — Align upstream decisions with capability-evidence model.
- `a53f42ed9dfb3c96e6d13abdacb693986b19ef8a` — Complete tactical learning-design semantics.
- `e23451618f549bdcf24e718e7aaca8c247270ba5` — Tighten learner evidence semantics.
- `4c2bf0860b0f51d90c805ab06b700498b7e16fe6` — Require uncontested support for target satisfaction.
- `67b3d30af64839098f323be3ef09e6a56801c2ad` — Require supporting evidence for capability claims.
- `cf37acc4a25dbbd8869b6597e84946ac1be52b62` — Separate role and interview targets.

This is the strongest historical donor state reviewed.

## Stable semantic distinctions

### 1. Subject Knowledge

Historical owner: Knowledge Model.

Stable semantics:

- reusable subject identity independent of learner, target and presentation;
- KnowledgeObject;
- KnowledgeProposition;
- typed relation predicates as vocabulary, distinct from relation assertions;
- learner evidence cannot mutate reusable subject truth;
- presentation/layout does not define knowledge identity.

Current relevance:

This aligns strongly with the newly restored `DS-SUBJECT-KNOWLEDGE` CORE responsibility.

### 2. Capability / performance contract

Historical owner: Learning Design.

Key semantics:

```text
Capability
    PerformanceExpectation
    condition_space
    criterion_dimensions
    constitutive_constraints
```

A Capability answers:

> What should a person be capable of doing?

A CapabilitySpecification refines a reusable Capability by condition scope and required standard.

This is neither:

- Subject Knowledge;
- one learner's state;
- one particular LearningTarget;
- one practice task.

It is reusable normative performance meaning shared by Target, Practice/Assessment and Learner claims.

### 3. Target requirements are not Capability identity

Historical model:

```text
LearningTarget
    target_context
    target_purpose
    related_targets
    RequirementExpression<CapabilitySpecification>
```

A target describes which CapabilitySpecifications matter for one external purpose/context.

Therefore:

- Capability is reusable;
- Target selects/composes capability requirements;
- Gap is target-relative;
- Capability does not become a gap by itself.

### 4. Learning/practice design is not learner performance

Historical model separates:

- LearningMaterial;
- TaskSpecification;
- Task;
- LearningSupportRequirement;
- LearningIntent;

from actual learner:

- Performance;
- Observation.

A task/opportunity creates a possibility for evidence; it does not prove capability.

### 5. Observation is not learner state

Stable learner-side sequence:

```text
Performance
  -> Observation
  -> CapabilityEvidenceArgument under EvidentialWarrant
  -> LearnerCapabilityClaim
```

Stable invariants:

- Observation is historical/token information, not a capability conclusion;
- evidence relevance exists only under an explicit inferential context/warrant;
- failure does not automatically establish a negative capability claim;
- a challenging argument does not imply the opposite claim;
- claims have temporal scope;
- learner evidence cannot redefine reusable Knowledge or Capability semantics.

### 6. Assessment/evidence design is reusable normative semantics

Historical Learning Design includes:

- ObservationSpecification;
- EvidencePattern;
- EvidentialWarrant;
- SamplingSpecification;
- AssessmentDesign.

These answer a different question from actual learner evidence:

> What observations/configuration would justify a claim about a CapabilitySpecification?

This design-time language is upstream of learner-specific evidence interpretation.

### 7. Gap, priority and intent are target-relative

Historical model explicitly keeps:

- Gap;
- LearningPriority;
- LearningIntent;

out of Knowledge and reusable Capability identity.

They are derived/normative relative to:

- LearningTarget;
- accepted learner-specific state;
- current constraints/purpose.

### 8. Relation vocabulary is not a separate subject context

The relation classification catalog is semantic vocabulary for Subject Knowledge propositions.

Important distinction:

```text
relation predicate vocabulary != relational assertion
```

This supports keeping relation classification under Tactical Domain Design for Subject Knowledge rather than inventing a separate Model Context merely because relations are complex.

### 9. Question is not a fundamental domain object

Later accepted model demoted Question to a compatibility/profile concept over:

- Task / TaskSpecification;
- ObservationSpecification;
- LearningMaterial;
- Performance;
- Observation.

This is a strong warning against letting one UI/runtime representation define the domain model.

## Strong current candidate boundaries

The historical model is evidence for the following **questions**, not automatic decisions.

### Candidate A — reusable Capability / Performance Semantics

Current Domain Strategy has:

- Preparation Direction;
- Learner Evidence & State;
- Subject Knowledge;
- Practice Enablement;
- Preparation Bootstrap.

No current responsibility clearly owns reusable Capability semantics independent of one target.

But current accepted behavior repeatedly requires a stable referent for:

- target requirements;
- learner-state claims;
- target-relevant evidence;
- practice/performance relevance.

Historical evidence strongly suggests a candidate responsibility/model language:

**Capability / Performance Semantics**

Possible semantic scope:

- Capability;
- PerformanceExpectation;
- condition space;
- criterion dimensions;
- CapabilitySpecification;
- CapabilityStandard.

This must be tested top-down before acceptance.

### Candidate B — Assessment / Evidence Design language

Current Learner Evidence & State owns learner-specific evidence and conclusions.

Historical evidence distinguishes this from reusable design-time semantics:

- what may be observed;
- what evidence configuration is sufficient;
- what warrant permits which claim;
- what sampling/assessment design intends to obtain that evidence.

Possible outcomes when revalidated:

1. remains part of reusable Capability/Performance Semantics;
2. belongs with Practice Enablement;
3. becomes an independent Assessment/Evidence Design model context;
4. is unnecessary at current product scope.

Do not preselect one.

### Candidate C — Learning Support semantics

Historical model contains:

- LearningMaterial;
- LearningSupportRequirement;
- LearningIntent.

Current Practice Enablement is intentionally broad and may be sufficient.

Revalidate whether learning-support preparation has an independently changing language/lifecycle or remains a supporting responsibility inside Practice Enablement/Application Design.

## Upstream propagation gaps discovered

### GAP-01 — role capability vs selection/interview target purpose

Current accepted Problem Evidence still contains:

- `CH-P07` — professional role capability and selection/interview performance can diverge;
- supporting naturalistic evidence;
- requirement to keep those target purposes related but semantically distinct.

Historical accepted commit `cf37acc...` propagated this into:

- Product Intent;
- Product Capabilities;
- LearningTarget.target_purpose;
- related targets without automatic requirement inheritance.

The current re-derived User Needs/Product Intent/Product Capabilities no longer carry this distinction explicitly.

**Disposition:** current upstream chain requires revalidation/repair before treating Preparation Direction semantics as complete.

### GAP-02 — retention / transfer is weaker downstream than Problem Evidence

Current Problem Evidence has accepted `OBS-P07 retention/transfer risk`.

Historical Capability semantics represented transfer through condition scope and standards; Learner claims used temporal scope and evidence rules.

Current User Needs/Product Intent/Product Capabilities use OBS-P07 mainly as evidence for state/progress but do not currently establish an explicit durable/transfer-capable outcome.

**Disposition:** re-check whether retention/transfer requires its own user need/product commitment or is sufficiently covered as a constraint on Capability, evidence and learner-state semantics.

### GAP-03 — capability identity has no clear current semantic owner

Current Product Capabilities use capability language in:

- target management;
- evidence context;
- learner state;
- practice.

Current Domain Strategy does not explicitly own reusable capability/performance semantics.

Historical model demonstrates why collapsing Capability into either Subject Knowledge or learner state causes semantic loss.

**Disposition:** must be evaluated before accepting the next Model Context Strategy revision.

### GAP-04 — design-time evidence semantics may be conflated with runtime learner evidence

Current Learner Evidence & State responsibility combines contextualized observations and conclusions.

Historical model maintains a critical distinction:

```text
ObservationSpecification / EvidencePattern / EvidentialWarrant
    !=
Performance / Observation / LearnerCapabilityClaim
```

**Disposition:** evaluate whether this is a tactical distinction inside one context or evidence for another model-language boundary.

## Historical relationships worth preserving as donor constraints

These relationships survived semantic refinement and should be tested, not blindly copied:

```text
Knowledge
  <- focuses_on - PerformanceExpectation / Capability

LearningTarget
  -> RequirementExpression<CapabilitySpecification>

LearningMaterial
  -> presents Knowledge
  -> intended_to_support CapabilitySpecification

TaskSpecification
  -> affords_observation_of ObservationSpecification

AssessmentDesign
  -> CapabilitySpecification
  -> TaskSpecification
  -> ObservationSpecification
  -> EvidentialWarrant
  -> SamplingSpecification

Performance
  -> responds_to Task

Observation
  -> about Performance / work product / action
  -> conforms_to ObservationSpecification

CapabilityEvidenceArgument
  -> Observations
  -> EvidentialWarrant
  -> LearnerCapabilityClaim

Gap
  <- derived from LearningTarget + accepted learner state

LearningPriority / LearningIntent
  <- target-relative Gap + context/constraints
```

## What should not be restored automatically

Do not infer from historical maturity that the following are current requirements:

- one monolithic Learning Design context;
- every historical tactical entity;
- mandatory AssessmentDesign;
- mandatory curator role;
- graph UI or 3D;
- graph database;
- Anki/Question-centered domain semantics;
- a universal mastery scalar;
- automatic capability composition;
- automatic target requirement inheritance;
- generic `uses` / `depends_on` knowledge edges.

## Recommended revalidation order

Before continuing to a new accepted Model Context Strategy:

1. repair/check User Needs -> Product Intent -> Product Capabilities for `CH-P07` target-purpose propagation;
2. explicitly test retention/transfer propagation from `OBS-P07`;
3. revisit Domain Strategy for reusable Capability/Performance responsibility if accepted behavior requires it;
4. then derive Model Context Strategy using:
   - current accepted top-down evidence;
   - this historical audit only as counterexample/donor evidence;
5. only afterward revalidate Tactical Domain Design entities.

## Bottom line

The strongest historical donor result is not a particular entity list. It is a set of durable semantic separations:

- **what is true about the subject** — Knowledge;
- **what a person should be capable of doing** — Capability/Performance contract;
- **what a particular target requires now** — Target/Direction;
- **what learning/practice/assessment is designed to elicit or support** — Learning/Assessment design;
- **what actually happened** — Performance/Observation;
- **what can defensibly be concluded about this learner** — learner-specific Claim/State.

The current model has restored the first, third and sixth areas clearly, but the second and design-time assessment semantics currently lack explicit ownership and must be revalidated.
