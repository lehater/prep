# Problem Space

## Purpose

Define the learner problem Prep exists to address before selecting product, domain, interface, or implementation solutions.

## Problem

A person needs to move from their current state of knowledge or ability to a desired state, but does not have a sufficiently reliable way to manage that transition.

For the primary motivating scenario, the desired state is often external: a role, vacancy, interview profile, certification or other opportunity defines capabilities the person is expected to demonstrate. The person may have only fragmented descriptions of that target and incomplete evidence about their own current capability.

The transition is difficult because:

- the desired state can require an uncertain scope of knowledge and different depths of mastery;
- external target descriptions may be incomplete, inconsistent, duplicated or expressed at different levels of abstraction;
- the person's current state is only partially observable;
- relevant subject material can be fragmented, incomplete, inconsistent, redundant or expressed in different terms;
- encountering information is not the same as being able to recall, explain, reason about or apply it;
- different knowledge may require different forms of learning and practice;
- evidence of learning has different strengths and can become stale;
- knowledge available now may no longer be available when it is needed later;
- successful recall in one setting does not guarantee understanding, application or transfer to another setting;
- limited time and attention require choices about what to learn next;
- as the person's state changes, those choices need to change as well.

## Evidence and provenance

The problem observations above are accepted direct stakeholder/project evidence from the current revalidation, not deductions from the existing implementation. To keep the problem statement reviewable, the durable observation set is:

- **OBS-P01 — target uncertainty:** a real learning goal can require uncertain scope and different depths of capability;
- **OBS-P02 — partial observability:** the learner's current state is not directly known and must be approached through imperfect evidence;
- **OBS-P03 — fragmented knowledge:** relevant material may be incomplete, inconsistent, redundant or expressed with different terminology;
- **OBS-P04 — exposure is not capability:** encountering information does not establish later recall, explanation, reasoning or application;
- **OBS-P05 — limited resources:** time and attention force choices about what deserves attention next;
- **OBS-P06 — changing state:** new learning/evidence can change what should be learned or checked next;
- **OBS-P07 — retention/transfer risk:** immediate success does not guarantee later availability or transfer to another context;
- **OBS-P08 — external target translation:** a learner may need to turn one or more external descriptions of a desired role/opportunity into a coherent, reviewable target capability profile before meaningful assessment is possible;
- **OBS-P09 — corpus bootstrapping:** useful assessment and learning depend on reusable target, capability, knowledge, task/material and evidence-design data that may initially be absent and must be created, imported or curated.

Provenance class: explicit product-owner/stakeholder observations accepted during Prep's Harness revalidation. No downstream UI, graph, Anki, persistence or implementation behavior is used as evidence that these problems exist.

### Evidence classes and current validation state

The observation set uses three evidence classes that must not be collapsed into one another:

- **STAKEHOLDER** — direct product-owner/project observations. This is sufficient to motivate Discovery, but not to prove representative user behavior.
- **SECONDARY** — external research, practitioner reports or public user discussions that independently support or challenge part of an observation. This can strengthen plausibility and sharpen research questions, but it does not validate Prep's concrete workflow.
- **REPRESENTATIVE-USER** — observed behavior or attributed statements from people matching the motivating user context while they work through goal-oriented scenarios. This is the evidence required to treat the user model as human-validated.

Current user-model gate: **PROVISIONAL-FOR-RESEARCH**. No OBS-Pxx item is yet accepted as representative-user validated.

| Observation | Secondary evidence status | What secondary evidence supports | Representative-user status |
| --- | --- | --- | --- |
| OBS-P01 — target uncertainty | PARTIAL-SUPPORT | Developer discussions repeatedly report uncertainty about which backend/interview topics matter for a concrete role and variation between companies/interview loops. | UNTESTED |
| OBS-P02 — partial observability | SUPPORT-OUTSIDE-TARGET-POPULATION | Learning-science reviews show limits in learners' metacognitive monitoring and strategy judgments; this supports the general problem but does not prove how Prep's target users assess themselves. | UNTESTED |
| OBS-P03 — fragmented knowledge | PARTIAL-SUPPORT | Practitioner preparation plans commonly assemble multiple resources, topic lists and practice systems rather than relying on one coherent source. | UNTESTED |
| OBS-P04 — exposure is not capability | STRONG-SECONDARY-SUPPORT | Retrieval-practice and transfer research distinguishes re-exposure from later recall/application and shows that performance depends on retrieval conditions and feedback. | UNTESTED |
| OBS-P05 — limited resources | PARTIAL-SUPPORT | Developer preparation reports explicitly describe bounded daily/weekly preparation time and the need to choose among many possible topics. | UNTESTED |
| OBS-P06 — changing state | SECONDARY-UNRESOLVED | Adaptation after new learning is plausible and consistent with self-regulated learning, but the concrete Prep decision loop is not independently established for the motivating population. | UNTESTED |
| OBS-P07 — retention/transfer risk | STRONG-SECONDARY-SUPPORT | Learning-science reviews and meta-analysis show that retention and transfer differ from immediate study success and depend on practice conditions. | UNTESTED |
| OBS-P08 — external target translation | PARTIAL-SUPPORT | Developers report tailoring preparation to role/company expectations and job descriptions; the need for a coherent capability profile is still a Prep hypothesis. | UNTESTED |
| OBS-P09 — corpus bootstrapping | PARTIAL-SUPPORT | Public preparation accounts show manual assembly of topic lists, notes, flash cards and practice resources; the need for Prep's reusable corpus and bulk/manual/mixed preparation choices remains unvalidated. | UNTESTED |

Secondary evidence used for this triangulation:

- Carpenter, Pan & Butler, *The science of effective learning with spacing and retrieval practice*, Nature Reviews Psychology (2022): https://www.nature.com/articles/s44159-022-00089-1
- Pan & Rickard, *Transfer of test-enhanced learning: Meta-analytic review and synthesis* (2018): https://pubmed.ncbi.nlm.nih.gov/29733621/
- Tech Interview Handbook, role/time-bounded coding interview study planning: https://www.techinterviewhandbook.org/coding-interview-study-plan/
- Public developer discussions illustrating topic uncertainty, bounded time and self-assembled preparation:
  - https://www.reddit.com/r/cscareerquestions/comments/1av5qc5/how_to_prep_effectively/
  - https://www.reddit.com/r/cscareerquestions/comments/1m6pr7j/is_anyone_else_overwhelmed_by_how_much_you_have/
  - https://www.reddit.com/r/cscareerquestions/comments/o3jevd/preparing_to_apply_for_a_new_role_would_love/
  - https://www.reddit.com/r/Backend/comments/1rvbhjz/backend_devs_with_35_yoe_how_do_you_prepare_for/

The public discussions above are anecdotal convenience evidence. They may expose recurring behaviors or vocabulary, but they are not treated as a representative sample and cannot satisfy the human-validation gate.


### Secondary-evidence challenges to falsify

The triangulation above also exposes plausible counterexamples to the current model. These are deliberately retained as **challenges**, not silently reconciled into the existing target-first lifecycle.

- **CH-P01 — target granularity/evolution:** developers may begin with a role/level or broad job-search target and only later learn company-specific interview format, technology emphasis or depth. The model must test whether one stable "concrete target" is natural, or whether users need a layered/refinable target that changes as new external information arrives.
- **CH-P02 — readiness is performance-shaped:** interview preparation reports repeatedly include coding under pressure, system design, practical/backend exercises, communication/behavioral explanation and discussion of past work. The model must test whether "knowledge and knowledge-dependent capability" captures the motivating outcome well enough, or whether the initial target scope is too knowledge-centric.
- **CH-P03 — users often track activity, not evidence:** common preparation practice uses topic lists, hours, question counts and completed resources as progress proxies. Prep's evidence-backed current-state model may be more trustworthy, but it may also impose cognitive/operational cost users do not naturally accept. Research must test both usefulness and burden rather than assuming richer evidence semantics is automatically better.
- **CH-P04 — preparation may be opportunistic rather than sequential:** public accounts show people switching among DSA, system design, stack review, practical work and company-specific preparation as interviews appear. Research must test whether target -> state -> gap -> focus -> activity -> evidence -> progress is a useful reasoning model or an overly neat sequence imposed by Prep.
- **CH-P05 — real interview outcomes can change both state and target knowledge:** an interview can reveal a skill gap and simultaneously reveal previously unknown expectations about the role/company. Research must test whether feedback should revise only learner state/priorities or also the target profile itself.
- **CH-P06 — reusable corpus may be optional infrastructure from the user's perspective:** users frequently assemble existing external resources rather than curate a durable semantic corpus. Research must distinguish the user's need ("get a usable preparation scope/support") from Prep's internal preference for reusable structured data.

These challenges are supported only at the secondary/anecdotal level. They exist to make Round A/B capable of disproving the current model.

Additional triangulation sources:

- Tech Interview Handbook, software-engineering interview guide (role-dependent coding/system-design/behavioral preparation): https://www.techinterviewhandbook.org/software-engineering-interview-guide/
- Tech Interview Handbook, coding interview study plan (time-bounded prioritization and progress tracking): https://www.techinterviewhandbook.org/coding-interview-study-plan/
- Recent backend/developer discussions:
  - https://www.reddit.com/r/Backend/comments/1rvbhjz/backend_devs_with_35_yoe_how_do_you_prepare_for/
  - https://www.reddit.com/r/Backend/comments/1spki0u/java_backend_developer_3_yoe_seeking_structured/
  - https://www.reddit.com/r/cscareerquestions/comments/1m6pr7j/is_anyone_else_overwhelmed_by_how_much_you_have/
  - https://www.reddit.com/r/SoftwareEngineerJobs/comments/1wo7s6q/5_yoe_java_backend_engineer_what_should_i/


### User-model validation gate

The model is considered **HUMAN-VALIDATED** only after representative-user evidence closes these critical claims:

1. **Target claim:** a concrete role/opportunity/learning outcome is a useful primary organizing context, and users can establish or correct its expected scope without being forced into Prep's internal model.
2. **Current-state claim:** users can reason about what is supported, uncertain or challenged without collapsing missing evidence into failure or treating familiarity as demonstrated capability.
3. **Gap/focus claim:** users can identify why something deserves attention next and make a priority decision under realistic time/attention constraints.
4. **Activity/evidence/progress claim:** users can distinguish learning/practice from diagnosis, recognize credible new evidence, and explain meaningful progress or legitimate no-change.
5. **Bootstrap claim:** when no prepared corpus exists, users can choose a sensible preparation path and understand how to get from source material to a usable target without losing the motivating goal.

Exit criteria are evidence-based rather than a magic participant count:

- every critical claim is exercised by multiple independent representative participants;
- the sample includes meaningful variation in preparation experience and at least the primary motivating Python/backend context;
- no unresolved **BLOCKING** or repeated **MAJOR** finding contradicts the claimed task model;
- participants can explain the core model and next action in their own words without being taught internal Prep terminology;
- at least one full learner loop and one completely-empty-system bootstrap are observed end to end;
- material changes caused by findings are rechecked with representative users;
- scope limitations are recorded explicitly instead of generalized beyond the evidence.

Secondary research, stakeholder approval, automated tests and implementation behavior cannot satisfy these exit criteria.

These observations may later be supplemented or challenged by research/user evidence. A conflict that changes the existence, affected actor or desired outcome of the problem must reopen Discovery rather than being reconciled by a downstream design artifact.

## Discovery validation backlog

The current observation set is **not yet validated with representative users**. The next Discovery step is to challenge the observations before treating the present target-first workflow as proven user behavior.

### Research objectives

- validate whether a concrete external target is a natural organizing goal for the primary motivating users;
- understand how people currently translate role/vacancy expectations into a usable learning scope;
- understand how they decide what they know, what remains uncertain and what deserves attention next;
- understand what they accept as credible evidence of improvement or readiness;
- understand how fragmented source material and an initially empty corpus affect the workflow;
- identify where the proposed lifecycle differs materially from existing user behavior.

### Participant hypotheses

These are recruitment hypotheses, not accepted user segments:

- **PH-P01:** Python/backend developers actively preparing for a concrete role, vacancy or interview profile;
- **PH-P02:** developers who already use notes, question banks, Anki, documents, AI assistants or similar tools to assemble preparation material;
- **PH-P03:** a subset with fintech/payment-processing preparation is useful for testing the motivating domain example, but fintech is not assumed to be the permanent product boundary.

### Research questions

- **RQ-P01 / OBS-P01, OBS-P08:** How does a person establish the scope and required depth of a concrete target today? What is ambiguous, duplicated or missing?
- **RQ-P02 / OBS-P02, OBS-P04:** How does the person decide what they currently know or can do, and which signals do they distrust?
- **RQ-P03 / OBS-P05, OBS-P06:** When time is limited, how is the next topic/activity chosen and what causes that choice to change?
- **RQ-P04 / OBS-P04, OBS-P06, OBS-P07:** What counts as convincing progress evidence, and when does earlier success stop being trusted?
- **RQ-P05 / OBS-P03:** Where do fragmented terminology, duplicated material or conflicting explanations create real preparation cost?
- **RQ-P06 / OBS-P09:** When preparation data is initially absent, how is it assembled today? When would bulk preparation through an external AI/tool be preferable to manual entry?
- **RQ-P07 / OBS-P07:** Which retention/transfer failures materially affect target readiness rather than merely recall convenience?
- **RQ-P08 / CH-P01, CH-P05:** At what granularity does the person's target actually exist over time: role family, level, vacancy, company/interview loop, or a changing combination? What events cause it to be refined?
- **RQ-P09 / CH-P02:** Which kinds of performance are part of "readiness" for the motivating users (recall/explanation, coding, system design, practical backend work, communication/behavioral evidence, past-project articulation), and which are outside Prep's useful scope?
- **RQ-P10 / CH-P03, CH-P04:** What lightweight signals do users currently use to decide "I am improving / ready / still weak", and when would a more evidence-backed model be worth the additional effort?
- **RQ-P11 / CH-P06:** Does the user need to own/curate a reusable structured corpus, or only to obtain a trustworthy usable preparation scope and support regardless of where the underlying structure is maintained?

### Representative discovery scenarios

Research should be framed as user goals rather than interface instructions:

1. **Concrete-target scenario:** "You want to become suitable for a specific Python backend role. Show how you would work out what it expects, what you already satisfy, what to work on next and how you would know you improved."
2. **Empty-preparation scenario:** "You have a target description and source material, but no prepared learning system or corpus. Show how you would turn that material into something you can assess and learn against."

### Evidence update rule

Each durable observation remains UNVALIDATED with respect to representative-user evidence until research supports a stronger status. Research may mark an observation as:

- SUPPORTED — observed strongly enough to retain the current problem statement;
- SCOPE-LIMITED — valid only for a narrower actor/context than currently stated;
- CHALLENGED — contradictory evidence requires Discovery revision;
- UNTESTED — not yet investigated.

Usability preference for a particular screen, graph, workflow or wording is not evidence that a problem observation exists. Conversely, research that changes the problem actor, desired outcome or material problem dimension must reopen downstream Product/Application/Interface knowledge through Harness.

### Validation programme

User-model validation is intentionally separated from interface usability so the model is not proven by the interface that was derived from it.

**Round A — current-behavior discovery**

- Recruit an initial qualitative round of approximately 5–6 potential users matching PH-P01/PH-P02; continue beyond that round when materially new patterns are still appearing.
- Prefer participants who have actively prepared for, changed or seriously evaluated a software-engineering role/interview within roughly the last six months so answers can be grounded in recent behavior.
- Include variation in seniority, preparation maturity and whether the person already uses structured notes/cards/question banks/AI support.
- Product owners, contributors already familiar with Prep's model, and people coached on the expected lifecycle may be used for protocol pilots but do **not** count as independent representative-user validation.
- Do not show Prep navigation, task names or the target -> state -> gap -> focus sequence before the participant has demonstrated/explained their existing process.
- Primary evidence: observed/currently recalled workflow, artifacts participants actually use, vocabulary, prioritization decisions, uncertainty, workarounds and progress signals.
- Explicitly capture target changes over time, interview/company feedback, performance types being prepared for, progress proxies, and whether participants maintain structured reusable data or simply assemble resources as needed.

**Round B — user-model challenge**

Run only after Round A findings have been synthesized into retained/changed observations.

- Present the concrete-target and empty-preparation scenarios using neutral scenario material or a low-fidelity concept walkthrough; production UI is not required.
- Ask participants to work out what they would need to know/do next rather than asking whether they “like” Prep's proposed sequence.
- Challenge UMC-01..UMC-05 from `task-model.yaml`: target, current state, gap/focus, activity/evidence/progress and bootstrap.
- Ask participants to explain important distinctions in their own words, especially unknown vs failed, learning vs diagnosis, activity vs evidence, and progress vs activity completion.
- Record where participants reorder, merge, skip or add tasks. A repeated natural sequence that differs from the Task Model is evidence against the current model, not a usability problem to patch downstream.
- Exercise one full learner scenario and one completely-empty-system scenario end to end with each claim tested across multiple independent participants.

**Round boundary**

Round A can validate/challenge the problem observations. Round B can validate/challenge the user task model and journeys. Neither round validates final screens, visual hierarchy, responsive behavior, 3D interaction or accessibility; those remain later interface/presentation validation concerns.

The initial 5–6 participant target is a practical qualitative starting point, not a statistical proof threshold. Recruitment continues when new material patterns are still emerging or when a critical context is underrepresented. This follows task-based qualitative-testing guidance that emphasizes actual/likely users, clear research questions/tasks, small iterative rounds and continued research when necessary.

Useful method references:

- GOV.UK moderated usability testing: https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing
- GOV.UK qualitative usability testing: https://www.gov.uk/guidance/usability-testing-qualitative-studies
- GOV.UK qualitative interview studies: https://www.gov.uk/guidance/interview-study-qualitative-studies

### Recruitment screener

A participant is a strong fit for the primary round when most of the following are true:

1. works or recently worked as a software developer, preferably backend-oriented for the motivating sample;
2. has prepared for or seriously considered a concrete software-engineering role/interview recently;
3. can bring or describe a real target source such as a vacancy, role profile, recruiter brief or interview loop;
4. has had to choose what to study/practise under limited time;
5. has some real way of judging readiness or weak areas, even if informal;
6. is not already familiar with Prep's canonical task model.

Recruitment should not require fintech experience. Fintech/payment-processing experience is a useful variation case, not a gate for the primary population.

### Session evidence ledger

Each session gets an identifier `USR-<round>-<nn>`. Do not store unnecessary personal data.

For each UMC claim record one of:

- **SUPPORT** — observed behavior/participant explanation is compatible with the claim;
- **SCOPE-LIMIT** — claim appears valid only under narrower context;
- **CHALLENGE** — observed behavior materially contradicts the current claim;
- **NOT-EXERCISED** — session did not provide meaningful evidence.

A claim may move from `UNTESTED` in `task-model.yaml` only after evidence from multiple independent participants is synthesized. Individual session outcomes are evidence inputs, not automatic canonical decisions.

Minimum synthesis record per claim:

| Field | Required content |
| --- | --- |
| claim | UMC-01..UMC-05 |
| session refs | independent USR-* sessions contributing evidence |
| recurring support | repeated observed behavior/statements supporting the claim |
| recurring challenge | repeated contradictions, alternative sequences or missing tasks |
| scope limits | contexts where the claim does/does not appear to hold |
| decision | RETAIN / NARROW / CHANGE / INVESTIGATE-MORE |
| affected canonical artifacts | Problem Space / Task Model / User Journeys as applicable |
| retest required | yes/no plus affected scenario |

### Round A moderator guide

Use a recent concrete preparation episode wherever possible. The moderator should prefer "what did you do?" over "what would you do?" and should not introduce Prep terminology before the participant has described their own model.

**Opening / context (5–10 min)**

1. Tell me about the most recent time you seriously prepared for a software-engineering role or interview.
2. What role(s) were you considering? What information did you actually have at the beginning?
3. What deadline, available time or other constraints mattered?
4. What artifacts can you show or describe from that preparation: vacancy, notes, bookmarks, spreadsheets, cards, question lists, chat history, calendar, repositories?

**Reconstruct the target (10 min)**

5. How did you decide what the role/interview expected from you?
6. Which expectations came from the vacancy, recruiter/interview loop, prior experience, community advice or your own assumptions?
7. Was there one target, or did it change between companies/interviews? Walk through a concrete change.
8. How did you decide how deep to prepare a topic?
9. What important expectation did you discover late?

Probe CH-P01/CH-P05 without naming them: ask what changed the person's preparation scope and whether interview feedback changed their understanding of the target itself.

**Reconstruct current-state reasoning (10 min)**

10. At that time, how did you decide what you already knew well enough?
11. Give one example where you thought you knew something but later discovered you could not use/explain it well enough.
12. Give one example where you were unsure because you had not tested yourself.
13. What signals did you trust most: work experience, solving tasks, explaining aloud, mock interview, quiz result, recall after time, something else?
14. Were there signals you intentionally ignored or distrusted?

Do not offer SATISFIED / UNRESOLVED / CHALLENGED vocabulary. Capture the participant's own distinctions.

**Reconstruct prioritization and activity choice (10 min)**

15. Show me how you decided what to do next on a typical preparation day.
16. What competed for your time?
17. What made you switch topics or change the plan?
18. Give an example where you chose learning/review versus practice/mock interview versus simply checking whether you knew something.
19. Did you ever work on something mainly because a resource was available/easy to consume even though you were not sure it mattered?

Probe whether the sequence is target-driven, resource-driven, anxiety-driven, deadline-driven, feedback-driven or opportunistic.

**Reconstruct progress/readiness (10 min)**

20. How did you know you were making progress?
21. What did you track, if anything?
22. Did completed hours/questions/topics make you feel ready? When were those signals misleading?
23. What event most changed your belief about your readiness?
24. Did you ever get new information that made you *less* certain after studying more?
25. What would have convinced you to stop studying one area and move on?

Probe CH-P03 explicitly through examples, not by explaining Prep's evidence model.

**Reconstruct source/corpus behavior (5–10 min)**

26. Where did your preparation material come from?
27. Did you try to organize it into one durable structure, or mostly use resources where they already lived?
28. What did you copy/rewrite into your own notes/cards/lists, and why?
29. What organization work felt useful? What felt like overhead?
30. If you used AI, what did you ask it to prepare, and how did you verify the result?

Probe CH-P06: distinguish the user need for trustworthy scope/support from the implementation idea of a reusable corpus.

**Close**

31. Looking back, what part of the process cost the most unnecessary effort?
32. What was the biggest uncertainty you never resolved before interviewing?
33. If you could improve only one part of your preparation process, which would it be and why?
34. Is there an important step we did not discuss because I framed the conversation incorrectly?

### Round A analysis rules

For each session, first reconstruct the participant's actual sequence in their vocabulary. Only after that sequence exists should the researcher map it to OBS/RQ/CH/UMC identifiers.

Analyse at least these dimensions:

- target granularity and how/when it changes;
- preparation inputs/sources and trust;
- self-assessment signals and uncertainty;
- prioritization criteria and triggers;
- learning/practice/diagnostic distinctions in participant language;
- progress/readiness signals;
- effects of real interview/mock feedback;
- material organization/corpus behavior;
- repeated workarounds and failure points;
- tasks/decisions present in the user's process but absent from Prep;
- Prep tasks the user never appears to need.

Do not count a participant saying that a proposed idea "sounds useful" as SUPPORT. SUPPORT requires observed/reconstructed behavior, an existing need/workaround, or a concrete decision pattern compatible with the claim.

### Initial discovery session protocol

The first round is qualitative discovery/mental-model validation, not a statistical study. Recruitment should cover the participant hypotheses above and include variation in preparation experience, current seniority and accessibility needs where practicable.

For each session:

1. record participant context relevant to the scenario without collecting unnecessary personal data;
2. present the goal-oriented scenario without naming Prep screens or expected interaction steps;
3. ask the participant to show/explain their current process first;
4. introduce the prototype only after the existing-process discussion where the session includes prototype evaluation;
5. observe task strategy, uncertainty, workarounds, vocabulary, errors/backtracking and what the participant treats as convincing evidence/progress;
6. distinguish observed behavior/direct statements from researcher interpretation;
7. map each material observation to one or more RQ-Pxx / OBS-Pxx entries;
8. end with unresolved questions and explicit follow-up/retest needs.

### Observation record

Each material finding should capture:

- session/participant pseudonymous identifier;
- scenario/task;
- directly observed behavior or short attributed statement;
- task outcome: complete / partial / blocked / not-attempted;
- assistance required: none / clarification / procedural-help;
- relevant RQ-Pxx / OBS-Pxx;
- researcher interpretation, explicitly separated from the observation;
- affected product/task/interface artifact if known;
- severity;
- proposed decision: retain / change / investigate-more;
- retest status.

### Usability finding severity

Severity is about impact on the user's ability to achieve the scenario, not implementation effort:

- **BLOCKING** — prevents completion of a primary scenario or causes a materially wrong conclusion/action with no obvious recovery;
- **MAJOR** — substantial repeated confusion, wrong turn or effort that threatens successful completion;
- **MINOR** — recoverable friction or local comprehension problem that does not materially threaten completion;
- **NOTE** — observation/hypothesis worth retaining but not yet an actionable usability defect.

One isolated participant event does not automatically establish a product-wide defect. Severity and scope are revised as evidence accumulates.

### Decision and retest rule

Research output changes canonical knowledge only through the owning Harness capability. A finding that changes a problem observation reopens Discovery and downstream closure. A finding that preserves the problem but changes task flow, vocabulary, IA, interaction or presentation is routed directly to that owner.

A change is not considered human-validated merely because it was implemented. Material BLOCKING/MAJOR changes require a subsequent representative-user check of the affected scenario before the corresponding usability obligation can be treated as satisfied.

### First-round success observations

The round should determine, rather than assume, whether participants can:

- explain the concrete target and what it expects in their own words;
- distinguish "not enough evidence" from "known failure";
- identify why a gap/focus deserves attention;
- choose between learning and diagnosis without needing internal Prep terminology;
- explain what changed after new evidence, including a legitimate no-change result;
- bootstrap an empty preparation context by choosing a sensible bulk/manual/mixed path and recover from partial rejection;
- use spatial Knowledge exploration without losing the target/focus context, and switch to list/search/detail when spatial interaction is not useful.

These are research observations, not pass/fail product KPIs until representative evidence justifies thresholds.

## Desired outcome

The person can reliably progress toward a chosen learning outcome by being able to:

1. establish the desired external or self-defined target state and relevant scope/depth;
2. establish enough of the current state to identify meaningful target-relative differences and uncertainty;
3. understand which requirements are satisfied, unresolved or challenged;
4. decide what requires attention next;
5. learn or practise it in a form appropriate to the required outcome;
6. obtain evidence that their state has changed;
7. preserve relevant knowledge or ability until it is needed;
8. use new evidence to continue adapting the learning process.

The supporting learning system can be bootstrapped and maintained from explicit source material or structured prepared data rather than assuming that target, knowledge and assessment data already exist.

## Problem dimensions

```text
external/self-defined goal
  -> target capability requirements
  -> current evidence-backed state
  -> gaps / uncertainty
  -> priority
  -> learning / practice / diagnostic activity
  -> evidence
  -> updated state
  -> revised gaps / priority
```

A supporting data lifecycle exists alongside the learner loop:

```text
source material / prepared structured data
  -> target / capability / knowledge / task-material data
  -> validation and curation
  -> reusable corpus
```

These are problem dimensions, not prescribed product components. Their technical or product realization is intentionally outside this artifact.

## Constraints

- time and attention are limited;
- the desired depth depends on the learning purpose;
- source material may be incomplete, inconsistent or redundant;
- learner state cannot be observed directly and must be inferred from imperfect evidence;
- learning evidence can decay in relevance over time;
- appropriate learning and evidence differ by the kind of knowledge or ability being developed;
- the reusable corpus may start incomplete or empty and must not be treated as pre-existing user input.

## Non-decisions

This problem statement does not choose:

- a knowledge representation;
- a graph or graph visualization;
- cards, questions or another learning-object format;
- a scheduling or repetition mechanism;
- an external study system;
- a particular import file format;
- a subject domain as a permanent product boundary.

Those belong to downstream research and design.
