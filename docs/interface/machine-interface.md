# Machine Interface Design

## Purpose

Define the transport-neutral machine-consumed contract used by the human interface to execute the accepted Prep application operations and bounded Process semantics.

The contract exposes only consumer-visible preparation behavior needed by the current frontend path. It does not expose curation workspaces, persistence structure, framework/controller decomposition, workflow-engine state, graph layout state or superseded assessment/evidential concepts.

## Contract boundary

The supported consumer is the Prep human-interface client. The contract materializes accepted Application operations plus the two bounded processes:

- `prep.application-process.activity-evidence-cycle`;
- `prep.application-process.prepare-support`.

Transport paths, verbs, streaming/polling mechanics and backend deployment remain downstream. Consumer-visible correlation uses semantic references such as target, focus, activity attempt, preparation request and semantic basis; technical request/job ids are not semantic identity.

## Common outcome envelope

Every operation returns one semantic outcome when applicable:

- `SUCCESS`;
- `UNRESOLVED`;
- `REJECTED`;
- `DEPENDENCY_UNAVAILABLE`;
- `STALE_BASIS`.

An unexpected transport/runtime failure may additionally be represented as `OPERATIONAL_FAILURE`; it carries no domain meaning and never implies that a semantic mutation was accepted.

Read results that can drive dependent mutations expose an opaque `semantic_basis_ref`. A mutation whose material target/evidence/focus basis changed returns `STALE_BASIS` rather than silently applying to different meaning.

## Representations

### Target

`TargetRepresentation` exposes target identity/context, purpose, known uncertainty and provenance needed by the active preparation context. Target remains distinct from required Capability.

### Target comparison

`TargetComparisonRepresentation` exposes two or more candidate Target refs evaluated against the same accepted learner claim/evidence basis. For each Target it preserves requirement identity, shared versus target-specific required capabilities, demonstrated/challenged/unknown projections, gaps/uncertainty, evidence applicability limits and target uncertainty. It is a read projection only: it does not mutate learner state, activate a Target, or expose a universal scalar fit/readiness/preparation-distance score.

### Target requirement

`TargetRequirementRepresentation` exposes RequirementExpression structure plus required Capability performance, conditions and quality criteria. Each PerformanceExpectation may expose its direct `knowledge_focus_refs`; these references remain separate from Subject Knowledge predicates, Capability identity and learner state.

### Current state

`CurrentStateRepresentation` exposes target-relative `demonstrated | challenged | unknown` projections with evidence-basis references and applicability limitations. It never exposes a universal mastery score.

### Evidence

`EvidenceRepresentation` exposes attributable Performance/Observation facts, provenance and inspectable CapabilityEvidenceArgument/LearnerCapabilityClaim projections, including supports/challenges and time/condition/coverage/transfer/dependence limits.

### Gap or uncertainty

`GapRepresentation` exposes target-relative satisfied/challenged/unresolved requirement fragments and the accepted basis for the gap/uncertainty.

`FocusDecisionContext` is returned alongside the current gap projection and exposes accepted target relevance, PreparationPriority rationale, material external constraints such as available time/attention or deadlines when known, and a bounded support-availability summary for candidate gap/capability focus. It is decision context only: it does not select support or assert learner Capability.

### Next focus

`FocusRepresentation` exposes the current PreparationIntent, purpose, relevant capability/gap refs and rationale.

### Knowledge

`KnowledgeProjection` preserves KnowledgeObject/KnowledgeProposition identity and predicate semantics with explicit overview/detail scope. It may include an optional `required_capability_ref` as scope basis plus the direct Knowledge-focus anchors used to derive that scope. Capability-scoped results are bounded to those anchors and accepted semantic expansion; this remains projection metadata and does not require inverse Knowledge-to-Required-Capability browsing. Graph/list/2D/3D coordinates are never contract fields.

### Preparation support

`SupportRepresentation` exposes applicable LearningMaterial, LearningSupportRequirement, TaskSpecification and ObservationSpecification references for the current focus, including the intended CapabilitySpecification, expected condition scope, inspectable support-fit basis and explicit inadequacy/limitations. Fit never implies Capability possession.

### Activity attempt

`ActivityAttemptRepresentation` exposes one semantic activity-attempt reference, selected support, active target/focus context and semantic basis. Attempt completion is not learner-state evidence by itself.

### Change

`ChangeRepresentation` exposes previous/current target-relative preparation projections and distinguishes learner-evidence change from target-information change, including valid no-change/increased-uncertainty outcomes.

### Preparation request

`PreparationRequestRepresentation` preserves motivating target/focus, source provenance, independently accepted owner-scoped support and explicit unresolved/rejected remainder. It is not a corpus-import or workflow-engine representation.

## Operations

| Operation | Kind | Minimum input | Result |
|---|---|---|---|
| `prep.targets.compare` | query | candidate_target_refs[2..N] | TargetComparisonRepresentation + semantic basis |
| `prep.target.establish` | command | target/source context, optional prior basis | active TargetRepresentation or explicit unresolved/rejected outcome |
| `prep.target.requirements.get` | query | target_ref | TargetRequirementRepresentation + semantic basis |
| `prep.current_state.get` | query | target_ref | CurrentStateRepresentation + semantic basis |
| `prep.evidence.get` | query | target_ref, optional capability/evidence ref | EvidenceRepresentation |
| `prep.gaps.get` | query | target_ref | GapRepresentation[] + FocusDecisionContext + semantic basis |
| `prep.focus.set` | command | target_ref, selected gap/capability refs, purpose/rationale, semantic_basis_ref | accepted FocusRepresentation or stale/rejected outcome |
| `prep.knowledge.query` | query | target_ref, optional focus_ref, optional required_capability_ref, semantic scope/query | KnowledgeProjection; when required_capability_ref is present, scope is anchored by that Capability's direct Knowledge focus |
| `prep.support.list` | query | target_ref, focus_ref | SupportRepresentation[] with explicit limitations |
| `prep.activity.start` | command | target_ref, focus_ref, support_ref, semantic_basis_ref | ActivityAttemptRepresentation |
| `prep.activity.complete` | command | activity_attempt_ref, attributable activity result/provenance, semantic_basis_ref | activity/evidence-cycle result; historical facts may be accepted even when inference is unresolved/rejected |
| `prep.change.get` | query | target_ref, optional activity_attempt_ref/prior basis | ChangeRepresentation |
| `prep.support.prepare.request` | command | motivating target/focus, source context/provenance, semantic_basis_ref | PreparationRequestRepresentation |
| `prep.support.prepare.get` | query/continuation | preparation_request_ref | current accepted owner-scoped support + explicit remainder and continuation/completion outcome |

## Activity/evidence process projection

`prep.activity.start` creates the semantic activity-attempt correlation used by the bounded activity/evidence occurrence.

`prep.activity.complete` supplies attributable attempt facts and requests completion of the accepted capture → evaluate → review composition. The consumer does not submit a capability conclusion. The result may be success, no-change, challenge, unresolved inference, dependency unavailable or stale basis without fabricating progress.

If execution pauses externally, the same activity attempt may continue only while its target/focus basis remains valid. The contract does not expose queue/job identity as Process identity.

## Prepare-support process projection

`prep.support.prepare.request` creates/preserves the semantic PreparationRequest and its motivating context.

`prep.support.prepare.get` exposes accepted owner-scoped results plus unresolved/rejected remainder. Accepted results are not rolled back merely because another candidate remains unresolved. Dependency unavailability preserves the request/context for later continuation while current.

The interface does not expose global corpus preparation, import schemas or learner-owned semantic maintenance.

## Compatibility

The semantic contract version is `prep-machine-v1`.

Additive fields are compatible when consumers can ignore them without changing meaning. Removing/renaming required fields, changing identity/basis semantics, collapsing distinct outcomes or changing the meaning of an existing operation requires an explicit incompatible contract revision.

## Deliberately unconstrained

- HTTP/RPC/message transport;
- endpoint paths and status codes;
- polling vs push realization;
- backend/controller/service modules;
- persistence/cache schema;
- runtime job identifiers;
- authorization mechanism not already accepted upstream;
- frontend routes/views/components;
- graph/list/2D/3D presentation.
