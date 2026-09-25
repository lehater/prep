# User Journeys

## Purpose

Define task-oriented interaction before screen or navigation decisions. These journeys consume accepted application/domain semantics and do not prescribe UI realization.

## Actor

Current scope assumes an authenticated or local Prep user who maintains learning data and prepares their own study. Identity/authentication semantics are not introduced here.

## Maintain knowledge

Goal: add or maintain reusable subject knowledge.

Entry: the user intends to record accepted subject knowledge.

Interactions:
1. User chooses to create knowledge manually or supply prepared bulk input.
2. For manual authoring, user supplies the KnowledgeNode semantic kind and content.
3. System validates domain-required structure and creates or updates the KnowledgeNode.
4. User may select existing nodes and create or remove a typed KnowledgeRelation.
5. System preserves stable identities and accepted relation semantics.

Recovery: invalid structure or relation semantics are rejected without partially applying the affected operation. Bulk-input representation and per-record reporting are downstream interface concerns.

Completion: accepted KnowledgeNodes/KnowledgeRelations are available to other Prep flows.

## Maintain learning requirements

Goal: record reusable learning requirements and compositions.

Interactions:
1. User creates/edits Requirements or supplies prepared bulk input.
2. User creates/edits RequirementSets and adds/removes Requirements or nested RequirementSets.
3. System rejects composition that violates acyclicity.
4. User may align/un-align Requirements with existing KnowledgeNodes.

Completion: accepted requirements, compositions and knowledge alignments are available for target definition.

## Maintain questions

Goal: build the question corpus independently of a particular target.

Interactions:
1. User creates/edits a Question with direct answer or supplies prepared bulk input.
2. User identifies one or more existing KnowledgeNodes relevant to the Question.
3. System records or removes Question-to-Knowledge alignments.
4. Question may exist before alignment; unaligned Questions remain distinguishable so alignment can be completed later.

Completion: Questions and their accepted knowledge alignments are available for study-set construction.

## Define learning target

Goal: describe what the learner intends to become capable of.

Interactions:
1. User creates/edits a LearningTarget.
2. User selects Requirements and/or RequirementSets for it.
3. System records target-requirement selection without changing reusable Requirement semantics.

Completion: target has sufficient accepted requirements to be used for learning preparation.

## Prepare study

Goal: obtain the questions relevant to a selected learning target.

Precondition: target requirements have sufficient Requirement-to-Knowledge alignment and relevant Questions have Question-to-Knowledge alignment.

Interactions:
1. User selects a LearningTarget.
2. System resolves selected Requirements/RequirementSets.
3. System resolves aligned KnowledgeNodes.
4. System selects Questions aligned with that knowledge.
5. System presents the resulting Study Set for inspection.
6. User may proceed with export to a supported external learning runtime.

If alignment is insufficient, system reports the missing preparation rather than inventing knowledge/question mappings.

Completion: a Study Set exists as an application materialization.

## Study externally

Goal: use a prepared Study Set in a supported external learning runtime.

Interactions:
1. User chooses export for the Study Set.
2. System materializes runtime-specific study representation.
3. System sends it through the supported external interface.
4. External runtime conducts learning.
5. Prep later receives supported review results.
6. System resolves results to canonical Questions and records ReviewObservations.

Failure/recovery semantics specific to transport, external identity reconciliation, duplicates and partial synchronization require the downstream machine-interface contract.

Completion: study material is available externally and/or returned ReviewObservations have been recorded.

## Inspect learning statistics

Goal: inspect recorded review history/statistics without treating them as inferred mastery.

Interactions:
1. User selects the relevant learning/question context.
2. System retrieves recorded Question-level ReviewObservations/statistics.
3. System presents recorded facts without claiming mastery, readiness, retention or priority.

Completion: user can inspect recorded statistics.

## Deliberately deferred journeys

No current journey automatically interprets statistics, reprioritizes learning, regenerates a plan, extracts knowledge from arbitrary sources, generates questions, or semantically validates imported source content.
