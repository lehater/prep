# PREP Representative-User Design Assurance Pack

## Purpose

Close the current human-evidence gate before the frontend is treated as production UX authority.

This pack implements the already accepted Discovery and Presentation Verification obligations. It does not redefine Product, Task, Interface or Presentation semantics.

Required gates:

- **PV-14** — completely empty-system bootstrap usability;
- **PV-15** — representative-user mental-model validation;
- **PV-17** — related role/interview target-purpose comprehension;
- production gate in docs/implementation/frontend-implementation-design.md.

## Participant fit

Initial qualitative round: approximately **5–6** participants, continuing if materially new patterns still appear.

Prefer people who:

- currently work or recently worked as software developers;
- prepared for or seriously evaluated a concrete software-engineering role/interview in roughly the last six months;
- had to choose what to prepare under limited time;
- can describe a real target source or recent preparation episode;
- are not already familiar with PREP's target/state/gap/evidence model.

Fintech/payment experience is useful variation, not a requirement.

## Session structure

### Round A — current behavior, no PREP UI

Do not show PREP navigation or explain the expected lifecycle first.

Use one recent real preparation episode.

Ask the participant to show or describe:

1. what they were preparing for;
2. how they learned what the role/interview expected;
3. what changed as recruiter/company/interview information appeared;
4. how they decided what they already knew or could do;
5. what remained uncertain;
6. how they chose what to work on next;
7. what time/deadline/cost constraints changed that choice;
8. what counted as convincing evidence that preparation worked;
9. what happened after a mock/interview exposed a weakness;
10. how they assembled notes/resources/tasks/cards/AI output;
11. whether they maintained reusable structured material or only needed usable preparation support;
12. where role capability and interview performance differed.

Record natural sequence, vocabulary and artifacts. Reordering, skipping or adding steps is evidence against the current Task Model, not a UI defect to hide downstream.

### Round B — prototype challenge

Use the current mock frontend only after Round A findings for that iteration have been synthesized.

Do not explain PREP terminology unless the participant is blocked and the intervention is recorded.

#### Scenario B1 — concrete target loop

Prompt:

> You want to become suitable for a Python backend role. Use this prototype to work out what is expected, what your current position is, what to work on next, and how you would know whether you improved.

Observe whether the participant can independently:

- identify the active target and its purpose;
- understand required capabilities;
- interpret Satisfied / Unresolved / Challenged;
- distinguish missing evidence from failure;
- identify a gap;
- choose a focus and explain why now;
- reach learning or diagnostics;
- understand Observation/evidence/current conclusion distinctions;
- interpret Progress;
- decide what to do next.

Do not count task completion caused by moderator instruction as successful comprehension.

#### Scenario B2 — completely empty system

Start with the empty-corpus scenario and a motivating target description.

Prompt:

> You know the kind of role you want, but this system has no prepared target or study material yet. Show what you would do.

Pass evidence for PV-14 requires the learner to understand:

- what preparation is missing;
- that preparation can be requested/delegated;
- that the prepared result must be reviewed;
- that ordinary learner work does not require import schema, bulk/incremental choice or item repair;
- that self-curation is optional and explicit.

If the participant believes they must maintain the corpus themselves, treat that as a material finding.

#### Scenario B3 — role vs interview target

Present one role-capability target and one related selection/interview target with:

- at least one shared capability;
- one interview-only performance constraint.

Ask:

> What belongs to the job itself, and what belongs only to this hiring process? If the interview process changes, what should change here?

PV-17 passes only when participants do not infer automatic requirement inheritance between the two target purposes.

#### Scenario B4 — 3D vs non-spatial Knowledge

Give the same concrete Knowledge task through:

- search/list/detail;
- 3D projection.

Record for each representation:

- correctness;
- time/effort;
- navigation errors/disorientation;
- whether relation type/direction was understood;
- whether the participant chose or avoided 3D when both were available;
- which representation was simpler for which task.

This is evidence for the production-default decision. Preference alone is not enough; task performance and explanation matter.

## Observation dimensions

For every material interaction, record:

- expected_task;
- participant_intent;
- participant_words;
- observed_action;
- outcome;
- assistance_required;
- misconception;
- severity;
- affected_capability/artifact;
- evidence_reference.

Severity:

- **BLOCKING** — cannot complete/understand a core workflow without moderator reconstruction, or interpretation would produce materially wrong product meaning;
- **MAJOR** — completes with substantial confusion/workaround or repeatedly forms a wrong mental model;
- **MINOR** — local friction without changing core meaning/task completion;
- **OBSERVATION** — useful evidence without an identified defect.

## Routing findings

Route meaning failures upstream rather than patching labels locally:

- problem/user behavior mismatch → Discovery / problem-space.md;
- missing or unnatural user job → Task Model / User Journey;
- wrong concepts/vocabulary → Conceptual Interface Model;
- poor grouping/findability → Information Architecture;
- wrong action/state/recovery → Interaction Design;
- wrong navigation/view responsibility → Interface Topology / Screen-View Design;
- visual hierarchy/responsiveness/accessibility → Presentation System;
- transport/operation mismatch → Machine Interface;
- implementation-only defect with accepted semantics unchanged → Component/Implementation.

After an upstream material change, rerun Harness currentness and downstream validation.

## Gate decision

Do **not** mark production UX authority accepted while either condition remains true:

1. a PV-14/PV-15/PV-17 scenario has unresolved BLOCKING or MAJOR findings;
2. representative-user evidence materially challenges the current Task Model and affected downstream design has not been revalidated.

A successful round is evidence for the bounded tested population/scenarios, not proof of universal usability.
