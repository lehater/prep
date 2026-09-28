# Presentation Verification

## Purpose

Verify the accepted Presentation System and Screen/View Design for the complete target-relative workflow, including 3D-default Knowledge exploration, non-spatial completion, responsive hierarchy and semantic-preserving state visualization.

## PV-01 — Topology / Screen coverage

**Verifies:** every Interface Topology view/frame has one stable Screen/View subject.

**Method:** TEST.

## PV-02 — End-to-end target workflow usability

**Verifies:** a representative learner can move through:

target -> preparation support when needed -> state -> gaps -> focus -> learning/diagnostics -> observations/evidence -> progress -> next action

without losing active target/focus or needing Curation for ordinary learner work.

**Method:** DEMONSTRATION.

**Evidence:** rendered walkthrough using representative mock data.

## PV-03 — Evidence/state distinction

**Verifies:** raw observations, evidence-backed claims, derived target state and Gap presentation are visually distinguishable; unresolved is not shown as failure and no universal proficiency score is invented.

**Method:** INSPECTION + DEMONSTRATION.

## PV-04 — Gap-to-action clarity

**Verifies:** from a selected gap, the user can understand its basis and reach learning, diagnostics, Knowledge or learner-facing missing-preparation support as appropriate; Curation is entered only through an explicit self-curation/curator context.

**Method:** DEMONSTRATION.

## PV-05 — Progress semantics

**Verifies:** progress shows learner-state change supported by accepted evidence, including valid no-change and increased-uncertainty outcomes, and presents target refinement separately from learner progress.

**Method:** DEMONSTRATION.

## PV-06 — Import usability

**Verifies:** Curation Import clearly separates contract/example discovery, validation and application, and per-item failures remain actionable.

**Method:** DEMONSTRATION.

**Evidence:** mock bulk-import walkthrough including partial rejection.

## PV-07 — Shared presentation consistency

**Verifies:** target-work and Curation views reuse one hierarchy, feedback, collection/edit, loading/empty/failure and focus-role system.

**Method:** INSPECTION.

## PV-08 — Accessibility and non-spatial completion

**Verifies:** core navigation/actions are keyboard accessible with visible focus; semantic state is not color-only; core Knowledge tasks remain completable through search/list/detail without camera manipulation.

**Method:** DEMONSTRATION.

## PV-09 — 3D semantic fidelity

**Verifies:** the 3D projection preserves canonical Knowledge identity and proposition meaning; geometry/depth/camera never become semantic truth; selection and explicit focus remain distinct.

**Method:** TEST.

## PV-10 — Target/focus-scoped 3D suitability

**Verifies:** target-scoped and current-focus-scoped Knowledge exploration remain understandable and users can restore broader scope without disorientation.

**Method:** DEMONSTRATION.

## PV-11 — Responsive closure

**Verifies:** wide/compact/narrow layouts preserve target context, current focus, required actions, semantic read order and task-complete non-spatial access.

**Method:** TEST.

## PV-12 — Performance degradation without semantic loss

**Verifies:** renderer profiles/degradation affect presentation cost only; semantic result set, target/focus scope, selection and non-spatial access remain preserved.

**Method:** TEST.

## PV-13 — Hardware workload evidence

**Verifies:** the selected production renderer has recorded evidence for accepted visual-item workloads on a named reference environment.

**Method:** DEMONSTRATION.

## PV-14 — Completely empty-system bootstrap usability

**Verifies:** with no usable target/capabilities/Knowledge/support/assessment corpus, the learner can understand what preparation is missing, request/accept a low-overhead system/agent/curator preparation path, review the prepared target/support and return to Target Work without losing the motivating goal. Import schema, bulk-vs-incremental choice and item repair are not imposed unless self-curation is explicitly chosen.

**Method:** DEMONSTRATION + REPRESENTATIVE-USER VALIDATION.

**Evidence:** end-to-end prototype walkthrough of E2E-C1 plus observed learner behavior, with a separate curator/operator demonstration for preparation-path/import recovery. Direct routing to import or an unusable target editor does not satisfy the learner obligation.

## PV-15 — Representative-user mental-model validation

**Verifies:** representative users can understand and act on the core model without being taught internal Prep terminology:

target purpose/expectations (including role vs selection/interview where relevant) -> current evidence-backed state -> gap/uncertainty -> next focus -> activity -> new observation/evidence -> progress/next action, while target refinement remains distinct from learner-state change.

**Method:** REPRESENTATIVE-USER VALIDATION.

**Evidence:** sessions using the Discovery research questions/scenarios from problem-space.md, with findings mapped back to affected observations/tasks/journeys. Stakeholder acceptance and automated tests do not satisfy this obligation.

## PV-16 — Accessibility interaction closure

**Verifies:** supported core flows remain operable and understandable with keyboard-only interaction, semantic focus order/restoration, zoom/reflow/large text, non-color state encoding, form/error announcement, non-drag alternatives and reduced-motion behavior.

**Method:** TEST + DEMONSTRATION + ASSISTIVE-TECHNOLOGY REVIEW.

**Evidence:** representative Target Work, learner empty-system preparation support, separate Curation/import and Knowledge exploration checks; 3D motion/physics cannot be the only task-complete presentation under reduced-motion or assistive-technology constraints.

## PV-17 — Related target-purpose comprehension

**Verifies:** users can distinguish professional-role capability from selection/interview performance when both are relevant, understand that related targets may overlap, and do not infer that an interview-specific requirement is automatically a job-role requirement.

**Method:** DEMONSTRATION + REPRESENTATIVE-USER VALIDATION.

**Evidence:** neutral scenario containing one shared capability plus one interview-only performance constraint, with participant explanation of which target each belongs to.

## Human-validation gate

Pinned Harness structural/currentness checks prove document/trace closure, not that people understand or benefit from the interface. PV-14 and PV-15 require representative-user evidence before the UI can be treated as ready for production implementation. Until that evidence exists, the coded frontend is prototype evidence rather than UX design authority.

## Prototype evidence required

The frontend mock prototype must demonstrate at minimum:

- one representative technical-career target;
- initial current-state projection with both known and unresolved areas;
- visible gaps and focus selection;
- learning and diagnostic paths;
- new evidence causing a visible reassessment;
- target/focus-scoped Knowledge exploration;
- learner-facing completely empty-system bootstrap through missing-preparation explanation, preparation request/review and return to Target Work without mandatory corpus machinery;
- separate curator/operator Curation path covering bulk/import contract/validation/apply, partial rejection and incremental correction;
- visible Observation -> evidence-basis/claim -> Current State distinction where those layers are exposed;
- shared interaction-contract examples for draft preservation, async mutation, conflict/stale recovery and focus restoration;
- wide/compact/narrow behavior;
- keyboard/non-spatial Knowledge completion;
- zoom/reflow/large-text and reduced-motion/accessibility evidence for supported core flows.
