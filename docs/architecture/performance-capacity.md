# Performance and Capacity Design

## Purpose

Set engineering envelopes sufficient to validate the chosen architecture without pretending they are product SLAs.

## Backend data envelope

Technical validation targets:

- 100,000 KnowledgeNodes;
- 1,000,000 Relations;
- several KnowledgeAssertions per node;
- millions of learner review/evidence events over long-term use.

These are deliberate headroom targets for a personal/small-team knowledge system, not expected initial data volume.

## Interactive graph envelope

The UI never renders the full backend graph by default.

Target modes:

- normal interactive view: up to ~2,000 visible nodes / ~10,000 edges;
- stress view: up to ~5,000 nodes / ~25,000 edges;
- larger scopes use filtering, clustering, search and progressive neighborhood expansion.

Target interaction is approximately 30 FPS or better during ordinary navigation on a modern desktop at normal view size; the application may reduce labels/effects/layout work under stress.

## Query budgets

Representative bounded graph/search/detail queries should target sub-second user-visible response; common cached/indexed operations should normally complete in a few hundred milliseconds on the reference deployment.

Exact p95 budgets are finalized after the first representative benchmark suite, before implementation is considered production-ready.

## Background work

Semantic extraction, embedding, ASR and media processing are background jobs; they optimize throughput/retryability rather than interactive latency.

## Benchmark gates

Before adding a specialized graph store, benchmark PostgreSQL using representative:

- 1-hop/2-hop typed neighborhoods;
- bounded variable-depth traversal with cycles;
- filtered TargetScope subgraph;
- node detail/evidence lookup;
- text/vector candidate search;
- progress overlay join.

Before replacing the selected renderer, benchmark representative 1k/2k/5k-node views.
