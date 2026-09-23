# Authentication and Session Contract

## Human session

v1 uses one local application user while retaining LearnerId.

### Login

`POST /api/v1/auth/login` accepts username/password over TLS (or localhost development). Password is verified with Argon2id.

On success:

- create `auth_session` with random 256-bit session secret stored only as a hash;
- set `prep_session` HttpOnly, SameSite=Lax, Secure when TLS;
- return a per-session CSRF token in response data.

### CSRF

Every unsafe cookie-authenticated request requires `X-CSRF-Token` matching the server-side session token/hash. Origin/Host checks are defense-in-depth, not the only CSRF control.

### Session lifecycle

- idle expiry: 7 days;
- absolute expiry: 30 days;
- logout/revocation invalidates server-side session;
- password change invalidates all existing human sessions.

Exact durations are configuration values with these defaults.

## Bootstrap user

No default password exists.

Reference deployment creates/resets the local administrator through an explicit operational command executed against the central app environment:

```text
python -m prep.admin set-password --username admin
```

Password is read interactively/stdin rather than stored in Compose YAML.

## Bridge authentication

Local Bridge does not use browser sessions.

A curator creates a scoped bridge token once. Server stores only its hash and associates it with one `RuntimeBinding`. Requests use:

```text
Authorization: Bearer <bridge-token>
```

Token scope permits bridge endpoints for that binding only. Token rotation/revocation is explicit.

## Authorization roles

v1 user may hold `learner` and `curator` capabilities. Route dependencies enforce capabilities; UI hiding is not authorization.

## Required persistence

- `app_user`;
- `auth_session`;
- token hash/metadata in `runtime_binding`;
- administrative audit event for token creation/revocation and curation decisions.
