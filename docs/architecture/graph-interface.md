# Graph-first Interface Concept

## Primary interaction model

The semantic graph is the main exploratory surface of Prep. The default rich view is an interactive 3D graph whose nodes and edges can be rotated, zoomed, dragged and inspected.

## Node detail/card

Selecting a KnowledgeNode opens a persistent detail surface while keeping graph context visible.

The detail surface is a projection of canonical node semantics:

- canonical label/aliases;
- kind/areas/facets;
- current accepted KnowledgeAssertions;
- important typed Relations/neighborhood;
- evidence/provenance access;
- selected learning/content overlays.

It is not an Anki card.

## Visual semantic modes

One visual channel must not encode two meanings simultaneously.

### Semantic mode

- node appearance encodes `kind`;
- edge appearance encodes relation `type`;
- relation types can be independently enabled/disabled;
- selected areas/facets/derived clusters reduce the visible graph.

### Learning mode

- node/edge appearance encodes learner-state overlay (`not_started`, `active`, `weak`, `stable`, `stale`);
- semantic kind remains available through another visual channel/detail/legend;
- plan membership/content coverage are separate overlays.

Exact colors/styles are later presentation-system decisions.

## Selection meanings

- `Area` — canonical classification;
- `DerivedCluster` — computed grouping;
- `SavedView` — stored inspection/filter state;
- `TargetScope` — explicit learning scope.

A visible cluster/filter does not become learning intent until explicitly converted/selected as TargetScope.

## Core interactions

- search;
- filter by areas/facets/kinds/relation types;
- isolate derived clusters/arbitrary subgraphs;
- inspect node/relation details;
- switch semantic/content/plan/learning overlays;
- create TargetScope/LearningPlan from selection;
- save views independently from learning intent.

## Relation interaction

Relations are first-class selectable objects: relation-type toggles, direction/meaning inspection, typed neighborhood exploration and relation learning overlays are supported conceptually.

## Companion surfaces

3D is insufficient for precision on large datasets. Search/list/filter/detail remain first-class companion surfaces over the same selection model.

## Mutation rule

UI feedback/change requests enter graph admission. Dragging, layout, coloring, filtering and cluster isolation mutate ViewState only.
