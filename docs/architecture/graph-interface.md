# Graph-first Interface Concept

## Primary interaction model

The semantic graph is the main exploratory surface of Prep. The default rich view is an interactive 3D graph whose nodes and edges can be rotated, zoomed, dragged and inspected.

## Visual semantics

- node appearance may encode node kind or selected overlay state;
- relation types have independently toggleable visibility and distinguishable presentation;
- learning state, plan membership and target scope are overlays rather than semantic graph fields;
- clusters/subgraphs can be isolated without copying or mutating the canonical graph.

## Core interactions

- search for a node;
- filter by areas, facets, node kinds and relation types;
- select one or more clusters/subgraphs;
- click a node to open its detail panel while preserving graph context;
- switch overlays such as semantic classification, learning plan and learning progress;
- create a learning target/plan from the current selection;
- save useful filtered views.

## Companion surfaces

A 3D graph is not sufficient for precise operation on large datasets. The product also requires search/list/filter and detail views as companion surfaces. They operate on the same selected graph/view model rather than forming a separate product.

## Mutation rule

The interface may collect feedback and change requests, but direct visual editing does not bypass graph admission. Dragging, coloring or filtering a node changes view state only.
