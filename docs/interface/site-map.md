# Prep Site Map and Low-Fidelity Frame Inventory

Status: human review projection of the canonical Interface Topology and accepted Screen/View Design for the current frontend-first slice.

Canonical view/context identity, responsibility and navigation relationships are owned by `docs/interface/interface-topology.yaml`. This document visualizes that knowledge together with coarse Screen/View frames; it is not a second source of semantic truth.

It intentionally does not define visual style, exact routes, component library, responsive breakpoints or production frontend structure.

## 1. Whole-product map

```text
Prep
│
├── Learning
│   │
│   ├── L-01 Target Selection
│   │
│   └── Target Workspace
│       ├── L-02 Overview
│       ├── L-03 Knowledge
│       │   ├── list/search projection
│       │   ├── 3D graph projection
│       │   └── in-context Knowledge detail
│       ├── L-04 Study
│       │   ├── Question inspection
│       │   ├── Study Set preview
│       │   └── Export to Anki
│       └── L-05 Statistics
│           └── Question review history
│
├── Curation
│   │
│   ├── Targets
│   │   ├── C-11 Target Collection
│   │   └── C-12 Target Detail / Editor
│   │
│   ├── Knowledge
│   │   ├── C-21 Knowledge Workspace
│   │   │   ├── list/search projection
│   │   │   └── global 3D graph projection
│   │   └── C-22 Knowledge Detail / Editor
│   │
│   ├── Requirements
│   │   ├── C-31 Requirements Collection
│   │   ├── C-32 Requirement Detail / Editor
│   │   └── C-33 RequirementSet Detail / Editor
│   │
│   └── Questions
│       ├── C-41 Questions Collection
│       └── C-42 Question Detail / Editor
│
└── Secondary surfaces
    ├── S-01 External Runtime Status
    └── S-02 Contextual Import Flow
```

There is no separate learner Scope page and no separate learner Questions page in the current slice:

- curated target scope belongs to L-02 Overview;
- learner Question browsing belongs to L-04 Study.

There is no general Settings area in the current accepted scope. Anki endpoint/API-key remain deployment configuration.

## 2. Shared application shell — F-00

Responsibility: preserve mode/context and global status without becoming a product workspace itself.

```text
┌──────────────────┬────────────────────────────────────────────┐
│ Prep             │                                            │
│                  │                                            │
│ Learning         │              active frame                  │
│ Curation         │                                            │
│   Targets        │                                            │
│   Knowledge      │                                            │
│   Requirements   │                                            │
│   Questions      │                                            │
│                  │                                            │
│ Anki status      │                                            │
└──────────────────┴────────────────────────────────────────────┘
```

Desktop projection uses the accepted approximately 200-220 px persistent left navigation rail; narrow layouts may reflow it into a compact disclosure/header navigation. The rail carries Prep identity, mode navigation, active mode-local sections and bottom-anchored runtime status.

Global responsibilities:

- switch explicitly between Learning and Curation;
- expose external-runtime status;
- preserve active LearningTarget while inside its workspace;
- do not expose Curation mutations inside Learning merely because the same physical user can switch modes.

# Learning

## 3. L-01 — Target Selection

Responsibility: choose an existing curated learning profile.

```text
┌───────────────────────────────────────────────────────────────┐
│ Learning                                                      │
│                                                               │
│ Search targets [..........................................]    │
│                                                               │
│ ┌───────────────────────────┐  ┌───────────────────────────┐  │
│ │ Python Backend Interview  │  │ System Design Interview   │  │
│ │ short purpose             │  │ short purpose             │  │
│ │ scope summary             │  │ scope summary             │  │
│ └───────────────────────────┘  └───────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

Owns target discovery/search, enough summary to choose the intended target, and entry to the target workspace. It does not own target creation, target-scope editing, or Knowledge/Question curation.

Primary transition:

```text
L-01 Target Selection
  -> choose target
  -> L-02 Overview
```

## 4. Shared LearningTarget workspace frame — F-LT

Responsibility: preserve the selected target while moving between learner tasks.

```text
┌───────────────────────────────────────────────────────────────┐
│ Learning / Python Backend Interview                           │
│                                                               │
│ [ Overview ] [ Knowledge ] [ Study ] [ Statistics ]           │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                   selected section                            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

This is one persistent learner context, not four unrelated products.

## 5. L-02 — Target Overview

Responsibility: answer "what am I preparing for and what material is currently available?"

```text
┌───────────────────────────────────────────────────────────────┐
│ Python Backend Interview                                     │
│ target purpose / description                                 │
│                                                               │
│ Scope                                                         │
│  Requirement / RequirementSet summary                         │
│  [show more]                                                  │
│                                                               │
│ Available material                                            │
│  Knowledge: N      Questions: M      Study Set: available     │
│                                                               │
│ Recent review facts                                           │
│  factual summary only                                         │
└───────────────────────────────────────────────────────────────┘
```

Owns target identity/purpose, read-only curated scope, material availability summary, and factual high-level review summary. It does not own Requirement editing, coverage scoring, or mastery/readiness inference.

## 6. L-03 — Target Knowledge

Responsibility: help the learner understand the knowledge structure relevant to the active target.

### Wide frame

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│ Search […] [Kind] [Relations] [Focus] [Clear] [Fit] [Reset] [Settings] [Profile] │
├──────────────┬───────────────────────────────────────────────────┬─────────────────┤
│ optional     │                                                   │ selected detail │
│ list/hits    │                  3D GRAPH                         │ content         │
│              │               PRIMARY AREA                        │ relations       │
│              │                                                   │ context         │
└──────────────┴───────────────────────────────────────────────────┴─────────────────┘
```

### Compact / narrow transformation

Compact keeps list + graph if useful and moves detail below/drawer. Narrow makes the graph full-width and exposes list/detail through supporting disclosures. The graph never collapses into a small equal-weight card while active.

Owns target-scoped Knowledge search/list, experimental 3D graph, semantic-kind filters, relation-type multi-select, focus/local-neighborhood exploration, fit/reset camera controls, presentation-only performance profile/settings, readable Knowledge detail, and preservation of graph state during inspection.

It does not own Knowledge editing, relation editing, graph geometry as semantic truth, or learner-state coloring before the upstream learner-state model exists.

Entry variants:

```text
L-02 Overview -> L-03 Knowledge
L-04 Study -> Show in Knowledge Map -> L-03 focused on Question Knowledge
```

## 7. L-04 — Study

Responsibility: own learner-facing Questions, Study Set preview and external-study handoff.

```text
┌────────────────────────────────────────────────────────────────────┐
│ Study                                                              │
│ Questions available: N                         [Build / Rebuild]    │
├──────────────────────────────┬─────────────────────────────────────┤
│ Question list / Study Set    │ selected Question                   │
│                              │                                     │
│ Question A                   │ question                            │
│ Question B                   │ answer                              │
│ Question C                   │                                     │
│                              │ [Show in Knowledge Map]             │
├──────────────────────────────┴─────────────────────────────────────┤
│ Study Set preview state                         Anki: reachable    │
│                                                   [Export to Anki] │
│ export/reconciliation results                                      │
└────────────────────────────────────────────────────────────────────┘
```

Owns target-relevant Question browsing, direct-answer inspection, exact Study Set preview, stale-preview/rebuild state, export to Anki, per-Question export/reconciliation outcomes, and Question -> Knowledge Map transition.

It does not own Question editing/alignment, semantic coverage quality, or Anki study-session UI.

## 8. L-05 — Statistics

Responsibility: show recorded learning facts, not inferred mastery.

```text
┌───────────────────────────────────────────────────────────────┐
│ Statistics                              [Sync reviews from Anki]│
│                                                               │
│ Summary                                                        │
│ Total | Again | Hard | Good | Easy                            │
│                                                               │
│ Review history                                                 │
│ Question | time | rating | interval | duration | phase        │
└───────────────────────────────────────────────────────────────┘
```

Owns explicit review sync trigger, factual aggregates, Question-attributable review history, and navigation to Question/history context.

It does not own mastery, retention, readiness, or learner-state graph overlay.

# Curation

## 9. Shared Curation workspace frame — F-C

Responsibility: author the prepared learning system.

```text
┌───────────────────────────────────────────────────────────────┐
│ Curation                                                      │
│ [ Targets ] [ Knowledge ] [ Requirements ] [ Questions ]      │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                     active curation area                       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

Curation is entity-oriented because these entities have genuinely different maintenance responsibilities.

## 10. C-11 — Target Collection

Responsibility: find/create prepared LearningTargets.

```text
┌───────────────────────────────────────────────────────────────┐
│ Targets                                      [+ New Target]   │
│ Search [.................................................]     │
│                                                               │
│ target list                                                    │
│  Python Backend Interview                                     │
│  System Design Interview                                      │
└───────────────────────────────────────────────────────────────┘
```

## 11. C-12 — Target Detail / Editor

Responsibility: define the reusable target profile consumed by Learning.

```text
┌───────────────────────────────────────────────────────────────┐
│ Target: Python Backend Interview                [Save]        │
│                                                               │
│ Definition / purpose                                           │
│                                                               │
│ Scope                                                          │
│  selected Requirements / RequirementSets                       │
│  [+ Add existing]                                              │
│                                                               │
│ [Preview in Learning]                                          │
└───────────────────────────────────────────────────────────────┘
```

Owns target definition and Requirement/RequirementSet composition. It does not own Requirement semantics/editing itself.

## 12. C-21 — Knowledge Workspace

Responsibility: maintain and inspect the global reusable Knowledge corpus.

Wide composition keeps the graph dominant:

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│ Knowledge  [+ New] [Import] Search […] [Kind] [Relations] [Fit] [Reset] [Settings]│
├──────────────┬───────────────────────────────────────────────────┬─────────────────┤
│ list / hits  │                  GLOBAL 3D GRAPH                  │ detail/editor   │
│ optional     │                   PRIMARY AREA                    │ selected item   │
└──────────────┴───────────────────────────────────────────────────┴─────────────────┘
```

New/Import open focused authoring/import surfaces; they do not permanently consume a large row above the graph.

Compact/narrow transformations follow the shared Knowledge spatial contract: graph remains primary, detail moves below/drawer, and list/detail become collapsible/disclosed as width decreases.

Owns collection/search, global graph exploration, access to create/edit, relation/semantic filters, graph fit/reset/performance controls and structural navigation.

## 13. C-22 — Knowledge Detail / Editor

Responsibility: author one KnowledgeNode and its accepted semantic relations.

```text
┌───────────────────────────────────────────────────────────────┐
│ KnowledgeNode                                      [Save]     │
│                                                               │
│ semantic kind                                                 │
│ content                                                       │
│                                                               │
│ Incoming relations                                            │
│ Outgoing relations                                            │
│ [+ relation]                                                  │
└───────────────────────────────────────────────────────────────┘
```

## 14. C-31 — Requirements Collection

Responsibility: find/create Requirements and RequirementSets.

```text
┌───────────────────────────────────────────────────────────────┐
│ Requirements                     [+ Requirement] [+ Set]      │
│ Search [.................................................]     │
│                                                               │
│ Requirements / RequirementSets                                │
└───────────────────────────────────────────────────────────────┘
```

## 15. C-32 — Requirement Detail / Editor

Responsibility: define one reusable Requirement and its Knowledge alignment.

```text
┌───────────────────────────────────────────────────────────────┐
│ Requirement                                        [Save]     │
│                                                               │
│ definition/content                                             │
│                                                               │
│ Knowledge alignment                                            │
│  aligned KnowledgeNodes                                        │
│  [+ Align existing Knowledge]                                  │
└───────────────────────────────────────────────────────────────┘
```

## 16. C-33 — RequirementSet Detail / Editor

Responsibility: compose reusable Requirements/RequirementSets while preserving acyclicity.

```text
┌───────────────────────────────────────────────────────────────┐
│ RequirementSet                                     [Save]     │
│                                                               │
│ definition/content                                             │
│                                                               │
│ Members                                                        │
│  Requirement A                                                 │
│  RequirementSet B                                              │
│  [+ Add member]                                                │
└───────────────────────────────────────────────────────────────┘
```

Cycle rejection stays in this context and preserves editing state.

## 17. C-41 — Questions Collection

Responsibility: find/create and structurally inspect the reusable Question corpus.

```text
┌───────────────────────────────────────────────────────────────┐
│ Questions                                  [+ New] [Import]   │
│ Search [...................] [Alignment ▼]                    │
│                                                               │
│ Question list                                                  │
│  question / aligned-un-aligned structural state               │
└───────────────────────────────────────────────────────────────┘
```

Owns collection/search, structural aligned/unaligned filter, and entry to Question editing. It does not own learner progress or semantic learning/evidence coverage percentage.

## 18. C-42 — Question Detail / Editor

Responsibility: author one Question and map it to reusable Knowledge.

```text
┌───────────────────────────────────────────────────────────────┐
│ Question                                           [Save]     │
│                                                               │
│ question text                                                  │
│ direct answer                                                  │
│                                                               │
│ Knowledge alignment                                            │
│  KnowledgeNode A                                               │
│  KnowledgeNode B                                               │
│  [+ Align existing Knowledge]                                  │
└───────────────────────────────────────────────────────────────┘
```

# Secondary surfaces

## 19. S-01 — External Runtime Status

Responsibility: communicate Anki/runtime availability without turning deployment configuration into product configuration.

```text
┌─────────────────────────────────────────┐
│ Anki runtime                            │
│ reachable / unavailable / incompatible │
│ profile / non-secret endpoint summary  │
└─────────────────────────────────────────┘
```

No API-key editing in current v1 UI.

## 20. S-02 — Contextual Import Flow

Responsibility: apply supported prepared-data documents in the curation context where the data belongs.

Entry examples:

```text
Curation / Knowledge    -> Import Knowledge
Curation / Requirements -> Import Requirements
Curation / Questions    -> Import Questions
Curation / Targets      -> Import Targets
```

Coarse frame:

```text
┌───────────────────────────────────────────────────────────────┐
│ Import Questions                                              │
│                                                               │
│ [select/drop supported document]                              │
│                                                               │
│ outcome                                                        │
│ total / applied / rejected                                    │
│ rejected item + reason                                        │
└───────────────────────────────────────────────────────────────┘
```

Import is a flow/state, not a permanent top-level destination.

# 21. Cross-frame transition map

```text
Learning
L-01 Target Selection
  └─> L-02 Overview
       ├─> L-03 Knowledge
       ├─> L-04 Study
       │    └─ Question -> Show in Knowledge Map -> L-03 focused
       └─> L-05 Statistics

Any Learning frame
  └─ explicit mode switch -> Curation

Curation
C-11 Targets      -> C-12 Target editor
C-21 Knowledge    -> C-22 Knowledge editor
C-31 Requirements -> C-32 Requirement editor
                   -> C-33 RequirementSet editor
C-41 Questions    -> C-42 Question editor

Curation collections
  └─> S-02 contextual Import

Any relevant frame
  └─> S-01 Runtime Status
```

# 22. Responsibility boundaries

| Area | Primary responsibility | Explicitly not responsible for |
|---|---|---|
| Learning / Overview | target context + read-only scope | authoring target semantics |
| Learning / Knowledge | relational understanding and readable knowledge | semantic editing |
| Learning / Study | Questions + Study Set + Anki handoff | Question curation |
| Learning / Statistics | factual ReviewObservations | mastery inference |
| Curation / Targets | prepared target profiles | learner activity |
| Curation / Knowledge | reusable subject semantics/relations | learner state |
| Curation / Requirements | reusable capability requirements/composition | target-specific learner evidence |
| Curation / Questions | reusable retrieval/diagnostic artifacts | coverage percentage |
| 3D Graph | relational projection/exploration | semantic meaning from geometry |
| Import | prepared-data intake | independent product workspace |
| Runtime Status | integration availability | deployment-secret editing |

# 23. What this map intentionally does not decide

- exact URL/router structure;
- top nav versus side nav;
- card/table/list visual styling;
- typography/color/theme;
- exact component boundaries;
- exact responsive behavior;
- drawer versus right panel versus page for canonical detail;
- 3D graph library, physics or camera implementation;
- 2D fallback realization;
- learner-state graph overlay;
- semantic learning/evidence coverage UI.

Those decisions belong after this responsibility map is exercised as a frontend prototype.
