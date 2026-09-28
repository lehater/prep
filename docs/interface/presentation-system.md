# Presentation System Design

## Purpose

Define shared presentation and interaction conventions for the accepted user-centered product flow without choosing frontend framework mechanics or encoding domain semantics in styling.

## Interaction principles

- **Target context first.** The active target remains visible while the user moves through state, gaps, learning, diagnostics, knowledge and progress.
- **Assessment before learning.** The interface must make current evidence-backed state and uncertainty inspectable before asking the learner to act on gaps.
- **Gaps drive focus.** Learning/practice/diagnostic activity is visibly tied to target-relative gaps or unresolved uncertainty.
- **Evidence is distinguishable from conclusions.** Raw observations, inferred claims and derived gaps are visually and semantically separate.
- **Curation is explicit.** Reusable target/capability/knowledge/support/assessment authoring is a separate task context.
- **Bulk preparation and incremental curation are complementary.** Import is the efficient mass-ingestion path; editors are for correction and small changes.
- **No fake completeness.** Missing evidence/support remains explicit. No universal readiness/mastery/coverage percentage is invented.
- **3D Knowledge is the preferred spatial exploration experience, not the only access path.** List/search/detail remain task-complete.
- **Recoverability is visible.** Validation/conflict/runtime failures retain context and a correction/retry path.

## Shared visual language

Use a compact, information-dense workspace style:

- neutral UI sans-serif;
- 13–14 px ordinary UI/body text;
- restrained section headings;
- 4/6/8/12/16/24 px spacing rhythm;
- ordinary controls around 28–32 px high;
- white/light-neutral application surfaces;
- low-contrast boundaries;
- strong visible focus treatment;
- semantic state never encoded by color alone.

Exact provider, CSS mechanics and color values remain implementation details.

## Application shell

Wide layouts use a persistent left navigation rail. Narrow layouts may collapse it into an accessible drawer/header.

Primary entries:

- **Target Work**
- **Curation**

When a target is active, target-local destinations are:

- Overview
- State
- Gaps
- Learning
- Diagnostics
- Knowledge
- Progress

Curation destinations are:

- Targets
- Capabilities
- Knowledge
- Learning Support
- Assessment
- Import
- Quality

Runtime status remains globally reachable.

The rail is navigation, not a competing content column.

## Target workspace presentation

The active target header persists across target-work views and shows:

- target identity/context;
- concise target definition;
- current active focus where one exists;
- change-target action.

Target-scope editing is not mixed into target-work views; explicit transition to Curation is used when repair/authoring is required.

## State presentation

The interface distinguishes:

- **Satisfied**
- **Unresolved**
- **Challenged**

Each state must be inspectable with its basis. Missing evidence is represented as uncertainty, not failure.

Where useful, the same target requirement structure may carry state overlays, but overlays must preserve the underlying requirement semantics and remain readable without graph manipulation.

## Gap and focus presentation

Gap views emphasize:

1. target requirement fragment;
2. current state/basis;
3. why it is unresolved/challenged;
4. current priority/focus rationale;
5. available next actions.

A gap is never presented as an intrinsic property of Knowledge or Capability.

Primary next actions are:

- learn/practise;
- gather diagnostic evidence;
- inspect supporting Knowledge;
- repair missing support in Curation when necessary.

## Learning presentation

Learning is organized around the current focus, not around the existence of a Study Set.

Regions may include:

- current focus and rationale;
- available LearningMaterial;
- practice/task opportunities;
- preparation diagnostics;
- supported external-runtime delegation.

Question/Anki material may appear as a compatibility profile inside this surface.

Activity completion does not visually imply gap closure.

## Diagnostics presentation

Diagnostics is evidence-oriented.

Show:

- target/gap being diagnosed;
- available diagnostic opportunities;
- task/performance context;
- recorded observations/provenance;
- accepted supporting/challenging claims where available.

Raw observations and derived learner claims must not be visually collapsed into one score.

## Progress presentation

Progress compares accepted target-relative states over time.

Emphasize:

- what changed;
- what stayed unresolved;
- newly challenged fragments;
- new supporting evidence;
- effect on current gaps/focus.

No-change and increased uncertainty are valid outcomes.

## Curation presentation

Curation is collection-first:

- search/browse;
- bounded results;
- focused editor/detail;
- explicit validation/conflict state.

Bulk import is a dedicated workspace because it supports a distinct user task:

`contract/examples → validate → inspect outcomes → apply`.

The import contract/examples must be usable by an external agent/tool preparing a compatible file.

## Knowledge exploration presentation

Knowledge supports coordinated list/search/detail and spatial graph projections over the same canonical identities.

### 3D representation decision

3D remains the accepted production-default spatial Knowledge projection on capable environments because:

- it is the product-owner-preferred exploration experience;
- a preserved experiment has already demonstrated viable interaction/performance characteristics;
- the underlying tasks remain independently available through list/search/detail.

This is a presentation choice, not evidence that 3D improves learning outcomes.

2D/non-spatial access may be used when 3D is unavailable, inappropriate or intentionally bypassed.

### Graph behavior

Required behavior:

- search to selection/focus;
- selection distinct from focus;
- explicit Focus / Clear focus;
- relation predicate/type and direction inspectable without geometry alone;
- Fit graph / Reset view;
- selective labels to control clutter;
- selected-item detail outside the canvas;
- camera/layout state never changes semantic membership or importance;
- off-camera/occluded items remain discoverable through search/list;
- target or current-focus scope can constrain the projection without redefining Knowledge truth.

Future overlays may visualize target requirements, gaps or learner state only after their semantic mapping is accepted. Visualization code must not invent mastery/proficiency.

## Responsive spatial system

Semantic layout classes:

- **wide** — dominant primary workspace plus persistent supporting regions;
- **compact** — primary workspace remains dominant; supporting detail moves below/drawer;
- **narrow** — one primary column; secondary regions become explicit disclosures/drawers.

Responsive changes must preserve:

- required actions;
- semantic state;
- keyboard/focus order;
- active target/focus;
- list/search/detail access when graph manipulation becomes impractical.

## Knowledge workspace geometry

Wide:

- left application rail around 200–220 px;
- compact header/control band;
- optional bounded results pane around 200–240 px;
- dominant graph remainder;
- supporting detail around 280–320 px.

Compact:

- graph remains dominant;
- results may remain narrow/collapsible;
- detail moves below or to a drawer.

Narrow:

- graph or non-spatial primary content uses full width;
- results/detail become ordered disclosures;
- no horizontal page scrolling is required for core tasks.

## Accessibility baseline

- core navigation/actions keyboard accessible;
- visible focus;
- labels do not depend on placeholders;
- state does not depend on color alone;
- every core graph-dependent task has a non-graph completion path;
- semantic reading/focus order survives responsive reflow;
- zoom/reflow and large-text use must preserve core task actions without requiring page-level horizontal scrolling;
- validation/error feedback must be programmatically associated or announced rather than conveyed only by visual placement;
- pointer hover and dragging are never the sole path to task-critical information or actions.

### Reduced motion

When the environment requests reduced motion:

- automatic/repeating graph motion is disabled by default;
- directional particles are disabled;
- continuous live force physics is disabled rather than merely slowed;
- camera fit/reset/focus commands use immediate or materially reduced transitions;
- the user can still inspect/select/focus Knowledge through list/search/detail and non-animated graph state;
- motion preference changes presentation only and never semantic membership, relation meaning, target/focus scope or current selection.

A user may deliberately choose a richer graph profile only when the interface makes that override explicit; reduced-motion users are never required to re-enable motion to complete a task.

## Remaining implementation freedoms

Downstream choices include:

- exact framework/component library;
- exact routes;
- CSS/Grid/Flex mechanics;
- drawer/modal primitives;
- graph renderer internals;
- animation details;
- pagination/virtualization strategy;
- exact theme tokens within the accepted hierarchy and contrast semantics.
