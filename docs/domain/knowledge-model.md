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

The current recurring semantic forms are deliberately small and extensible.

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

Currently accepted foundational relations:

| relation | meaning |
|---|---|
| `addresses` | source provides a solution, mitigation or response to the target problem |
| `realizes` | source is a concrete or narrower realization of the target abstraction |

Additional relation types such as dependency, composition, participation, causal explanation or usage require demonstrated recurring semantics and clear boundaries before becoming canonical.

A generic `related_to` relation is not sufficient canonical subject meaning.

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

## Question boundary

Questions, exercises and cards are not canonical Knowledge Model entities merely because they refer to knowledge.

Learning Design may map a question to the knowledge required to answer it:

```text
Question
  prompt
  requires: KnowledgeNode[]
```

The semantic meaning of `requires` is:

> Which reusable knowledge must a learner command to answer this question substantively and correctly?

It does **not** mean:

> Which minimal atomic fact is the literal answer?

Therefore a question such as “What does 7 mean in Unix permissions?” may require the reusable knowledge object `Unix permission representation`; the model need not create a canonical node whose identity is the literal value `7`.

A broad question may require several knowledge objects. A personal or meta interview question may require no subject-knowledge node.

Questions do not reference `KnowledgeRelation` by default. Relations remain internal subject semantics; Learning Design depends on them only when a learning requirement genuinely concerns the relationship itself.

## Requirement / competency boundary

A reusable statement of expected knowledge or knowledge-based capability may be referenced by learning targets when it has meaning beyond one target.

Such a requirement may align to one or more knowledge objects but is not identical to learner state or a target-relative gap.

Whether reusable competency definitions remain inside Knowledge Model is still open; target-specific requirements belong to Learning Design.

## Ownership

Knowledge Model owns:

- stable semantic identity of reusable subject knowledge;
- semantic forms of reusable knowledge objects;
- typed semantic relationships and distinctions;
- explanatory meaning and coherence;
- implementation-independent and implementation-specific knowledge without conflating them;
- provenance or support needed to judge subject-semantic quality;
- reusable requirement/competency definitions only where they have target-independent meaning.

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
- node admission must not force every literal answer fragment into an artificial knowledge atom;
- semantic form and relational role are distinct dimensions;
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

## Open questions

- whether `Concept | Mechanism | Procedure | Strategy` are sufficient recurring semantic forms or should remain a partially controlled extensible vocabulary;
- whether `Strategy` and `Method` need distinct semantics;
- which additional relation types have genuine recurring subject semantics;
- whether reusable competency definitions have enough target-independent identity to remain in Knowledge Model;
- how provenance, disagreement and conflicting claims affect acceptance of reusable knowledge;
- what exact admission test determines when explanatory material deserves an independent KnowledgeNode.
