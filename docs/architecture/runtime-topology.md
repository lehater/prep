# Runtime Topology

## Central runtime

v1 central deployment:

```text
Browser
   |
   v
Prep Application/API (Python)
   |
   +---- PostgreSQL
   |
   +---- durable job/outbox tables
              ^
              |
        Prep Worker (Python)
```

Application and worker are separate processes from one modular-monolith codebase.

The frontend is built as static browser assets and may be served by the application or a simple reverse proxy.

## Local Anki runtime

```text
Prep Local Bridge (Python)
      | outbound HTTPS
      v
Prep Application
      |
      + local call -> AnkiConnect :8765 -> Anki Desktop -> AnkiWeb
```

The bridge runs on the machine hosting the designated Anki Desktop profile.

## English media execution

Media/ASR jobs run in the worker environment that has access to the required media. For a local/self-hosted deployment this may be the same machine/volume; remote media-worker distribution is not required in v1.

## No initial distributed platform

No Kubernetes, microservice mesh, Redis or external message broker is required.

Docker Compose is the reference self-hosted deployment envelope for central application + worker + PostgreSQL. The local bridge remains a separate desktop process because it needs localhost AnkiConnect access.

## Scale-out path

Application/worker processes may be replicated later behind stable DB/job/port contracts. Specialized media workers or graph/read stores can be introduced without changing bounded-context ownership.
