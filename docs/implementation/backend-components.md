# Backend Component Contract

## Selected stack

- Python 3.13;
- FastAPI interface layer;
- Pydantic v2 DTO/config validation;
- SQLAlchemy 2.x synchronous ORM/Core;
- psycopg 3 synchronous PostgreSQL driver;
- Alembic migrations;
- pytest + Hypothesis for Python verification.

Sync-first persistence is deliberate. External/background concurrency belongs in durable jobs/adapters rather than forcing async through the domain/application model.

## Package shape

```text
src/prep/
  graph/
    domain/
    application/
    ports/
  curation/
    application/
    ports/
  learning/
    domain/
    application/
    ports/
  interview/
    domain/
    application/
    ports/
  listening/
    domain/
    application/
    ports/
  runtime/
    application/
    ports/
  readmodel/
    application/
    ports/
  interface/
    http/
      routers/
      dto/
      dependencies/
  infrastructure/
    postgres/
      orm/
      repositories/
      queries/
      uow/
    model_provider/
    media/
    asr/
    anki/
  composition/
  worker/
  admin/
```

Local bridge is separate:

```text
src/prep_bridge/
  server_client/
  ankiconnect/
  reconcile/
  config/
  main.py
```

## Dependency rules

- domain imports only standard-library/domain code;
- application imports domain + ports;
- HTTP DTOs/Pydantic models never become domain entities;
- SQLAlchemy models stay under infrastructure;
- repositories translate ORM rows to domain/application records;
- cross-context references use IDs/contracts, not another context's aggregate classes;
- composition roots are the only normal place that selects concrete adapters.

## Transaction boundary

HTTP command/application service opens one UnitOfWork per authoritative transaction. Application service decides commit/rollback. Repository methods do not commit independently.

Queries/read-model operations may use read-only sessions without domain aggregate materialization when projection semantics allow it.

## Framework freedom

Routers, SQLAlchemy mappings and React client generation may be changed without changing domain contracts. Exact internal helper functions/classes are implementation freedom as long as package/dependency rules and public ports remain intact.
