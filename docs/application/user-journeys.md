# User Journeys

## Purpose

Define task-oriented interaction before screen or navigation decisions. Journeys consume accepted Product Capability, Task Model, Application and Domain semantics; they do not prescribe UI realization.

## Actor and task contexts

The first version has one Prep user/data scope. Multi-user identity, authentication, authorization and tenant separation are outside current journeys.

Within that single-user scope, the same physical person may act in two task modes:

- **Learning mode** — selects an existing curated LearningTarget, studies currently available material and inspects factual review evidence;
- **Curation mode** — maintains reusable LearningTargets/scopes, Knowledge, Requirements/RequirementSets, Questions, alignments and supported quality diagnostics.

These are task modes, not security roles. Learning consumes prepared semantic structure; semantic authoring requires an explicit move to Curation.

## Maintain knowledge

**Task:** `TASK-C-MAINTAIN-KNOWLEDGE`  
**Actor/context:** curator / Curation.  
**Trigger:** reusable subject knowledge must be added or corrected.  
**Preconditions:** Curation is available; referenced Knowledge identities/accepted relation semantics are available where a relation is edited.

Flow:
1. Curator creates/edits a KnowledgeNode manually or supplies supported prepared input.
2. Curator provides accepted semantic kind/content.
3. System validates and applies the item.
4. Curator may add/remove a precisely typed KnowledgeRelation using existing canonical endpoints.
5. System preserves stable identities and relation direction/meaning.

Alternate/recovery: invalid content/reference/relation semantics are rejected without partially applying the affected item; the curator remains able to correct/retry. No relation is coerced into a broad type merely to make the operation succeed.

**Completion:** accepted KnowledgeNodes/KnowledgeRelations are available to downstream learning/curation queries.

## Maintain learning requirements

**Task:** `TASK-C-MAINTAIN-REQUIREMENTS`  
**Actor/context:** curator / Curation.  
**Trigger:** reusable learning requirements, sets or Knowledge alignments need maintenance.  
**Preconditions:** referenced Requirement/RequirementSet/Knowledge identities exist where required.

Flow:
1. Curator creates/edits Requirements or supported prepared input.
2. Curator creates/edits RequirementSets and adds/removes Requirement or nested RequirementSet membership.
3. System rejects composition that would violate acyclicity.
4. Curator aligns/unaligns Requirements with existing KnowledgeNodes when the semantic correspondence is known.

Alternate/recovery: cycle/reference/validation rejection leaves the accepted graph unchanged for the rejected operation and preserves enough context to correct/retry.

**Completion:** accepted Requirements, acyclic compositions and Knowledge alignments are available for target composition.

## Maintain questions

**Task:** `TASK-C-MAINTAIN-QUESTIONS`  
**Actor/context:** curator / Curation.  
**Trigger:** reusable Question material must be created/corrected/aligned.  
**Preconditions:** none for Question creation; referenced Knowledge identities must exist for alignment.

Flow:
1. Curator creates/edits a Question with direct answer or supplies prepared input.
2. Curator may select one or more existing KnowledgeNodes relevant to it.
3. System records/removes Question-to-Knowledge alignment.
4. A Question may exist before alignment; unaligned state remains explicit.

Alternate/recovery: rejected content/reference changes do not erase accepted Question data or alignments. Semantic adequacy/coverage is not inferred from Question count.

**Completion:** Questions and currently accepted Knowledge alignments are available for Study Set resolution.

## Curate learning target

**Task:** `TASK-C-MAINTAIN-TARGETS`  
**Actor/context:** curator / Curation.  
**Trigger:** a prepared learning outcome/profile must be created or its reusable scope revised.  
**Preconditions:** Requirements/RequirementSets chosen for scope already exist.

Flow:
1. Curator creates/edits a LearningTarget.
2. Curator selects reusable Requirements/RequirementSets defining the prepared scope.
3. System records target selection without changing reusable Requirement semantics.
4. Curator may later revise composition through Curation.

Alternate/recovery: invalid references/conflict are visible and do not silently produce a partial target-scope mutation.

**Completion:** an existing LearningTarget has a prepared reusable scope selectable from Learning mode.

## Choose learning target

**Task:** `TASK-L-SELECT-TARGET`  
**Actor/context:** learner / Learning.  
**Trigger:** learner wants to begin/continue work toward a prepared target.  
**Preconditions:** none; zero curated targets is an explicit empty state.

Flow:
1. Learner browses/searches curated LearningTargets.
2. Learner opens/selects one.
3. System establishes the selected target as active learning context.
4. Learner may inspect its read-only prepared scope.

Alternate/recovery: empty search is distinguished from unavailable/failure; retry preserves the selection task. Editing target composition requires an explicit switch to Curation.

**Completion:** an existing curated target is active.

## Understand target

**Task:** `TASK-L-UNDERSTAND-TARGET`  
**Actor/context:** learner / Learning.  
**Trigger:** target is selected and learner needs to understand what it means/currently contains.  
**Preconditions:** active LearningTarget.

Flow:
1. System presents target definition and read-only Requirement/RequirementSet scope.
2. System exposes current material availability summaries and factual review summary where available.
3. Learner chooses whether to inspect Knowledge, Study material or Statistics next.

Alternate/recovery: unresolved/missing material is represented as an availability/curation limitation, not as fabricated coverage/mastery.

**Completion:** learner can explain the target intent/scope and choose a next learner task.

## Explore target knowledge

**Task:** `TASK-L-EXPLORE-KNOWLEDGE`  
**Actor/context:** learner / Learning.  
**Trigger:** learner needs to inspect target-relevant subject meaning/relationships.  
**Preconditions:** active LearningTarget.

Flow:
1. System projects Knowledge reached from current Requirement-to-Knowledge alignment.
2. Learner searches/filters, selects a Knowledge item and inspects canonical detail/relations.
3. Learner may explicitly focus a local neighborhood and later restore the target scope.
4. Equivalent list/search/detail access remains available alongside graph projection.

Alternate/recovery: renderer failure/degradation does not remove canonical non-graph access; data-query retry preserves active target/filter context.

**Completion:** learner can inspect relevant Knowledge identities and accepted relational context.

## Prepare study

**Task:** `TASK-L-STUDY-QUESTIONS`  
**Actor/context:** learner / Learning.  
**Trigger:** learner wants the currently available Question material for the active target.  
**Preconditions:** active LearningTarget; corpus completeness is not a prerequisite.

Flow:
1. System resolves selected Requirements/RequirementSets.
2. System follows available Requirement-to-Knowledge alignments.
3. System selects currently available Questions aligned with that Knowledge.
4. System materializes and presents the exact Study Set preview, including valid-empty output.
5. Learner may inspect Question/direct answer/supporting Knowledge and navigate a Question to its Knowledge context.

Alternate/recovery: stale materialization is not silently substituted; learner can rebuild/reinspect. Incomplete curation may limit available material without blocking a valid subset.

**Completion:** an exact current Study Set preview exists for inspection, possibly empty.

## Study externally

**Task:** `TASK-L-EXPORT-STUDY`  
**Actor/context:** learner plus supported external runtime.  
**Trigger:** learner chooses export from an inspected Study Set preview.  
**Preconditions:** active target, inspected materialization token, configured runtime.

Flow:
1. Learner requests export of the inspected preview.
2. System re-resolves current materialization and verifies the token.
3. On match, system materializes runtime-specific representation and sends it through the accepted external interface.
4. External runtime executes study.
5. Prep may later receive supported review results, resolve them to canonical Questions and record ReviewObservations.

Alternate/recovery: stale preview returns conflict requiring rebuild/reinspection; runtime-unavailable/partial/operational failures remain distinguishable and retryable without losing target/item outcome context.

**Completion:** inspected material is reconciled externally and/or supported returned ReviewObservations are recorded.

## Inspect learning statistics

**Task:** `TASK-L-REVIEW-FACTS`  
**Actor/context:** learner / Learning.  
**Trigger:** learner wants to inspect recorded review evidence.  
**Preconditions:** active target or Question context; zero observations is valid.

Flow:
1. System retrieves Question-level ReviewObservations/statistics for the current context.
2. Learner may explicitly request runtime review synchronization.
3. System presents factual aggregates/history without mastery/readiness/retention/priority inference.

Alternate/recovery: synchronization failure/unavailable runtime preserves already recorded facts and can be retried; empty history is not treated as negative evidence.

**Completion:** learner can inspect current factual review evidence.

## Check external runtime

**Task:** `TASK-I-CHECK-RUNTIME`  
**Actor/context:** user / integration status.  
**Trigger:** user wants to know whether runtime-dependent operations are currently possible.  
**Preconditions:** configured runtime profile may or may not be reachable.

Flow:
1. User opens/inspects runtime status.
2. System reports reachable/compatible or unavailable/incompatible state plus only non-secret configured profile context.

Alternate/recovery: status failure can be retried and never mutates canonical learning data.

**Completion:** current supported runtime reachability/compatibility is visible.

## Import prepared data

**Task:** `TASK-C-IMPORT-DATA`  
**Actor/context:** curator / contextual Curation import.  
**Trigger:** prepared canonical data should be loaded in bulk.  
**Preconditions:** supported prepared-data envelope/data kind.

Flow:
1. Curator selects prepared input.
2. System validates the envelope, then items according to accepted import semantics.
3. Valid independent items are applied.
4. System reports aggregate counts and per-item created/updated/duplicate/rejected outcomes.

Alternate/recovery: invalid envelope blocks application; item-level rejection remains identifiable/correctable and does not roll back accepted independent peers.

**Completion:** all processable items have terminal outcomes visible to the curator.

## Deliberately deferred journeys

No current journey automatically interprets statistics into KnowledgeNode state, overlays a degree learned on the graph, reprioritizes learning, regenerates a plan, extracts knowledge from arbitrary sources, generates questions, semantically judges Question-set coverage adequacy, or validates arbitrary source content automatically.
