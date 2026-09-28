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


### Secondary behavior synthesis

A small desk-research coding pass over recent public developer preparation accounts produced these recurring patterns. They remain **secondary evidence** and do not change any UMC status from `UNTESTED`.

| Pattern | Secondary observation | Challenges/claims affected |
| --- | --- | --- |
| SEC-PAT-01 — mutable target | People often start with a broad backend/seniority target, then adjust preparation after learning a company's interview format, stack emphasis or depth expectations. | CH-P01, CH-P05 / UMC-01 |
| SEC-PAT-02 — multi-modal readiness | Preparation commonly spans DSA/coding, system design, stack/backend knowledge, practical exercises and behavioral/past-project explanation rather than one homogeneous body of knowledge. | CH-P02 / UMC-04 |
| SEC-PAT-03 — performance reveals false familiarity | Developers report understanding material when reading/watching it but being unable to retrieve/explain/apply it in an interview or mock. | OBS-P04, CH-P03 / UMC-02, UMC-04 |
| SEC-PAT-04 — time scarcity drives explicit triage | People routinely ask what to prioritize, how deep to go and how to divide limited preparation time; role/company differences make a universal syllabus unattractive. | OBS-P01, OBS-P05, CH-P04 / UMC-03 |
| SEC-PAT-05 — activity counts are common but weak readiness proxies | Question counts, hours, completed lists and topic coverage are commonly tracked, while confidence often changes after mocks or real interviews. | CH-P03 / UMC-02, UMC-04 |
| SEC-PAT-06 — feedback loops cross target/state boundary | Real interviews and mocks reveal both personal weaknesses and previously unknown interviewer expectations; one event can update both self-assessment and understanding of the target. | CH-P05 / UMC-01, UMC-04 |
| SEC-PAT-07 — resource assembly is usually lightweight | Public accounts more often describe combining external guides, LeetCode/problem lists, notes and company-specific information than maintaining a reusable semantic corpus. | CH-P06 / UMC-05 |

Sources sampled for this coding pass:

- https://www.reddit.com/r/Backend/comments/1rvbhjz/backend_devs_with_35_yoe_how_do_you_prepare_for/
- https://www.reddit.com/r/Backend/comments/1spki0u/java_backend_developer_3_yoe_seeking_structured/
- https://www.reddit.com/r/cscareerquestions/comments/1m6pr7j/is_anyone_else_overwhelmed_by_how_much_you_have/
- https://www.reddit.com/r/SoftwareEngineerJobs/comments/1wo7s6q/5_yoe_java_backend_engineer_what_should_i/
- https://www.reddit.com/r/ExperiencedDevs/comments/1rmn6yj/today_had_a_system_design_interview_today_and_i/
- https://www.reddit.com/r/ExperiencedDevs/comments/1roks3z/interview_prep_how_long_do_you_study/
- https://www.reddit.com/r/csMajors/comments/1v14mpo/rising_senior_grinding_leetcode_system_design_how/
- https://www.reddit.com/r/ExperiencedDevs/comments/1p2ew23/how_do_you_prepare_for_a_realworld_coding/
- https://www.techinterviewhandbook.org/software-engineering-interview-guide/
- https://www.techinterviewhandbook.org/coding-interview-study-plan/

The strongest pre-interview risk to the current model is therefore not "users do not need preparation". It is that Prep may currently model the preparation process as **more stable, sequential and corpus-centric than users actually experience it**. Round A should actively look for that mismatch.


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

### Round A recruitment and execution pack

The research programme is ready to recruit without changing the user model.

**Recruitment channel options considered**

1. **Existing professional network** — fast access to relevant developers and easier artifact-based interviews, but carries convenience/similarity bias.
2. **Developer communities** — broader variation in experience and preparation style, but response quality and participant fit are less predictable.
3. **Paid research panel** — more controlled recruitment, but adds operational cost and may still require technical screening.
4. **Project contributors / people already exposed to Prep** — useful only for protocol pilots because prior model exposure contaminates independent validation.

Initial strategy: recruit through **(1) professional network + (2) developer communities**, using the screener and variation guardrails below. If this produces a homogeneous sample, add a panel or targeted outreach rather than treating convenience recruitment as representative.

**Concrete recruitment channels (checked 2026-09-28)**

Use these as candidate pools, not as permission to post:

- **Professional-network referrals** — preferred first path because participant fit and recent preparation history can be screened directly. Ask each suitable participant for at most one or two referrals with a different employer/team/background to reduce same-network clustering.
- **r/Backend** — current 2026 threads show active backend developers discussing interview preparation and uncertainty about DSA/system design/backend-specific expectations: https://www.reddit.com/r/Backend/comments/1udz646/interview_preparation/ and https://www.reddit.com/r/Backend/comments/1rvbhjz/backend_devs_with_35_yoe_how_do_you_prepare_for/
- **r/ExperiencedDevs** — useful for the experienced/senior variation cohort; the community explicitly restricts normal participation to developers with 3+ years of experience. Treat it as a senior-specific channel, not the whole sample: https://www.reddit.com/r/ExperiencedDevs/
- **r/developersIndia** — current 2026 posts include backend developers actively asking how to prioritize DSA/backend/system-design/AI preparation, and recent research-recruitment posts are visible in the community. This suggests potential channel fit but is not blanket permission; current rules/moderator guidance must still be checked before posting: https://www.reddit.com/r/developersIndia/comments/1wqvi58/backend_ai_in_2026_what_should_i_actually_prepare/
- **Python Discord** — potentially useful for Python-specific variation. Its published rules prohibit unapproved advertising and direct users with questions to `@ModMail`, so research recruitment should be treated as approval-required before posting: https://www.pythondiscord.com/pages/rules/

**Permission-first rule**

Research recruitment must follow each community's current rules and moderator guidance. Before posting in a subreddit/Discord/community:

1. check current rules and whether research/recruitment posts are allowed;
2. where the rule is absent or ambiguous, request moderator/admin permission first;
3. do not mass-DM community members or scrape usernames for outreach;
4. do not imply community endorsement;
5. use the same screener and consent/privacy framing regardless of channel;
6. record the recruitment source for each `USR-*` session so channel-driven sample bias remains visible.

If a community does not clearly allow recruitment, skip it rather than working around moderation. Public developer discussions may still be used as secondary evidence under the existing evidence rules, but their authors are not representative participants unless they independently opt in to a research session.

**Recruitment source field**

Add to every counted session record:

```text
recruitment:
  source_type: professional-network | referral | community | panel | other
  source_name: <channel/community, no unnecessary personal identifier>
  moderator_permission_required: yes | no
  moderator_permission_obtained: yes | no | not-applicable
```

Use source diversity as a sampling diagnostic, not as a numeric representativeness score.

**Variation guardrails for the first round**

Across the initial 5–6 representative sessions, try to include variation on:

- backend experience/seniority rather than one team/peer group only;
- active versus recently completed job/interview preparation;
- highly structured preparation (notes/cards/plans) versus lightweight/ad-hoc preparation;
- use versus non-use of AI assistants during preparation;
- at least some participants who experienced a real interview/mock that changed their preparation;
- Python/backend relevance in the primary sample; fintech/payment experience is optional variation, not a quota.

Do not force demographic quotas that are unrelated to the current research questions. Record sample limits explicitly.

**Recruitment message**

> I am researching how backend developers actually prepare for a concrete software-engineering role/interview: how they decide what is expected, what they already know, what to work on next, and whether preparation is working.  
>   
> I am looking for developers who have seriously prepared for or evaluated a software-engineering role/interview recently. This is a research interview about your existing process, not a test of you and not a demo/sales session. It is especially useful if you can describe or show non-sensitive preparation artifacts such as a vacancy, topic list, notes, cards, bookmarks or study plan.  
>   
> The session focuses on a recent real preparation episode. You can skip anything confidential.

Do not mention Prep's target/state/gap/evidence model in the recruitment text.

**Pre-screen questions**

Ask before scheduling:

1. What kind of software-development work do you do or most recently did?
2. Have you seriously prepared for, interviewed for, or evaluated a software-engineering role in roughly the last six months?
3. Was there a concrete role, vacancy, company/interview loop or role family you were preparing toward?
4. Did you have to choose among topics/activities because preparation time was limited?
5. What did you use while preparing: notes, spreadsheets, question banks, LeetCode/task lists, Anki/cards, AI assistants, repositories, courses, other?
6. Did you have any mock or real interview feedback that changed what you prepared?
7. Are you already familiar with Prep's current task model or have you helped design this project?

Strong Round A fit normally means "yes" to 2–4, relevant developer context in 1, and "no" to 7. Questions 5–6 provide variation, not exclusion.

**Scheduling / pre-session request**

Before the session, ask the participant to choose one recent preparation episode and, where comfortable, have one or more real artifacts available. Examples: a public vacancy, personal topic list, non-confidential notes, study plan, question list or anonymized AI conversation excerpt.

Do not require participants to expose employer-confidential information, private recruiter communication, personal application data or proprietary code.

**Consent/privacy opening**

At the start, state:

- the purpose is to understand their preparation process, not evaluate their technical ability;
- participation is voluntary and they may skip any question or artifact;
- avoid sharing confidential employer/company information;
- recording, if used, requires explicit agreement for that session;
- durable repository evidence will use pseudonymous `USR-*` identifiers and should exclude unnecessary personal data;
- researcher interpretation will be kept separate from observed behavior/direct statements.

If recording permission is not given, continue with notes. Lack of recording does not make a session invalid if evidence can be captured accurately enough.

**Protocol pilot**

Run one pilot before counting representative sessions where practical. A contributor/person familiar with Prep may be used for the pilot because the goal is to detect confusing wording, leading questions, timing problems and missing note fields. Mark it `counts_as_representative_validation: no`.

After the pilot, only change the protocol for methodological clarity. Do not alter UMC claims based on the pilot participant's model-contaminated answers.

**Moderator preflight checklist**

Before each counted Round A session:

- participant passed the screener and independence check;
- one recent concrete preparation episode has been selected;
- moderator has not sent the participant Prep task names or lifecycle;
- note template has a new `USR-A-<nn>` ID;
- recording permission state is known before recording starts;
- moderator is prepared to ask for concrete examples/artifacts and "what happened next?";
- no prototype/screens are open or ready to bias the current-behavior section;
- strongest-disconfirming-evidence field will be completed even for supportive sessions.

**Immediately after each session**

Before discussing findings with stakeholders or comparing to expected Prep concepts:

1. reconstruct the participant's sequence in their language;
2. separate direct evidence from interpretation;
3. record missing/extra tasks;
4. complete the disconfirming-evidence field;
5. map findings to OBS/RQ/CH/UMC only after steps 1–4;
6. mark weak/ambiguous material `NOT-EXERCISED` or low-confidence rather than forcing support/challenge;
7. do not change canonical UMC status until cross-session synthesis.

**Round A continuation/stopping decision**

After approximately five independent sessions, perform an interim synthesis rather than automatically stopping.

Continue recruitment when any of the following is true:

- new sessions still introduce materially new target/task structures;
- a critical challenge CH-P01..CH-P06 has not been exercised;
- Python/backend motivating context is underrepresented;
- the sample is dominated by one preparation style/network/seniority band;
- evidence for a critical UMC claim is contradictory without a clear context boundary;
- a likely change to the Task Model has appeared but has not repeated independently.

Round A may close when all critical observations/challenges have been exercised across multiple independent participants, new sessions mostly repeat already understood patterns, and remaining variation can be recorded as explicit scope rather than unresolved model uncertainty.

Closing Round A does **not** set UMC claims to HUMAN-VALIDATED. It only permits synthesis of Problem Space findings and, if necessary, revision before Round B challenges the candidate Task Model/Journeys.

### Research execution state and protocol versioning

Current execution state:

```text
research_gate: PROVISIONAL-FOR-RESEARCH
round_a_protocol: RA-1
round_b_protocol: RB-1
round_a_status: READY-TO-RECRUIT
round_b_status: PREPARED-NOT-RUN
representative_sessions_completed: 0
representative_sessions_synthesized: 0
human_validated_claims: 0/5
```

These counters are operational status only. They do not imply evidence until actual `USR-*` sessions exist.

**Protocol version rule**

- `RA-1` is the initial counted Round A protocol defined by the current screener, moderator guide, evidence ledger and post-session analysis rules.
- `RB-1` is the initial Round B protocol defined by the UI-independent task/concept cards and staged scenario.
- Every `USR-*` record must store the protocol version actually used.
- Editorial changes that do not alter questions, stimulus, participant qualification or evidence coding may keep the same protocol version.
- A change that can materially affect what evidence is elicited or how it is classified increments the protocol version before the next counted session.
- Never retroactively relabel earlier sessions as if they were run under a newer protocol.
- During synthesis, check whether findings differ by protocol version before treating them as user-context variation.

Add to every session record:

```text
protocol:
  id: RA-1 | RB-1 | <later version>
  deviations:
    - <none, or exact deviation>
  deviation_effect_on_evidence: NONE | POSSIBLE | MATERIAL
```

A `MATERIAL` deviation does not automatically discard a session, but evidence affected by the deviation must not be treated as equivalent to clean sessions without explicit justification.

**Recruitment/execution ledger**

Use pseudonymous operational IDs; do not store participant names/contact details in the repository.

| Slot | Candidate/session state | Protocol | Recruitment source | Counted as representative evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| RA-01 | OPEN | RA-1 | TBD | TBD | first independent Round A slot |
| RA-02 | OPEN | RA-1 | TBD | TBD | seek different network/background from RA-01 |
| RA-03 | OPEN | RA-1 | TBD | TBD | seek preparation-style variation |
| RA-04 | OPEN | RA-1 | TBD | TBD | seek seniority/context variation |
| RA-05 | OPEN | RA-1 | TBD | TBD | interim-synthesis threshold candidate |
| RA-06 | OPEN | RA-1 | TBD | TBD | reserve for unresolved/underrepresented context |

Allowed operational states:

`OPEN -> CONTACTED -> SCREENED-IN | SCREENED-OUT -> SCHEDULED -> COMPLETED -> SYNTHESIZED`

Additional states:

- `PILOT` — protocol test, never counted as representative validation;
- `WITHDRAWN` — participant withdrew; preserve no unnecessary data;
- `INVALID-FOR-CLAIM` — session exists but cannot support one or more claims due to contamination/material protocol deviation.

The ledger is not a participant database. Contact details, real names and scheduling logistics stay outside the repository.

**Evidence contamination guard**

Before a counted session, mark the participant `counts_as_representative_validation: no` if any of these are true:

- they designed/reviewed the current Prep task model;
- they were coached on target -> state -> gap -> focus -> evidence/progress before the session;
- they have already seen the Round B cards/scenario before Round A;
- the moderator substantially explained Prep's intended solution before current-behavior reconstruction.

If contamination becomes apparent during a session, continue only if useful for protocol learning, but do not silently count the contaminated material as independent representative evidence.

**Change freeze during a round**

Once the first counted `RA-1` session begins:

- do not change UMC wording, Round A questions or claim-mapping criteria mid-round merely because an early participant disagrees;
- record the finding first;
- change the protocol only for a genuine methodological defect or safety/privacy issue;
- semantic changes to Problem Space/Task Model wait for cross-session synthesis unless a finding exposes an immediate invalid assumption that makes continuing the same protocol meaningless.

This prevents early participants from progressively teaching the research instrument what answer to seek.

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

### Round B stimulus selection

Available ways to challenge the user model were considered before choosing a stimulus:

1. **Current coded prototype** — realistic interaction, but strongly risks teaching the participant Prep's proposed navigation/order and would make the user model validate itself.
2. **Low-fidelity screens/wireframes** — lower implementation bias, but still encode information architecture, grouping and sequence that are downstream of the user model.
3. **UI-independent task/concept cards** — exposes candidate user concepts/actions without prescribing screen placement or navigation.
4. **Sequential scenario walkthrough** — reveals new external information and asks the participant what changes in their understanding/next action.

For the current gate, use **(3) task/concept cards + (4) sequential scenario walkthrough**. The coded prototype and screen designs are deliberately excluded until the user model is accepted or materially revised.

### Round B neutral target stimulus

The stimulus is a composite, not a real employer and not a prediction of one company's interview. It is derived from current public backend/payments roles so the task has realistic ambiguity while avoiding company-specific memorization.

**Initial role brief — Python Backend Engineer, Payments**

A product company operates financial/payment workflows for business customers. The role is backend-focused and involves:

- Python backend services and APIs;
- relational data and correctness-sensitive transaction processing;
- integrations with external financial/payment providers;
- reliability, observability and investigation of production failures;
- designing or improving services that must handle money movement safely;
- collaboration with Product, Operations/Compliance and other engineers;
- ownership of technical decisions and communication of trade-offs.

The role description mentions Python and common backend infrastructure but does **not** define an exact interview syllabus, exact depth for each topic or one authoritative preparation resource.

This composite is grounded in current public roles including:

- Stripe Backend Engineer, Payments / Payments and Risk: https://stripe.com/careers/listing/backend-engineer-payments/6692166
- InvestEngine Lead Backend Engineer, Payments Team: https://careers.investengine.com/jobs/8335980-lead-backend-engineer-payments-team
- lemon.markets Senior Backend Engineer, Banking: https://jobs.ashbyhq.com/lemon-markets/8eb5e491-1af6-459e-b3d7-1f7a36871e79
- Norman Senior Backend Engineer: https://norman.finance/de/en/careers/senior-backend-engineer

The stimulus intentionally mixes recurring requirements (backend/API work, financial correctness, integrations, reliability, cross-functional collaboration) with uncertain depth and company-specific details. The participant must decide what the target means rather than receive a pre-modeled capability profile.

### Round B task/concept cards

Cards are presented as plain text in randomized order. They are **candidate concepts/actions to sort, rename, merge, reject or add to**, not required Prep steps.

- understand what the role/interview expects;
- decide what I already know/can demonstrate;
- identify what is uncertain or weak;
- decide what deserves attention next;
- learn/review material;
- practise under realistic conditions;
- test/diagnose whether I can perform;
- collect/use feedback from a mock or real interview;
- decide whether new evidence changes my readiness;
- revise what I think the role requires;
- find/organize useful preparation material;
- keep reusable notes/questions/material for later;
- decide when to stop one topic and move on;
- decide what to do next after a no-change or disappointing result.

Participant instructions:

1. Remove cards that do not belong in your real preparation process.
2. Rename cards using your own language.
3. Merge cards that are the same thing to you.
4. Add missing cards.
5. Arrange them only if an order really exists; otherwise group by when/why they happen.
6. Mark which cards happen repeatedly and which happen only once.
7. Mark which cards you would expect a tool to do automatically versus decisions you need to make yourself.

The researcher records the participant's resulting model before mapping anything to UMC-01..UMC-05.

### Round B sequential challenge scenario

Run after the card exercise.

**Stage B1 — initial target**

Give only the neutral role brief.

Ask:

- What would you need to figure out first?
- What would you do before starting to study?
- What do you already know about the target, and what remains unknown?
- What would make you decide the target is defined well enough to prepare against?

Tests: UMC-01, CH-P01.

**Stage B2 — constrained preparation**

Add: "You have about three weeks and roughly 60–90 minutes on most weekdays. You already work as a backend developer but have not worked directly on payment processing."

Ask:

- What changes in your plan?
- How do you decide what deserves time first?
- What information about yourself would you want before prioritizing?
- Which activities would be learning, which would be practice, and which would merely check your current ability?

Tests: UMC-02, UMC-03, CH-P03, CH-P04.

**Stage B3 — late interview information**

Add: "A recruiter later says the technical process will include a backend coding/debugging discussion, a system-design discussion around reliable financial workflows, and discussion of past engineering decisions. Exact questions are not provided."

Ask:

- Did your target change, or did you merely learn more about the same target?
- What preparation work becomes more or less important?
- Would you preserve the earlier target model/history, replace it, or keep several layers?
- What would you now want to test about yourself?

Tests: UMC-01, UMC-04, CH-P01, CH-P02, CH-P05.

**Stage B4 — diagnostic evidence**

Add: "In a mock interview you explain API design well but struggle to reason clearly about idempotency/reconciliation during a failed payment workflow. You eventually solve the problem after hints."

Ask:

- What does this result actually tell you?
- What does it *not* tell you?
- Is this a gap, uncertainty, one-off performance issue or something else in your language?
- What would you do next?
- What future result would convince you the situation changed?

Tests: UMC-02, UMC-03, UMC-04.

**Stage B5 — no-change / conflicting evidence**

Add: "After several days of study you answer a familiar idempotency question correctly, but a new scenario with duplicated webhooks and partial downstream failure still requires substantial prompting."

Ask:

- Do you consider this progress? Why?
- What changed, if anything?
- Would you continue the same focus, broaden it, diagnose differently or move on?
- Which evidence would you trust more and why?

Tests: UMC-04 and the distinction between activity, immediate familiarity, transfer and target-relative progress.

**Stage B6 — empty preparation system**

Reset the tool context: "Assume a preparation tool knows nothing about this role yet. You have only the role brief, a few links/articles and your own experience."

Ask:

- What would you expect the tool to do before it can help?
- What information would you personally be willing to enter/organize?
- What organization work would you consider unacceptable overhead?
- If AI could prepare structure/material for you, what would you want to verify before trusting it?
- Do you need to own a reusable corpus, or just need the tool to produce a trustworthy preparation scope/support?

Tests: UMC-05, CH-P06.

### Round B claim decision criteria

Round B does not ask whether participants "like" the model. A claim is synthesized from behavior/explanations:

- **UMC-01 Target**
  - support: participant naturally establishes some target context and can revise/refine it when new external information appears;
  - narrow/change: participant requires multiple simultaneous target layers, or target is too fluid for one active target abstraction.
- **UMC-02 Current state**
  - support: participant distinguishes demonstrated ability, uncertainty and weak/challenged performance using their own language;
  - narrow/change: explicit evidence tracking is rejected as overhead or participant decisions rely on materially different signals not represented in the model.
- **UMC-03 Gap/focus**
  - support: participant can explain why one topic/activity deserves attention next under constraints;
  - narrow/change: prioritization is primarily driven by external scheduling/resource availability in a way the current gap-relative model cannot represent.
- **UMC-04 Activity/evidence/progress**
  - support: participant distinguishes studying/practice from credible evidence and changes next action based on performance;
  - narrow/change: readiness depends on capability/performance types outside accepted product scope or the proposed evidence distinctions are not usable.
- **UMC-05 Bootstrap**
  - support: participant needs a preparation-scope/support bootstrap and can understand a low-overhead path from raw sources to usable preparation;
  - narrow/change: maintaining Prep-style reusable corpus is not a user task and should move to internal/curator responsibility.

A repeated finding that invalidates a claim changes the Task Model before any screen/interface work resumes.

### Session record template

Store research findings in the canonical Discovery artifact during synthesis; raw recordings/transcripts may remain outside the repository when privacy or consent requires it. The durable record should contain only enough evidence to support/reopen canonical decisions.

For each session:

```text
session_id: USR-A-01 | USR-B-01
round: A | B
participant_fit:
  primary_context: <backend/python/etc>
  recent_preparation: <yes/no + brief context>
  prep_experience: <low/medium/high>
  prep_tools: <participant-described>
independence:
  familiar_with_prep_model_before_session: yes | no
  counts_as_representative_validation: yes | no

target_context:
  starting_target: <participant language>
  target_granularity: role-family | level | vacancy | company | interview-loop | mixed | other
  target_changed_during_recalled/scenario_process: yes | no
  change_trigger: <if any>

actual_or_constructed_sequence:
  - <participant step/action in participant vocabulary>
  - ...

observations:
  - id: F-<nn>
    direct_evidence: <observed behavior or short attributed statement>
    interpretation: <researcher interpretation, separate from evidence>
    refs: [OBS-Pxx, CH-Pxx, UMC-xx]
    outcome: SUPPORT | SCOPE-LIMIT | CHALLENGE | NOT-EXERCISED
    severity: BLOCKING | MAJOR | MINOR | NOTE
    confidence: HIGH | MEDIUM | LOW
    rationale: <why this mapping is justified>

missing_or_extra_tasks:
  missing_from_prep: [<participant tasks not represented>]
  prep_tasks_not_needed_by_participant: [<candidate tasks>]

vocabulary:
  participant_terms:
    - <their term> -> <what it meant>
  prep_terms_that_required_explanation: [<if Round B>]

claim_summary:
  UMC-01: SUPPORT | SCOPE-LIMIT | CHALLENGE | NOT-EXERCISED
  UMC-02: SUPPORT | SCOPE-LIMIT | CHALLENGE | NOT-EXERCISED
  UMC-03: SUPPORT | SCOPE-LIMIT | CHALLENGE | NOT-EXERCISED
  UMC-04: SUPPORT | SCOPE-LIMIT | CHALLENGE | NOT-EXERCISED
  UMC-05: SUPPORT | SCOPE-LIMIT | CHALLENGE | NOT-EXERCISED

researcher_notes:
  strongest_disconfirming_evidence: <required even when session broadly supports model>
  unresolved_questions: [...]
  follow_up_needed: yes | no
```

Rules:

- `direct_evidence` must not contain researcher conclusions disguised as observation.
- A participant preference ("I would like that") is not evidence of an existing need or task.
- `HIGH` confidence means the finding is grounded in demonstrated/reconstructed concrete behavior; it does not mean the finding generalizes to the population.
- A contributor/product owner already familiar with Prep can be recorded for protocol testing but `counts_as_representative_validation: no`.
- Preserve disconfirming evidence even when the overall session supports the model.

### Cross-session synthesis worksheet

Synthesize only after several independent sessions; do not update UMC status from a single participant.

For each claim:

```text
claim: UMC-0x
representative_sessions: [USR-...]
supporting_findings: [USR-.../F-...]
challenging_findings: [USR-.../F-...]
scope_limit_findings: [USR-.../F-...]
not_exercised_sessions: [USR-...]

recurring_user_language:
  - ...

observed_user_sequence:
  common:
    - ...
  legitimate_variants:
    - ...
  conflicts_with_current_task_model:
    - ...

decision: RETAIN | NARROW | CHANGE | INVESTIGATE-MORE
decision_basis: <evidence synthesis>
affected_artifacts:
  - PROBLEM-SPACE
  - PRODUCT-VISION
  - PRODUCT-CAPABILITIES
  - TASK-MODEL
  - USER-JOURNEYS
retest_required: yes | no
retest_scope: <claim/scenario>
```

Decision discipline:

- **RETAIN** only when multiple independent sessions support the claim and material challenges are explained by accepted scope/variation.
- **NARROW** when the claim is useful only for a smaller actor/context than currently stated.
- **CHANGE** when repeated evidence shows a materially different task, sequence, concept or responsibility.
- **INVESTIGATE-MORE** when evidence conflicts, critical contexts are missing or findings are too weak to decide.
- Never average contradictory qualitative findings into a score. Preserve the contexts that explain the disagreement.

### Downstream reopening rule

After synthesis:

1. if evidence changes the **existence, actor or desired outcome of the problem**, revise PROBLEM-SPACE first and revalidate downstream;
2. if the problem remains but product scope/outcome changes, revise PRODUCT-VISION / PRODUCT-CAPABILITIES;
3. if user responsibility, ordering, decision points or recovery change, revise TASK-MODEL and USER-JOURNEYS;
4. only after the five UMC claims satisfy the human-validation gate may Conceptual Interface / IA / Interaction work resume as accepted design rather than research hypothesis;
5. existing interface/frontend artifacts remain downstream and potentially stale until that revalidation occurs.

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
