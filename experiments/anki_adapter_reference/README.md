# Anki adapter reference implementation

**Status: maintained noncanonical reference implementation.**

This package preserves the previously exercised AnkiConnect transport and generic note/deck reconciliation code so future Prep backend work can reuse proven mechanics instead of reimplementing them from scratch.

It is deliberately located under `experiments/` rather than `src/` because Prep does not currently have a canonical backend implementation. This code must not be treated as Product, Domain, Application, Machine Interface or System Architecture authority.

## Retained mechanics

- dependency-free AnkiConnect v6 HTTP envelope/client;
- typed connection/API failure handling;
- deck creation;
- safe NoteType creation/evolution;
- stable external-id lookup with exact post-search verification;
- note upsert while preserving existing Anki scheduling identity/state;
- tag preservation/addition;
- media upload;
- unit tests for transport and reconciliation behavior.

## Reuse rule

When backend implementation begins, adapt this code behind the then-current accepted `ExternalStudyRuntimePort` / Machine Interface contract. Do not copy historical Interview Preparation, QuestionType, LearningTask or Prep Card prototype semantics into production.

## Validation

The repository CI runs:

```text
python -m unittest discover -s experiments/anki_adapter_reference/tests -v
```

These tests validate the reference mechanics only. They do not assert that this package itself is a current production adapter.
