# Top-level System Landscape

## Purpose

Define black-box responsibilities and information flow without selecting deployment units or technologies.

## Logical responsibilities

```text
Sources / imports
      |
      v
Knowledge Curation
      | accepted semantic delta
      v
Knowledge Graph Core
      |
      +--> Graph-first UI
      |
      +--> Learning Coordination <--> Domain learning contexts
                                  |
                                  v
                           Study-system integration
                                  |
                                  v
                                Anki
                                  | review evidence
                                  v
                          Learning Coordination
                                  |
                                  v
                        progress/gap graph overlay
```

## Responsibilities

### Knowledge Graph Core

Own canonical nodes, relations, classification and evidence.

### Knowledge Curation

Transform source/import material into proposed graph deltas and enforce controlled admission.

### Learning Coordination

Own target scopes, learning plans, publication intent, learning evidence and graph-level progress projections.

### Domain learning contexts

Own domain-specific learning objects and generation/evaluation semantics. Current contexts are Interview Preparation and English Listening.

### Study-system integration

Translate domain/application projections into external runtime operations and reconcile observed state. AnkiConnect is the first adapter.

### Graph-first UI

Provide graph exploration, filtering, node details, plan selection and overlays without owning semantic truth.

## External systems

- Anki / AnkiConnect;
- media tooling such as ffmpeg;
- ASR providers such as Whisper;
- source files/documents and future connected sources;
- LLM/model providers used for semantic proposals.

## Explicitly deferred

Service/process decomposition, database selection, property-graph technology, API style, frontend framework, deployment topology and messaging strategy are outside this top-level landscape.
