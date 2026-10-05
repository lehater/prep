# Interface Verification

## Purpose

Verify that the frontend interaction/topology contract realizes the complete user-centered target workflow and the transport-neutral machine boundary before implementation is treated as conforming.

## IV-01 — USER task coverage

**Verifies:** every current USER task has an Interaction Design context or explicit disposition.

**Method:** ANALYSIS.

**Evidence:** Task Model -> Interaction Design coverage with zero unmapped USER tasks and zero unknown task references.

## IV-02 — User-loop continuity

**Verifies:** the complete learner loop is traversable without inventing hidden application behavior:

`compare plausible targets when needed -> establish/refine target -> understand requirements -> current state -> gaps -> choose focus -> knowledge/support/activity as needed -> evidence/change review -> reassessment or target refinement`.

**Method:** ANALYSIS + DEMONSTRATION.

**Evidence:** task/journey/context/topology trace with preserved active target and focus across transitions.

## IV-03 — Empty-preparation boundary continuity

**Verifies:** an empty or incomplete preparation context supports the accepted learner trace without exposing internal corpus/import/schema responsibilities:

`preparation need -> request preparation support with source/motivating context -> inspect accepted partial/complete support plus explicit remainder -> return to the originating preparation work`.

**Method:** ANALYSIS + DEMONSTRATION.

**Evidence:** Task Model -> J-PREPARE-SUPPORT -> IX-PREP-SUPPORT -> VIEW-PREPARE-SUPPORT -> accepted machine-operation trace, including partial/unresolved/dependency-unavailable recovery.

## IV-04 — Information-location coverage

**Verifies:** every interaction context is placed through Interface Topology into accepted Information Architecture.

**Method:** ANALYSIS.

**Evidence:** interaction-context -> topology-view -> IA-location trace with all references resolved.

## IV-05 — State semantic integrity

**Verifies:** satisfied, unresolved, challenged, missing-support, unavailable-runtime and evidence/conflict states remain distinguishable and do not collapse into invented mastery/proficiency semantics.

**Method:** INSPECTION.

**Evidence:** Interaction Design and Screen/View state review against Learning/Learner Model invariants.

## IV-06 — Machine binding completeness

**Verifies:** server-backed actions/read models used by Interaction Design bind to accepted operation IDs and accepted observable outcomes.

**Method:** TEST/INSPECTION.

**Evidence:** operation reference closure against `machine-interface.md`.

## IV-07 — Topology integrity

**Verifies:** topology IDs are unique and all parent, exit, context and IA references resolve.

**Method:** TEST.

**Evidence:** deterministic pinned-Harness topology validation.

## IV-08 — Screen/View coverage

**Verifies:** every topology view/frame has one stable Screen/View subject.

**Method:** TEST.

**Evidence:** topology-to-screen-subject closure.

## IV-09 — Recovery/outcome trace

**Verifies:** validation rejection, conflict, missing evidence/support, runtime unavailable/incompatible, partial external failure and recoverable operational failure retain user context and an explicit next action.

**Method:** INSPECTION.

**Evidence:** machine outcome -> interaction state -> screen recovery trace.

## IV-10 — Mode-boundary integrity

**Verifies:** learner-facing views do not silently mutate reusable Target/Capability/Knowledge/support semantics outside accepted commands; missing-preparation recovery remains a contextual request/review flow and does not expose corpus/import/schema maintenance as learner work.

**Method:** INSPECTION.

**Evidence:** Screen/View action -> Interaction action -> Machine operation/application-owner trace, plus explicit exclusions in VIEW-PREPARE-SUPPORT.

## IV-11 — Shared interaction-contract closure

**Verifies:** accepted shared rules for navigation/context retention, unsaved drafts, asynchronous operations, validation/conflict/stale data, focus restoration, keyboard/touch alternatives and destructive-action governance are not contradicted by task-specific contexts or Screen/View Design.

**Method:** INSPECTION + DEMONSTRATION.

**Evidence:** representative traces covering:
- Target establishment/refinement rejection or stale basis -> correction/reconsideration without lost target/source input;
- activity completion -> evidence processing -> reviewed/unresolved/challenged/no-change outcome without duplicate submission or false cancellation;
- stale focus decision -> refreshed current state/gaps before reconsideration;
- contextual preparation request -> partial/unresolved/dependency-unavailable -> resume/review/return with motivating target/focus preserved;
- keyboard-only navigation/recovery with semantic focus restoration;
- spatial/drag interaction -> equivalent non-spatial/non-drag task completion.

## IV-12 — Target-purpose and refinement integrity

**Verifies:** professional-role capability and selection/interview performance can be related without requirement inheritance; target-purpose/provenance remain visible; new target information is not presented as learner progress.

**Method:** ANALYSIS + DEMONSTRATION.

**Evidence:** traces with overlapping role/interview targets, one interview-specific requirement, and a later recruiter-format refinement showing that role requirements remain unchanged unless independently revised.

## Frontend-first boundary check

The interface must be implementable against mock adapters using the same semantic ports later used by transport adapters. Verification rejects dependencies on HTTP paths, backend frameworks, database shape or persistence identifiers.

## Current evidence

Structural checks are expected from pinned Harness validation. Rendered usability/accessibility evidence belongs to Presentation/Frontend Verification.
