# Model Context Strategy

## Purpose

Define the independently modeled semantic languages required by the Prep MVP and the relationships between them.

This artifact does not define strategic investment classification, tactical entities, APIs, persistence, services, packages, UI areas, or deployment topology.

## Accepted model contexts

### MC-01 Preparation Information

Owns the semantic language of current preparation-related information.

Its scope includes:

- Goal;
- Capability;
- Knowledge;
- Practice Material;
- distinguishable kinds of Knowledge;
- distinguishable meanings of relationships;
- relationships among different kinds of preparation information.

These information kinds remain semantically distinguishable. Their distinction does not by itself require separate model contexts.

Preparation Information does not state what the person knows, can do, has mastered, or is ready for.

### MC-02 Recorded Activity History

Owns the semantic language of recorded activity and results as historical facts.

Its scope includes:

- a recorded fact that activity took place;
- a recorded result when one exists;
- temporal context;
- relationships to the information the activity concerned;
- historical context sufficient for retained records to remain understandable when related information later changes or is removed.

Recorded Activity History does not infer learner state, mastery, readiness, competence, or capability possession.

## Cross-context relationship contract

### TR-01 Preparation Information and Recorded Activity History

Recorded Activity History may relate recorded activity and results to Preparation Information.

The boundary must preserve:

- the distinction between current preparation information and historical facts;
- the meaning of referenced Preparation Information;
- the meaning of relationships between activity/results and the information they concern;
- sufficient historical context when referenced current information later changes or is removed;
- the rule that recorded facts do not redefine Preparation Information or imply learner-state conclusions.

The same exploration or product behavior may use both model contexts without creating a third semantic owner.

## Behaviors without independent model contexts

The MVP does not currently justify independent model languages for:

- introducing, retaining, changing, or removing information;
- exploring information from different perspectives;
- selecting information or material for external use;
- transferring selected information outside Prep;
- import, export, or integration mechanisms;
- external study, practice, review, or testing execution.

These behaviors operate over the accepted model contexts unless later evidence establishes independently evolving semantics.

## Contexts not independently justified

No separate model context is currently established for:

- Goal;
- Capability;
- Knowledge;
- Practice Material;
- relationship classification;
- learning or practice design;
- learner state or learner evidence;
- source/provenance management.

A distinction may later become an independent context only when it develops its own semantic language, lifecycle, or consumers that cannot remain coherent inside the current contexts.

## Boundary invariants

- Goal, Capability, Knowledge, and Practice Material remain semantically distinguishable.
- Knowledge presence does not state what the person knows.
- Capability meaning does not state that the person possesses that capability.
- Practice Material is usable in activity; Recorded Activity describes activity recorded as having occurred.
- Recorded activity/result is a historical fact, not a learner-state conclusion.
- Relationships may cross different information kinds.
- No fixed relationship topology or taxonomy is implied.
- Historical context must remain intelligible when related current information changes or is removed.
- Model contexts do not imply technical boundaries.

## Consumers

- Tactical Domain Design defines concepts, relationships, and invariants inside each accepted model context.
- Application Design orchestrates lifecycle, exploration, selection, transfer, and activity recording without redefining model semantics.
- Interface and Data Design must preserve the distinction between current preparation information and recorded historical facts.

## Reopening conditions

Revisit this strategy when:

- one Preparation Information kind develops independently changing semantics or consumers;
- relationship semantics require independently governed language;
- Recorded Activity and historical-context semantics cease to form one coherent model;
- external-use or information-lifecycle behavior develops durable domain semantics of its own;
- new accepted Product Requirements introduce another independently modeled language.
