# Problem Space

## Purpose

Define the learner problem Prep exists to address before selecting product, domain, interface, or implementation solutions.

## Problem

A person needs to move from their current state of knowledge or ability to a desired state, but does not have a sufficiently reliable way to manage that transition.

The transition is difficult because:

- the desired state can require an uncertain scope of knowledge and different depths of mastery;
- the person's current state is only partially observable;
- relevant information can be fragmented, incomplete, inconsistent, redundant or expressed in different terms;
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
- **OBS-P07 — retention/transfer risk:** immediate success does not guarantee later availability or transfer to another context.

Provenance class: explicit product-owner/stakeholder observations accepted during Prep's Harness revalidation. No downstream UI, graph, Anki, persistence or implementation behavior is used as evidence that these problems exist.

These observations may later be supplemented or challenged by research/user evidence. A conflict that changes the existence, affected actor or desired outcome of the problem must reopen Discovery rather than being reconciled by a downstream design artifact.

## Desired outcome

The person can reliably progress toward a chosen learning outcome by being able to:

1. establish the desired state and relevant scope/depth;
2. establish enough of the current state to identify meaningful differences;
3. decide what requires attention next;
4. learn or practise it in a form appropriate to the required outcome;
5. obtain evidence that their state has changed;
6. preserve relevant knowledge or ability until it is needed;
7. use new evidence to continue adapting the learning process.

## Problem dimensions

```text
desired state
  -> required knowledge / ability
  -> current state
  -> difference
  -> priority
  -> learning / practice
  -> evidence
  -> retention / transfer
  -> updated state
```

These are problem dimensions, not prescribed product components. Their technical or product realization is intentionally outside this artifact.

## Constraints

- time and attention are limited;
- the desired depth depends on the learning purpose;
- source material may be incomplete, inconsistent or redundant;
- learner state cannot be observed directly and must be inferred from imperfect evidence;
- learning evidence can decay in relevance over time;
- appropriate learning and evidence differ by the kind of knowledge or ability being developed.

## Non-decisions

This problem statement does not choose:

- a knowledge representation;
- a graph or graph visualization;
- cards, questions or another learning-object format;
- a scheduling or repetition mechanism;
- an external study system;
- a subject domain or motivating use case.

Those belong to downstream research and design.
