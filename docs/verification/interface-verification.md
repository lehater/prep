# Interface Verification

## Purpose

Verify that the frontend interaction/topology contract completely realizes the current Task Model and transport-neutral frontend machine boundary before implementation is treated as conforming.

Verification owns proof obligations only; missing product/domain/application/interface meaning routes to its owner.

## IV-01 — USER task interaction coverage

**Verifies:** every current USER task has an Interaction Design context or explicit no-UI disposition.

**Method:** ANALYSIS.

**Evidence:** deterministic Task Model -> Interaction Design coverage with zero unmapped USER tasks and zero unknown task references.

## IV-02 — Interaction information-location coverage

**Verifies:** every interaction context is placed through Interface Topology into accepted Information Architecture.

**Method:** ANALYSIS.

**Evidence:** interaction-context -> topology-view -> IA-location trace with all references resolved.

## IV-03 — Interaction response/state sufficiency

**Verifies:** each material context declares actions/inputs, visible responses, material states, recovery and accepted machine-operation bindings where application data/actions are required.

**Method:** INSPECTION.

**Evidence:** review of `docs/interface/interaction-design.yaml` against current transport-neutral operation IDs/outcomes.

## IV-04 — Topology task/context closure

**Verifies:** every non-structural interaction context maps to at least one topology view, every USER task reaches a view, and structural shells remain explicit.

**Method:** ANALYSIS.

**Evidence:** Harness frontend topology closure with zero undisposed interaction contexts and zero uncovered USER tasks.

## IV-05 — Topology reference integrity

**Verifies:** topology IDs are unique and all parent, exit, context and IA references resolve.

**Method:** TEST.

**Evidence:** deterministic pinned-Harness topology validation.

## IV-06 — Screen/View subject coverage

**Verifies:** every topology view/frame has one corresponding stable Screen/View subject.

**Method:** TEST.

**Evidence:** pinned topology-to-screen-subject check comparing `interface-topology.yaml` with subject IDs in `screen-view-design.md`.

## IV-07 — Recovery/outcome trace

**Verifies:** validation rejection, conflict/stale materialization, runtime unavailable/incompatible, partial external failure and recoverable operational failure have explicit visible recovery behavior where they affect USER tasks.

**Method:** INSPECTION.

**Evidence:** trace from current Machine Interface outcomes through Interaction Design contexts and Screen/View states.

## Frontend-first boundary check

The interface layer must remain implementable against mock adapters using the same semantic ports later used by a transport adapter. Verification therefore rejects any screen/interaction requirement that depends on an HTTP path, backend framework, database shape or persistence identifier.

## Current evidence

Deterministic structural checks are executed by `tools/check_harness_integration.py` and full Harness revalidation. Rendered usability/accessibility evidence belongs to Presentation/Frontend Verification.

## Out of scope

Routes, CSS, framework/provider choice, backend transport and persistence are not verification truth here.
