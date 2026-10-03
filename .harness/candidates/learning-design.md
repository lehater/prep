# Learning Design

## Purpose

Define the reusable tactical semantics that connect **Capability & Performance**, **Preparation Direction**, **Subject Knowledge**, and practice/learning enablement.

This artifact owns reusable performance contracts and target-relative preparation design. It does **not** own actual learner performances, observations, learner capability conclusions, concrete application/user tasks, UI flows, persistence, or runtime implementation.

## Capability & Performance

### Capability

`Capability` is reusable normative meaning for what a person is expected to be able to perform.

```text
Capability
    performance_expectation
    condition_space
    constitutive_constraints
    criterion_dimensions
```

Capability identity is the semantic identity of one reusable performance contract. It is not the identity of one learner's state, one target requirement, one task, or one observed performance.

### PerformanceExpectation

`PerformanceExpectation` answers:

> What should a person be capable of doing?

Examples include diagnosing CPU saturation, constructing a proof, evaluating an investment, explaining a mechanism, or adapting a known method to a novel situation.

### Condition space

`condition_space` defines the admissible conditions under which the Capability applies.

It may include:

- situation/input class;
- environment;
- available information;
- tools/resources;
- assistance;
- constraints;
- performer-relative conditions such as novelty or unfamiliarity.

A condition is part of Capability semantics only when it materially changes what competent performance means.

### Constitutive constraints and criterion dimensions

A constitutive constraint determines whether a performance counts as an instance of the Capability at all.

A criterion dimension describes quality of an otherwise admissible performance, such as:

- accuracy;
- completeness;
- speed;
- safety;
- explanatory quality;
- trade-off quality.

Criterion dimensions do not by themselves set the required threshold for every target.

### Knowledge focus

```text
PerformanceExpectation -- focuses_on --> Knowledge*
```

`focuses_on` is owned by Capability & Performance as the cross-context semantic reference to Subject Knowledge.

It is true when Knowledge is a direct semantic object of the expected performance.

It does **not** imply that the Knowledge:

- is the only valid realization method;
- is sufficient for the Capability;
- must be memorized;
- is used identically in every competent performance;
- becomes part of the Capability's identity merely because it is referenced.

A Subject Knowledge relation is not automatically a Capability relation, and `focuses_on` is not a Subject Knowledge predicate.

## CapabilitySpecification

```text
CapabilitySpecification
    capability
    condition_scope?
    capability_standard?
```

A CapabilitySpecification means:

> Capability C within condition scope S at required standard Q.

It is a reusable value that can be selected by preparation targets, learning/practice support, and learner-evidence claims.

`condition_scope` refines the Capability's condition space. It need not be an enumerated set.

Absence of `condition_scope` means the full Capability condition space.

### CapabilityStandard

```text
CapabilityStandard
    performance_thresholds?
    consistency_requirement?
```

A CapabilityStandard may constrain criterion dimensions and stable realization across admissible occasions.

A consistency requirement is normative/ontic. Confidence in whether a learner meets that requirement is epistemic and belongs to learner-evidence semantics.

Absence of an explicit standard means only the constitutive Capability semantics are required.

No entailment between CapabilitySpecifications is automatic merely because one scope appears narrower, broader, stronger, or weaker.

## Preparation Direction

### PreparationTarget

```text
PreparationTarget
    target_context
    target_purpose
    related_targets*
    requirements: RequirementExpression<CapabilitySpecification>
```

A PreparationTarget describes the desired capability profile for one explicit purpose in an external or self-defined target context.

`target_purpose` keeps meanings such as professional-role capability, interview/selection performance, certification, or another preparation purpose distinguishable.

`related_targets` supplies context only.

Related targets do **not** automatically inherit:

- requirements;
- satisfaction;
- gaps;
- capability standards;
- evidence.

Two targets may share CapabilitySpecifications while remaining semantically distinct.

### RequirementExpression

```text
RequirementExpression =
    CapabilitySpecification
    | all_of(RequirementExpression*)
    | any_of(RequirementExpression*)
```

`all_of` means every child is required.

`any_of` means at least one child can satisfy that branch.

No additional combinator is fundamental until an accepted use case requires it.

### Gap

```text
Gap
    target
    requirement_fragment
    kind: unresolved | challenged
    basis
```

A Gap is a target-relative requirement fragment whose satisfaction is not currently established by accepted learner state.

- `unresolved`: available learner state is absent, conflicting, stale, out of scope, or otherwise insufficient;
- `challenged`: accepted learner evidence materially challenges satisfaction.

Gap does not copy or own learner observations or capability conclusions.

Absence of sufficient positive state does not create a negative learner claim.

The Boolean structure of the RequirementExpression must be preserved. An unsatisfied alternative inside an already satisfied `any_of` branch is not automatically a target gap.

### PreparationPriority

```text
PreparationPriority
    target
    focuses_on: Gap+
    rationale
```

PreparationPriority records which target-relative gaps or uncertainty deserve attention next and why.

Priority is not an intrinsic property of Knowledge, Capability, or Gap.

Rationale may include target relevance, uncertainty, deadlines, available time/attention, support availability, or preparation cost where accepted downstream policy exposes those factors.

### PreparationIntent

```text
PreparationIntent
    target
    capability_focus: CapabilitySpecification*
    addresses: Gap*
    purpose
```

PreparationIntent is a target-relative normative statement of what change, reinforcement, diagnosis, or transfer preparation should be pursued next.

`purpose` is open semantic content. It may include acquisition, reconstruction, explanation, application practice, diagnosis, transfer preparation, or retention support.

PreparationIntent does not assert that change occurred.

## Practice & Learning Enablement

### LearningMaterial

```text
LearningMaterial
    learner_facing_content

    -- presents --> Knowledge*
    -- intended_to_support --> CapabilitySpecification*
```

LearningMaterial is reusable learner-facing support that does not itself require a learner response.

It may present Subject Knowledge without becoming the owner of that Knowledge.

`intended_to_support` is design intent only. Exposure or completion does not imply learning or Capability possession.

### LearningSupportRequirement

```text
LearningSupportRequirement
    target: CapabilitySpecification
    support_constraints
    coverage_constraints
```

LearningSupportRequirement states what kinds and coverage of learning/practice opportunities are needed before support can be called adequate for the specified Capability.

It does not prescribe one universal learning-method taxonomy or one coverage score.

Support adequacy:

- is relative to an explicit CapabilitySpecification;
- may depend on material, practice, relevant conditions, or other accepted support properties;
- is not inferred from artifact count;
- does not imply that the learner acquired the Capability.

### TaskSpecification

```text
TaskSpecification
    performance_expectation
    prescribed_condition_constraints
    variable_dimensions*
    response_affordances

    -- affords_observation_of --> ObservationSpecification*
```

TaskSpecification is a reusable **performer-facing task class**, not the user/application task model.

It defines the kind of performance opportunity a conforming concrete task can create.

`response_affordances` describe what a performer is permitted or required to produce, such as:

- an answer;
- work product;
- code;
- trace;
- explanation;
- design;
- observable action.

A concrete task/session/runtime interaction belongs downstream to Application Design.

### ObservationSpecification

```text
ObservationSpecification
    target_feature
    identification_or_evaluation_method?
```

ObservationSpecification describes a feature of actual Performance that a supported practice or diagnostic opportunity is intended to make observable.

`TaskSpecification affords_observation_of ObservationSpecification` means the task specification creates an opportunity to observe the feature if a performer actually manifests it.

It does **not** imply:

- that an Observation exists;
- that the learner manifested the feature;
- that the observation is accurate;
- that a Capability conclusion is justified.

Actual Observation and evidential justification belong to Learner Evidence & State.

## Evidence-design boundary

Current accepted upstream semantics do not justify an independent Assessment/Evidence Design model context.

Therefore the following old constructs are **not currently fundamental in Learning Design**:

- EvidencePattern;
- EvidentialWarrant;
- SamplingSpecification;
- AssessmentDesign.

This does not mean evidence justification is unimportant.

It means the current tactical boundary is:

```text
CapabilitySpecification
    -> TaskSpecification / ObservationSpecification
    -> actual Performance / Observation
    -> evidence argument / learner-state conclusion
```

The first design-time part belongs here.

Actual Performance, Observation, and the explicit reasoning that supports/challenges a learner capability conclusion belong to Learner Evidence & State and will be defined by Learner Model.

If reusable evidence/warrant/sampling rules later acquire independent lifecycle or consumers, reopen Model Context Strategy before restoring a separate assessment-design language.

## Question compatibility

`Question` is not a fundamental tactical entity.

A question-like interaction can be projected from:

- TaskSpecification for the requested learner response;
- ObservationSpecification for what can be evaluated;
- optional LearningMaterial for explanation/reference content;
- Subject Knowledge references;
- CapabilitySpecification being practiced or diagnosed.

This preserves question/card workflows without making one interaction format universal.

## Boundary with Learner Evidence & State

Learning Design does not own:

- actual Performance events;
- actual Observation tokens;
- learner-specific Capability claims;
- evidence arguments;
- confidence/posteriors/proficiency values;
- mutable mastery/readiness state.

Those constructs cannot redefine Capability, PreparationTarget, or Subject Knowledge.

## Boundary with Application Design

Learning Design defines reusable normative/design semantics.

Application Design decides:

- concrete user tasks and workflows;
- creation/selection of concrete practice or diagnostic interactions;
- runtime/session coordination;
- external-runtime delegation;
- UI actions and navigation.

A reusable TaskSpecification is therefore not a screen, route, workflow, or concrete task instance.

## Allowed inference

The model permits:

- `all_of` -> every child requirement is required;
- `any_of` -> at least one child can satisfy that branch;
- a set of support artifacts/opportunities -> may be tested against an explicit LearningSupportRequirement;
- accepted learner state + RequirementExpression -> may yield target-relative satisfaction/gap projections;
- accepted learner-state changes -> may justify a new PreparationPriority or PreparationIntent.

## Forbidden inference

The model does not permit:

- `focuses_on(K)` -> K is the required realization method;
- LearningMaterial presents K -> learner knows K;
- `intended_to_support(C)` -> learner possesses C;
- support adequacy -> learner Capability;
- TaskSpecification affordance -> Observation exists;
- one successful task/performance -> broad Capability possession;
- one failed task/performance -> negative Capability claim;
- narrow condition scope -> broader CapabilitySpecification;
- related target -> inherited requirements;
- absence of satisfying learner state -> negative learner claim;
- priority -> intrinsic importance of Knowledge or Capability.

## Not fundamental in the current model

The following old constructs are not current fundamentals:

- concrete Task as a tactical-domain entity;
- Question as a fundamental entity;
- CapabilityState;
- CapabilityEstimate;
- CapabilityRealization;
- Task.demands;
- Capability.composed_of;
- PerformanceSpecification entity;
- PerformanceCriterion entity;
- universal Evidence entity;
- EvidenceRequirement;
- EvidencePattern;
- EvidentialWarrant;
- SamplingSpecification;
- AssessmentDesign;
- universal CoverageSpecification;
- AssessmentEpisode;
- TaskFamily / TaskTemplate / TaskInstance;
- Attempt;
- LearningSupportDesign as a separate aggregate.

A future accepted counterexample may reintroduce a distinction when the current minimal model causes material semantic loss.
