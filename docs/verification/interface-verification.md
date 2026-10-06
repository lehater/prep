# Interface Verification

## Purpose

Define verification evidence for the accepted Task Model, Information Architecture, Interaction Design and Interface Topology.

This capability verifies the semantic **human-interface contract before concrete presentation composition**. Screen/View layout, renderer behavior, visual accessibility evidence and implementation adapters are downstream and are not owned here.

## Verification checks

### IV-01 — USER task / interaction coverage

**Verifies:** every current USER task is represented by an accepted Interaction Design context or explicit no-UI disposition, without inventing additional user work.

**Upstream refs:** Task Model USER tasks; `IX-*` interaction contexts.

**Method:** ANALYSIS.

**Evidence requirement:** deterministic task-to-interaction coverage with zero unresolved USER task references.

### IV-02 — Information / topology closure

**Verifies:** accepted interaction contexts can be placed in Interface Topology locations derived from Information Architecture; every topology parent/exit/context/location reference resolves.

**Upstream refs:** `IA-*`, `IX-*`, `TOP-*`.

**Method:** TEST.

**Evidence requirement:** deterministic IA -> interaction -> topology reference closure.

### IV-03 — Target-direction continuity

**Verifies:** candidate-target comparison, target establishment/refinement, current state, gaps/uncertainty and next-focus work preserve target purpose, requirement ownership and evidence basis without turning target refinement into learner progress.

**Upstream refs:** target/direction Task Model tasks; `IX-TARGET-DIRECTION`, `IX-TARGET`, `IX-DIRECTION`; target/current topology views.

**Method:** ANALYSIS.

**Evidence requirement:** representative semantic trace covering related role/selection targets, target-specific requirements, unchanged learner evidence and explicit unresolved direction.

### IV-04 — Preparation-support boundary continuity

**Verifies:** a learner with missing preparation support can request preparation, inspect accepted partial/rejected/unresolved outcomes and return to the motivating target/focus without being forced into a corpus/import/curation workflow.

**Upstream refs:** preparation-support tasks; `IA-LOC-PREP-SUPPORT`; `IX-PREP-SUPPORT`; `TOP-VIEW-PREP-SUPPORT`.

**Method:** DEMONSTRATION.

**Evidence requirement:** task/interaction/topology trace from missing support -> preparation request/result -> originating work, preserving target/focus context.

### IV-05 — Knowledge-orientation semantics

**Verifies:** Knowledge exploration supports semantic query/scope/detail/relationship traversal and a reversible Required Capability scope criterion without making graph/spatial representation or projection state into Knowledge truth.

**Upstream refs:** Knowledge Task Model task; `IA-LOC-KNOWLEDGE`, `IA-SCOPE-KNOWLEDGE`; `IX-KNOWLEDGE`; `TOP-VIEW-KNOWLEDGE`.

**Method:** ANALYSIS.

**Evidence requirement:** semantic trace for broad scope -> capability-bounded scope -> relation/detail -> restore broader scope.

### IV-06 — Activity / evidence boundary

**Verifies:** support selection and learning/practice/diagnostic/retention/transfer activity remain distinct from Performance/evidence conclusions; completion, feedback or repetition alone cannot change learner state. Evidence/change review is reached from a reviewed activity result (or an equivalent direct link carrying that context), while ordinary why-this-state inspection remains in Current position.

**Upstream refs:** support/activity/evidence Task Model tasks; `IX-ACTIVITY`; `TOP-VIEW-ACTIVITY`, `TOP-VIEW-EVIDENCE`, `TOP-EVIDENCE-REVIEW`.

**Method:** INSPECTION.

**Evidence requirement:** interaction/topology contract review showing separate support, activity, evidence and change semantics.

### IV-07 — State and outcome integrity

**Verifies:** demonstrated/challenged/unknown, unresolved/rejected/dependency-unavailable/stale-basis and valid no-change/increased-uncertainty outcomes remain distinguishable in interaction semantics.

**Upstream refs:** current-state/evidence Task Model semantics; `IX-OUTCOMES`, `IX-CURRENTNESS`, `IX-PENDING`.

**Method:** INSPECTION.

**Evidence requirement:** state/outcome vocabulary review with no invented universal mastery/readiness scalar.

### IV-08 — Context-preserving recovery

**Verifies:** stale, unavailable, rejected or recoverable operational outcomes preserve enough target/focus/user intent to continue or reconsider rather than silently replaying against changed meaning.

**Upstream refs:** Task Model recovery semantics; `IX-CURRENTNESS`, `IX-CONTEXT-CONTINUITY`; topology navigation contracts.

**Method:** DEMONSTRATION.

**Evidence requirement:** representative stale-basis and dependency-unavailable traces through accepted interaction/topology semantics.

### IV-09 — Non-spatial / direct-access completeness

**Verifies:** task-critical interface semantics do not require pointer hover, drag, camera manipulation or a spatial graph, and direct-link/context recovery does not lose active target/focus meaning.

**Upstream refs:** `IX-KEYBOARD`, `TOP-DIRECT-LINK`, `TOP-CONTEXT`, `TOP-NO-COMPOSITION`.

**Method:** ANALYSIS.

**Evidence requirement:** contract trace showing named/keyboard/non-spatial task completion and context restoration.

## Product requirement dispositions

Every accepted Product Capability requirement reachable through the prerequisite closure has an interface-verification disposition:

| Requirement | Interface verification disposition |
|---|---|
| `REQ-CAP-TARGET` | IV-03 |
| `REQ-CAP-TARGET-PURPOSE` | IV-03 |
| `REQ-CAP-TARGET-DIRECTION` | IV-03 |
| `REQ-CAP-PERFORMANCE-REQUIREMENT` | IV-03, IV-06 |
| `REQ-CAP-EVIDENCE-CONTEXT` | IV-06, IV-07 |
| `REQ-CAP-STATE` | IV-03, IV-07 |
| `REQ-CAP-EVIDENCE-JUSTIFICATION` | IV-06, IV-07 |
| `REQ-CAP-FOCUS` | IV-03 |
| `REQ-CAP-PRACTICE` | IV-06 |
| `REQ-CAP-DURABLE-TRANSFER` | IV-06 verifies that retention/transfer purpose and evidence limitations are representable; actual durable capability remains outside Interface Verification. |
| `REQ-CAP-SUPPORT-FIT` | IV-04, IV-06 |
| `REQ-CAP-ADAPT` | IV-03, IV-07, IV-08 |
| `REQ-CAP-BOOTSTRAP` | IV-04 |
| `REQ-CAP-KNOWLEDGE-OVERVIEW` | IV-05 |
| `REQ-CAP-KNOWLEDGE-RELATIONSHIPS` | IV-05 |
| `REQ-CAP-KNOWLEDGE-SCOPE` | IV-05 |
| `REQ-CAP-KNOWLEDGE-DEPTH` | IV-05 |

## Explicit boundary

Interface Verification does **not** require:

- Screen/View composition;
- rendered visual hierarchy;
- HTTP/backend/database details;
- concrete external-runtime/provider behavior;
- a production import or Curation interface;
- 3D rendering;
- usability success from representative users.

Those obligations belong to Presentation Verification, later Frontend Verification/Test Design, or the relevant semantic owner.

## Completion meaning

This strategy is complete when the interface contract has traceable verification obligations and evidence requirements. It does not claim downstream rendered/implemented evidence already exists.
