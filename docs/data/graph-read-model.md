# Logical Graph Read Model

## Purpose

Support interactive graph exploration without making presentation/query optimizations the semantic source of truth.

## Required query shapes

### Search

Find nodes by canonical label, aliases and searchable semantic content. Ranking strategy is not yet fixed.

### Bounded subgraph

Return a bounded graph around:

- selected NodeIds/RelationIds;
- area/facet filters;
- node kinds;
- relation types;
- TargetScope/LearningPlan membership;
- derived cluster membership.

The UI must not require loading the entire global graph to work.

### Neighborhood expansion

Expand from visible nodes by selected relation types and bounded depth/size.

### Detail

Return one node/relation with current assertions, classification, important neighbors and evidence references.

### Path / topology analysis

Support relation-constrained paths and topology facts needed for explanation/analysis. Exact algorithms are later choices.

### Overlay join

Join semantic subjects with:

- content coverage;
- plan membership;
- learner state;
- synchronization/problem state when relevant.

## Revision coherence

A semantic graph result identifies the GraphRevision it represents.

Learner/content overlays identify their own projection revision/time. The UI may combine independently refreshed layers, but their version tuple must be inspectable so stale overlays are not mistaken for semantic inconsistency.

## Derived clusters

Clusters produced by topology/embedding/analytics are read-model results, not canonical semantic truth. Algorithm/version parameters must be identifiable when a cluster is saved/reused.

## Pagination/bounding

Every large traversal must support an explicit bound/continuation strategy. Unbounded “load all nodes/edges” is not a required contract.

## Rebuildability

The read model is derived. Loss or recreation may affect availability/performance but must not lose canonical graph or learner evidence.
