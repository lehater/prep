# Graph Representation Evidence Review

## Purpose

Review existing visualization/HCI/learning evidence before implementing Prep's Knowledge Representation Experiment.

Question: what should Prep actually test when deciding whether knowledge should be explored through textual/domain-specific views, a 2D node-link graph, or a 3D node-link graph?

This is a research synthesis, not product policy. Product decisions still require Prep-specific evidence.

## Sources reviewed

### Graph-task and evaluation frameworks

- Lee et al., *Task Taxonomy for Graph Visualization* (BELIV 2006), DOI: 10.1145/1168149.1168168.
- Brehmer and Munzner, *A Multi-Level Typology of Abstract Visualization Tasks* (IEEE TVCG 2013), DOI: 10.1109/TVCG.2013.124.
- Munzner, *A Nested Model for Visualization Design and Validation* (IEEE TVCG 2009), DOI: 10.1109/TVCG.2009.111.
- Lam et al., *Empirical Studies in Information Visualization: Seven Scenarios* (IEEE TVCG 2012), DOI: 10.1109/TVCG.2011.279.
- Filipov et al., *Are We There Yet? A Roadmap of Network Visualization from Surveys to Task Taxonomies* (Computer Graphics Forum 2023), DOI: 10.1111/cgf.14794.
- Burch et al., *The State of the Art in Empirical User Evaluation of Graph Visualizations* (IEEE Access 2021).

### Representation comparisons

- Ghoniem et al., *A Comparison of the Readability of Graphs Using Node-Link and Matrix-Based Representations* (InfoVis 2004; extended 2005).
- Okoe, Jianu and Kobourov, *Node-Link or Adjacency Matrices: Old Question, New Insights* (IEEE TVCG 2019).
- Lee et al., *TreePlus: Interactive Exploration of Networks with Enhanced Tree Layouts* (IEEE TVCG 2006), DOI: 10.1109/TVCG.2006.106.
- van Ham and Perer, *Search, Show Context, Expand on Demand: Supporting Large Graph Exploration with Degree-of-Interest* (IEEE TVCG 2009), DOI: 10.1109/TVCG.2009.108.
- Plaisant et al., *SpaceTree: Supporting Exploration in Large Node Link Tree* (InfoVis 2002).
- Dörk et al., *PivotPaths: Strolling through Faceted Information Spaces* (IEEE TVCG 2012), DOI: 10.1109/TVCG.2012.252.

### Knowledge-graph consumers and learning

- Li et al., *Knowledge Graphs in Practice: Characterizing their Users, Challenges, and Visualization Opportunities* (IEEE TVCG 2024), DOI: 10.1109/TVCG.2023.3326904.
- Nesbit and Adesope, *Learning With Concept and Knowledge Maps: A Meta-Analysis* (Review of Educational Research 2006), DOI: 10.3102/00346543076003413.
- Schroeder et al., *Studying and Constructing Concept Maps: a Meta-Analysis* (Educational Psychology Review 2018), DOI: 10.1007/s10648-017-9403-9.
- Anastasiou et al., *The Effectiveness of Concept Maps on Students' Achievement in Science: A Meta-Analysis* (Educational Psychology Review 2024), DOI: 10.1007/s10648-024-09877-y.

### 3D-specific evidence

- Ware and Franck, *Evaluating Stereo and Motion Cues for Visualizing Information Nets in Three Dimensions* (ACM TOG 1996), DOI: 10.1145/234972.234975.
- Huang, Pfister and Yang, *Is Embodied Interaction Beneficial? A Study on Navigating Network Visualizations* (Information Visualization 2023), DOI: 10.1177/14738716231157082.
- Kwon et al., *A Study of Layout, Rendering, and Interaction Methods for Immersive Graph Visualization* (IEEE TVCG 2016).
- van Wageningen et al., *An Experimental Evaluation of Viewpoint-Based 3D Graph Drawing* (Computer Graphics Forum 2024), DOI: 10.1111/cgf.15077.
- Joos et al., *Show Me Your Best Side: Characteristics of User-Preferred Perspectives for 3D Graph Drawings* (Graph Drawing 2025 / JGAA 2026).

## Findings

### F1 — graph utility is task-dependent, not representation-global

The graph-visualization literature consistently classifies tasks rather than declaring one representation globally superior.

The recurring task classes are:

- topology: adjacency, accessibility, common connection, path/connectivity;
- attribute-based lookup/filtering;
- browsing/exploration;
- overview/structure estimation.

This supports Prep's task-first premise and argues against asking a participant whether "the graph is useful" as a single question.

### F2 — node-link diagrams have a known strength for paths, not for every relational task

Controlled studies summarized by Burch et al. show a recurring pattern:

- node-link diagrams tend to perform well for path-related tasks on modest/sparse graphs;
- matrices can outperform node-link diagrams for dense graphs, common-neighbor/group tasks, and several lookup/count tasks;
- performance changes materially with graph size and density.

Therefore a Prep study that includes only path tasks would bias the experiment toward graph success.

### F3 — a strong non-graph baseline is required

Li et al.'s study of real knowledge-graph practitioners identifies limited efficacy of node-link diagrams for KG Consumers and explicitly calls for domain-specific visualizations and digestible knowledge-card-like representations.

For Prep, R0 must therefore be a credible product alternative:

- search;
- structured concept cards/list;
- typed relation list/table;
- detail;
- explicit textual path/relationship explanation where appropriate.

A deliberately weak flat list would not answer the product question.

### F4 — progressive disclosure is already a well-supported graph-exploration pattern

TreePlus, SpaceTree, and degree-of-interest work all challenge the "show the whole graph first" assumption.

TreePlus uses a start-node-and-expand pattern and reported increasing advantage over a traditional graph interface as density increased. "Search, show context, expand on demand" similarly treats local relevance and controlled expansion as central to large-graph exploration.

Implication for Prep: the graph candidate should be search/focus/expand-oriented, not a static hairball. Full overview may remain a separate task/view.

### F5 — benchmark graph-reading tasks are necessary but insufficient for Prep

Visualization evaluation literature distinguishes user-performance benchmark studies from insight/sensemaking studies.

Prep's product claim is stronger than "the user can find a path quickly". The product is intended to support understanding and learning.

Therefore representation validation needs two layers:

1. controlled graph-reading/navigation tasks;
2. domain sensemaking/learning tasks, including explanation, reconstruction, recall and transfer.

### F6 — learning literature supports concept maps, but active construction matters

Meta-analyses find positive learning effects for concept/knowledge maps, but the effect varies by use.

The 2018 meta-analysis reports a larger effect for constructing maps than merely studying them. This does not mean Prep should let users mutate canonical semantic truth. It does mean a passive "look at the graph" task is a weak test of learning value.

Prep should include active cognitive work such as:

- reconstruct a relation chain after the view is hidden;
- explain why relations matter;
- select the concepts required to explain a mechanism;
- transfer the learned structure to a new scenario.

### F7 — classic 3D advantages do not transfer automatically to ordinary desktop 3D

Ware and Franck's classic positive 3D results relied on strong depth cues including stereo and motion/head-coupled viewing.

Later immersive studies also often obtain benefits from VR/embodied interaction, not merely from adding a z-axis.

Huang et al. show that benefits depend on task and interaction/display condition; immersive/embodied conditions can help some whole-network tasks while adding overhead for others. Their desktop 2D and desktop 3D conditions did not establish a broad accuracy/time advantage for desktop 3D.

Therefore Prep must not use VR/stereo evidence as evidence that a mouse-controlled WebGL graph will be better.

### F8 — viewpoint selection is part of the 3D problem

Recent 3D graph work emphasizes that 3D graph quality is viewpoint-dependent. A poor initial viewpoint can hide structure that exists in the layout.

For a reproducible Prep study:

- layout coordinates must be deterministic/frozen per fixture revision;
- initial camera/viewpoint must be deterministic;
- camera movements must be logged;
- reset must restore the same viewpoint;
- a renderer's random force simulation must not silently produce a new experimental condition on each run.

### F9 — exact visual parity is not the same as a fair product comparison

A scientifically pure experiment might try to vary only dimensionality. A product experiment asks which plausible interface helps the user.

For Prep, each condition should be competent in its own medium while sharing the same semantic information budget and core actions. We should not intentionally remove a basic 3D navigation aid merely because R0 has no camera, nor give R2 semantic information that R0 cannot access.

The causal claim should remain modest: "this candidate interface worked better for this task", not "the third dimension itself caused the benefit".

### F10 — matched tasks and counterbalancing are established practice

TreePlus used a within-subject repeated-measures design with equivalent graph/task sets and counterbalanced interface order to control learning/order effects.

Prep's existing matched-bundle design is therefore directionally sound, but bundle equivalence must be checked before interpreting results.

## Consequences for Prep's experiment

### Change 1 — split validation into two stages

**Stage A — representation mechanics**

Test:

- locate/filter;
- adjacency;
- common connection;
- path/connectivity;
- browsing/orientation;
- overview where relevant.

Measure accuracy, completion, time/interactions, help, orientation loss.

**Stage B — learning/sensemaking**

After exploration, hide the representation and test:

- explain typed/directional relations;
- reconstruct a local structure/path;
- recall key concepts/relations;
- apply the structure to a new payment-processing scenario.

Measure semantic correctness and transfer, not visual preference.

### Change 2 — strengthen R0

Use:

```text
R0 = search + structured concept cards/list + typed relation table + detail
R1 = R0 + 2D graph exploration
R2 = R0 + 3D graph exploration
```

The graph must beat a good textual/domain-specific interface.

### Change 3 — make graph interaction focus-first

Default graph interaction:

```text
search -> select -> local context -> expand on demand -> return/recover
```

Do not make "understand a 200-node hairball" the normal task.

### Change 4 — separate overview/dense tasks

Small/local topology and dense/global overview are different task families.

A graph that helps paths at 30-60 visible nodes may still be poor for global overview at 200 nodes. Record results separately rather than averaging them into one "graph score".

### Change 5 — treat 3D as a challenger, not as an assumed peer/default

Build the task battery and R0/R1 interaction model first.

R2 should reuse the validated task/evidence infrastructure. Do not spend substantial product-design effort on 3D controls before the measurement pipeline and 2D baseline are trustworthy.

This sequencing does not pre-judge 3D; it reduces wasted work and avoids debugging the study and the 3D interaction model simultaneously.

### Change 6 — add a pilot before evidence runs

Run an unscored pilot to verify:

- task instructions are understandable;
- bundles are similar enough;
- answer rubrics discriminate correct/partial/incorrect;
- layouts/viewpoints are stable;
- event logging captures the intended interactions;
- no condition exposes hidden semantic information unavailable elsewhere.

Pilot data must not be mixed with decision evidence.

## What this research does not establish

The literature does **not** establish whether Prep should use a graph as its primary Knowledge UI.

It also does not establish that 2D will beat 3D, or vice versa, for Prep's payment-processing knowledge model.

The evidence supports a better experiment design and raises the burden of proof for desktop 3D. Prep-specific user evidence is still required.

## Recommended next step

Before Figma or React implementation:

1. define the exact Stage A task battery;
2. define Stage B explanation/reconstruction/transfer questions and scoring rubric;
3. define a strong R0 information design;
4. define deterministic fixture/layout/viewpoint rules;
5. then design the screen/state inventory around those tasks.
