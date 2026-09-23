# ADR-012 — Integrate Anki through a local desktop bridge

Status: Accepted

## Context

AnkiConnect runs inside Anki Desktop and binds to localhost by default. AnkiWeb already synchronizes a collection across desktop and mobile clients.

A server-side Prep service therefore cannot reliably treat each learner device as a directly callable Anki API endpoint.

## Decision

Use this integration topology:

```text
Prep Service
    ^
    | authenticated outbound connection / polling
    v
Prep Local Bridge
    |
    v
AnkiConnect @ localhost
    |
    v
Anki Desktop
    |
    v
AnkiWeb sync
    |
    +--> AnkiMobile / AnkiDroid / other desktop clients
```

- One designated bridge is active writer/observer for one Anki profile/collection at a time.
- The bridge communicates outbound to Prep; no inbound exposure of AnkiConnect is required.
- Prep owns desired content/publication identity; Anki owns scheduling/review state.
- Review history is ingested through AnkiConnect and deduplicated by runtime review identity.
- Other devices are observed indirectly after their reviews synchronize into the collection.

## Consequences

- Multiple Anki devices do not create competing direct Prep integrations.
- AnkiConnect remains localhost-only by default.
- The bridge must tolerate Anki being closed/offline and reconcile later.
- AnkiWeb remains an external synchronization dependency but not a Prep API.
