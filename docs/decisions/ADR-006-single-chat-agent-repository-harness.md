# ADR-006 — Single chat agent with repository harness

Status: Accepted

## Context

`prep` is intended to be operated initially from a ChatGPT conversation rather than through a dedicated web or desktop application. The repository already acts as the durable system of record, while chat history is transient working context.

Without an explicit execution model, an agent can re-invent process, load excessive context, mix semantic reasoning with deterministic mechanics, or persist decisions only in chat.

## Decision

For Harness v0.1:

1. **ChatGPT chat is the initial user interface.** The user expresses intent in natural language.
2. **One chat agent is the coordinator/orchestrator.** Do not introduce specialist or supervisor agents until a concrete workflow demonstrates that one agent is insufficient.
3. **The repository is the system of record.** Durable state, decisions, plans, learning artifacts, schemas, tests, and validation rules live in the repository rather than in conversation history.
4. **The repository harness is the agent execution contract.** `AGENTS.md` is the stable entrypoint; detailed workflows, skills, policies, and operational instructions are discovered progressively from repository artifacts.
5. **Context is minimized per task/stage.** Load only task-relevant canonical rules and declared inputs. Do not scan or preload the whole repository. A completed stage hands durable information to the next stage through persisted artifacts instead of requiring the full previous reasoning trace.
6. **Agent reasoning and deterministic mechanics are separated.** The agent owns semantic interpretation, research, proposal, generation, and critique. Scripts/code own stable IDs, schemas, provenance, mechanical validation, migrations, synchronization, and external writes where deterministic behavior is available.
7. **Human gates remain explicit.** A workflow may stop for user review/approval where scope, trade-offs, or semantics require human judgment. A gate is a workflow property, not a separate agent.
8. **Skills are introduced only for reusable model-driven work.** Do not model every script, validator, or workflow step as a skill. A skill may use deterministic tools, but the tool remains a tool.
9. **Local Anki synchronization remains outside the cloud chat boundary.** The agent prepares repository artifacts; local deterministic sync scripts communicate with AnkiConnect on the user's machine.

## Conceptual execution model

```text
User
  -> ChatGPT chat
  -> single chat agent
  -> repository harness
       -> task-relevant workflow / skill / policy
       -> deterministic scripts / validators as needed
       -> human gate when required
  -> repository system of record

Repository artifacts
  -> local sync script
  -> AnkiConnect
  -> Anki Desktop
```

## Alternatives considered

### Multi-agent architecture from the start

Rejected for v0.1. It adds orchestration, handoff, state, and context-management complexity before a demonstrated need exists.

### Put the whole project context into every task

Rejected. It increases irrelevant context and makes task execution less predictable. Progressive disclosure is the default.

### Treat every operation as a skill

Rejected. Deterministic scripts and validators should remain explicit mechanics rather than being disguised as model reasoning.

### Make Anki the interactive backend of the chat agent

Rejected for the initial cloud-chat setup because local AnkiConnect is a machine-local integration. Repository state remains authoritative; local synchronization is a separate deterministic action.

## Consequences

- Future user journeys should be expressed as repository-backed workflows executed by one agent.
- Concrete workflows and skills can be added incrementally without changing this top-level interaction model.
- Each future workflow/skill should state the minimum inputs/context it needs and the artifact(s) it produces.
- Failures should first be addressed by improving repository instructions, tools, validators, or evals rather than by adding agents by default.
- A future dedicated UI or multi-agent topology requires a new decision if it changes these boundaries.
