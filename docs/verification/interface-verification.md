# Interface Verification

## Purpose

Define verification obligations for the accepted Task Model, Information Architecture, Interaction Design and Interface Topology before Screen/View or frontend realization is treated as conforming.

Verification owns proof obligations only. Missing product/domain/application/interface meaning routes back to the owning Authority rather than being invented as a test expectation.

## IV-01 — USER task interaction coverage

**Verifies:** every current USER task in `PREP-TASK-MODEL` has either an Interaction Design context or an explicit no-UI disposition.

**Method:** ANALYSIS.

**Evidence requirement:** deterministic Task Model -> Interaction Design coverage showing no unmapped USER task and no unknown task reference.

## IV-02 — Interaction information-location coverage

**Verifies:** every interaction context is placed in accepted Information Architecture through a topology view/location rather than inventing its own information structure.

**Method:** ANALYSIS.

**Evidence requirement:** deterministic interaction-context -> topology-view -> IA-location trace with all references resolved.

## IV-03 — Interaction response/state sufficiency

**Verifies:** each material interaction context states user actions/inputs, visible system responses, material states and recovery semantics, and server-backed contexts bind to accepted Machine Interface operation IDs.

**Method:** INSPECTION + ANALYSIS.

**Evidence requirement:** structured review of `docs/interface/interaction-design.yaml`; every server-backed context has non-empty `machine_operations`, `visible_responses`, `states` and a recovery disposition.

## IV-04 — Topology task/context closure

**Verifies:** every non-structural interaction context maps to at least one topology view, every USER task therefore reaches a view, and structural frames are explicitly identified rather than masquerading as task views.

**Method:** ANALYSIS.

**Evidence requirement:** generic Harness frontend topology closure with zero undisposed interaction contexts and zero uncovered USER tasks.

## IV-05 — Topology reference integrity

**Verifies:** topology view IDs are unique; parent, exit, interaction-context and IA-location references resolve; navigation relationships do not depend on screen-local invention.

**Method:** TEST + ANALYSIS.

**Evidence requirement:** deterministic topology validation in the pinned Harness integration.

## IV-06 — Screen/View subject coverage

**Verifies:** every view/frame required by Interface Topology has one corresponding stable Screen/View subject and no required topology subject disappears during detailed view design.

**Method:** TEST.

**Evidence requirement:** pinned Harness topology-to-screen-subject coverage comparing `docs/interface/interface-topology.yaml` with subject IDs in `docs/interface/screen-view-design.md`.

## IV-07 — Human task recovery trace

**Verifies:** accepted validation, conflict, runtime-unavailable, partial-external-failure and recoverable operational outcomes that affect current USER tasks have an explicit interaction recovery disposition before concrete screens implement them.

**Method:** INSPECTION.

**Evidence requirement:** trace from Application/Machine Interface outcomes through the applicable Interaction Design contexts. Unknown outcome semantics are a blocking upstream question, not a UI convention.

## Current evidence

The deterministic checks are executed by `tools/check_harness_integration.py` and the full Harness revalidation command. Rendered usability/accessibility evidence belongs to Presentation/Frontend Verification.

## Out of scope

This artifact does not select routes, screen regions, styling, frontend providers, test frameworks or implementation structure.
