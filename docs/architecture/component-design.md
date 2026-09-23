# Component Design

## Backend modular monolith

Target Python component structure by responsibility, not framework:

```text
prep.graph
  domain
  application
  persistence ports

prep.curation
  application
  semantic-analysis ports

prep.learning
  domain/application for targets/plans/evidence

prep.interview
prep.listening
  subject bounded contexts

prep.runtime
  publication/reconciliation application contracts

prep.readmodel
  graph/search/overlay query services

prep.interface
  HTTP command/query adapters

prep.infrastructure
  postgres
  model_provider
  media/asr
```

Domain/application modules depend inward; infrastructure and HTTP adapters depend on ports.

## Worker

Worker uses application use cases through the same composition root. Job handlers do not bypass domain/application boundaries.

## Local bridge

Separate small Python application/package:

```text
bridge
  server_client
  ankiconnect_adapter
  reconciliation_loop
  local_config/credentials
```

It contains no graph/learning domain policy.

## Frontend

```text
app shell
graph explorer
detail panel
plan/progress
curation
runtime/sync
settings
shared API client/query state
graph renderer adapter
```

Frontend never imports persistence models.

## Composition

Concrete adapters are selected in composition roots. Cross-context integration uses stable IDs/contracts rather than importing another context's aggregates.
