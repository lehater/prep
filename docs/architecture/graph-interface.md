# Graph-first Interface Concept

## Primary interaction model

The semantic graph is the main exploratory surface of Prep. The default rich view is an interactive 3D graph whose nodes and edges can be rotated, zoomed, dragged and inspected.

## Visual semantic modes

One visual channel must not encode two meanings simultaneously.

### Semantic mode

- node appearance encodes `kind`;
- edge appearance encodes relation `type`;
- relation types can be independently enabled/disabled;
- selected areas/facets/clusters reduce the visible graph.

### Learning mode

- node/edge appearance encodes learner-state overlay (`not_started`, `active`, `weak`, `stable`, `stale`);
- semantic kind remains available through shape/icon/detail/legend rather than competing color;
- plan membership/content coverage can be switched as separate overlays.

Exact colors/styles are presentation-system decisions. The semantic mapping above is the contract.

## Core interactions

- search for a node;
- filter by areas, facets, node kinds and relation types;
- select one or more clusters/subgraphs;
- click a node or relation to open detail while preserving graph context;
- switch among semantic, content-coverage, plan and learner-state overlays;
- create a learning target/plan from the current selection;
- save useful filtered views.

## Relation interaction

Relations are first-class selectable objects. The UI can:

- toggle entire relation types;
- inspect direction and semantic definition;
- show local neighborhoods limited to selected types;
- later display relation learning state when exercises explicitly test that relation.

## Companion surfaces

A 3D graph is not sufficient for precise operation on large datasets. Search/list/filter and detail views are required companion surfaces over the same graph/view selection.

## Mutation rule

The interface may collect feedback/change requests, but direct visual editing does not bypass graph admission.

Dragging, layout, coloring, filtering and cluster isolation change view state only.
