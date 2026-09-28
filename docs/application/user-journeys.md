# User Journeys

## Purpose

Define task-oriented usage scenarios before screen, navigation or transport decisions. Journeys consume accepted Product Capability, Task Model, Application and Domain semantics and do not prescribe UI realization.

## Actor and task contexts

The first version has one Prep user/data scope. Multi-user identity, authentication, authorization and tenant separation are outside current journeys.

The same physical person may work in two semantic contexts:

- **Target/Learning** — establish a target, assess current state, inspect gaps, choose a focus, learn/practise/diagnose, collect evidence and reassess.
- **Curation** — bootstrap and maintain targets, capabilities, knowledge, learning support and assessment/evidence design.

These are not security roles.

## Establish target

**Task:** `TASK-L-ESTABLISH-TARGET`

**Trigger:** user wants to prepare for a concrete role, vacancy, interview profile, certification or other outcome.

Flow:
1. User searches/browses prepared targets.
2. If a suitable target exists, user selects it.
3. If not, user enters target preparation with the motivating source/context preserved.
4. After preparation, the new target becomes active.

Alternate/recovery: missing target data is explicit and does not force the user to choose an unrelated prepared target.

**Completion:** a concrete active target with a reviewable capability requirement profile exists.

## Understand target

**Task:** `TASK-L-UNDERSTAND-TARGET`

**Preconditions:** active target.

Flow:
1. System presents target context and required capability structure.
2. User inspects required standards/conditions where material.
3. User may inspect related target-relevant knowledge.
4. User confirms that the target is suitable enough to assess against.

Alternate/recovery: incomplete or disputed requirements are visible as curation/preparation issues.

**Completion:** user understands what the target expects.

## Establish current state

**Task:** `TASK-L-ESTABLISH-CURRENT-STATE`

**Preconditions:** active target.

Flow:
1. System projects existing accepted learner claims/evidence against target requirements.
2. System distinguishes established satisfaction, challenged state and unresolved uncertainty.
3. For material unresolved areas, system exposes supported diagnostic opportunities.
4. User chooses whether existing evidence is sufficient for now or performs diagnosis.

Alternate/recovery: absence of evidence remains unknown rather than becoming failure.

**Completion:** enough evidence-backed current state exists to derive meaningful target-relative gaps or uncertainty.

## Review gaps

**Task:** `TASK-L-REVIEW-GAPS`

**Preconditions:** active target and current-state projection.

Flow:
1. System derives satisfied, unresolved and challenged target requirement fragments.
2. User inspects the basis/evidence behind visible conclusions.
3. User may move from a gap to its capability/knowledge/evidence context.

Alternate/recovery: conflicting evidence remains explicit and is not collapsed into a single proficiency score.

**Completion:** user understands the currently established difference between their state and the target.

## Choose next focus

**Task:** `TASK-L-CHOOSE-NEXT-FOCUS`

**Preconditions:** visible gaps or meaningful uncertainty.

Flow:
1. System presents current target-relative gaps, accepted priorities/rationale where available, and support availability.
2. User chooses or confirms one or more next learning/diagnostic focuses.
3. System records the current LearningPriority/LearningIntent context.

Alternate/recovery: a high-priority gap with no usable support remains selected but exposes a support-preparation issue.

**Completion:** the next target-relative focus is explicit.

## Explore relevant knowledge

**Task:** `TASK-L-EXPLORE-RELEVANT-KNOWLEDGE`

**Preconditions:** active target; current focus is optional.

Flow:
1. System projects target-relevant or focus-relevant Knowledge.
2. User searches, filters, selects and follows accepted semantic relationships.
3. User may move between broader target scope and local/focus scope without losing context.
4. Equivalent semantic access remains available independently of graph rendering.

Alternate/recovery: visualization degradation preserves list/search/detail and active target/focus state.

**Completion:** user can understand the knowledge structure relevant to the target or current gap.

## Learn or practise

**Task:** `TASK-L-LEARN-OR-PRACTISE`

**Preconditions:** active learning focus.

Flow:
1. System resolves available learning material and practice/task opportunities for the focus.
2. User selects suitable activity.
3. User performs activity in Prep or a supported external runtime.
4. System preserves correlation with target/focus and exposes preparation diagnostics where support is incomplete.

Alternate/recovery: missing support is explicit; completion itself does not close a gap.

**Completion:** meaningful learning/practice activity tied to the current focus has occurred.

## Collect evidence

**Task:** `TASK-L-COLLECT-EVIDENCE`

**Preconditions:** supported assessment/practice opportunity or supported external evidence source.

Flow:
1. User performs diagnostic/assessment activity or synchronizes/imports supported evidence.
2. System records Performance/Observation facts with provenance where faithful translation is possible.
3. Applicable evidence warrants may produce supporting/challenging arguments and learner capability claims.
4. Unsupported/incomplete integration records remain distinguishable from accepted evidence.

Alternate/recovery: failed synchronization leaves accepted evidence unchanged; one success/failure is not automatically generalized.

**Completion:** new accepted evidence is available for target reassessment.

## Review progress and adapt

**Task:** `TASK-L-REVIEW-PROGRESS`

**Preconditions:** active target and changed accepted evidence.

Flow:
1. System recomputes target satisfaction and gaps.
2. System shows material differences from the previous target-relative projection.
3. User inspects which requirements became established, remain unresolved or became challenged.
4. User decides whether to continue the current focus, choose another gap or gather more diagnostic evidence.

Alternate/recovery: no-change, increased uncertainty and newly challenged state are valid outcomes.

**Completion:** user understands progress relative to the same target and can continue the loop.

## Prepare bulk data externally

**Task:** `TASK-C-PREPARE-BULK-DATA`

**Trigger:** reusable corpus data must be created or changed at a scale where item-by-item UI authoring is inefficient.

Flow:
1. User obtains the supported import schema/examples.
2. User or an external agent/tool prepares structured data conforming to that contract.
3. Data may contain supported target, capability, knowledge, learning-support or assessment-design records.

Alternate/recovery: unsupported schema/data kinds are identifiable before application where possible.

**Completion:** a structured prepared document is ready for import validation.

## Import bulk data

**Task:** `TASK-C-IMPORT-BULK-DATA`

**Preconditions:** prepared document using a supported import contract.

Flow:
1. User selects/provides the prepared document.
2. System validates envelope and items.
3. User reviews material validation outcomes where required.
4. Valid independent items are applied.
5. System reports aggregate and per-item outcomes.

Alternate/recovery: invalid envelope blocks application; rejected items remain correctable without erasing accepted independent peers.

**Completion:** all processable items have explicit terminal outcomes.

## Maintain targets

**Task:** `TASK-C-MAINTAIN-TARGETS`

Flow:
1. Curator creates/edits target context.
2. Curator composes/replaces its RequirementExpression<CapabilitySpecification>.
3. System validates references and boolean expression semantics.
4. Accepted change becomes available to learner flows.

**Completion:** prepared target accurately expresses required capabilities.

## Maintain capabilities

**Task:** `TASK-C-MAINTAIN-CAPABILITIES`

Flow:
1. Curator creates/edits reusable Capability semantics.
2. Curator defines performance expectation, material conditions, criteria and standards where applicable.
3. Curator relates Knowledge focus where justified.
4. System validates accepted semantics/references.

**Completion:** reusable capabilities are available for target and assessment design.

## Maintain knowledge

**Task:** `TASK-C-MAINTAIN-KNOWLEDGE`

Flow:
1. Curator creates/edits Knowledge objects/propositions.
2. Curator maintains accepted semantic relationships.
3. System validates identity, references and predicate semantics.

**Completion:** reusable subject knowledge is available for exploration and support design.

## Maintain learning support

**Task:** `TASK-C-MAINTAIN-LEARNING-SUPPORT`

Flow:
1. Curator creates/edits LearningMaterial and TaskSpecifications.
2. Curator relates them to intended CapabilitySpecifications and Knowledge where applicable.
3. System evaluates explicit support requirements where defined.
4. Missing/inadequate support remains diagnostic.

**Completion:** usable target-relevant learning/practice support is available.

## Maintain assessment design

**Task:** `TASK-C-MAINTAIN-ASSESSMENT-DESIGN`

Flow:
1. Curator defines supported TaskSpecifications/ObservationSpecifications.
2. Curator maintains EvidencePatterns/EvidentialWarrants and AssessmentDesign composition where required.
3. System validates semantic compatibility.
4. Supported designs become available for learner diagnosis/evidence collection.

**Completion:** assessment opportunities can produce evidence interpretable by the learner-state model.

## Review corpus quality

**Task:** `TASK-C-REVIEW-CORPUS-QUALITY`

Flow:
1. System exposes supported structural/semantic preparation diagnostics.
2. Curator inspects unresolved references, support gaps or incomplete assessment semantics.
3. Curator chooses defects to correct through the relevant curation task.

**Completion:** known corpus defects remain visible and actionable.

## Check external runtime

**Task:** `TASK-I-CHECK-RUNTIME`

Flow:
1. User requests runtime status.
2. System reports reachable/compatible or unavailable/incompatible state plus non-secret profile context.

**Completion:** user knows whether supported runtime-dependent operations are currently possible.

## Deliberately deferred journeys

The current journeys do not require automatic extraction of arbitrary vacancy/source text, automatic generation of the reusable corpus, a universal proficiency score, a fixed graph count, or a persistent scheduling-heavy LearningPlan entity.

Those may be introduced only when their product/domain semantics are accepted.
