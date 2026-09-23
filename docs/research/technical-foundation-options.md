# Technical Foundation Options

Date: 2026-09-23
Status: evidence used by accepted technical design

## Anki topology

Current Anki documentation states that AnkiWeb synchronizes one collection across desktop/mobile devices and merges normal multi-device changes after initial setup.

AnkiConnect exposes its API from the running desktop Anki process and binds to `127.0.0.1:8765` by default. It exposes note/card operations and review-history operations such as `cardReviews` / `getReviewsOfCards`.

Consequences:

- Prep should not model every phone/laptop as an independently managed Anki server.
- Prep needs a local bridge colocated with an Anki Desktop + AnkiConnect instance.
- AnkiWeb remains responsible for propagating the resulting collection/scheduler state to other Anki clients.
- Review telemetry can be ingested through AnkiConnect from the synced desktop collection.

Sources:

- https://docs.ankiweb.net/syncing.html
- https://github.com/cjappl/anki-connect/blob/master/README.md

## Persistence options

### PostgreSQL-first

PostgreSQL 18 provides recursive CTE/query facilities suitable for bounded graph traversals. The project also needs relational/personal state, transactional GraphRevision changes and audit/history.

`pgvector` provides exact and approximate vector search (HNSW/IVFFlat), useful for candidate identity resolution and derived clustering without making similarity semantic truth.

Sources:

- https://www.postgresql.org/docs/18/queries.html
- https://github.com/pgvector/pgvector

### PostgreSQL + Apache AGE

Apache AGE adds property-graph/Cypher semantics inside PostgreSQL and has a PostgreSQL 18 release. It is a viable future optimization if Cypher/native graph traversal produces clear value.

Sources:

- https://age.apache.org/
- https://age.incubator.apache.org/download/

### Neo4j

Neo4j provides a native property-graph model, Cypher and ACID transactions. It is strong when deep/irregular graph traversal dominates, but introducing it now would either split authoritative state across stores or push unrelated learner/runtime state into the graph database.

Sources:

- https://neo4j.com/docs/cypher-manual/current/introduction/
- https://neo4j.com/docs/query-api/current/transactions/

## 3D graph rendering

`react-force-graph` exposes 2D/3D/VR/AR React components. Its 3D implementation uses Three.js/WebGL and supports node dragging, camera navigation, node/link click/hover, directional arrows and custom Three.js objects.

The standalone `3d-force-graph` project is actively maintained and MIT licensed.

Sources:

- https://github.com/vasturiano/react-force-graph
- https://github.com/vasturiano/3d-force-graph

## Resulting direction

Use a deliberately simple first architecture:

- PostgreSQL as the only authoritative database;
- plain relational node/edge/assertion/history tables initially;
- pgvector for similarity/search assistance;
- no Neo4j/AGE until benchmarked graph queries demonstrate a need;
- browser application with React/TypeScript and react-force-graph-3d;
- local bridge for AnkiConnect;
- purpose-built HTTP JSON command/query API;
- modular monolith + worker rather than microservices/message broker.

This preserves graph semantics while minimizing operational state and cross-store consistency.
