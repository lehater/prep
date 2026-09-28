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
