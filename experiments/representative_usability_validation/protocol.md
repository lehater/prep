# Representative Usability Validation Protocol

## Goal

Challenge the current PREP mental model with representative users before the frontend is
treated as production UX authority.

This protocol closes human-evidence obligations; it does not ask participants to approve
the design.

Current verification targets:

- **PV-06** — empty/incomplete preparation support is understandable and recoverable;
- **PV-09** — task-complete accessible/non-spatial use, including assistive-technology
  evidence where applicable;
- **PV-11** — related role/interview targets do not imply automatic requirement
  inheritance;
- **PV-12** — the core target -> state -> gap -> focus -> activity -> evidence/change
  model is understandable without teaching internal PREP terminology.

PV-13 composition integrity and the deterministic portions of PV-08/PV-09 are already
covered by implementation tests; human sessions should still record any contradiction.

## Participant fit

Initial qualitative round: approximately 5–6 participants, continuing while materially
new patterns still appear.

Prefer participants who:

- currently work or recently worked as software developers;
- prepared for or seriously evaluated a concrete software-engineering role/interview in
  roughly the last six months;
- had to choose what to prepare under limited time;
- can describe a real target source or recent preparation episode;
- are not already familiar with PREP's target/state/gap/evidence vocabulary.

Variation in seniority, role family and interview format is useful. Do not recruit only
people whose preparation habits already resemble PREP.

## Session ordering

### Round A — current behavior, no PREP UI

Do not show PREP, its navigation or its expected lifecycle.

Use one recent real preparation episode. Ask the participant to show or describe:

1. what they were preparing for and why;
2. how they learned what the role or selection process expected;
3. whether the target changed as new recruiter/company/interview information appeared;
4. how they decided what they already knew or could do;
5. what remained uncertain rather than simply "failed";
6. how they selected what to work on next and why that item won;
7. which time/deadline/cost constraints affected that choice;
8. what counted as convincing evidence that preparation changed anything;
9. what they did when an exercise, mock or interview exposed a weakness;
10. how they assembled usable resources/tasks/support;
11. whether reusable structured material mattered to them or only usable preparation
    support;
12. where real job capability and hiring-process performance differed.

Record the natural sequence and participant vocabulary. Skipped, reordered or invented
steps are evidence about the Task Model, not friction to hide in UI wording.

Synthesize Round A notes before evaluating Round B findings for that participant.

### Round B1 — target direction and core preparation loop

Use the current deterministic prototype.

Prompt:

> You are considering the engineering interview targets shown here and have limited
> preparation time. Use the prototype to decide what you are preparing for, understand
> what is expected and your current position, choose what to work on next, perform one
> preparation activity, and decide what the result means for what you do next.

Do not explain PREP nouns unless the participant is blocked; record every intervention.

Observe whether the participant can independently:

- compare plausible Targets against one learner evidence basis;
- explain why the Targets differ without looking for a single fit/readiness score;
- establish a Target explicitly rather than assuming selection already activated it;
- distinguish Target requirements from learner state;
- distinguish **demonstrated**, **challenged** and **unknown**;
- interpret missing evidence as uncertainty rather than failure;
- understand why a gap is relevant;
- choose and explain a Next focus;
- understand support fit and its limitations;
- complete an Activity without assuming completion itself proves capability;
- understand evidence/change, including no-change or increased uncertainty;
- choose a sensible continuation.

Primary gate: PV-12. Also record vocabulary findings for the production gate.

### Round B2 — missing-support recovery

Starting from the accepted Backend Engineer interview Target, use the Behavioral
communication gap/focus path.

Prompt:

> You have decided this is what you need to work on next, but suitable support is not
> prepared. Show what you would do and how you would decide whether the result is usable.

Observe whether the participant understands that:

- missing support is a preparation problem, not evidence that the capability failed;
- Prepare Support is contextual to the originating Target/focus;
- ordinary learner work does not require corpus CRUD, import schema or item repair;
- a partial result can contain accepted support and explicit unresolved/rejected
  remainder;
- returning from preparation should preserve the motivating context.

Primary gate: PV-06.

### Round B3 — related role vs interview purpose

Use `related-target-purpose-fixture.yaml`. This is a research stimulus, not canonical
product data.

Ask:

> What belongs to being able to do the job, and what belongs only to this hiring
> process? If the interview process changes but the role does not, what should change?

Then ask the participant to explain which requirements may be shared and which require
independent evidence.

PV-11 passes only when the participant does not infer automatic inheritance merely
because the two Targets are related.

If this conceptual stimulus passes but the production Target-comparison UI has never
shown a role/interview pair, record that UI-specific evidence as still missing rather
than promoting the conceptual result beyond its scope.

### Round B4 — accessibility / assistive technology

Automated FI-09 evidence already exercises keyboard-only flow, reduced-motion preference
and non-spatial task completion. Human/assistive-technology evidence remains separate.

For participants/evaluators using the applicable access method, exercise a representative
core path and record:

- semantic focus order and focus visibility;
- control names and state announcement;
- error/outcome announcement;
- large text / zoom / reflow behavior;
- whether color is required to understand state;
- whether any task requires hover, drag or spatial manipulation;
- reduced-motion behavior where relevant.

Primary gate: PV-09.

### Spatial representation — deferred unless selected

The current production prototype intentionally has no spatial renderer dependency.
Therefore do not manufacture a 3D-vs-nonspatial session merely to close a checkbox.

If a future production spatial/default proposal is made, add a controlled comparison
using the same semantic Knowledge fixture and measure correctness, effort,
disorientation, relation comprehension and representation choice. The production gate
requires user/quality evidence before a spatial default can be accepted.

## Observation record

For every material interaction capture:

- expected task;
- participant intent in their own terms;
- participant words, with identifying details redacted;
- observed action;
- outcome;
- assistance required;
- misconception;
- severity;
- verification/artifact affected;
- evidence reference.

Severity:

- **BLOCKING** — core workflow/meaning cannot be completed without moderator
  reconstruction, or the interpretation would materially change product meaning;
- **MAJOR** — substantial confusion/workaround or repeated wrong mental model;
- **MINOR** — local friction without changing core meaning/task completion;
- **OBSERVATION** — evidence without a demonstrated defect.

## Routing findings

Do not patch a label locally when the finding challenges upstream meaning:

- problem/user behavior mismatch -> Discovery / Problem Space;
- missing or unnatural user job -> Task Model / User Journey;
- wrong concepts/vocabulary -> Conceptual Interface Model;
- poor grouping/findability -> Information Architecture;
- wrong action/state/recovery -> Interaction Design;
- wrong navigation/view responsibility -> Interface Topology / Screen-View Design;
- visual hierarchy/responsiveness/accessibility -> Presentation System;
- transport/operation mismatch -> Machine Interface;
- accepted semantics correct but implementation wrong -> Component/Implementation.

After material upstream changes, revalidate the affected Harness chain and rerun the
relevant participant scenario.

## Round decision

Do not treat the production UX gate as closed while any of these is true:

1. PV-06, PV-11 or PV-12 lacks representative-user evidence;
2. an applicable PV-09 assistive-technology/accessibility obligation remains untested;
3. a BLOCKING or MAJOR finding remains unresolved or its material correction is not
   retested;
4. representative evidence materially challenges the Task Model and affected downstream
   design has not been revalidated;
5. critical learner vocabulary remains materially misunderstood;
6. a production spatial/default decision is proposed without the required user/quality
   evidence.

A successful round is evidence for the tested population and scenarios only.
