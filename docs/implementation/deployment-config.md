# Deployment and Configuration Contract

## Central Docker Compose services

```text
postgres
prep-api
prep-worker
```

Frontend production assets are built separately and served by `prep-api` (or a simple reverse proxy without changing the application contract).

No Redis/broker/graph database service exists in the reference v1 Compose file.

## Process commands

- API: application composition root + FastAPI ASGI server;
- worker: `python -m prep.worker`;
- migrations: explicit one-shot `alembic upgrade head`;
- admin password: `python -m prep.admin set-password --username admin`.

Deployment applies migrations before starting/restarting API and worker.

## Required configuration

Central:

```text
PREP_DATABASE_URL
PREP_PUBLIC_BASE_URL
PREP_SESSION_SECRET
PREP_LOG_LEVEL
PREP_JOB_POLL_INTERVAL
PREP_MODEL_PROVIDER
PREP_MODEL_API_KEY (when required)
PREP_MEDIA_ROOT (when listening/media is enabled)
```

Optional:

```text
PREP_OTEL_ENDPOINT
PREP_COOKIE_SECURE
PREP_CORS_ALLOWED_ORIGINS
```

CORS defaults to same-origin only.

## Local Bridge config

Stored in OS-appropriate user config with restrictive permissions:

```text
server_url
runtime_binding_id
bridge_token
ankiconnect_url = http://127.0.0.1:8765
poll_interval
```

Token is not committed to repository config.

## Volumes

PostgreSQL data and user-provided media/source volumes are explicit persistent mounts. Derived frontend assets/caches/jobs are reconstructable as defined by their owner.

## Development

Local development may run API/worker directly with a Compose PostgreSQL. Frontend uses Vite development server with API proxy/same-origin development configuration.

## Version pinning

Python dependencies live in `pyproject.toml` plus a reproducible lock; frontend dependencies live in `package.json` plus lockfile; Docker images use explicit major/minor or immutable digest policy before production release.
