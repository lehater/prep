# Interface Verification

## Purpose

Verify that the frontend interaction/topology contract realizes the complete user-centered target workflow and the transport-neutral machine boundary before implementation is treated as conforming.

## IV-01 — USER task coverage

**Verifies:** every current USER task has an Interaction Design context or explicit disposition.

**Method:** ANALYSIS.

**Evidence:** Task Model -> Interaction Design coverage with zero unmapped USER tasks and zero unknown task references.

## IV-02 — User-loop continuity

**Verifies:** the complete learner loop is traversable without inventing hidden application behavior:

`establish target -> understand target -> current state -> gaps -> choose focus -> learning/diagnostics -> evidence -> progress/reassessment`.

**Method:** ANALYSIS + DEMONSTRATION.

**Evidence:** task/journey/context/topology trace with preserved active target and focus across transitions.

## IV-03 — Corpus bootstrap continuity

**Verifies:** the corpus can start empty and the interface still exposes the preparation path:

`import contract/examples -> validate -> apply -> incremental curation -> learner use`.

**Method:** ANALYSIS.

**Evidence:** task/journey/interaction/machine-operation trace for bulk import and each curation area.

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

**Verifies:** target-work views do not silently mutate reusable target/capability/knowledge/support/assessment semantics, and Curation transitions are explicit.

**Method:** INSPECTION.

**Evidence:** action/command ownership trace.

## Frontend-first boundary check

The interface must be implementable against mock adapters using the same semantic ports later used by transport adapters. Verification rejects dependencies on HTTP paths, backend frameworks, database shape or persistence identifiers.

## Current evidence

Structural checks are expected from pinned Harness validation. Rendered usability/accessibility evidence belongs to Presentation/Frontend Verification.
