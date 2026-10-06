# Presentation Verification

## Purpose

Define evidence required to verify the accepted Presentation System and Screen/View Design against the accepted Interface Verification contract and frontend performance-capacity constraints.

Presentation Verification owns rendered/composed human-interface evidence. It does not create new product, domain, application, import/curation, or persistence semantics.

## Verification checks

### PV-01 — Topology / Screen coverage

**Verifies:** every accepted topology task view/frame has one stable Screen/View realization and no required view is invented solely by presentation structure.

**Upstream refs:** Interface Verification closure; `SV-*` Screen/View subjects.

**Method:** TEST.

**Evidence requirement:** deterministic topology-to-screen closure.

### PV-02 — End-to-end preparation workflow usability

**Verifies:** a representative learner can move through target/direction -> state/gaps -> focus -> suitable support -> activity -> evidence/change -> next action while preserving target/focus context.

**Upstream refs:** IV-03, IV-04, IV-06, IV-07; `PS-TASK-HIERARCHY`; relevant `SV-*`.

**Method:** DEMONSTRATION.

**Evidence requirement:** rendered walkthrough using representative data, including one unresolved/no-change path.

### PV-03 — Evidence/state visual distinction

**Verifies:** historical Performance/Observation facts, evidence-backed inference, target-relative current state, gaps/uncertainty and change are visually distinguishable; unknown is not rendered as failure and no universal mastery score is invented.

**Upstream refs:** IV-06, IV-07; `PS-PATTERN-STATE-BASIS`; `SV-CURRENT`, `SV-EVIDENCE`.

**Method:** INSPECTION.

**Evidence requirement:** rendered state/basis examples with supports/challenges, limitations and valid uncertainty.

### PV-04 — Support fit and adaptive progression

**Verifies:** activity presentation exposes enough fit basis to distinguish preparation purposes and learner/condition constraints, and can represent guidance/feedback/repetition/variation without presenting those mechanisms as evidence of capability.

**Upstream refs:** IV-04, IV-06; `PS-PATTERN-ACTIVITY`, `PS-PATTERN-PREP-SUPPORT`; `SV-ACTIVITY`, `SV-PREP-SUPPORT`.

**Method:** DEMONSTRATION.

**Evidence requirement:** examples for at least acquisition/practice and retention/transfer or diagnosis, showing fit limitations and continuation choices.

### PV-05 — Progress/change integrity

**Verifies:** learner-state change is presented separately from target-information refinement and supports positive change, no-change, challenge and increased uncertainty.

**Upstream refs:** IV-03, IV-07; `PS-PATTERN-STATE-BASIS`; `SV-CURRENT`, `SV-EVIDENCE`.

**Method:** DEMONSTRATION.

**Evidence requirement:** before/after rendered examples with unchanged learner evidence plus target refinement, and with new learner evidence plus unchanged target.

### PV-06 — Preparation-support bootstrap usability

**Verifies:** an empty/incomplete preparation context explains what support is missing, lets the learner request/review preparation support and return to the motivating work without exposing a mandatory corpus/import/curation workflow.

**Upstream refs:** IV-04; `PS-PATTERN-PREP-SUPPORT`; `SV-PREP-SUPPORT`.

**Method:** DEMONSTRATION.

**Evidence requirement:** rendered empty-system/missing-support walkthrough through explicit partial/unresolved outcomes and return path.

### PV-07 — Knowledge representation semantic fidelity

**Verifies:** spatial and non-spatial Knowledge projections preserve the same canonical Knowledge identity, relation meaning, relation direction/source-target distinction, scope basis and selection/focus distinctions; geometry/camera never become semantic truth.

**Upstream refs:** IV-05, IV-09; `PS-KNOWLEDGE-REPRESENTATION`; `SV-KNOWLEDGE`.

**Method:** TEST.

**Evidence requirement:** equivalent semantic fixture exercised through non-spatial and any enabled spatial projection.

### PV-08 — Responsive hierarchy

**Verifies:** wide/compact/narrow composition preserves active target/focus context, required actions, semantic read order and task-complete non-spatial access.

**Upstream refs:** `PS-RESPONSIVE`; `SV-RESPONSIVE`.

**Method:** TEST.

**Evidence requirement:** deterministic responsive checks over representative Target, Current, Activity, Evidence and Knowledge views.

### PV-09 — Accessibility and non-spatial completion

**Verifies:** core flows remain operable/understandable with keyboard-only interaction, semantic focus restoration, zoom/reflow/large text, non-color state encoding, announced errors and reduced-motion behavior; drag/spatial manipulation is never the only task-complete path.

**Upstream refs:** IV-09; `PS-ACCESSIBILITY`; Screen/View rules.

**Method:** DEMONSTRATION.

**Evidence requirement:** keyboard/non-spatial walkthrough plus assistive-technology and reduced-motion evidence for representative core flows.

### PV-10 — Performance degradation without semantic loss

**Verifies:** allowed presentation/rendering degradation changes cost/detail only; semantic result set, target/focus scope, Knowledge identity, selection and non-spatial access remain preserved.

**Upstream refs:** `PS-DEGRADATION`; `SV-PERFORMANCE`; frontend performance-capacity constraints.

**Method:** TEST.

**Evidence requirement:** same semantic fixture under supported degradation profiles. No numeric performance target is invented when upstream defers one.

### PV-11 — Related-target purpose comprehension

**Verifies:** users can distinguish professional-role capability from selection/interview performance when both are relevant and do not infer requirement inheritance merely because targets are related.

**Upstream refs:** IV-03; target-comparison presentation/screen patterns.

**Method:** DEMONSTRATION.

**Evidence requirement:** representative-user session with one shared capability and one target-specific performance constraint; participant explanation is retained as evidence.

### PV-12 — Core mental-model evidence gate

**Verifies:** representative users can understand and act on target purpose/requirements -> evidence-backed state -> gap/uncertainty -> next focus -> support/activity -> evidence/change without being taught internal Prep type names.

**Upstream refs:** IV-03 through IV-08; Presentation System patterns and relevant Screen/View subjects.

**Method:** DEMONSTRATION.

**Evidence requirement:** representative-user sessions with observations mapped back to affected checks. Stakeholder approval and automated tests alone do not satisfy this evidence requirement.

### PV-13 — State-dependent composition integrity

**Verifies:** each material state-dependent composition remains the same accepted view responsibility, exposes exactly one dominant task/work region, keeps context/detail/actions subordinate to that work, and does not create a hidden route, product mode or domain state. On capable wide surfaces, the application shell owns the bounded viewport, persistent preparation navigation remains available, and task-region overflow does not displace the application frame. For Knowledge, the declared wide spatial-overview variant keeps task-complete nonspatial results simultaneously available while exactly one region remains dominant.

**Upstream refs:** `PS-APPLICATION-SURFACE`; `PS-TASK-HIERARCHY`; `SV-FRAME`; `SV-KNOWLEDGE`; `SV-COMPOSITION-VARIANTS`; composition variants in Targets, Target, Knowledge, Activity and Prepare Support.

**Method:** TEST + INSPECTION.

**Evidence requirement:** a state matrix or rendered walkthrough showing the dominant region for every declared composition variant and confirming unchanged view identity/navigation semantics; representative wide evidence must also show stable application-frame ownership/persistent navigation while bounded child regions overflow independently. Exact pane widths, splitter thickness and CSS/DOM mechanics are not verification oracles.

## Product requirement dispositions

| Requirement | Presentation verification disposition |
|---|---|
| `REQ-CAP-TARGET` | PV-02, PV-11 |
| `REQ-CAP-TARGET-PURPOSE` | PV-02, PV-11 |
| `REQ-CAP-TARGET-DIRECTION` | PV-02, PV-11 |
| `REQ-CAP-PERFORMANCE-REQUIREMENT` | PV-02, PV-04 |
| `REQ-CAP-EVIDENCE-CONTEXT` | PV-03, PV-05 |
| `REQ-CAP-STATE` | PV-03, PV-05 |
| `REQ-CAP-EVIDENCE-JUSTIFICATION` | PV-03 |
| `REQ-CAP-FOCUS` | PV-02, PV-04 |
| `REQ-CAP-PRACTICE` | PV-04 |
| `REQ-CAP-DURABLE-TRANSFER` | PV-04 verifies retention/transfer purpose and limitations; actual durable capability requires later/time-separated evidence. |
| `REQ-CAP-SUPPORT-FIT` | PV-04, PV-06 |
| `REQ-CAP-ADAPT` | PV-02, PV-05 |
| `REQ-CAP-BOOTSTRAP` | PV-06 |
| `REQ-CAP-KNOWLEDGE-OVERVIEW` | PV-07 |
| `REQ-CAP-KNOWLEDGE-RELATIONSHIPS` | PV-07 |
| `REQ-CAP-KNOWLEDGE-SCOPE` | PV-07 |
| `REQ-CAP-KNOWLEDGE-DEPTH` | PV-07 |

## Explicit boundary

Presentation Verification does not establish:

- corpus Curation or production import UI;
- provider-specific external-runtime UI;
- backend/database behavior;
- target/learner semantic truth;
- numeric renderer/performance requirements that upstream has deferred.

Later Frontend Verification/Test Design may refine these evidence requirements into implementation-level checks without changing their semantic oracle.

## Completion meaning

An accepted strategy means the required evidence is explicit and traceable. Human-evidence checks remain unsatisfied until the specified representative-user/assistive-technology evidence actually exists; the strategy itself does not fabricate that evidence.
