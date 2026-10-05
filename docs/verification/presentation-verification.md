# Presentation Verification

## Purpose

Verify the accepted Presentation System and Screen/View Design for the complete target-relative workflow, including task-complete Knowledge exploration, optional spatial enhancement, non-spatial completion, responsive hierarchy and semantic-preserving state visualization.

## PV-01 — Topology / Screen coverage

**Verifies:** every Interface Topology view/frame has one stable Screen/View subject.

**Method:** TEST.

## PV-02 — End-to-end target workflow usability

**Verifies:** a representative learner can move through:

candidate-target comparison when needed -> target establishment/refinement -> requirements -> current state -> gaps -> focus -> Knowledge/support/activity as needed -> observations/evidence -> change review -> next action

without losing active target/focus or exposing corpus/import/schema work as ordinary learner responsibility.

**Method:** DEMONSTRATION.

**Evidence:** rendered walkthrough using representative mock data.

## PV-03 — Evidence/state distinction

**Verifies:** raw observations, evidence-backed claims, derived target state and Gap presentation are visually distinguishable; unresolved is not shown as failure and no universal proficiency score is invented.

**Method:** INSPECTION + DEMONSTRATION.

## PV-04 — Gap-to-action clarity

**Verifies:** from a selected gap, the user can understand its basis and reach Knowledge, suitable support/activity or learner-facing missing-preparation support as appropriate, without exposing internal corpus/import/schema maintenance.

**Method:** DEMONSTRATION.

## PV-05 — Evidence/change semantics

**Verifies:** change review shows learner-state change only when supported by accepted evidence, preserves valid no-change and increased-uncertainty outcomes, and presents target-information refinement separately from learner-state change.

**Method:** DEMONSTRATION.

## PV-06 — Preparation-support review usability

**Verifies:** the learner can provide source context, inspect independently accepted preparation support, understand explicit unresolved/rejected remainder, recover from stale/dependency-unavailable outcomes and return to the originating preparation work.

**Method:** DEMONSTRATION.

**Evidence:** VIEW-PREPARE-SUPPORT walkthrough covering request input, partial result review, continuation/recovery and return-to-origin.

## PV-07 — Shared presentation consistency

**Verifies:** learner preparation views reuse the accepted hierarchy, context, feedback, loading/empty/outcome and focus-role system without introducing competing workspaces.

**Method:** INSPECTION.

## PV-08 — Accessibility and non-spatial completion

**Verifies:** core navigation/actions are keyboard accessible with visible focus; semantic state is not color-only; core Knowledge tasks remain completable through search/list/detail without camera manipulation.

**Method:** DEMONSTRATION.

## PV-09 — Spatial-view semantic fidelity

**Applicability:** CONDITIONAL when a 2D or experimental 3D spatial Knowledge projection is present.

**Verifies:** the spatial projection preserves canonical Knowledge identity and proposition meaning; geometry/depth/camera never become semantic truth; selection and semantic scope remain distinct.

**Method:** TEST.

## PV-10 — Spatial-view usability

**Applicability:** CONDITIONAL when a spatial Knowledge projection is presented to users.

**Verifies:** target/focus/Required-Capability-scoped Knowledge exploration remains understandable, users can restore broader scope without disorientation, and the spatial view does not displace the task-complete non-spatial path.

**Method:** DEMONSTRATION + REPRESENTATIVE-USER VALIDATION.

## PV-11 — Responsive closure

**Verifies:** wide/compact/narrow layouts preserve target context, current focus, required actions, semantic read order and task-complete non-spatial access.

**Method:** TEST.

## PV-12 — Performance degradation without semantic loss

**Verifies:** renderer profiles/degradation affect presentation cost only; semantic result set, target/focus scope, selection and non-spatial access remain preserved.

**Method:** TEST.

## PV-13 — Renderer workload evidence

**Applicability:** DEFERRED until a production renderer choice or quantitative quality boundary depends on renderer workload.

**Verifies:** when applicable, the selected production renderer has recorded evidence for the representative browser/device/workload required by the accepted Quality Design boundary.

**Method:** DEMONSTRATION.

## PV-14 — Completely empty-system bootstrap usability

**Verifies:** with no usable target/capabilities/Knowledge/support/assessment corpus, the learner can understand what preparation is missing, request/accept a low-overhead system/agent/curator preparation path, review the prepared target/support and return to Target Work without losing the motivating goal. Import schema, bulk-vs-incremental choice and item repair are not imposed unless self-curation is explicitly chosen.

**Method:** DEMONSTRATION + REPRESENTATIVE-USER VALIDATION.

**Evidence:** end-to-end prototype walkthrough of the accepted learner empty/incomplete-preparation path plus observed learner behavior. Direct routing to corpus/import/schema machinery or an unusable target editor does not satisfy the learner obligation.

## PV-15 — Representative-user mental-model validation

**Verifies:** representative users can understand and act on the core model without being taught internal Prep terminology:

target purpose/expectations (including role vs selection/interview where relevant) -> current evidence-backed state -> gap/uncertainty -> next focus -> activity -> new observation/evidence -> progress/next action, while target refinement remains distinct from learner-state change.

**Method:** REPRESENTATIVE-USER VALIDATION.

**Evidence:** sessions using the Discovery research questions/scenarios from problem-space.md, with findings mapped back to affected observations/tasks/journeys. Stakeholder acceptance and automated tests do not satisfy this obligation.

## PV-16 — Accessibility interaction closure

**Verifies:** supported core flows remain operable and understandable with keyboard-only interaction, semantic focus order/restoration, zoom/reflow/large text, non-color state encoding, form/error announcement, non-drag alternatives and reduced-motion behavior.

**Method:** TEST + DEMONSTRATION + ASSISTIVE-TECHNOLOGY REVIEW.

**Evidence:** representative target/setup, current-position, learner preparation-support, activity/evidence and Knowledge exploration checks; spatial motion/physics cannot be the only task-complete presentation under reduced-motion or assistive-technology constraints.

## PV-17 — Related target-purpose comprehension

**Verifies:** users can distinguish professional-role capability from selection/interview performance when both are relevant, understand that related targets may overlap, and do not infer that an interview-specific requirement is automatically a job-role requirement.

**Method:** DEMONSTRATION + REPRESENTATIVE-USER VALIDATION.

**Evidence:** neutral scenario containing one shared capability plus one interview-only performance constraint, with participant explanation of which target each belongs to.

## Human-validation gate

Pinned Harness structural/currentness checks prove document/trace closure, not that people understand or benefit from the interface. PV-14 and PV-15 require representative-user evidence before the UI can be treated as ready for production implementation. Until that evidence exists, the coded frontend is prototype evidence rather than UX design authority.

## Prototype evidence required

The frontend mock prototype must demonstrate at minimum:

- multi-target comparison using one learner evidence basis and a continuation into target establishment;
- one representative technical-career target with explicit purpose/context and unresolved requirement meaning where applicable;
- initial current-state projection with demonstrated/challenged/unknown areas, visible gaps and focus selection;
- support selection plus at least one learning/practice/diagnostic activity attempt;
- new evidence causing a visible evidence/change review, including valid no-change or increased-uncertainty handling;
- target/focus/Required-Capability-scoped Knowledge exploration with task-complete non-spatial access;
- learner-facing completely empty/incomplete preparation recovery through missing-support explanation, preparation request/result review and return to the originating work without corpus/import/schema machinery;
- visible Observation -> evidence-basis/claim -> Current State distinction where those layers are exposed;
- shared interaction-contract examples for input preservation, async mutation, stale recovery and focus restoration;
- wide/compact/narrow behavior;
- keyboard/non-spatial Knowledge completion;
- zoom/reflow/large-text and reduced-motion/accessibility evidence for supported core flows.
