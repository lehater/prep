# Research: 3D Knowledge Graph as a learning interface

Status: research evidence and prototype hypothesis for Q-KNOWLEDGE-GRAPH-3D-VALUE. This is not a domain-model decision and does not make graph geometry semantic.

## Question

Where can an interactive 3D visualization of Prep's Knowledge Model provide user value, especially for learning, and what limitations must the frontend prototype test?

## Executive finding

There is good evidence for **relational visual representations** as learning/analysis aids, but much weaker evidence that **desktop 3D is generally superior to 2D**.

Therefore Prep should not treat the 3D graph as decoration or as the only Knowledge interface. It should treat it as a first-class experimental representation for tasks where spatial/relational structure is itself the information the learner needs to understand.

The strongest Prep-specific hypothesis is:

> A target-scoped Knowledge Graph can help the learner understand how reusable knowledge objects relate, while Study Questions provide retrieval practice. Linking a Question directly to its supporting Knowledge neighborhood can connect retrieval with relational understanding.

## Evidence: relational maps can support learning

Concept maps make relationships between information explicit. A 2024 meta-analysis covering 78 studies reported a strong positive overall association between concept-map use and academic achievement.

Research on concept-map design also shows that representation quality matters. Low salience of spatial structure can increase disorientation, and signaling, spatial contiguity and segmentation can improve learning in some conditions.

This means "show a graph" is not enough. Scope, filtering, salience and orientation are part of the learning design.

## Evidence: representation should fit the task

A cognitive-fit study comparing network representations found node-link diagrams superior for spatial/relational problem-solving tasks, while tables were better for symbolic tasks.

For Prep this argues for coordinated representations:

- graph for relational questions ("what connects to this and how?");
- list/search for locating a known item;
- readable detail for understanding the actual content;
- Study for retrieval/practice.

The graph should not replace text/detail simply because the data is relational.

## Evidence: 3D is not automatically better

Classic experiments comparing 2D and 3D interfaces found no general spatial-memory advantage from simply adding a third dimension; in one physical comparison 2D was better.

Modern 3D graph research likewise treats viewpoint selection, occlusion, crossings and overlap as significant problems. A 2024 experimental evaluation found that 3D graph layouts can offer high-quality viewpoints for some graph families, but the advantage depends on viewpoint/layout rather than "3D" alone.

A 2025 study of user-preferred 3D viewpoints found that stress, crossings, edge/node overlap and viewpoint orientation materially influence preference.

Immersive AR/VR research reports promising benefits for some 3D graph-analysis tasks, but those results should not be transferred uncritically to an ordinary desktop browser.

## Consequence for Prep

Implement 3D in the frontend prototype because it is a plausible and product-relevant hypothesis, not because research proves it superior.

Keep 2D/list/search/detail as comparison baselines and guaranteed non-graph access.

## Learning use cases

### 1. Target knowledge map

Scope the graph to KnowledgeNodes relevant to the selected LearningTarget.

Purpose:

- see the "shape" of required knowledge;
- understand which accepted semantic relations connect the nodes;
- move from one concept to nearby mechanisms/procedures/strategies;
- develop an integrated relational picture rather than isolated card knowledge.

This is the primary learning use case.

### 2. Question -> Knowledge Map

From a Study Question, "Show in Knowledge Map" focuses all KnowledgeNodes aligned to that Question.

The map then exposes the local neighborhood around those nodes.

Purpose:

- connect a retrieval item to broader reusable subject meaning;
- understand why the answer belongs in this conceptual context;
- discover nearby concepts/relations after retrieval.

This transition uses existing Question-to-Knowledge alignment. It does not create new domain semantics.

### 3. Focused neighborhood exploration

Large graphs should not always be shown at full density.

Select a node -> focus it -> show bounded neighborhood -> optionally expand.

This supports the evidence that complexity and weak spatial salience can create disorientation.

### 4. Relation-type exploration

Current foundational KnowledgeRelation types are:

- `addresses`;
- `realizes`.

The graph should let the learner toggle relation types and make direction/meaning explicit.

Future relation filters appear only when those relation types become accepted domain semantics.

### 5. Semantic-kind exploration

Filter/highlight:

- Concept;
- Mechanism;
- Procedure;
- Strategy.

This can support questions such as:

- "What is this?"
- "How does it work?"
- "How do I do it?"
- "How should I choose/organize actions?"

Semantic-kind visibility should not imply a strict hierarchy.

## Curation use cases

A broader/global graph can help a curator:

- inspect accepted relation structure;
- detect isolated or unexpectedly connected nodes;
- inspect relation-type distribution;
- navigate to canonical detail/editing;
- visually review a local neighborhood before changing relations.

Graph layout remains non-semantic and is not persisted as subject truth merely because a curator drags nodes.

## Proposed prototype composition

```text
Knowledge
┌──────────────────────────────────────────────────────────────┐
│ Search  [Kind] [Relation type] [Focus depth] [Reset]         │
├────────────────────────────────────────┬─────────────────────┤
│                                        │ Knowledge detail    │
│              3D graph                  │                     │
│                                        │ content             │
│                                        │ incoming/outgoing   │
│                                        │ relations           │
│                                        │                     │
└────────────────────────────────────────┴─────────────────────┘
```

List/search and graph are coordinated projections over the same canonical objects.

## Required interaction rules

- click without drag selects/open detail;
- drag/orbit/pan/zoom changes only presentation state;
- preserve camera/filter/focus state while opening detail;
- "focus" shows a selected node and bounded local neighborhood;
- "reset" returns to target/global scope;
- relation type and direction must be explicitly inspectable;
- filters must be reversible and visibly active;
- graph must have a non-graph equivalent for every core task;
- geometric distance must never be interpreted as semantic strength unless a future model explicitly defines it.

## 3D-specific risks

### Occlusion and crossings

Depth can reduce some 2D crossings but introduces node/edge occlusion from particular viewpoints.

Mitigation hypotheses:

- focus/local-neighborhood mode;
- fade non-focused edges/nodes;
- viewpoint reset/home;
- search-to-focus;
- relation filtering;
- selected-edge emphasis;
- labels/detail outside the canvas rather than labeling everything simultaneously.

### Viewpoint dependence

The apparent readability of a 3D graph changes with camera angle.

Mitigation hypotheses:

- stable initial layout and home viewpoint;
- predictable camera controls;
- one-click refocus on selection;
- preserving camera state across detail inspection;
- possibly automatic "good viewpoint" focus later, only if needed.

### Disorientation

Free 3D navigation can make users lose context.

Mitigation hypotheses:

- target scope always visible in surrounding UI;
- breadcrumb/focus indicator;
- selected node fixed in detail panel;
- reset view;
- limited local expansion rather than showing all global nodes;
- list/search always available as an anchor.

### False semantic inference

Users may read position, distance, size or centrality as domain meaning.

Mitigation:

- document/communicate that layout is presentation;
- encode only accepted semantics through explicit labels/legend/filters;
- do not use spatial axes as unexplained semantic dimensions.

## What to test

Compare 3D graph with a simpler baseline for the same concrete tasks.

Tasks:

1. Find all directly connected knowledge around a selected node and name relation types.
2. Explain how two visible nodes are related.
3. Starting from a Study Question, locate its supporting Knowledge and describe one nearby relation.
4. Filter to `realizes` or `addresses` and identify the remaining structure.
5. Leave a node, inspect another, then return to the first without losing orientation.
6. Find a known node using search/list versus spatial browsing.

Measure:

- correctness;
- time;
- navigation errors;
- number of resets/search fallbacks;
- perceived disorientation;
- qualitative usefulness for understanding relationships;
- preference only as secondary evidence, not proof of task benefit.

## Decision rule

Keep 3D prominent if it materially improves relational-understanding/exploration tasks or creates clear learner value not supplied by simpler representations.

If it is attractive but slower, confusing or unused, keep it as a secondary/exploratory mode rather than forcing the product around it.

If 2D performs better for core relational tasks, the product should preserve the graph concept while reconsidering dimensionality.

## Future overlays

The same target-scoped graph is a natural host for future layers such as:

- inferred learner-state overlay;
- learning/evidence coverage diagnostics for Curation;
- target-relative filtering;
- additional accepted semantic relation types.

None of those layers should be implemented as semantic truth before their upstream models exist.

## Sources

1. Izci, E., & Acikgoz Akkoc, E. (2024). The impact of concept maps on academic achievement: A meta-analysis. Heliyon 10(1), e23290. https://pubmed.ncbi.nlm.nih.gov/38163243/
2. Krieglstein, F. et al. (2022). How the design and complexity of concept maps influence cognitive learning processes. Educational Technology Research and Development 70, 99–118. https://pubmed.ncbi.nlm.nih.gov/35095237/
3. Krieglstein, F. et al. (2021). How organization highlighting through signaling, spatial contiguity and segmenting can influence learning with concept maps. Computers and Education Open 2, 100040. https://doi.org/10.1016/j.caeo.2021.100040
4. Huang, H.-S. et al. (2012). Effects of multidimensional concept maps on fourth graders' learning in web-based computer course. Computers & Education 58(3), 863–873. https://doi.org/10.1016/j.compedu.2011.10.016
5. Network visualization and problem-solving support: A cognitive fit study (2018). Social Networks 54, 162–167. https://doi.org/10.1016/j.socnet.2018.01.005
6. Cockburn, A., & McKenzie, B. (2004). Evaluating spatial memory in two and three dimensions. International Journal of Human-Computer Studies 61(3), 359–373. https://doi.org/10.1016/j.ijhcs.2004.01.005
7. van Wageningen, S., Mchedlidze, T., & Telea, A. (2024). An Experimental Evaluation of Viewpoint-Based 3D Graph Drawing. Computer Graphics Forum 43(3), e15077. https://doi.org/10.1111/cgf.15077
8. Show Me Your Best Side: Characteristics of User-Preferred Perspectives for 3D Graph Drawings (2025). Graph Drawing and Network Visualization. https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.GD.2025.37
9. Wang, X. et al. (2022). Understanding differences between combinations of 2D and 3D input and output devices for 3D data visualization. International Journal of Human-Computer Studies 163, 102820. https://doi.org/10.1016/j.ijhcs.2022.102820
10. Transforming graph data visualisations from 2D displays into augmented reality 3D space: A quantitative study (2023). Frontiers in Virtual Reality. https://www.frontiersin.org/journals/virtual-reality/articles/10.3389/frvir.2023.1155628/full
11. Evaluating user cognition of network diagrams (2021). Visual Informatics 5(4), 26–33. https://doi.org/10.1016/j.visinf.2021.12.004
