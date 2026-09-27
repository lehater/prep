# Screen / View Design

## Purpose

Materialize the accepted Interface Topology into concrete, implementation-independent view compositions.

All views inherit the rebuilt Presentation System. The contracts below define semantic regions, hierarchy, actions, state variants and responsive transformations without prescribing framework, DOM, CSS, route strings or component boundaries.

## Shared shell

The shell exposes the three root destinations **Learning / Knowledge / Curation** with current work context visible.

Shared shell regions:

- **context header** — current root intent plus active target/scope where applicable;
- **primary work surface** — the current topology view;
- **global navigation** — compact access to root destinations;
- **global feedback layer** — operational feedback that cannot be contained by a local region.

The shell does not allocate a permanent large region to navigation. Primary task content gets spatial priority.

The structural topology node `V-CURATE` does not require an empty landing screen. Entering Curation may resolve to the first/last appropriate curation child while preserving explicit Curation context.

## Shared composition rules

- one primary task surface dominates each view;
- collection + focused detail/editor remain co-located when both are needed to complete the same accepted task;
- destructive/canonical mutation controls stay inside explicit Curation context;
- contextual navigation does not duplicate canonical objects into separate workspaces;
- recoverable errors preserve search, selection, focus and proposed input where safe;
- wide-layout secondary regions may become disclosures/full-width substates on narrow layouts without changing semantic view identity;
- every 3D Knowledge interaction has a textual/keyboard path inherited from Presentation System.

## [V-LEARN-TARGET] Learning target

**Purpose:** find/select an existing curated LearningTarget and establish the read-only Learning context.

**Reads:** `learning.targets.list`, `learning.targets.get`.

### Regions

1. **Learning context header — priority high**
   - root context: Learning;
   - current target identity when selected;
   - intended outcome summary.
2. **Target finder — priority primary**
   - search input;
   - target result collection;
   - empty/no-match state.
3. **Selected target summary — priority primary after selection**
   - intended outcome;
   - prepared Requirement/RequirementSet scope as read-only information;
   - contextual exits to Study, Evidence and target-scoped Knowledge.
4. **Secondary guidance — priority low**
   - explicit route to Curation when target preparation/maintenance is needed.

### Primary actions

- search targets;
- select target;
- continue to Study preparation.

### States

- no target selected;
- loading targets;
- targets available;
- no target match;
- target selected;
- target not found;
- operational failure.

### Responsive transformation

Wide layout may show finder and selected summary together. Narrow layout keeps the finder first; after selection, the target summary becomes the primary full-width state with a clear return to target results.

Focus returns to the selected result when navigating back.

## [V-LEARN-STUDY] Study preparation

**Purpose:** build, inspect and export exactly the current Study Set preview for the active target.

**Commands/reads:** `learning.target.study_set.build`, `learning.target.study_set.export`.

### Regions

1. **Target context strip — priority high**
   - active target;
   - preview current/stale state.
2. **Study preview — priority primary**
   - current Question material;
   - explicit empty result;
   - currently inspected materialization.
3. **Preparation diagnostics — priority secondary**
   - supported structural diagnostics only;
   - contextual link to Curation diagnostics/repair.
4. **Action region — priority high**
   - build/rebuild preview;
   - export reviewed preview.

### Action hierarchy

- primary before preview exists: **Build preview**;
- primary after inspected current preview exists: **Export reviewed preview**;
- stale preview: **Rebuild** replaces Export as primary;
- diagnostics are secondary and never silently repair data.

### States

- no preview;
- building;
- preview current;
- preview empty;
- exporting;
- exported;
- preview stale;
- external runtime unavailable;
- partial external failure;
- operational failure.

### Responsive transformation

Question preview remains primary. Diagnostics and export outcome detail may move behind disclosure on narrow layouts. Build/export actions remain adjacent to preview state rather than moving into global navigation.

## [V-LEARN-EVIDENCE] Review evidence

**Purpose:** inspect factual Question-level review evidence and explicitly refresh it.

**Reads/commands:** `learning.target.statistics.get`, `learning.question.reviews.get`, `learning.reviews.sync`.

### Regions

1. **Evidence context header — priority high**
   - active target or explicit Question context;
   - factual evidence-presence state.
2. **Target evidence summary — priority primary**
   - accepted factual aggregates;
   - Question references with available evidence.
3. **Question history detail — priority secondary/focused**
   - ReviewObservations for the current Question;
   - pagination/continuation.
4. **Refresh action/outcome — priority secondary**
   - explicit sync;
   - item-level failures if partial.

### States

- loading;
- evidence present;
- no observations;
- syncing;
- sync complete;
- external runtime unavailable;
- partial import failure;
- operational failure.

No region may label data as mastery, readiness, retention or progress.

### Responsive transformation

Wide layout may keep evidence list and focused history side by side. Narrow layout shows the collection first and focused history as a full-width substate with return-to-list focus restoration.

## [V-KNOWLEDGE] Knowledge

**Purpose:** find, focus and traverse reusable Knowledge in explicit global/target scope, and expose intentional Knowledge mutation only in Curation context.

**Reads/commands:** `learning.target.knowledge.list`, `curation.knowledge.list`, `curation.knowledge.get`, plus accepted Curation Knowledge/relation commands when Curation context is active.

### Regions

1. **Knowledge task bar — priority high**
   - global vs target-relevant scope;
   - search;
   - semantic-kind filter;
   - relation-type filter;
   - current focus / clear focus.
2. **3D relational projection — priority primary on capable wide layouts**
   - current bounded relational context;
   - focused node;
   - accepted relation links;
   - direct manipulation for exploration only.
3. **Textual Knowledge access — priority primary-semantic / secondary-spatial**
   - search/result list or equivalent textual references;
   - remains available independent of renderer;
   - establishes focus without spatial gestures.
4. **Focused Knowledge detail — priority high contextual**
   - identity and content;
   - semantic kind;
   - explicit incoming/outgoing relationship type and direction;
   - relationship traversal actions.
5. **Projection-local controls — priority secondary**
   - fit/reframe;
   - reset viewpoint;
   - enter/leave spatial projection where needed.
6. **Curation actions — conditional**
   - visible only when Curation work context is explicit;
   - create/edit Knowledge;
   - add/remove typed relationship.

### Composition decision

On wide layouts the 3D projection receives the largest work region because relational exploration is the distinctive spatial task. Textual search/list access and focused detail remain immediately reachable as supporting semantic regions.

The view is not a graph-only canvas. Search/list/detail are co-equal access semantics even when spatial projection has greater visual area.

### States

- no focus;
- searching;
- no match;
- focus selected;
- loading focus;
- relation selected;
- renderer unavailable;
- operational failure;
- Curation editing/submitting/accepted/rejected/conflict when mutation is enabled.

Renderer unavailable degrades to textual search/focus/detail without changing scope or canonical meaning.

### Responsive transformation

Wide:
- 3D projection primary;
- compact search/filter controls;
- focused detail/textual access adjacent or disclosed without covering the whole projection.

Narrow:
- textual search/results and focused detail become primary;
- 3D projection becomes an explicit full-width mode/disclosure rather than competing for simultaneous space;
- projection controls appear only inside that mode.

Keyboard focus order follows task semantics: context/search → results → focus/detail → relationships/actions → optional projection controls.

## [V-CURATE-TARGETS] Curation — Targets

**Purpose:** maintain LearningTargets and explicit prepared scopes.

**Reads/commands:** `curation.targets.list`, `curation.targets.get`, `curation.targets.create`, `curation.targets.update`, `curation.targets.scope.add`, `curation.targets.scope.remove`.

### Regions

1. **Target collection/search — priority primary when no edit focus**
2. **Focused target editor — priority primary when selected/creating**
3. **Prepared scope editor — priority high contextual**
4. **Validation/conflict outcome — priority high on failure**
5. **Cross-context links — priority secondary**
   - Requirements;
   - Knowledge;
   - Diagnostics.

### Composition

Collection and focused editor belong to one Curation task view rather than separate product destinations. Wide layouts may use master/detail composition. Narrow layouts present editor/detail as a full-width substate with explicit back-to-collection behavior.

### States

- browsing;
- editing;
- submitting;
- accepted;
- validation rejected;
- conflict;
- not found;
- operational failure.

## [V-CURATE-REQUIREMENTS] Curation — Requirements

**Purpose:** maintain Requirements/RequirementSets, acyclic membership and explicit Knowledge alignments.

**Reads/commands:** accepted `curation.requirements.*`, `curation.requirement_sets.*`, membership and requirement↔knowledge alignment operations.

### Regions

1. **Requirement/RequirementSet finder — priority primary**
2. **Focused definition editor — priority primary**
3. **Set membership — priority high contextual**
4. **Knowledge alignment — priority high contextual**
5. **Validation/conflict feedback — priority high on failure**

### Composition

Membership and alignment stay with focused Requirement/RequirementSet context; they are not promoted into independent root workspaces.

Wide layouts may keep finder and focused work adjacent. Narrow layouts move focused editing to a full-width substate while preserving collection search/filter state.

### States

- browsing;
- editing;
- selecting membership/alignment;
- submitting;
- accepted;
- validation rejected;
- conflict;
- operational failure.

## [V-CURATE-QUESTIONS] Curation — Questions

**Purpose:** maintain Question/direct-answer material and explicit Knowledge alignments.

**Reads/commands:** accepted `curation.questions.*` and Question↔Knowledge alignment operations.

### Regions

1. **Question finder/search — priority primary**
2. **Focused Question editor — priority primary**
   - question text;
   - direct answer.
3. **Knowledge alignment — priority high contextual**
4. **Review-evidence link — priority secondary**
5. **Validation/conflict feedback — priority high on failure**

Question material may exist with zero Knowledge alignments; the UI must not force one.

### Responsive transformation

Wide master/detail is allowed. Narrow editing becomes a full-width substate with preserved search context and explicit return. Alignment selection may use a local disclosure/overlay but remains visibly subordinate to the Question being edited.

## [V-CURATE-IMPORT] Curation — Prepared data

**Purpose:** submit one supported prepared-data document and understand aggregate/item-level outcomes.

**Command:** `curation.import.apply`.

### Regions

1. **Prepared-data input — priority primary before submission**
   - selected/pasted source representation;
   - submission action.
2. **Aggregate outcome — priority high after submission**
   - created;
   - updated;
   - duplicate-skipped;
   - rejected counts.
3. **Item outcome list — priority primary after partial/rejected result**
   - item reference;
   - outcome;
   - rejection reason/category.
4. **Affected-object navigation — priority secondary**
   - contextual navigation to canonical destinations where identity exists.

### States

- ready;
- submitting;
- applied;
- partially applied;
- envelope rejected;
- operational failure.

Successful and rejected peer items remain visibly distinct.

### Responsive transformation

Input and results may be side by side on wide layouts only when results already exist. Narrow layouts use sequential input → outcome presentation with item outcomes preserving readable identity/reason pairs.

## [V-CURATE-DIAGNOSTICS] Curation — Diagnostics

**Purpose:** inspect supported structural preparation facts and continue into explicit repair contexts.

**Reads:** currently supported diagnostic facts derived from accepted collection/query operations.

### Regions

1. **Diagnostic finder/filter — priority primary**
2. **Finding list — priority primary**
3. **Focused diagnostic context — priority secondary**
   - implicated canonical object;
   - factual reason;
   - owning repair destination.
4. **Repair navigation action — priority high contextual**
   - route to Knowledge / Requirements / Questions while preserving implicated identity.

### States

- loading;
- findings present;
- no findings;
- operational failure.

The view does not expose semantic coverage scores or automatic repair.

### Responsive transformation

Wide layouts may show finding list and focused diagnostic context together. Narrow layouts use list → focused finding substate; repair navigation preserves enough context to return meaningfully.

## Detail/edit placement policy

For entity-heavy Curation views, the selected default is **same semantic view with preserved collection context**.

Wide screens may realize this as master/detail regions. Narrow screens may realize it as full-width focused substates. This is not two different topology views.

Modal/overlay editing is reserved for bounded secondary choices such as selecting an alignment candidate; it is not the default container for long-form canonical editing.

Knowledge focused detail similarly remains contextual to `V-KNOWLEDGE` rather than becoming an independent product destination.

## Responsive policy

Responsive transformation is semantic-priority driven:

1. preserve current work context;
2. preserve primary task/focused object;
3. preserve primary action and recovery state;
4. disclose/move secondary context;
5. reduce simultaneous regions before removing information access.

No exact breakpoint is canonical.

## Focus and read order

When wide master/detail becomes narrow sequential states:

- moving into detail/edit moves focus to the detail heading/first meaningful control;
- returning restores focus to the originating collection item when available;
- validation error focus moves to the first actionable error summary/field while preserving entered values;
- renderer mode changes never trap focus inside the 3D surface.

## Material exclusions

Screen/View Design does not introduce:

- graph FPS/node-count requirements;
- renderer tuning profiles;
- new domain entities;
- mastery/readiness/coverage semantics;
- background jobs;
- browser-direct external-runtime calls;
- separate editor product destinations where topology defines one Curation task view.

## Implementation freedoms

Downstream realization may choose:

- exact route strings;
- CSS Grid/Flexbox;
- exact region dimensions;
- drawer vs side panel mechanics where semantics above are preserved;
- internal component split;
- exact responsive breakpoints;
- 3D renderer library/camera implementation;
- visual token values.
