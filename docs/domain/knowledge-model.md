# Knowledge Model

## Purpose

Define the reusable subject-knowledge semantics owned by the Knowledge Model bounded context without choosing persistence, visualization, document layout or study-runtime representation.

The model represents **knowledge objects and semantic relationships between them**. A graph is one possible projection of those semantics, not the domain definition.

## Core model

```text
KnowledgeNode
  id
  semantic_kind
  content

KnowledgeRelation
  id
  type
  source: KnowledgeNode
  target: KnowledgeNode
```

A `KnowledgeNode` is a reusable object of subject meaning with stable semantic identity.

A `KnowledgeRelation` is a first-class directional semantic assertion between two knowledge objects. Its type carries subject meaning; it is not a visualization edge.

The model does not require every answer fragment, literal value or sentence to become a node. Node granularity follows independently useful explanatory responsibility.

## Semantic identity

Semantic identity denotes continuity of the subject referent or reusable knowledge object.

Identity is independent of:

- label, aliases and wording;
- source location or document path;
- UI position or graph layout;
- learning target;
- learner state;
- question/card identity;
- external study-system identity.

Two similarly named objects are not identical merely because their labels overlap.

## Semantic forms

The current recurring semantic forms form a small controlled, extensible vocabulary. A new semantic kind is introduced only when it recurs, has a distinct explanatory responsibility and boundary, and reducing it to an existing kind would lose material meaning.

### Concept

Represents a stable notion, phenomenon, property, structure or named subject referent.

Primary explanatory question:

> What is this / what does this notion mean?

Examples: process, inode, file descriptor, virtual memory, signal, Unix permissions, cgroups.

### Mechanism

Explains how a phenomenon or behavior is produced through interaction of parts, rules or state.

Primary explanatory question:

> How does the system produce this behavior or effect?

Examples: virtual-address translation, process scheduling, systemd service activation.

A concrete implementation is **not automatically a mechanism**. `systemd` may be a concrete technology/concept; `systemd service activation` is a mechanism when the knowledge object explains how activation is produced.

### Procedure

Describes how an acting subject achieves a goal through actions, conditions and, where material, ordering.

Primary explanatory question:

> How does an actor obtain this result?

Examples: inspect disk usage, change file permissions, trace filesystem errors with strace.

This term is preferred over `Practice` inside Knowledge Model because learning practice belongs to Learning Design.

### Strategy

Defines principles for selecting and organizing actions across a class of situations, including subordinate procedures and material trade-offs.

Primary explanatory question:

> How should actions be selected and organized to pursue this goal across varying situations?

Examples: Linux server hardening, incident investigation, performance troubleshooting.

A strategy is not merely a long procedure. A procedure prescribes an actionable way to achieve a bounded result; a strategy guides choices among actions under varying conditions.

## Relational roles, not permanent node types

Some important distinctions are **relative between knowledge objects** and therefore must not be encoded as permanent mutually exclusive node kinds.

### Problem and solution

A knowledge object is a solution to a problem because it **addresses** that problem.

```text
Solution --addresses--> Problem
```

`problem` and `solution` are relational roles unless future evidence demonstrates an independently useful intrinsic semantic form.

The same knowledge object may address one problem while introducing, exposing or participating in another.

### Abstraction and implementation

A knowledge object is an implementation relative to an abstraction because it **realizes** that abstraction.

```text
Implementation --realizes--> Abstraction
```

Abstraction/implementation is therefore not a global level enum.

The same object may be a realization of a higher-level abstraction while itself defining an abstraction realized by lower-level objects.

Examples:

```text
Linux cgroups --realizes--> Resource isolation
epoll         --realizes--> Event-driven I/O notification
systemd       --realizes--> Init system
```

This preserves the distinction between transferable implementation-independent knowledge and knowledge of a concrete realization without forcing every node into one permanent abstraction level.

## Semantic relationship principles

Typed relationships are part of subject meaning and may create semantic roles.

The canonical relation vocabulary is controlled and extensible. Prep keeps `addresses` for its explicit problem/solution role and also admits the relation semantics previously evaluated in the Knowledge Graph project where they have clear directional boundaries.

| relation | direction | meaning |
|---|---|---|
| `addresses` | solution/response -> problem | source provides a solution, mitigation or response to the target problem |
| `uses` | user -> employed target | source functionally employs the target as a mechanism, tool, technology, service or method; this alone does not imply necessity |
| `specializes` | specific kind -> general kind | source is a narrower kind of the target |
| `part_of` | part -> whole | source is a constituent part of the target |
| `depends_on` | dependent -> dependency | source requires the target as a prerequisite; evidence must support necessity rather than mere use |
| `realizes` | concrete realization -> abstraction | source concretely implements, embodies or represents the target abstraction |
| `produces` | producer/activity -> output | source produces the target as an output or result |
| `derives_from` | derived entity -> source entity | source is semantically derived from the target |
| `enables` | enabler -> enabled capability/state | source materially makes the target possible or practically attainable without asserting universal hard dependency |

> **Relation-vocabulary status:** the table above is the current runtime/domain compatibility baseline, not the final leaf vocabulary. The canonical machine-readable classification and candidate-admission contract is `docs/domain/relation-classification-catalog.yaml`. Existing broad runtime types remain supported until representative corpus validation justifies migration; classification must not coerce new assertions into an imprecise legacy predicate.

These types are machine-readable Prep semantics. Their admission does not require Knowledge Graph V2 to restore a typed relation registry: current Knowledge Graph cards may keep human-facing explanatory wikilinks, while a Prep import/export boundary classifies a typed edge only when the source explanation supports one of the accepted meanings without adding a new material assertion.

A generic `related_to` relation remains insufficient canonical subject meaning. When available evidence does not distinguish an accepted type and direction, no typed edge should be invented.

Relations should not be duplicated as separate nodes merely to make them addressable.

## Example semantic chain

```text
[Resource contention / uncontrolled resource usage]
                    ^
                    | addresses
[Resource isolation]
                    ^
                    | realizes
[Linux cgroups]
       |
       +-- related semantic knowledge -->
           [How cgroups enforce resource limits] : Mechanism
           [Configuring CPU limits with cgroups] : Procedure
```

The important learning structure is preserved without claiming that Problem, Solution, Abstraction and Implementation form one flat taxonomy.

A useful explanatory traversal can therefore expose:

```text
WHY?          problem
WHAT IDEA?    implementation-independent solution/abstraction
HOW?          concrete realization and mechanism
HOW TO USE?   procedure
HOW TO CHOOSE/ORGANIZE? strategy
```

These are explanatory roles and forms, not mandatory layers for every subject.

## Boundary with Learning Design

Questions are owned by Learning Design. Knowledge Model exposes reusable `KnowledgeNode` identities that a question may reference as its supporting knowledge.

A question contains its own question text and direct answer text. Its knowledge references identify the reusable subject knowledge that explains the topic; they do not change Knowledge Model ownership.

Concrete facts, values, definitions, conditions and examples may be part of a `KnowledgeNode.content` when they belong to that reusable explanatory object.

Reusable requirements and competencies are owned by Learning Design. They may align to Knowledge Model identities without becoming subject knowledge.

## Ownership

Knowledge Model owns:

- stable semantic identity of reusable subject knowledge;
- semantic forms of reusable knowledge objects;
- typed semantic relationships and distinctions;
- explanatory meaning and coherence;
- implementation-independent and implementation-specific knowledge without conflating them;
- provenance or support needed to judge subject-semantic quality;

It does not own:

- learner evidence or inferred learner state;
- target-relative gaps or priorities;
- learning/diagnostic activities or scheduling;
- question/card lifecycle;
- import/extraction mechanics;
- UI or graph visualization.

## Invariants

- reusable subject meaning must not change because one learner succeeds or fails;
- learner observations cannot directly mutate subject truth;
- semantic identity is independent of presentation, target and external study-system identity;
- a KnowledgeNode is admitted when it has stable semantic identity, an independent explanatory responsibility, and usefulness beyond one concrete question, learner or learning target;
- a question's question text, answer text and knowledge references remain Learning Design semantics;- semantic form and relational role are distinct dimensions;
- `realizes` establishes abstraction/implementation roles relative to a pair of knowledge objects; neither role is a permanent global level;
- `addresses` establishes solution/problem roles relative to a pair of knowledge objects; neither role is a permanent global type;
- concrete technology is not automatically a mechanism;
- system behavior and actor action remain distinguishable: Mechanism explains how the system produces an effect; Procedure explains how an actor obtains a result;
- target alignment may reference reusable knowledge without taking ownership of subject meaning;
- learning artifacts may depend on knowledge objects without becoming canonical subject knowledge.

## Evidence from current stress testing

The current Linux interview-question corpus does not require answer-literal atomization.

Representative mappings remain coherent at reusable knowledge granularity:

```text
inode questions                    -> Inode : Concept
7 / 755 / rwx permission questions -> Unix permission representation : Concept
SIGTERM vs SIGKILL                 -> Unix signals : Concept
Linux boot                         -> Linux boot process : Mechanism
change permissions                 -> Changing file permissions : Procedure
strace filesystem diagnosis        -> Filesystem troubleshooting with strace : Procedure
secure a Linux server              -> Linux server hardening : Strategy
```

This is evidence for the current model boundary, not proof that these four semantic forms are complete.

## Research influence

1EdTech CASE supports separation of reusable competency/standards definitions from learning and assessment use, but Prep does not adopt the CASE schema.

Knowledge Space Theory supports separating discipline knowledge structure from an individual learner state; Prep does not currently adopt its mathematical representation.

Knowledge-component and Q-matrix research supports many-to-many mapping between assessment items and reusable knowledge requirements. Prep uses that separation principle without requiring Knowledge Components to be globally minimal atoms.

The previous Knowledge Graph project provides implementation evidence for stable semantic identity, explanatory responsibility, lightweight classification and questions derived from explanatory knowledge. Its graph-centered architecture is not treated as a premise of this model.

## Deferred input concerns

Source validation, provenance assessment, disagreement resolution and conflicting-input handling are outside Knowledge Model. Knowledge Model stores accepted subject semantics supplied to it; a future Knowledge Input / Acquisition context may own these concerns if a concrete product use case justifies that context.
