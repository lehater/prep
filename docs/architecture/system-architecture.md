# System Architecture

## Purpose

Define the smallest Prep runtime and dependency topology that satisfies the accepted application, human-interface, machine-interface and consistency contracts for the current single-user slice.

This architecture owns runtime boundaries and dependency direction. Product/domain semantics, human-interface composition, machine-operation meaning, consistency rules and physical persistence representation remain with their upstream/downstream Authorities.

## Architecture driver closure

| Concern | State | Decision | Canonical basis |
| --- | --- | --- | --- |
| execution-mode | RESOLVED | Interactive browser work invokes foreground backend application operations. External review sync/export are explicit foreground operations; no background worker is required. | `docs/application/application-design.md`, `docs/interface/machine-interface.md`, `docs/interface/interaction-design.yaml` |
| consumers | RESOLVED | One user may perform Learning and Curation work through the browser. Prepared-data import and the external study runtime are machine-boundary consumers/collaborators, not separate product actors. | `docs/application/application-design.md`, `docs/interface/interaction-design.yaml`, `docs/interface/machine-interface.md` |
| load-volume-frequency | RESOLVED | The accepted scope is single-user interactive work plus explicit item-accounted bulk import. Collections are queried/paginated at the backend boundary; no independent high-throughput server workload is accepted. | `docs/application/application-design.md`, `docs/interface/machine-interface.md` |
| latency-freshness | RESOLVED | Browser queries observe current canonical state. Study export must detect preview drift instead of silently exporting changed material. No eventual-consistency user contract is introduced. | `docs/application/application-design.md`, `docs/interface/machine-interface.md` |
| availability | RESOLVED | External-runtime unavailability is isolated to operations that require it. Local canonical browsing/curation and already recorded evidence remain independently usable; no high-availability topology is required by accepted inputs. | `docs/interface/interaction-design.yaml`, `docs/interface/machine-interface.md` |
| recovery-durability | RESOLVED | Canonical mutations follow accepted validation/conflict outcomes. Import units are atomic and idempotent individually; peer valid items survive rejected items. Physical durable-storage technology remains Data Design. | `docs/architecture/import-consistency.md`, `docs/interface/machine-interface.md` |
| growth-horizon | RESOLVED | Current growth is handled through backend-side search/pagination and explicit bounded operations. Multi-user horizontal scaling, service sharding and distributed coordination are reopening conditions, not current drivers. | `docs/application/application-design.md`, `docs/interface/machine-interface.md` |
| deployment-environment | RESOLVED | Browser code executes in the browser; one Prep backend deployable owns application entrypoints and integration adapters. The supported Anki runtime remains external and may be reached from local/container deployment through deployment configuration. | `docs/interface/machine-interface.md` |
| concurrency | RESOLVED | Competing writes to the same stable identity must not create duplicates or silently last-write-wins; conflicts are surfaced. Bulk peers do not form one transaction. | `docs/architecture/import-consistency.md` |
| integration-boundaries | RESOLVED | Three explicit boundaries exist: browser ↔ Prep backend, prepared-data document → Prep backend, and Prep backend ↔ external study runtime adapter. The browser does not call Anki directly. | `docs/interface/machine-interface.md` |
| persistence-history | RESOLVED | Canonical modeled data and accepted ReviewObservations require durable backend-owned storage behind application/infrastructure boundaries. Concrete schema/store choice belongs to Data Design. | `docs/application/application-design.md`, `docs/interface/machine-interface.md` |
| security-trust-boundary | RESOLVED | External-runtime endpoint/API-key configuration remains backend/deployment configuration and is not browser product state. The current architecture introduces no multi-user identity/authorization semantics. | `docs/application/application-design.md`, `docs/interface/machine-interface.md` |

No baseline architecture-driver concern remains unresolved for the current scope.

## Runtime topology

```text
Browser runtime
  |
  | versioned browser/backend machine operations
  v
Prep backend runtime
  +-- application entrypoints / orchestration
  +-- canonical query and mutation ports
  +-- persistence ports --------------------> durable store (technology downstream)
  +-- prepared-data import adapter
  +-- external-study port ------------------> Anki adapter --> external Anki runtime
```

### Browser runtime

The browser runtime owns presentation and interaction state required by accepted interface contracts: current work context, exploration scope, focus, transient form input, loading/recovery state and currently displayed projections.

Those values do not become canonical product/domain state merely because the browser retains them during an interaction.

The browser invokes the versioned backend machine boundary. It does not:

- write directly to durable storage;
- become a second canonical source of truth;
- call Anki/AnkiConnect directly;
- own import identity, canonical conflict resolution or external-runtime reconciliation.

### Prep backend runtime

One backend runtime is sufficient for the current accepted drivers. It owns technical execution of application entrypoints and coordinates infrastructure adapters behind application-facing ports.

The backend runtime contains technical composition for:

- browser/backend operation dispatch;
- application use-case/query invocation;
- persistence adapter invocation;
- prepared-data decoding/application coordination;
- external-study adapter invocation.

A separate background worker, message broker, integration service or independent import service is not part of the current architecture because no accepted driver requires asynchronous background execution, independent scaling or independent deployment.

### External study runtime

Anki remains an external runtime behind the backend external-study port. Its availability is not a prerequisite for ordinary local canonical browsing/curation.

Explicit export, review-sync and runtime-status operations cross this boundary. Adapter-specific endpoint, API-key and representation details stay outside application/domain semantics.

## Deployment topology

The current topology has one Prep server deployable plus browser-delivered static code. The architecture does not require the static bundle and backend to have independent release/scaling lifecycles; they may be packaged together for the current deployment.

The external Anki runtime remains independently running because that independence is already part of the accepted machine boundary, not because Prep is decomposed into distributed services.

Reopen deployment topology when an accepted driver requires one of:

- multiple users or independent security boundaries;
- independent frontend/backend scaling or release lifecycle;
- background processing with durability requirements;
- remote external-runtime bridging;
- availability/failover guarantees beyond operation-level recovery.

## Interaction topology

### Browser ↔ backend

Use foreground stateless request/response interactions for the accepted browser operation IDs.

This fits the accepted interaction model because operations have explicit request inputs and visible success/failure outcomes, and no accepted behavior requires server-initiated push or a persistent bidirectional session.

Long-lived duplex channels or queued browser commands are reopening options if future accepted behavior introduces server push, collaborative presence, long-running asynchronous jobs or another material requirement.

### Backend ↔ external runtime

External study operations are foreground adapter calls initiated by explicit application operations:

- export reviewed study material;
- sync review facts;
- inspect runtime status.

An external failure returns through the accepted operation outcome model. The architecture does not mask it behind an invented background retry workflow.

## State placement

Canonical modeled data and ReviewObservations have one backend-side source of truth. The browser may cache/query/display representations, but it is not a competing authoritative replica.

Interaction-only state such as current mode, navigation context, exploration scope, Knowledge focus and unsaved form input is browser-local unless a future accepted capability explicitly makes such state durable/shared.

Study-preview identity is the accepted machine-boundary materialization token used to detect drift. It is not promoted into a new durable canonical Study Set entity.

## Dependency direction

The dependency direction is inward toward accepted application/domain contracts:

```text
browser presentation
    -> browser/backend machine contract
        -> application orchestration
            -> domain semantics

backend infrastructure adapters
    -> application ports

Anki adapter
    -> external-study port
    -> application orchestration
```

Framework, transport, persistence and Anki-specific types must not become required dependencies of domain semantics or redefine application behavior.

System Architecture does not select concrete frontend component boundaries or persistence schema.

## Failure isolation

### External runtime

External-runtime outage/incompatibility is an integration failure domain. It affects operations that require that runtime while preserving:

- local canonical browsing and curation;
- an already built study preview;
- already recorded review evidence;
- correction/retry context.

### Prepared-data import

Import failure isolation follows the accepted consistency contract:

- envelope-level decoding failure rejects the request;
- after envelope acceptance, each item is an independent atomic unit;
- invalid items do not roll back valid peers;
- no item may be partially applied;
- concurrent duplicate/conflicting identity handling must preserve uniqueness and surface conflicts.

These correctness semantics are consumed from Concurrency/Consistency Design; System Architecture only places the enforcement behind the backend application/infrastructure boundary.

## Rejected structural alternatives

The reviewed decision space rejected the following current-scope alternatives because they either violate accepted boundaries or add complexity without an accepted driver:

- browser-owned canonical persistence/application execution;
- browser-direct Anki integration;
- dual-master browser/backend canonical state;
- dedicated background worker or message broker;
- independently scaled frontend/backend/services as a required topology;
- persistent browser/server duplex as the default interaction model;
- framework- or Anki-specific dependencies flowing into application/domain semantics;
- whole-bulk rollback or partially applied import items.

They remain legitimate reopening alternatives if upstream requirements change.

## Non-goals

This architecture does not decide:

- concrete HTTP route/verb mapping;
- frontend framework, component tree or visual layout;
- whether Knowledge presentation is graph, list, tree, table or mixed;
- database technology, schema or migration mechanics;
- Anki scheduling semantics;
- multi-user authentication/authorization;
- background jobs not required by an accepted capability.

## Consequences

The current system remains deliberately simple: one canonical backend execution boundary, browser-local interaction state, explicit adapter seams and foreground request/response orchestration.

This keeps downstream freedom for Data Design and Frontend System Architecture while preventing those layers from inventing a second source of truth, hidden asynchronous workflows or direct external-runtime coupling.
