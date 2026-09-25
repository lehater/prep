# System Architecture

## Architecture driver closure

Accepted drivers for the current scope:

- Prep is a browser-based web application.
- Frontend and backend run as separate Docker containers.
- Initial deployment is local.
- The first version is single-user. User/tenant isolation and multi-user authentication are intentionally deferred, while later introduction of users must remain possible without changing domain meaning.
- The architecture must not depend on local-only assumptions that prevent later remote deployment.
- Canonical domain/application behavior executes behind the backend boundary.
- Human interaction is delivered by the browser frontend.
- Bulk prepared-data exchange and Anki integration follow accepted Machine Interface contracts.
- The first automated Anki integration is backend-to-AnkiConnect HTTP; endpoint location is deployment configuration.
- Local development may run Anki Desktop on the Docker host while the Prep backend runs in a container; the container-to-host route is infrastructure configuration, not application semantics.
- Import idempotency and item-level consistency follow Import Consistency.
- Canonical data must survive ordinary process/container restarts through durable persistence.
- Backup/restore and long-term recovery are deliberately deferred for the early architecture-evolution period; no current requirement justifies a backup subsystem.

The current data/trust boundary is one user's Prep installation and its configured external learning runtime. The backend does not need tenant-aware authorization or row-level ownership in the first version.

No accepted driver currently requires microservices, distributed domain ownership, queues, asynchronous workers, or independent scaling of model contexts.

### Driver classification

| Concern | State | Current decision / rationale |
|---|---|---|
| execution-mode | RESOLVED | Browser frontend and backend are separate Docker runtime boundaries. |
| consumers | RESOLVED | First version serves one Prep user/data scope; multi-user operation is future scope. |
| load-volume-frequency | DEFERRED | No accepted scale/load target currently changes the single-backend topology; measure before introducing scaling machinery. |
| latency-freshness | DEFERRED | No accepted latency or freshness SLO currently changes topology; interactions are ordinary user-driven web/application operations. |
| availability | DEFERRED | Local single-user early versions have no HA/failover/uptime requirement; adding availability machinery now would not satisfy an accepted need. |
| recovery-durability | RESOLVED | Canonical data survives ordinary restarts; backup/restore and long-term recovery are deliberately deferred. |
| growth-horizon | DEFERRED | Later remote/multi-user use is anticipated, but no accepted growth target justifies speculative scaling topology now. |
| deployment-environment | RESOLVED | Initial local Docker deployment with separate frontend/backend; boundaries must remain usable for later remote deployment. |
| concurrency | RESOLVED | Current material concurrency is repeated/concurrent import identity handling defined by Import Consistency; no multi-user concurrency semantics are required. |
| integration-boundaries | RESOLVED | Prepared-data exchange is versioned; automated Anki v1 uses backend-to-AnkiConnect behind a transport-independent external-runtime boundary. |
| persistence-history | RESOLVED | Canonical model data and append-oriented ReviewObservations are durable; broader audit/version history is not required. |
| security-trust-boundary | RESOLVED | Current trust scope is one local user/deployment plus configured Anki endpoint; no tenant authorization boundary exists in v1. Network exposure remains deployment configuration and must not broaden this trust assumption silently. |

All baseline concerns are classified for the current scope. Deferred concerns are non-material to the selected topology until a corresponding requirement is accepted.

## Runtime topology

```text
Browser
   |
   v
Frontend container
   |
   | backend machine interface
   v
Backend container
   |
   +--> durable persistence
   |
   +--> supported external learning runtime adapter --> Anki
```

Frontend and backend are separate deployable runtime boundaries. Domain model contexts are not separate deployables merely because they have distinct semantic ownership.

## Frontend boundary

The frontend owns browser-side interaction realization of accepted Human Interface contracts.

It may own ephemeral presentation state, form state, navigation state and cached server projections. It does not own canonical Knowledge, Learning Design, Learner Model, import consistency or persistence truth.

All canonical mutations pass through backend application/machine contracts.

## Backend boundary

The backend is one application/runtime boundary for the current scope.

It hosts:

- application use cases;
- Knowledge Model;
- Learning Design;
- Learner Model;
- machine-interface endpoints;
- import validation/orchestration;
- external-learning-runtime adapter orchestration;
- persistence access through owner-respecting ports/repositories.

Internal modules preserve model-context dependency boundaries without network separation.

## External integration boundary

Anki interaction is isolated behind an adapter implementing the accepted external-learning-runtime contract.

The first concrete adapter is AnkiConnect. The backend, not the browser, invokes it. In the local development topology Anki Desktop may run on the Docker host and the backend container reaches the configured host endpoint. Docker host-gateway naming, AnkiConnect bind address, port and API key are deployment configuration.

AnkiConnect is not the architectural identity of the external-learning-runtime boundary. File exchange and a future local bridge/add-on remain possible alternative adapters when deployment constraints require them.

Anki's native sync service, including a self-hosted sync server, may be used to support the Anki environment but is not Prep's machine API: Prep does not couple application behavior to the Anki sync protocol.

Anki identifiers, schemas and transport behavior do not leak into canonical domain models.

## Dependency direction

```text
transport/UI adapters
        |
        v
application
        |
        v
domain/model contexts
        ^
        |
persistence/external adapters implement required ports
```

Infrastructure depends on canonical contracts; canonical domain semantics do not depend on Docker, database technology, frontend framework or Anki transport libraries.

## Deployment

The initial Docker deployment contains at least frontend and backend containers. Durable persistence may be embedded in or attached to the backend deployment according to Data Design/Implementation Design; this architecture does not yet choose a database product or require a third database container.

Local deployment and later remote deployment preserve the same logical frontend/backend boundary. Hostnames, TLS termination, reverse proxy and production orchestration are deployment/operability decisions unless later constraints make them architecture-significant.

## Import correctness realization

Backend execution must expose a technical identity boundary capable of enforcing accepted import idempotency under repeated/concurrent requests. Physical uniqueness and transaction mechanisms are delegated to Data Design.

## Non-goals

Current architecture does not introduce:

- microservices per bounded context;
- message broker/event bus;
- distributed transactions;
- background job infrastructure;
- independent frontend ownership of canonical business state;
- direct browser access to persistence;
- direct UI-to-Anki integration bypassing backend application semantics;
- multi-user/tenant isolation or user-owned partition keys in canonical records;
- backup scheduling, backup retention, point-in-time recovery, or restore workflows.

## Reopening conditions

Revisit topology if accepted requirements introduce backup/recovery objectives, multiple users/tenants, independent scaling, long-running/asynchronous work, offline-first synchronization, stronger availability targets, remote Anki interaction constraints, a requirement to automate against Anki without a reachable AnkiConnect endpoint, or materially different trust/security boundaries.
