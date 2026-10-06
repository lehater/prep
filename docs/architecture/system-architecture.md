# System Architecture

## Purpose

Define the smallest runtime and dependency topology that can realize the accepted Application, Human Interface, Machine Interface and consistency contracts without promoting implementation choices or obsolete integration mechanics into architecture truth.

## Architecture driver closure

| Concern | State | Accepted architectural consequence |
|---|---|---|
| runtime-boundaries | RESOLVED | Human-interface realization is separated from canonical application/domain ownership by accepted interface and machine contracts. One application runtime may host the application and domain/model-context responsibilities; semantic contexts are not separate runtimes by default. |
| deployment-topology | RESOLVED | No accepted driver requires microservices, per-context deployables, queues, or a particular container count. Logical boundaries must remain deployable without changing semantic ownership; concrete packaging is downstream. |
| interaction-model | RESOLVED | Human-interface consumers invoke transport-neutral Machine Interface operations and bounded continuation semantics. Synchronous or asynchronous transport is permitted only when observable semantic outcomes/currentness remain equivalent. |
| state-placement | RESOLVED | Canonical target/Knowledge/Learning/Learner state remains behind its semantic owners on the application side. Human-interface clients may hold ephemeral presentation/navigation/cache state but do not become canonical owners. |
| dependency-direction | RESOLVED | Interface adapters depend on machine/application contracts; application depends on domain/model-context semantics; persistence/external-runtime adapters implement inward-facing ports/contracts. |
| failure-isolation | RESOLVED | Dependency/runtime failure is isolated from semantic acceptance. `DEPENDENCY_UNAVAILABLE` / nonsemantic operational failure do not fabricate accepted mutation; already accepted historical facts are preserved. |
| scale/availability/numeric latency | DEFERRED | No accepted upstream target currently requires distributed scaling, HA, failover, or a numeric SLO. |
| persistence technology | DOWNSTREAM | Data Design owns durable representation; database engine/schema/tool selection remains downstream unless a future accepted driver makes it architecture-significant. |
| external-runtime provider | DOWNSTREAM | A supported external learning runtime is an adapter boundary, not a provider-specific architecture identity. |

There is no unresolved architecture-driving Question that requires a more complex topology for the current scope.

## Runtime topology

```text
Human Interface client
        |
        | accepted Machine Interface
        v
Application runtime
        |
        +--> domain/model-context semantics
        |
        +--> persistence port ------> persistence adapter
        |
        +--> external-runtime port -> optional supported runtime adapter
```

This is an architectural responsibility topology, not a commitment to process count, Docker/container count, HTTP, RPC, database product, or one external provider.

## Human-interface boundary

The human-interface side realizes accepted Conceptual Interface, Information Architecture, Interaction and Topology semantics.

It may own ephemeral:

- navigation and view state;
- form/draft state;
- local interaction state;
- cache/projection state that can be reconstructed from canonical sources.

It must not independently own or infer canonical Knowledge, Capability, learner evidence/state, target requirements, Gap semantics, or preparation-support truth.

## Application/runtime boundary

The application runtime is the canonical execution boundary for accepted application operations and bounded Application Processes.

It coordinates semantic owners but does not collapse them into one aggregate model. Internal module boundaries preserve Authority/model-context ownership without requiring network separation.

The application runtime exposes accepted machine-consumed behavior through the Machine Interface boundary. Transport/controller/framework choices remain downstream.

## Persistence boundary

Canonical state is accessed through application/domain-facing persistence ports. Data Design decides physical durable representation and consistency realization.

Architecture does not choose:

- relational versus non-relational storage;
- database product;
- table/schema layout;
- ORM;
- migration tooling;
- cache topology unless a later driver requires one.

## External-runtime boundary

Selected preparation support may execute in Prep or in a supported external runtime.

External runtime integration is isolated behind an adapter boundary that preserves:

- semantic activity-attempt correlation;
- actual assistance/conditions where known;
- attributable result/provenance;
- accepted outcome/currentness semantics.

No concrete provider, protocol, host route or synchronization service is part of canonical architecture. Provider-specific mechanics remain adapter/deployment concerns.

## Interaction and failure topology

Accepted operations may be realized synchronously or asynchronously, but:

- a semantic operation retains its accepted identity/currentness contract;
- transport/job identity never becomes Process/domain identity;
- stale dependent mutations return `STALE_BASIS` rather than applying silently;
- external dependency failure remains distinguishable from semantic rejection;
- preparation-support partial results preserve independently accepted owner-scoped meaning;
- accepted historical learner facts are not rolled back because later evidence inference fails.

Material atomicity/retry/idempotency rules are owned by Import Consistency; physical realization is owned by Data Design.

## Dependency direction

```text
human-interface adapters
        |
        v
machine/application contracts
        |
        v
application
        |
        v
domain/model contexts
        ^
        |
persistence and external-runtime adapters
```

Frameworks, storage engines, renderer/provider libraries and transport protocols depend on accepted contracts rather than defining them.

## Non-goals

Current architecture does not establish:

- microservices per model context;
- message broker/event bus;
- distributed transactions;
- a production import/curation subsystem;
- Question/card or Anki-specific architecture;
- direct human-interface access to persistence;
- human-interface ownership of canonical semantic state;
- concrete database, transport, container or orchestration technology;
- automatic retry infrastructure;
- multi-user/tenant security topology;
- HA/failover/backup architecture absent accepted requirements.

## Reopening conditions

Revisit System Architecture if accepted upstream knowledge introduces material requirements for multiple users/tenants, remote trust boundaries, independent scaling, long-running/asynchronous work with independent lifecycle, offline synchronization, stronger availability/recovery targets, external-runtime constraints that change topology, multiple authoritative stores, or another architecture-driving deployment constraint.
