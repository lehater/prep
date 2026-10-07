# Presentation System Design

## Purpose

Define shared presentation rules inherited by all Prep preparation views without turning styling, layout mechanics or visualization technology into product/domain semantics.

The system covers the current human-interface surface: Target, Current position, Knowledge, Activity, Evidence & changes, and contextual Prepare missing support.

## Shared principles

- **Task-first hierarchy.** Each view has one dominant task surface; active Target and optional Next focus remain supporting context rather than competing workspaces. In Target requirement inspection, required Capability performance and its direct Knowledge focus remain visibly distinct but colocated.
- **Evidence before confidence.** Demonstrated/challenged/unknown and why-this-state remain distinguishable; missing evidence is not styled as failure.
- **Progressive focus + context.** Secondary detail is inspectable on demand without forcing all context to remain simultaneously visible.
- **No visual proof inflation.** Color, completion, animation or spatial proximity never imply learner capability beyond accepted evidence.
- **Semantic equivalence across representations.** A richer visualization may help orientation, but required tasks remain possible through a non-spatial semantic path.
- **Recoverability remains visible.** Pending, unresolved, rejected, unavailable and stale-context states preserve the next valid action and do not collapse into one generic error.

## Application surface

On capable wide surfaces, Prep uses a **desktop-oriented bounded application/workbench** rather than document-oriented page flow:

- the application shell owns the available viewport;
- preparation navigation remains persistently available;
- the active task workspace occupies the remaining viewport;
- task regions may own bounded internal overflow where their content requires independent inspection;
- long page-level document scrolling is not the default ownership model for the primary preparation workspace.

This contract fixes the structural interaction archetype, not pane geometry. It does not require every secondary region to remain visible, equal-width panes, resizable splitters or any particular CSS mechanism.

On constrained/narrow surfaces the same semantic priorities are preserved through reflow and disclosure; bounded wide-screen composition does not create a separate product topology.

## Knowledge representation

The shared Knowledge pattern is **mixed 2D relationship overview + task-complete non-spatial access**.

Canonical requirements:

- search/query and semantic scope controls;
- bounded semantic results;
- selected Knowledge detail;
- inspectable relationship meaning/direction;
- an optional 2D node-link overview for relationship orientation on capable surfaces;
- equivalent non-spatial traversal/inspection for every task-critical Knowledge action;
- a Required Capability is an explicit optional Knowledge-scope control: selecting it visibly limits results/relationship overview to the Capability-derived scope anchored by direct Knowledge focus; clearing it restores broader target/focus scope;
- capability-derived scope does not require inverse Knowledge-to-Capability browsing or turn the focus relation into a Subject Knowledge predicate.

The 2D overview is presentation state only. Node position, edge geometry, zoom, pan and focus camera state are not Knowledge semantics.

A 3D graph is a controlled experimental freedom, not the canonical default. It may be prototyped only if it preserves all accepted semantic/accessibility/performance behavior and does not force downstream screens/components to depend on 3D-only interaction.

Rationale evidence is task-dependent rather than universal: empirical visualization studies show that 3D can help some spatial/complex graph tasks, while precise navigation, viewpoint/occlusion and standard-display interaction can favor 2D or combined representations. Therefore Prep does not make 3D a prerequisite for useful Knowledge exploration.

## Information density

Default density is **progressive focus + context**:

- one primary work surface per view;
- essential Target/focus context remains easy to recover;
- evidence rationale, provenance and secondary detail use disclosure/detail regions rather than permanently competing with the primary task;
- empty/unknown states reduce noise rather than filling space with placeholders;
- narrow screens prioritize task sequence over simultaneous panels.

Dense peer-panel composition and single-step sparse wizards remain controlled alternatives for a specific screen only when the screen contract justifies them. A bounded workbench may still contain several cooperating regions when one task/work region remains dominant and the Screen/View contract establishes their simultaneous value.

## Control surface

Controls are **contextual task controls with keyboard-equivalent semantics**.

Persistent controls are limited to:

- preparation navigation/context recovery;
- active Target context;
- current focus context where material.

Task controls live near the information/action they affect. Direct manipulation (including graph pan/zoom/selection) may supplement but never replace named/queryable/keyboard-operable actions.

## Shared hierarchy

Use semantic emphasis roles rather than fixed visual sizes:

1. view purpose / primary task;
2. active Target and current focus context;
3. primary decision or work content;
4. supporting basis/detail;
5. provenance/diagnostic metadata.

Exact typography family, font sizes, color values, border radii, spacing values and icon set remain implementation freedoms unless a later accepted brand/platform constraint makes them material.

## Implementation layering

The presentation system is implemented in three layers so visual styling can propagate across the whole application without feature-specific duplication:

1. **Design tokens** define reusable visual roles such as application canvas, surfaces, navigation surfaces, borders, text hierarchy, accent, row states, radii, spacing and focus treatment. Feature CSS consumes semantic token roles rather than embedding a private palette.
2. **Shared presentation primitives** define recurring application-shell and control patterns such as navigation, page/task headings, surfaces, controls, actions, section headings, collection rows and dividers.
3. **Feature composition** owns only feature-specific geometry and task semantics. A feature may compose shared primitives and add local layout rules, but it does not redefine the application palette or typography system.

A visual refresh therefore changes tokens and shared primitives first. Knowledge may be the first dense consumer used to validate the system, but Knowledge-specific styling must not become the source of truth for application-wide appearance.

Resizable region separators keep their visible rule visually subordinate to content; their pointer hit area may be wider than the visible divider so usability does not require a wide gutter between sections. A shared resizable split owns the interaction mechanics and guarantees that each slot stretches its composed child to the full allocated region; feature content must not need local height hacks to become usable.

Typography is application-wide presentation knowledge. All views use one semantic type scale (page title, section title, subheading, body, small, meta and micro) from design tokens; features select roles but do not introduce private font-size values. Palette and typography literals are confined to the token layer and are mechanically checked.

For resizable data tables, content auto-size and fit-to-container are separate operations. Columns may declare fixed preferred widths or a flex weight. Flex columns absorb positive or negative remaining grid width within explicit min/max bounds; fixed-column resize or double-click content auto-size therefore gives space back to, or takes space from, the flex pool without mutating the fixed width of a sibling column. When the visual design places fixed columns to the right of a leading flex column, their resize handle may use the column's start edge so the divider manipulates the column the user sees on its right. A flex fill column is derived from the remaining width and need not expose a direct resize handle.

Feature-specific CSS may introduce a new visual role only when the role is genuinely local. If the same role recurs across multiple views, it is promoted into the shared presentation layer rather than copied.

## Reusable patterns

### PATTERN-CONTEXT-HEADER

Shows current Target and optional Next focus with explicit change/recovery actions. It does not become a second navigation tree.

### PATTERN-TARGET-COMPARISON

For choosing among plausible preparation directions:

- compare two or more candidate Targets against the same learner evidence basis;
- preserve each Target's own requirement identity and uncertainty;
- make shared versus target-specific Required Capabilities inspectable;
- expose demonstrated/challenged/unknown and gap/uncertainty per Target with evidence limitations;
- keep the comparison dimensions aligned enough to support a decision without implying that all requirements have equal weight;
- do not synthesize a universal scalar fit/readiness/preparation-distance score;
- provide an explicit continue-with-target action while allowing the decision to remain unresolved.

Wide surfaces may compare candidates simultaneously. Narrow surfaces may serialize candidates, but must preserve the same comparison dimensions and make the currently compared Targets explicit.

### PATTERN-QUERY-RESULT-DETAIL

For Knowledge and other inspectable collections:

- query/scope controls including an explicit optional Required Capability filter;
- visible active scope basis and a clear-filter action;
- bounded result set;
- selected detail;
- optional relationship overview when semantically useful.

Selection reveals detail; it does not silently mutate semantic scope.

### PATTERN-STATE-BASIS

Shows demonstrated/challenged/unknown or gap/uncertainty conclusions with a clear path to why-this-state evidence. For Next-focus choice it also exposes priority rationale, material external constraints and a bounded support-availability summary. Evidence detail remains inspectable but secondary to the current decision.

### PATTERN-ACTIVITY-ATTEMPT

Shows support options with intended CapabilitySpecification, expected conditions, fit basis and limitations before selection, then selected support, active attempt, pending evidence processing and reviewed result as distinct states. Activity completion never visually equals capability completion.

### PATTERN-PREPARE-SUPPORT

Shows motivating context, source/provenance input, accepted owner-scoped support, explicit remainder and return-to-origin action. Partial acceptance is visually distinct from global success/failure.

### PATTERN-OUTCOME

Maps accepted outcomes:

- SUCCESS → accepted result;
- UNRESOLVED → explicit unknown/remains-to-resolve;
- REJECTED → correction/reconsideration;
- DEPENDENCY_UNAVAILABLE → unavailable with preserved context;
- STALE_BASIS → updated-context refresh/reconsideration;
- OPERATIONAL_FAILURE → operational inability without semantic rejection.

## Feedback and loading

- Loading does not erase already accepted context when preserving it cannot mislead.
- Pending mutations show the specific pending action and block accidental duplicate submission.
- Empty, unknown, unresolved, rejected, dependency-unavailable, stale-context and operational-failure states are visually/semantically distinct.
- Success wording reports what was accepted or changed, not unsupported learner progress.
- No-change and increased uncertainty use neutral valid-result treatment, not failure styling.

## Responsive defaults

- Preserve semantic/read/focus order when regions reflow.
- Wide surfaces may show primary work plus supporting detail simultaneously.
- Narrow surfaces keep the primary task first and move secondary detail/visualization into ordered disclosures or subsequent sections.
- Knowledge's non-spatial query/result/detail path becomes primary on constrained/narrow surfaces; the 2D relationship overview may become a secondary disclosure.
- No screen requires a separate mobile product mode.

Exact breakpoints and CSS mechanics are implementation details.

## Accessibility defaults

- Keyboard access exists for every task-critical action.
- Visible focus is persistent and not encoded by color alone.
- Semantic status uses text/structure in addition to color/iconography.
- Pointer hover, drag, pan, zoom and spatial selection are supplemental.
- Reflow/disclosure preserves reading and focus order.
- Motion is nonessential to understanding and cannot be the sole carrier of state change.

## Performance/degradation

Presentation may use bounded active working sets, progressive disclosure, filtering or virtualization without changing Knowledge identity or semantic scope meaning.

If the relationship overview cannot remain usable, the system may reduce visual richness or omit it while retaining task-complete search/result/detail and relationship inspection. No production FPS/item-count threshold is invented here.

## Material invariants

- bounded desktop/workbench application surface on capable wide displays, with application-shell viewport ownership;
- persistent preparation navigation on capable wide displays and priority-preserving reflow/disclosure on constrained surfaces;
- task-complete non-spatial Knowledge access;
- 2D relationship overview is optional enhancement, never semantic truth;
- 3D is experimental controlled freedom, not required/default;
- visible Target/focus context continuity;
- distinct evidence vs conclusion;
- distinct accepted outcome states;
- keyboard/non-spatial equivalence;
- semantic-preserving degradation.

## Controlled freedoms

- whether a specific wide Knowledge view shows the 2D overview simultaneously or behind a disclosure;
- local pane resizing, default proportions and size persistence unless repeated evidence promotes them into a reusable cross-screen convention;
- whether secondary evidence/detail is inline, side-by-side or disclosed, subject to Screen/View composition;
- optional 3D prototype behind the same semantic contract;
- exact visual density within the progressive focus+context rule.

## Ordinary implementation details

Framework, DOM structure, CSS layout mechanism, exact token values, animation library, graph renderer/library, canvas/SVG/WebGL choice, private component decomposition, exact column widths, splitter thickness and convenience gestures such as double-click auto-fit.

## Deviation policy

A Screen/View may override a shared pattern only with explicit rationale and may not weaken semantic boundaries, task completeness, currentness, accessibility or degradation obligations.

## Unresolved questions

None.
