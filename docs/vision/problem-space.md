# Problem Space

## Purpose

Define the problems Prep exists to solve before choosing detailed implementation.

## Problem

Learning state is fragmented across source material, chats, notes, generated files, Anki decks and domain-specific pipelines. This creates several coupled problems:

- the same knowledge is imported repeatedly under different wording and becomes semantically duplicated;
- cards become accidental units of knowledge even when several cards test the same concept;
- there is no stable semantic denominator for questions such as "what exists", "what is covered", "what remains" and "where are the gaps";
- Anki contains valuable review history, but that state is hard to aggregate into a domain-level picture across topics and devices;
- different learning domains need different source and exercise models, while still sharing planning, publication and progress concerns;
- users cannot easily see the structure of their target knowledge space or how progress is distributed across it;
- manual graph editing would make identity and relation quality depend on ad-hoc user input rather than controlled semantic rules.

## Desired outcome

Prep should maintain a trustworthy semantic knowledge space, let a learner select meaningful subgraphs as learning targets, derive learning plans and domain-specific practice from those targets, publish practice to execution systems such as Anki, and project returned evidence back onto the knowledge space.

## Core distinction

Prep must keep these concerns separate:

```text
knowledge truth   -> what concepts and relations exist
learning intent   -> what the learner plans to learn
learning evidence -> what study/review activity has happened
presentation      -> how the graph and overlays are shown
```

## Constraints

- Knowledge identity and graph relations require controlled admission; the ordinary user does not directly mutate semantic truth.
- Anki remains an external spaced-repetition runtime, not the owner of Prep domain semantics.
- Subject-specific learning objects remain inside their bounded contexts until genuinely shared semantics are demonstrated.
- The current design phase is breadth-first: establish the whole top-level responsibility map before deep implementation slices.
