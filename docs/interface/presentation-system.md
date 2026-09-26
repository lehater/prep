# Presentation System Design

## Purpose

Define shared presentation and interaction conventions for the accepted two-mode product: target-centric Learning plus reusable-data/target-profile Curation, without choosing frontend framework mechanics or encoding domain semantics in styling.

## Interaction principles

- **Mode is explicit.** Learning and Curation are visibly different task contexts even when the same physical user performs both.
- **Learner context first.** Inside Learning, the selected curated LearningTarget remains visible while the learner moves through Overview, Knowledge, Study and Statistics.
- **Curation is explicit.** Editing target scope, reusable Knowledge/Requirements/Questions and corpus quality belongs to Curation rather than appearing as implicit learner chores.
- **Reuse is explicit.** Target views project reusable canonical objects; they do not imply that Knowledge, Requirements or Questions are owned by the target.
- **Library maintenance is collection-first.** Large reusable corpora are found through search/browse controls and opened into canonical detail/edit contexts.
- **One canonical identity, contextual capabilities.** The same canonical object may be viewed from learner or curation context while edit capabilities remain context-specific.
- **No fake completeness.** The learner sees available material; semantic Question-set coverage quality belongs to curation and has no current numeric score.
- **Graph is first-class but non-exclusive.** The frontend prototype gives spatial Knowledge exploration a prominent role for relational learning, while list/search/detail remain equivalent canonical access paths.
- **Recoverability is visible.** Validation and external-integration failures retain context/input and expose a retry or correction path.

## Accepted visual language and design tokens

The current production visual direction is intentionally compact, information-dense and workspace-oriented. These values are accepted Presentation System decisions rather than provider defaults.

### Typography

Use one neutral UI sans-serif family through the shared theme/provider boundary. The exact font file/provider may vary, but the visual metrics must remain close to the accepted scale.

| Role | Accepted size | Weight / behavior |
| --- | ---: | --- |
| application/page title | 18-22 px | 600-700 |
| section heading | 15-18 px | 600-700 |
| ordinary UI/body text | 13-14 px | 400-500 |
| compact control/label text | 12-13 px | 500-600 |
| caption/metadata/tag | 11-12 px | 500-700 |
| overline/context label | 10-11 px | 600-700, restrained tracking |

Large display typography is not used inside operational workspaces. Workspace hierarchy is created by placement, weight, surface and spacing rather than oversized headings.

### Density and spacing

Use a 4/6/8/12/16/24 px spacing rhythm. Ordinary dense workspace composition should primarily use 6-12 px gaps.

Accepted control density:

- ordinary desktop buttons/selects/text inputs: approximately 28-32 px high;
- icon-only graph controls: approximately 28-32 px square;
- chips/tags: approximately 18-22 px high;
- panel internal padding: approximately 8-12 px;
- application content edge padding: approximately 12-20 px depending on viewport class.

Buttons use normal title/sentence case, not automatic all-caps.

### Color and surfaces

The visual system uses a light application shell with a dark graph workspace:

- application background: very light neutral gray;
- ordinary panel/surface: white or near-white;
- dividers/borders: low-contrast neutral gray;
- primary action/selection accent: clear medium blue;
- ordinary text: near-black neutral;
- secondary text: muted gray;
- graph canvas: dark navy/charcoal;
- graph labels: high-contrast near-white;
- semantic node colors may distinguish semantic roles, but color never carries meaning alone.

Exact hexadecimal values are provider/theme implementation details as long as contrast and role relationships remain equivalent.

### Shape, borders and elevation

- panels use restrained 6-8 px corner radius;
- ordinary boundaries prefer 1 px borders over heavy shadows;
- overlays/floating graph utilities may use modest elevation;
- selected rows use a low-intensity accent background plus non-color selection indication;
- focus-visible treatment must be stronger than ordinary borders.

### Iconography

Use one coherent simple line-icon family. Icons supplement text and never replace required accessible labels. Graph controls may become icon-only when space is constrained, provided tooltip/accessible-name semantics remain explicit.

## Accepted application shell

Desktop/wide application navigation uses a persistent left rail.

### Desktop / wide shell

- rail width: approximately 200-220 px;
- rail occupies full useful viewport height and remains visually separate from the active workspace;
- application identity `Prep` appears at the top;
- primary mode entries: `Learning`, `Curation`;
- active mode is clearly selected;
- mode-local navigation appears below the active mode:
  - Curation: Targets, Knowledge, Requirements, Questions;
  - Learning target context: Overview, Knowledge, Study, Statistics plus a way to change target;
- external runtime status such as Anki reachability is anchored near the rail bottom;
- active workspace consumes the remaining width.

The rail is navigation, not a second content column: it stays visually quieter than the active task surface.

### Narrow shell

Below the narrow breakpoint, the persistent rail may collapse into a compact header/disclosure/navigation drawer. The same navigation hierarchy and accessible names remain available without horizontal overflow.

## Shared application composition

The application shell provides an explicit way to enter/switch between:

- **Learning**;
- **Curation**.

The accepted desktop switcher/navigation mechanism is the persistent left rail defined above. Narrow/mobile collapse mechanics remain downstream as long as the same hierarchy is preserved.

A compact global integration/status/settings surface may expose external-runtime connectivity/configuration.

Study and Statistics are contextual Learning capabilities. Import is a contextual Curation/Library capability.

## Learning presentation pattern

Learning starts with selection of an existing curated LearningTarget. Learning mode provides no create/edit/recompose actions for target scope.

When a target is open, presentation preserves:

- target identity and concise definition;
- minimal local learner navigation for Overview, Knowledge, Study and Statistics;
- available-material facts relevant to the current section;
- a stable way back to target selection;
- an explicit switch to Curation when the same v1 user chooses to author or repair reusable material/target structure.

Scope is presented inside Overview because it is read-only in Learning. Target Questions are presented inside Study because the current Study Set and currently resolvable Question collection have the same membership.

Detailed structural/semantic curation diagnostics should not dominate learner surfaces.

Learning target navigation uses the shared shell hierarchy on desktop; exact routing and narrow/mobile disclosure mechanics remain downstream.

## Curation presentation pattern

Curation exposes:

- prepared LearningTargets and their Requirement/RequirementSet composition;
- the reusable Library of Knowledge, Requirements/RequirementSets and Questions.

Library collections remain collection-first.

Each collection may provide supported search/filter controls, creation, canonical detail/edit access, alignments and contextual Import.

Future Question-set coverage quality belongs here or in another curation surface derived from accepted semantics. Until those semantics exist, presentation may show structural facts such as "no aligned Questions" but must not fabricate a coverage percentage.

## Canonical object pattern

Canonical Knowledge, Requirement/RequirementSet and Question identity is shared across contexts.

### Learner context

Learner detail emphasizes readable subject/question content and navigation relevant to the selected target.

### Curation context

Curation detail may expose:

- editable canonical fields;
- related-object/alignment sections;
- searchable canonical-object selectors where assignment/alignment is allowed;
- explicit completion/cancel behavior;
- inline validation while preserving recoverable input.

Context switching must preserve object identity and make the change in available actions clear.

## Study presentation

Study Set presentation keeps LearningTarget identity and currently resolved Questions visible.

Construction uses the currently resolvable subset. It may be empty. The presentation does not imply semantic completeness and does not block learning merely because curation is incomplete.

External-study actions show runtime availability and per-Question outcome. An unavailable runtime is distinct from an empty Study Set.

## Statistics presentation

Statistics use factual ReviewObservation language and factual aggregates.

Target-context statistics are observations for Questions currently relevant to the target, not target mastery/readiness.

## Responsive spatial system

All material views must define how hierarchy survives reduced available width. Exact CSS breakpoints remain implementation details; the semantic transformations are not.

Shared layout classes:

- **wide workspace** — enough width for a dominant primary work surface plus persistent supporting regions;
- **compact workspace** — primary work surface remains dominant while secondary detail/list regions move below, collapse or become drawers;
- **narrow workspace** — one primary reading/interaction column; secondary regions become explicit disclosures/drawers and must not cause horizontal overflow.

Responsive reflow preserves keyboard/focus order and does not hide required actions.

For canvas/map/graph workspaces, the primary interactive surface receives the flexible remainder of available width/height. Supporting list/detail panes must not consume equal visual weight merely because they are sibling regions.

## Knowledge workspace visual specification

The Knowledge workspace is a graph-centered operational frame with supporting search/results and detail/editor access.

### Wide frame geometry

At desktop/wide widths:

- left application rail: approximately 200-220 px;
- workspace header + actions + graph toolbar: compact, normally no more than approximately 120-150 px total vertical chrome;
- optional Knowledge results pane: approximately 200-240 px;
- right detail/editor pane: approximately 280-320 px;
- central graph receives all remaining horizontal space and must be the visually dominant region;
- graph height uses the useful viewport remainder after shell/header/toolbars, normally targeting at least approximately 520 px on ordinary desktop screens;
- the graph is not centered inside a larger empty panel: its renderer surface fills the graph region.

### Page header and actions

Header composition:

1. small context/eyebrow, e.g. `Curation`;
2. compact title, e.g. `Curation Knowledge`;
3. one short helper sentence only where it materially helps orientation.

Curation authoring actions `New Knowledge` and `Import Knowledge` are compact actions aligned with the header/toolbar area. They do not render permanent full-width authoring cards until invoked.

### Graph toolbar

The graph toolbar is one compact horizontal control band on wide layouts. It contains, in task order:

1. Search field;
2. Search action;
3. semantic-kind filter;
4. relation-type control;
5. explicit Focus;
6. Clear focus;
7. Fit graph;
8. Reset camera;
9. Graph settings;
10. compact Auto / Quality / Performance profile selector where space permits.

Toolbar controls may wrap in compact layouts but must remain grouped by task. They must not form several visually unrelated button rows.

### Knowledge results pane

The results pane is supporting and search-first.

- label: `Knowledge results`;
- show exact result/total context when available, e.g. `40 / 1,284`;
- do not render an unbounded full corpus;
- ordinary visible window is approximately 8-12 rows or a bounded maximum such as 40 results;
- row shows concise title plus compact semantic-kind tag/secondary cue;
- selected item uses explicit selection styling;
- large corpora are narrowed with search/filtering; future virtualization/pagination may realize the same contract;
- global Curation may keep the pane collapsed by default so the graph receives maximum width.

### Graph canvas

Graph canvas visual behavior follows the proven experimental direction without importing experiment semantics:

- dark continuous workspace surface;
- selected node is emphasized but the remaining graph stays visible;
- selection does not imply focus/filtering;
- explicit focus may emphasize a bounded neighborhood and dim/hide unrelated nodes only after the user asks for it;
- visible node labels are selective to avoid clutter; selected/focused/hovered labels have priority;
- relation direction/type remains inspectable by arrows, labels, legend/detail or another redundant encoding;
- compact unobtrusive graph status may show node count, relation count and active profile;
- fit/reset/settings controls may be duplicated as icon utilities inside the canvas only if they mirror, rather than redefine, toolbar commands;
- optional minimap/overview is allowed as a presentation aid but carries no semantic meaning.

### Detail/editor pane

The right pane is bounded supporting context, not a peer workspace.

- width approximately 280-320 px on wide layouts;
- compact heading and field spacing;
- selected Knowledge identity/content remains visible while graph context is preserved;
- relations use compact rows/chips with explicit direction/type text;
- relation editor uses compact type + target selection and explicit Add action;
- Save/mutation actions are visually clear but do not dominate the pane;
- closing or changing detail must not reset graph camera/layout merely because selection changed.

### Selection and focus

Selection and focus are separate interaction states:

- selecting a node opens/updates detail and highlights that node;
- other nodes remain visible;
- focus/local-neighborhood filtering occurs only after explicit user Focus action or accepted deep-link intent;
- Clear focus restores the previous semantic scope without discarding selection unless the user changes selection separately.

## Responsive frame specification

Accepted implementation breakpoints are expressed as viewport classes rather than device brands.

### Wide — approximately 1280 px and above

- persistent left application rail;
- one-row/compact graph toolbar where practical;
- optional results pane + dominant central graph + persistent right detail/editor;
- results pane may be collapsed independently;
- graph is the clear majority of the flexible workspace.

### Compact — approximately 900-1279 px

- application navigation remains available but may use a narrower rail or compact equivalent;
- results pane may remain beside graph only while graph stays dominant;
- detail/editor moves below the graph or becomes a drawer/overlay;
- graph should retain at least roughly 2.5x the width of an open results pane where both are side by side;
- toolbar may wrap into two compact rows.

### Narrow — below approximately 900 px

- one content column;
- graph appears first and uses full content width;
- results and detail/editor follow as explicit disclosures/drawers/stacked regions;
- large supporting panes never force horizontal page scrolling;
- graph controls become compact/icon-based where necessary;
- navigation rail becomes a compact mobile navigation mechanism.

Responsive transformation preserves semantic state, keyboard order and current selection/filter/focus intent.

## Knowledge exploration

Knowledge provides coordinated list/search, graph and detail representations over the same canonical identities.

### Spatial priority

The 3D graph is the **primary workspace** whenever graph mode is active. List/search and detail are supporting access/inspection regions.

Wide composition:

- compact workspace header and toolbar;
- optional/collapsible Knowledge list at the left;
- flexible central graph occupying the clear majority of remaining workspace;
- selected Knowledge detail at the right;
- graph workspace uses the available viewport height after shell/header/toolbars rather than a small fixed canvas.

Compact composition:

- list remains narrow/collapsible beside the graph when useful;
- graph remains primary;
- detail moves below the graph or opens as a drawer/overlay;
- no supporting pane may force the graph into a small card.

Narrow composition:

- graph uses full available content width;
- list and detail are explicit drawers/disclosures or ordered supporting sections;
- search/filter/settings remain reachable without horizontal overflow;
- non-graph list/search/detail remains fully usable.

In Curation Knowledge, **New Knowledge** and **Import** are toolbar actions that open focused authoring/import surfaces. They must not permanently occupy a large row above the graph.

### Graph control surface

Primary toolbar:

- Knowledge search;
- semantic-kind filter;
- relation-type filter;
- focus/clear focus;
- **Fit graph**;
- **Reset camera**;
- compact **Graph settings**.

Relation filtering uses a multi-select checklist/legend so several accepted relation types can be visible simultaneously; color may support but never replace the textual relation type.

Graph settings expose the accepted performance profiles and presentation-only controls from `docs/architecture/performance-capacity.md`. Expensive visual effects may be disabled without losing semantic access.


For the frontend prototype:

- a 3D node-link graph is implemented as an experimental first-class Knowledge view;
- Target Knowledge defaults the graph scope to nodes relevant to the selected LearningTarget;
- Curation may expose a broader/global graph;
- relation-type filters control accepted semantic relation types, initially `addresses` and `realizes`;
- semantic-kind filters control Concept / Mechanism / Procedure / Strategy visibility;
- focus mode reduces clutter to a selected node and a bounded neighborhood;
- relation direction and type remain legible without relying on geometry alone;
- node selection opens readable canonical detail without discarding graph state;
- Study Questions can deep-link into the graph focused on their aligned KnowledgeNodes.

Graph layout/camera state and performance-profile state remain presentation state. Geometric proximity and renderer quality settings are not semantic meaning.

The 3D prototype is compared with 2D/list baselines on concrete relational-learning tasks. Research shows potential value of node-link representations and, in some settings, 3D/immersive depth, but also known viewpoint, occlusion and disorientation costs; therefore 3D is not promoted to a product invariant before task evidence.

A future learner-state overlay may use opacity, size or other redundant encodings, but only after accepted learner-state semantics exist. Current review facts must not be converted into pseudo-mastery by visualization code.

## Import presentation

Import is presented from the relevant Library data kind rather than as a required global workspace.

Bulk import reports total/applied/rejected outcomes plus rejected-item identity and reason without representing partial success as total failure.

## Accessibility baseline

Core navigation/actions are keyboard accessible; focus is visible; labels do not depend on placeholders; semantic state does not depend on color alone; every graph task needed for core operation has a non-graph equivalent.

Any future state overlay must use a non-color-only redundant encoding.

## Remaining implementation freedoms

The accepted visual language above constrains role hierarchy, density, approximate metrics, shell composition and responsive workspace behavior.

Still downstream:

- exact CSS/layout mechanism;
- exact font provider/file as long as metrics remain equivalent;
- exact hexadecimal palette values within the accepted role/contrast relationships;
- concrete component library/provider;
- exact icon package within one coherent line-icon family;
- route implementation;
- animation/easing details that do not alter task semantics;
- virtualization/pagination implementation behind the bounded Knowledge results contract;
- exact narrow/mobile drawer/disclosure implementation;
- future learner-state overlay encoding after its semantics exist.

Repeated presentation roles must map through one provider/theme/token boundary rather than allowing each feature to invent an unrelated visual system.
