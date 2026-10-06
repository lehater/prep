version: 1
kind: screen-view-design
id: PREP-SCREEN-VIEW-DESIGN
inherits: PREP-PRESENTATION-SYSTEM

views:
  - id: FRAME-PREPARATION
    purpose: Preserve application-level preparation navigation, support candidate Target comparison before commitment, and retain active Target/focus context when established.
    topology_ref: FRAME-PREPARATION
    regions:
      - {id: prep-navigation, role: navigation, priority: primary, content: [Targets, Target, Current position, Knowledge, Activity]}
      - {id: active-context, role: context, priority: supporting, content: [active Target when established, optional Next focus]}
      - {id: active-child, role: task-surface, priority: primary, content: [current task view]}
    patterns: [PATTERN-CONTEXT-HEADER]
    responsive:
      - wide: Navigation and active-context remain simultaneously available without competing with the child task surface.
      - narrow: Navigation becomes ordered disclosure; active Target remains recoverable before the child task surface.
      - focus_order: navigation -> active context -> child view
    exclusions: [global curation mode, runtime-status workspace, edit tools]

  - id: VIEW-TARGETS
    purpose: Compare plausible preparation Targets against the same evidence-backed learner capability basis and decide which candidate to continue with.
    topology_ref: VIEW-TARGETS
    interaction_refs: [IX-TARGET-DIRECTION]
    regions:
      - {id: candidate-targets, role: selection-context, priority: primary, content: [two or more candidate Targets, purpose/context, target uncertainty]}
      - {id: target-comparison, role: primary-decision-context, priority: primary, content: [shared Required Capabilities, target-specific requirements, per-target demonstrated/challenged/unknown projection, gaps/uncertainty]}
      - {id: comparison-basis, role: supporting-detail, priority: secondary, content: [same learner evidence basis, applicability/coverage/time limitations, incomplete target requirement warnings]}
      - {id: direction-actions, role: actions, priority: primary, content: [continue with selected Target, change compared Targets, leave decision unresolved]}
    composition_variants:
      - id: candidate-selection
        when: Fewer than two usable candidate Targets are selected for comparison.
        dominant_region: candidate-targets
        region_effects: [target-comparison deferred, comparison-basis deferred, direction-actions limited to candidate-selection/change actions]
      - id: comparison-ready
        when: Two or more usable candidate Targets have a current comparison projection.
        dominant_region: target-comparison
        region_effects: [candidate-targets supporting, comparison-basis secondary, direction-actions primary]
    reads: [prep.targets.compare]
    commands: []
    patterns: [PATTERN-TARGET-COMPARISON, PATTERN-OUTCOME]
    states: [loading, ready, partial, unresolved, dependency-unavailable]
    responsive:
      - wide: Candidate Targets may be compared simultaneously with aligned requirement/state/gap dimensions and supporting limitations secondary.
      - narrow: Candidate Targets may be serialized, but each preserves the same comparison dimensions and the set of compared Targets stays explicit.
      - focus_order: candidate selection -> comparison -> direction action -> comparison basis detail
    exclusions: [universal fit score, readiness percentage, preparation-distance score, target activation as a side effect of comparison, duplicated learner profile per Target]

  - id: VIEW-TARGET
    purpose: Establish/refine Target and understand required performance.
    topology_ref: VIEW-TARGET
    interaction_refs: [IX-TARGET]
    regions:
      - {id: target-context, role: input-and-context, priority: primary, content: [target/source context, purpose, uncertainty]}
      - {id: target-requirements, role: requirement-detail, priority: primary, content: [RequirementExpression, required Capability performance, conditions, quality, direct Knowledge focus per PerformanceExpectation]}
      - {id: target-provenance, role: supporting-detail, priority: secondary, content: [provenance, unresolved expectations]}
      - {id: target-actions, role: actions, priority: primary, content: [establish/refine Target, inspect requirements, inspect required Knowledge focus, explore Knowledge scoped to a selected Required Capability, request missing support]}
    composition_variants:
      - id: target-setup
        when: No accepted active Target exists or material Target meaning remains unresolved enough to require establishment/refinement.
        dominant_region: target-context
        region_effects: [target-requirements deferred-or-partial, target-provenance secondary, target-actions emphasize establish/refine or request missing support]
      - id: target-established
        when: An accepted active Target exists with usable requirement meaning.
        dominant_region: target-requirements
        region_effects: [target-context supporting, target-provenance secondary, target-actions emphasize requirement/Knowledge navigation and optional refinement]
    reads: [prep.target.requirements.get]
    commands: [prep.target.establish, prep.support.prepare.request]
    patterns: [PATTERN-CONTEXT-HEADER, PATTERN-OUTCOME]
    states: [loading, ready, unresolved, submitting, rejected, dependency-unavailable, stale-context]
    responsive:
      - wide: Context and requirements may share the primary surface; provenance remains secondary.
      - narrow: Target context -> requirements -> provenance -> actions in semantic order.
      - focus_order: context input -> requirements -> actionable unresolved items -> primary action
    exclusions: [learner-state score, Knowledge-as-requirement, target editing beyond accepted establish/refine semantics]

  - id: VIEW-CURRENT
    purpose: Understand current evidence-backed position/gaps and choose the Next focus.
    topology_ref: VIEW-CURRENT
    interaction_refs: [IX-DIRECTION]
    regions:
      - {id: current-state, role: primary-decision-context, priority: primary, content: [demonstrated/challenged/unknown projection]}
      - {id: gaps, role: primary-decision-context, priority: primary, content: [gap or uncertainty, requirement fragment]}
      - {id: next-focus, role: action-context, priority: primary, content: [PreparationIntent purpose and rationale, target relevance, priority rationale, material time/attention constraints, support-availability summary]}
      - {id: evidence-basis, role: supporting-detail, priority: secondary, content: [why-this-state, supports/challenges, applicability limits]}
    reads: [prep.current_state.get, prep.evidence.get, prep.gaps.get]
    commands: [prep.focus.set]
    patterns: [PATTERN-CONTEXT-HEADER, PATTERN-STATE-BASIS, PATTERN-OUTCOME]
    states: [loading, ready, insufficient-evidence, challenged, submitting-focus, rejected, dependency-unavailable, stale-context]
    responsive:
      - wide: State/gaps and selected evidence basis may coexist, with focus action remaining prominent.
      - narrow: Current state -> gaps -> focus action; evidence basis follows as disclosure/detail.
      - focus_order: current-state summary -> gaps -> focus action -> evidence detail
    exclusions: [mastery percentage, automatic focus change, evidence hidden behind color-only status]

  - id: VIEW-KNOWLEDGE
    purpose: Explore relevant Subject Knowledge and relationship meaning without losing target/focus context.
    topology_ref: VIEW-KNOWLEDGE
    interaction_refs: [IX-KNOWLEDGE]
    regions:
      - {id: knowledge-query, role: query-controls, priority: supporting, content: [query, semantic scope, optional Required Capability filter, visible Capability-derived scope basis, clear-filter action, relation filters when backed]}
      - {id: knowledge-results, role: task-complete-nonspatial-results, priority: primary, content: [bounded Knowledge results, relation text/structure]}
      - {id: relationship-overview, role: optional-spatial-overview, priority: primary, content: [2D node-link overview bounded to current semantic scope including selected Required Capability scope when active]}
      - {id: knowledge-detail, role: selected-detail, priority: supporting, content: [Knowledge meaning, proposition/relationship detail]}
    reads: [prep.knowledge.query]
    commands: []
    patterns: [PATTERN-CONTEXT-HEADER, PATTERN-QUERY-RESULT-DETAIL]
    states: [loading, empty, ready, selected, dependency-unavailable, degraded]
    responsive:
      - wide: 2D relationship overview may be primary visual context alongside bounded results/detail.
      - compact: Results/detail remain visible; overview may occupy the main visual region with ordered supporting disclosures.
      - narrow: Nonspatial query/results/detail become primary; 2D overview becomes secondary disclosure or separate temporary surface.
      - focus_order: query -> result set -> relationship overview controls -> selected detail
    performance:
      constraints: [QD-SEMANTIC-PRESERVATION, QD-ACTIVE-WORKING-SET-FREEDOM, QD-GRAPH-CONDITIONAL]
      degradation: Reduce or omit spatial richness while preserving query/results/detail, Knowledge identity, scope and inspectable relationship meaning.
    exclusions: [3D-required task path, graph coordinates as Knowledge meaning, drag-only traversal]

  - id: VIEW-ACTIVITY
    purpose: Select support and perform one preparation activity attempt.
    topology_ref: VIEW-ACTIVITY
    interaction_refs: [IX-ACTIVITY]
    regions:
      - {id: active-focus, role: context, priority: supporting, content: [Next focus and rationale]}
      - {id: support-options, role: selection, priority: primary, content: [available support, intended CapabilitySpecification, expected conditions, support-fit basis, explicit limitations]}
      - {id: activity-attempt, role: primary-work, priority: primary, content: [selected support, activity task, attempt state]}
      - {id: processing-status, role: status, priority: secondary, content: [capture/evidence processing outcome state]}
    composition_variants:
      - id: support-selection
        when: No activity attempt is active.
        dominant_region: support-options
        region_effects: [active-focus supporting, activity-attempt absent-or-inactive, processing-status absent]
      - id: attempt-active
        when: An ActivityAttemptRepresentation exists and the learner is performing it.
        dominant_region: activity-attempt
        region_effects: [active-focus supporting, support-options supporting-and-noncompeting, processing-status absent]
      - id: evidence-processing
        when: The attempt has been submitted/completed and accepted evidence processing has not yet reached a reviewable terminal result.
        dominant_region: processing-status
        region_effects: [activity-attempt preserved-as-context, support-options secondary, duplicate completion action unavailable]
    reads: [prep.support.list]
    commands: [prep.activity.start, prep.activity.complete]
    patterns: [PATTERN-CONTEXT-HEADER, PATTERN-ACTIVITY-ATTEMPT, PATTERN-OUTCOME]
    states: [loading-support, no-suitable-support, ready, activity-active, submitting-attempt, evidence-processing, unresolved, dependency-unavailable, stale-context]
    responsive:
      - wide: Support selection and active attempt may coexist after selection without reducing the attempt's priority.
      - narrow: Focus -> support selection -> active attempt -> processing status.
      - focus_order: support options -> start action -> activity controls -> submit/complete -> processing status
    exclusions: [activity-complete-equals-capability-complete, implicit retry, cancellation not backed by machine contract]

  - id: VIEW-EVIDENCE-CHANGE
    purpose: Review the evaluated result of one activity attempt, understand what changed or remained unresolved, and choose the next continuation.
    topology_ref: VIEW-EVIDENCE-CHANGE
    interaction_refs: [IX-ACTIVITY]
    regions:
      - {id: change-summary, role: primary-result, priority: primary, content: [reviewed activity/attempt context, learner-evidence change, target-information refinement, changed, no-change, challenged or increased-uncertainty result]}
      - {id: current-state-after, role: primary-context, priority: primary, content: [current target-relative state/gaps]}
      - {id: evidence-detail, role: supporting-detail, priority: secondary, content: [Performance/Observation facts, evidence argument/claim basis, provenance]}
      - {id: continuation-actions, role: actions, priority: primary, content: [continue current focus, return to Current position, inspect Knowledge]}
    reads: [prep.change.get, prep.current_state.get, prep.evidence.get]
    commands: []
    patterns: [PATTERN-STATE-BASIS, PATTERN-OUTCOME]
    states: [loading, reviewed, no-change, challenged, increased-uncertainty, unresolved, dependency-unavailable]
    responsive:
      - wide: Change/current-state stay primary; evidence basis may appear beside them as supporting detail.
      - narrow: Change summary -> current state -> continuation actions -> evidence detail disclosure.
      - focus_order: change summary -> current state -> continuation actions -> evidence detail
    exclusions: [progress score, positive-change-only success styling, observation collapsed into capability conclusion]

  - id: VIEW-PREPARE-SUPPORT
    purpose: Resolve one contextual missing-support request and return usable accepted results plus explicit remainder to the originating work.
    topology_ref: VIEW-PREPARE-SUPPORT
    interaction_refs: [IX-PREP-SUPPORT]
    regions:
      - {id: motivating-context, role: context, priority: supporting, content: [originating Target/focus, missing support need]}
      - {id: source-context, role: input, priority: primary, content: [fragmented source/provenance context]}
      - {id: accepted-support, role: result, priority: primary, content: [owner-scoped accepted support]}
      - {id: remainder, role: result-detail, priority: primary, content: [unresolved/rejected remainder and reason]}
      - {id: return-action, role: actions, priority: primary, content: [resume request when current, return to originating view]}
    composition_variants:
      - id: request-input
        when: No current PreparationRequest result is available for the motivating missing-support need.
        dominant_region: source-context
        region_effects: [motivating-context supporting, accepted-support absent, remainder absent, return-action emphasizes request or return]
      - id: result-review
        when: A current PreparationRequest has accepted, partial, unresolved or rejected owner-scoped results.
        dominant_region: accepted-support
        region_effects: [motivating-context supporting, source-context supporting, remainder primary when non-empty, return-action primary]
      - id: continuation-recovery
        when: The current PreparationRequest is stale or dependency-unavailable but preserves resumable context.
        dominant_region: return-action
        region_effects: [motivating-context supporting, source-context preserved, accepted-support preserved when already accepted, remainder explains unresolved work]
    reads: [prep.support.prepare.get]
    commands: [prep.support.prepare.request]
    patterns: [PATTERN-CONTEXT-HEADER, PATTERN-PREPARE-SUPPORT, PATTERN-OUTCOME]
    states: [ready, requesting, partial, unresolved, rejected, dependency-unavailable, stale-context, complete]
    responsive:
      - wide: Accepted support and explicit remainder may be compared side by side after processing.
      - narrow: Motivating context -> source input -> accepted support -> remainder -> return action.
      - focus_order: motivating context -> source input -> request/resume -> accepted results -> remainder -> return
    exclusions: [corpus/import editor, global all-or-nothing preparation, learner-owned schema maintenance]

shared_rules:
  primary_surface: Each concrete composition variant has one dominant task/work region; other simultaneously visible regions remain supporting context, detail or actions and must not compete for task primacy.
  variant_semantics: Composition variants are presentation states of the same accepted view responsibility, not new routes, modes or domain states; variant selection follows accepted interaction/machine outcomes.
  detail_placement: Supporting detail is same-view contextual detail/disclosure by default; no accepted task has inline or dedicated semantic editing.
  action_hierarchy: One primary task action group per view; navigation/recovery remains secondary unless the view exists specifically for recovery.
  responsive_model: Priority-preserving reflow/disclosure; no separate mobile product mode.
  provider_features: No generic table/graph/editor feature is enabled unless its data/action exists in accepted machine/interaction semantics.
  visual_references: None are canonical; future Figma/prototype artifacts are review projections unless explicitly promoted.

unresolved_questions: []
