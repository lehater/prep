# Domain Strategy

## Purpose

Define Prep's strategic problem-space responsibilities for the MVP. This artifact establishes only responsibilities whose semantic meaning and evolution justify independent strategic attention. It does not define model contexts, tactical structures, APIs, persistence, UI, or technical decomposition.

## Strategic subdomain landscape

### DS-01 Preparation Information — CORE

Owns the problem-space responsibility for preparation-related information other than retained activity-history facts, and for meaningful relationships among that information.

This includes knowledge, goals, capabilities, practice material, their relevant distinctions, distinguishable kinds of knowledge, relationship meanings, and relationships that may connect different kinds of information. It also owns the semantic basis that allows the same information to be understood and explored from different perspectives.

Introducing, retaining, changing, and removing this information and its relationships are lifecycle behaviors over this responsibility. They do not establish a separate strategic subdomain.

**Derived from:** `REQ-CAP-INTRODUCE-INFORMATION`, `REQ-CAP-RETAIN-INFORMATION`, `REQ-CAP-CHANGE-INFORMATION`, `REQ-CAP-REMOVE-INFORMATION`, `REQ-CAP-KNOWLEDGE-KINDS`, `REQ-CAP-RELATIONSHIP-MEANINGS`, `REQ-CAP-CROSS-INFORMATION-RELATIONSHIPS`, `REQ-CAP-EXPLORE-PERSPECTIVES`.

**Why CORE:** Prep's differentiating responsibility is making a growing body of preparation information and its relationships understandable without collapsing distinct meanings or prescribing one fixed structure.

### DS-02 Recorded Activity History — CORE

Owns the problem-space responsibility for recorded preparation activity and results as historical facts.

This includes when activity occurred, what information it concerned, and enough historical context for those facts to remain understandable when related information later changes or is removed.

Recorded activity and results do not establish what the person knows, can do, has mastered, or is ready for.

**Derived from:** `REQ-CAP-RECORD-ACTIVITY`, `REQ-CAP-RELATE-ACTIVITY`, `REQ-CAP-PRESERVE-TIME`, `REQ-CAP-PRESERVE-HISTORY-CONTEXT`, `REQ-CAP-EXPLORE-HISTORY`.

**Why CORE:** accumulated activity and result history has semantics and lifecycle distinct from the current preparation information it references, especially when that information changes over time.

## Strategic relationship constraints

- Preparation Information owns current preparation-related meaning; Recorded Activity History owns facts about activity that took place.
- Recorded Activity History may refer to Preparation Information but does not redefine it.
- Recorded activity or a recorded result is not learner-state evidence or a capability conclusion.
- Changes or removal of current Preparation Information must not make already retained activity history unintelligible.
- Relationships may connect different kinds of Preparation Information and do not imply a fixed topology or representation.
- Exploration may combine both responsibilities without collapsing their distinct meanings.

## Product behaviors without independent strategic ownership

The current MVP does not justify separate strategic subdomains for:

- selecting part of information or material;
- making a selection available outside Prep;
- import, export, integration, or transfer mechanisms;
- external study, practice, review, or testing execution.

Selection and external-use behavior operate on Preparation Information. Transfer and external execution are product/application concerns unless durable domain rules emerge later.

## Consumers

- Model Context Strategy consumes both strategic responsibilities to decide which independently modeled semantic languages are required and how they relate.
- Tactical Domain Design consumes the model-context decisions that refine these responsibilities into coherent domain semantics.
- Application Design consumes the accepted semantic boundaries while orchestrating lifecycle, exploration, selection, transfer, and recorded-history behavior without redefining domain ownership.

## Explicitly not established

The MVP does not establish strategic responsibilities for:

- learner state;
- mastery, readiness, or competence assessment;
- information verification or source authority;
- provenance, citation, or source management;
- fixed knowledge taxonomy;
- fixed relationship topology;
- product-owned external learning or assessment runtime.

## Reopening conditions

Revisit the decomposition when:

- one kind of Preparation Information develops independently changing semantics or consumers that no longer remain coherent within one strategic responsibility;
- selection or external-use semantics acquire their own durable rules or lifecycle;
- recorded activity and historical interpretation cease to change coherently as one responsibility;
- information lifecycle behavior acquires independently valuable domain semantics beyond operating on Preparation Information;
- new accepted product capabilities introduce additional problem-space responsibilities.
