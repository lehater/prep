# Presentation System

## Purpose

Define the shared presentation language for Prep's rebuilt human interface from the accepted conceptual model, information architecture, interaction design, topology and frontend quality constraints.

The presentation system makes shared visual and interaction choices. It does not redefine domain semantics, choose backend behavior, prescribe concrete screen composition or make one visualization the only way to access Knowledge.

## Presentation principles

### Task context before decoration

Every view makes the current work context and primary user intent understandable before secondary visual detail.

The three root intents remain recognizable:

- **Learning** — consume a prepared target, prepare/export study material and inspect factual review evidence;
- **Knowledge** — understand reusable subject knowledge and semantic relationships;
- **Curation** — intentionally maintain reusable canonical data.

They use one shared visual language. Distinction comes from labels, action hierarchy and context, not color alone.

### Focus before density

Presentation follows the accepted single-primary-focus interaction model.

Large information spaces use search, filtering, scope, focus and progressive disclosure rather than attempting to show every available object and detail simultaneously.

### Semantics do not depend on geometry

Knowledge identity, semantic kind, relation type and relation direction remain explicitly inspectable outside spatial position.

A spatial projection may make relationships easier to explore, but geometry, distance, color or camera position never become the sole carrier of canonical meaning.

### Canonical state and interaction state look different

Selection, focus, active scope, loading, unsaved input and temporary projection state are visually distinguishable from accepted canonical content.

A pending or rejected mutation must never look equivalent to accepted canonical state.

## Shared information hierarchy

Across views, visual hierarchy follows:

1. **work context** — Learning, Knowledge or Curation and relevant target/scope;
2. **primary task / focused object**;
3. **primary action or current outcome**;
4. **supporting information and relationships**;
5. **secondary controls, diagnostics and implementation-oriented detail**.

This hierarchy is semantic. Concrete regions, columns, drawers and breakpoint composition belong to Screen/View Design.

## Knowledge presentation portfolio

Knowledge uses a **mixed access model**.

### Textual semantic backbone

Searchable textual/list access and focused detail are always available.

They provide:

- canonical Knowledge identity and readable content;
- semantic kind;
- explicit incoming/outgoing relationship type and direction;
- current global or target-relevant exploration scope;
- keyboard-operable result and relationship traversal.

This path is the semantic/accessibility backbone and does not depend on a graphics renderer.

### 3D relational projection

A 3D node-link projection is selected as a local visualization mode for the shared Knowledge view.

Its responsibility is to support relational exploration:

- perceive local/global relationship structure;
- move focus by following accepted semantic relationships;
- preserve context around the focused Knowledge item;
- make relation neighborhoods visually explorable.

It is **not**:

- the universal shell of Prep;
- the only Knowledge access mechanism;
- canonical domain structure;
- a requirement that all nodes/relations be rendered simultaneously;
- a source of semantic meaning beyond accepted Knowledge identities and relationships.

The existing 3D experiment is donor implementation evidence and should be reused downstream where compatible. Its existence reduces realization cost but does not override the semantic safeguards above.

### Why 3D is paired with textual access

A 3D projection can improve relational overview and make exploration engaging, but it also introduces viewpoint, occlusion, spatial-navigation and accessibility risks.

Therefore:

- search can establish focus without spatial navigation;
- focused detail provides explicit content and relationship semantics;
- selecting/following a relationship does not require interpreting geometry;
- renderer failure or deliberate disabling does not remove Knowledge access;
- the user can return from spatial exploration to textual/focused navigation without changing canonical scope.

A future 2D projection remains a controlled extension if user evidence shows it materially improves the same tasks.

## Knowledge projection density

The default projection is **focus-progressive**, not full-corpus dense.

Presentation should emphasize:

- the focused Knowledge item;
- its directly relevant neighborhood/relationships;
- enough surrounding context to preserve orientation;
- explicit filters/scope when the visible projection is bounded.

Labels/details use progressive disclosure:

- focused item: strong identity/content access;
- related items: readable identity on interaction or when presentation can support it without clutter;
- distant/supporting context: lower visual emphasis;
- full content: on demand through focused detail.

No fixed node count, edge count, FPS or density threshold is part of the current contract.

## Knowledge control surface

### Persistent task controls

The Knowledge presentation keeps the controls needed to perform accepted tasks easy to discover:

- search;
- global vs target-relevant scope;
- semantic-kind filtering where available;
- relation-type filtering where available;
- current focus / clear focus.

### Projection-local controls

When the 3D projection is active, presentation may expose compact projection-local controls such as:

- fit/reframe visible projection;
- reset viewpoint;
- enter/leave 3D projection.

These controls affect attention/presentation state only.

### Secondary renderer tuning

Renderer mechanics are not ordinary product vocabulary.

Options such as:

- force constants;
- physics duration;
- particles;
- polygon/detail level;
- batching/instancing;
- pixel ratio;
- shader/material choices;

remain implementation or developer-diagnostic concerns unless later user evidence shows a stable user task for controlling them.

The previous Auto / Quality / Performance profile requirement is removed from the product presentation contract.

## Action hierarchy

Shared action hierarchy:

- **primary** — the action that advances the current user task;
- **secondary** — reversible/supporting task action;
- **contextual** — object-specific action available when a canonical item/focus exists;
- **destructive or scope-changing** — visually differentiated and requires deliberate intent;
- **technical/diagnostic** — subordinate to user work and never competes visually with primary actions.

Curation mutation actions appear only when Curation context is explicit.

Learning views do not silently expose mutation actions merely because the same canonical object is visible.

## Search, selection and detail pattern

The reusable pattern for entity-heavy work is:

```text
scope/context
  -> search/filter
  -> result/reference
  -> focus/selection
  -> focused detail
  -> relationship/context action
```

The pattern applies to Knowledge and may be specialized by Targets, Requirements and Questions.

Selection/focus is preserved during recoverable loading or operational failure when doing so does not misrepresent canonical acceptance.

## Forms and canonical mutations

Curation forms follow a common state language:

- browsing;
- editing;
- submitting;
- accepted;
- validation rejected;
- conflict;
- operational failure.

Presentation rules:

- proposed input remains distinguishable from accepted canonical value;
- validation rejection keeps corrective context;
- conflict requires explicit reload/reconciliation rather than silently presenting stale input as accepted;
- success is shown only after the accepted machine/application outcome.

Exact inline/modal/drawer composition remains Screen/View Design freedom.

## Feedback conventions

### Loading

Loading indicates the affected region/task without replacing unrelated usable context.

### Empty

Empty state states the factual absence:

- no search match;
- empty Study Set materialization;
- no observations;
- no supported diagnostics.

It must not infer learner failure, poor coverage or missing mastery.

### Error and recovery

Errors preserve semantic context where safe and present the next valid recovery action.

External-runtime failure remains distinguishable from local canonical-data failure.

### Success

Success confirms accepted outcome, not merely local optimistic intent.

## Navigation presentation

The root destinations remain:

- Learning;
- Knowledge;
- Curation.

The presentation system does not mandate tabs, rail, menu or another concrete navigation widget. Screen/View Design chooses the shell pattern while preserving:

- root destinations remain findable;
- current work context remains visible;
- target-scoped Knowledge entry preserves target context;
- Curation remains explicit before mutation actions appear.

## Visual language

No branding system or exact visual reference is accepted upstream, so exact colors, typefaces and token values remain controlled implementation/design freedoms.

Shared defaults:

- restrained chrome around the primary task;
- clear hierarchy through type scale, spacing, weight and grouping;
- semantic status never encoded by color alone;
- selection/focus has an explicit visible treatment;
- dense technical metadata is subordinate to user-readable meaning;
- visual effects in the 3D projection must not obscure identity or relationship inspection.

A small stable semantic token vocabulary may be introduced downstream for roles such as surface, text, emphasis, focus, success, warning, error and relation-category encoding. Exact values are not canonical at this stage.

## Responsive/adaptive defaults

Presentation must preserve task semantics when available viewport space changes.

General rules:

- primary task and focused content outrank secondary context;
- secondary panels/controls may move behind disclosure;
- textual Knowledge access remains available when the 3D projection is unsuitable for the current viewport/device;
- Curation input and validation state must remain recoverable across adaptation.

Exact breakpoints and region rearrangement belong to Screen/View Design and implementation.

## Accessibility defaults

Shared requirements:

- keyboard-visible focus;
- keyboard operation for search, result selection, relationship traversal and primary actions;
- semantic statuses expressed in text/structure, not color alone;
- pointer-only 3D gestures never become the sole way to focus or traverse Knowledge;
- focused Knowledge identity and relation type/direction have non-spatial readable equivalents;
- motion/continuous visual effects are presentation enhancements, not semantic requirements.

Detailed conformance criteria may be refined by Verification Design when concrete screens exist.

## Material invariants

- Knowledge remains accessible without the 3D renderer.
- 3D is a local Knowledge projection, not the universal Prep UI.
- Geometry never defines canonical Knowledge semantics.
- Learning/Curation context remains explicit around shared canonical information.
- Mutation success follows accepted canonical outcome.
- Search/focus/relationship traversal have non-spatial, keyboard-operable paths.
- No numeric performance envelope or renderer profile is a current MVP presentation requirement.

## Controlled freedoms

Screen/View Design may decide:

- concrete navigation widget;
- screen regions and pane composition;
- inline vs overlay detail/editing;
- whether 3D is initially visible or activated from the Knowledge view;
- exact placement of projection-local controls;
- responsive rearrangement.

Implementation may decide:

- CSS/layout mechanics;
- rendering library and object model;
- camera mechanics;
- batching/instancing;
- physics behavior;
- exact styles and tokens;
- internal component structure.

## Reopening conditions

Revisit the presentation system when:

- prototype/user evidence shows 3D harms or materially improves target tasks;
- a 2D projection demonstrates distinct user value;
- branding or explicit visual identity becomes accepted;
- accessibility/platform obligations require stricter presentation rules;
- realistic corpus/device evidence produces accepted numeric quality constraints;
- new product capabilities add materially different user work.

## Unresolved questions

None currently block shared presentation definition.
