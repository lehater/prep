# Low-fidelity interface validation

Status: interaction-design evidence derived from accepted Learning/Curation semantics. No visual style or frontend framework is selected.

## Goal

Reduce the semantic view inventory to the smallest practical screen flow for the Python Backend Interview scenario before visual design or frontend implementation.

## Result

The learner does not need six peer sections.

The current minimal Learning flow is:

```text
Learning
  -> choose prepared Target
      -> Overview
      -> Knowledge
      -> Study
      -> Statistics
```

Curation remains:

```text
Curation
  -> Targets
  -> Knowledge
  -> Requirements
  -> Questions
```

Import is contextual to curation collections.

## Why Scope is not a learner destination

Target scope is curated and read-only in Learning mode.

The learner's task is to understand what the selected target represents, not to maintain Requirement composition. Therefore scope belongs inside Overview as inspectable context.

A separate Scope destination would add navigation without an independent learner command.

## Why Questions are not a learner destination

For the current v1 slice:

```text
target
  -> currently aligned Knowledge
  -> currently aligned Questions
  -> Study Set
```

The Study Set includes all currently resolvable target Questions; there is no learner-side prioritization, subset curation or alternative question collection semantics.

Therefore a separate learner Questions destination would present essentially the same collection as Study.

Question browsing/inspection belongs inside Study. Question authoring/alignment remains a Curation task.

## Learning entry

Purpose: choose what to learn.

Low-fidelity regions:

```text
[ Learning ] [ Curation ]                         [Anki status]

Learn
---------------------------------------------------------------
Search targets...

Python Backend Interview
  concise purpose/scope summary

System Design Interview
  concise purpose/scope summary
```

No create/edit target action appears in Learning mode.

## Target Overview

Purpose: establish context quickly.

```text
Learning / Python Backend Interview

[ Overview ] [ Knowledge ] [ Study ] [ Statistics ]

Python Backend Interview
Target description

Scope
  Python ...
  PostgreSQL ...
  Linux ...
  [show all]

Available material
  Knowledge: N
  Questions: M
  Study Set: available / empty

Recent review facts
  factual counts only
```

Scope is read-only. If the same operator intends to edit it, they explicitly switch to Curation.

## Target Knowledge

Purpose: understand the subject structure relevant to the current target.

```text
Learning / Python Backend Interview / Knowledge

[ Search ................................ ]

[ List ] [ Graph ]

Knowledge results / graph canvas
                         |
                         +--> selected Knowledge detail
                              semantic kind
                              content
                              relations
```

List and Graph are two projections of the same canonical target-relevant Knowledge set.

Selecting a node or list item opens the same readable Knowledge detail.

Graph manipulation is not required for access. 2D/3D remains unselected.

## Target Study

Purpose: inspect currently available retrieval material and send exactly that preview to Anki.

```text
Learning / Python Backend Interview / Study

Questions available: N                         [Build/Rebuild]

Study Set preview
---------------------------------------------------------------
Question 1
Question 2
Question 3
...

[Export to Anki]

Anki: reachable
last export outcome / per-question failures
```

Question browsing and direct-answer inspection live here.

If the current materialization becomes stale after Curation changes, export does not silently export a different set; the learner is asked to rebuild/reinspect.

Valid empty state:

```text
No study questions are currently available for this target.
```

This is not rendered as learner failure or "0% complete".

## Target Statistics

Purpose: inspect recorded review facts.

```text
Learning / Python Backend Interview / Statistics

[Sync reviews from Anki]

Reviews
  total ...
  Again ...
  Hard ...
  Good ...
  Easy ...

Recent review history
  Question / occurred_at / rating / interval / duration / phase
```

No mastery/readiness/retention percentage is shown.

Future inferred learner-state graph overlay remains separate research.

## Curation shell

Purpose: author the prepared learning system rather than consume it.

```text
[ Learning ] [ Curation ]

Curation
[ Targets ] [ Knowledge ] [ Requirements ] [ Questions ]
```

Each area keeps independent collection -> canonical detail/editor behavior because each supports distinct maintenance commands.

### Targets

Create/edit prepared LearningTargets and compose scope from reusable Requirements/RequirementSets.

### Knowledge

Search/browse/edit KnowledgeNodes and relations. Offer list/graph projections where useful.

### Requirements

Maintain Requirements, RequirementSets, acyclic composition and Knowledge alignment.

### Questions

Maintain question/answer content and Knowledge alignment. Structural diagnostics may show unaligned items. Semantic learning/evidence coverage is deliberately not reduced to a percentage.

## Findings

1. Learning and Curation should be visibly separate modes.
2. Learning target selection is read-only with respect to target definition/scope.
3. Learning local navigation needs four sections, not six.
4. Scope belongs in Overview.
5. Questions belong in Study for the current all-resolvable-questions Study Set semantics.
6. Knowledge retains list + optional graph because they serve different exploration patterns over the same canonical set.
7. Curation remains entity-oriented because authoring/maintenance actually is entity-oriented.
8. External runtime configuration remains deployment configuration; UI exposes status, not invented secret editing.
9. Visual hierarchy, exact layout, drawer/page detail and graph dimensionality remain intentionally unresolved.
