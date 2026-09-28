# User Journeys

## Purpose

Define task-oriented usage scenarios before screen, navigation or transport decisions. Journeys consume accepted Product Capability, Task Model, Application and Domain semantics and do not prescribe UI realization.

## Actor and task contexts

The first version has one Prep user/data scope. Multi-user identity, authentication, authorization and tenant separation are outside current journeys.

The same physical person may work in two task modes:

- **Learning mode** — selects an existing curated LearningTarget, consumes its read-only RequirementExpression, explores relevant Knowledge, uses available study material and inspects factual evidence;
- **Curation mode** — maintains reusable LearningTargets, Capability definitions, Knowledge and Question-compatible material.

These are task modes, not security roles. Learning consumes prepared semantic structure; target/capability/knowledge authoring requires an explicit Curation operation.

## Maintain knowledge

**Task:** `TASK-C-MAINTAIN-KNOWLEDGE`  
**Actor/context:** curator / Curation.  
**Trigger:** reusable subject meaning must be added or corrected.  
**Preconditions:** referenced Knowledge identities and predicate vocabulary exist when a relational proposition requires them.

Flow:
1. Curator creates or edits a KnowledgeObject or KnowledgeProposition, or supplies supported prepared input.
2. For a relational proposition, curator supplies the accepted predicate and participants/conditions needed by that proposition.
3. System validates the semantic form and references.
4. System applies the accepted change while preserving stable semantic identity.
5. Predicate vocabulary remains distinct from the proposition that asserts a relation.

Alternate/recovery: invalid content, participant reference or predicate use is rejected without silently coercing semantic meaning; correction/retry remains possible.

**Completion:** accepted KnowledgeObject/KnowledgeProposition content is available to learning and curation queries.

## Maintain capability definitions

**Task:** `TASK-C-MAINTAIN-CAPABILITIES`  
**Actor/context:** curator / Curation.  
**Trigger:** reusable capability semantics used by learning targets need maintenance.  
**Preconditions:** referenced Knowledge exists where a Capability focuses on Knowledge.

Flow:
1. Curator creates or edits a reusable Capability.
2. Curator defines its PerformanceExpectation, material condition space, criterion dimensions and constitutive constraints.
3. Curator maintains Knowledge focus where applicable.
4. System validates references and accepted Capability semantics.
5. CapabilitySpecifications may later constrain condition scope or standard when composing a LearningTarget.

Alternate/recovery: invalid references or definitions leave the accepted reusable capability unchanged and preserve correction context.

**Completion:** reusable Capability definitions are available for target RequirementExpression composition.

## Maintain Question-compatible material

**Task:** `TASK-C-MAINTAIN-QUESTIONS`  
**Actor/context:** curator / Curation.  
**Trigger:** material used by the current Question-compatible study profile must be created or corrected.  
**Preconditions:** referenced Knowledge exists when a mapping is supplied.

Flow:
1. Curator creates or edits Question-compatible prompt/response material or supplies prepared input.
2. Curator may maintain supported Knowledge mappings needed by the current compatibility profile.
3. System validates the material and mappings.
4. System preserves the distinction between the compatibility projection and its underlying TaskSpecification, LearningMaterial or ObservationSpecification semantics where those mappings are known.
5. Learning-support adequacy is evaluated only through an applicable LearningSupportRequirement, never from Question count.

Alternate/recovery: rejected content/reference changes do not erase accepted material or mappings; unresolved adequacy remains explicit.

**Completion:** accepted material is available to the supported Question-compatible Study Set profile.

## Curate learning target

**Task:** `TASK-C-MAINTAIN-TARGETS`  
**Actor/context:** curator / Curation.  
**Trigger:** a prepared learning outcome must be created or its required capability scope revised.  
**Preconditions:** CapabilitySpecifications used by the target can be resolved.

Flow:
1. Curator creates or edits a LearningTarget.
2. Curator composes or replaces its RequirementExpression<CapabilitySpecification>.
3. System validates the expression and referenced specifications.
4. System persists the accepted prepared target.
5. Curator may later revise the expression only through another Curation operation.

Alternate/recovery: invalid references, expression structure or conflict are visible and do not silently produce a partial target mutation.

**Completion:** an existing LearningTarget has a complete prepared RequirementExpression selectable from Learning mode.

## Choose learning target

**Task:** `TASK-L-SELECT-TARGET`  
**Actor/context:** learner / Learning.  
**Trigger:** learner wants to begin or continue work toward a prepared target.  
**Preconditions:** none; zero curated targets is an explicit empty state.

Flow:
1. Learner searches or browses curated LearningTargets.
2. Learner selects one.
3. System establishes it as the active learning context.
4. Learner may inspect its RequirementExpression read-only.

Alternate/recovery: empty search is distinguished from unavailable/failure; retry preserves the selection task. Editing target composition requires an explicit transition to Curation.

**Completion:** an existing curated target is active.

## Understand target

**Task:** `TASK-L-UNDERSTAND-TARGET`  
**Actor/context:** learner / Learning.  
**Trigger:** target is selected and learner needs to understand its requirements and available support.  
**Preconditions:** active LearningTarget.

Flow:
1. System presents the target definition and read-only RequirementExpression<CapabilitySpecification>.
2. System presents current learning/practice support availability and preparation diagnostics.
3. System presents factual evidence summary where available without converting facts directly into broad learner-state conclusions.
4. Learner chooses the next learning task.

Alternate/recovery: missing, inadequate or unrepresentable support is explicit rather than fabricated as completeness; unavailable evidence is not treated as negative evidence.

**Completion:** learner understands the target intent, required capability scope and current material/evidence context.

## Explore target knowledge

**Task:** `TASK-L-EXPLORE-KNOWLEDGE`  
**Actor/context:** learner / Learning.  
**Trigger:** learner needs to inspect reusable subject meaning relevant to the active target.  
**Preconditions:** active LearningTarget.

Flow:
1. System resolves target-relevant Knowledge from accepted CapabilitySpecification/Capability semantics.
2. Learner searches or filters the resulting semantic set.
3. Learner selects Knowledge and follows accepted relational KnowledgePropositions where useful.
4. System preserves Knowledge identity plus predicate/participant meaning while exploration context changes.

Alternate/recovery: presentation degradation or recoverable query failure does not remove access to canonical Knowledge semantics and does not discard active target context.

**Completion:** learner can inspect relevant Knowledge identities, propositions and relational context.

## Prepare study

**Task:** `TASK-L-STUDY-QUESTIONS`  
**Actor/context:** learner / Learning.  
**Trigger:** learner wants currently available material for the supported Question-compatible study profile.  
**Preconditions:** active interpretable LearningTarget; corpus completeness is not a prerequisite.

Flow:
1. System resolves the target RequirementExpression into CapabilitySpecification leaves.
2. System resolves currently available learning/practice support representable by the requested profile.
3. System evaluates applicable LearningSupportRequirements where defined.
4. System materializes the exact resolvable subset plus preparation diagnostics and current-state identity.
5. Learner inspects the resulting Study Set, including valid-empty output.

Alternate/recovery: stale materialization is not silently substituted; learner can rebuild/reinspect. Missing or inadequate support remains diagnostic and does not block a valid resolvable subset.

**Completion:** an exact current Study Set preview exists for inspection, possibly empty.

## Study externally

**Task:** `TASK-L-EXPORT-STUDY`  
**Actor/context:** learner plus supported external runtime.  
**Trigger:** learner chooses export from an inspected Study Set preview.  
**Preconditions:** active target, inspected current-state materialization identity, configured supported runtime.

Flow:
1. Learner requests export of the inspected preview.
2. System checks that target/support resolution still matches the preview identity.
3. On match, system materializes the runtime-specific representation and sends it through the accepted external interface.
4. External runtime executes study.
5. Supported returned activity is mapped into Performance/Observation semantics only where the mapping is semantically justified.

Alternate/recovery: stale preview returns conflict requiring rebuild/reinspection; runtime-unavailable, partial and operational failures remain distinguishable and retryable without losing target/item outcome context.

**Completion:** inspected material is exported and any supported returned evidence is recorded with appropriate provenance.

## Inspect learning evidence

**Task:** `TASK-L-REVIEW-FACTS`  
**Actor/context:** learner / Learning.  
**Trigger:** learner wants to inspect recorded factual evidence.  
**Preconditions:** active target or compatible study-item context; zero observations is valid.

Flow:
1. System retrieves relevant Observation facts and available Performance/task/provenance context.
2. Learner may explicitly request synchronization from the supported external runtime.
3. System presents factual history/aggregates without automatically asserting mastery, readiness, retention, Gap or LearningPriority.

Alternate/recovery: synchronization failure preserves recorded evidence and can be retried; empty history is not negative evidence.

**Completion:** learner can inspect current factual evidence and its context.

## Check external runtime

**Task:** `TASK-I-CHECK-RUNTIME`  
**Actor/context:** user / integration status.  
**Trigger:** user wants to know whether runtime-dependent operations are currently possible.  
**Preconditions:** configured runtime profile may or may not be reachable.

Flow:
1. User requests current runtime status.
2. System reports reachable/compatible or unavailable/incompatible state plus only non-secret configured profile context.

Alternate/recovery: status failure can be retried and never mutates canonical learning data.

**Completion:** current supported runtime reachability/compatibility is known.

## Import prepared data

**Task:** `TASK-C-IMPORT-DATA`  
**Actor/context:** curator / Curation.  
**Trigger:** prepared canonical data should be loaded in bulk.  
**Preconditions:** supported prepared-data envelope/data kind.

Flow:
1. Curator selects prepared input.
2. System validates the envelope and items according to accepted import semantics.
3. Valid independent items are applied.
4. System reports aggregate and per-item outcomes.

Alternate/recovery: invalid envelope blocks application; item-level rejection remains identifiable/correctable and does not erase accepted independent peers.

**Completion:** all processable items have terminal outcomes visible to the curator.

## Deliberately deferred journeys

No current journey automatically derives broad learner capability state from raw runtime ratings, reprioritizes learning, regenerates a plan, extracts Knowledge from arbitrary sources, generates learning material, invents support adequacy where no LearningSupportRequirement exists, or validates arbitrary source content automatically.
