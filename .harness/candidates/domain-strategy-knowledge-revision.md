# Domain Strategy

## Purpose

Define Prep's strategic problem-space responsibilities from accepted product capabilities. This artifact decides investment and isolation attention only. It does not define bounded contexts, model-language applicability, tactical domain objects, relation taxonomies, services, APIs, storage, interface form, or deployment units.

## Strategic subdomain landscape

### DS-01 Preparation Direction — CORE

Owns the problem-space responsibility for maintaining a usable preparation direction: the active target, explicit uncertainty about that target, target-relative next focus, and adaptation of that direction as accepted evidence or target information changes.

**Derived from:** REQ-CAP-TARGET, REQ-CAP-FOCUS, REQ-CAP-ADAPT.

**Why CORE:** this responsibility directly expresses Prep's differentiating promise: deciding what the learner is preparing toward and what deserves attention next under uncertainty.

**Concrete consumers:** Model Context Strategy must decide where this language is modeled; Application Design must later orchestrate target/focus/adaptation behavior.

### DS-02 Learner Evidence and State — CORE

Owns the problem-space responsibility for contextualized learner evidence and evidence-bounded conclusions about current target-relative capability, including demonstrated, challenged, and unknown state.

**Derived from:** REQ-CAP-EVIDENCE-CONTEXT, REQ-CAP-STATE, REQ-CAP-ADAPT.

**Why CORE:** evidence-backed state is required to avoid equating exposure or activity with capability and is central to trustworthy preparation decisions.

**Concrete consumers:** Model Context Strategy must decide the applicable model language and relationships; downstream application behavior consumes accepted learner-state conclusions without redefining their evidence basis.

### DS-03 Subject Knowledge — CORE

Owns the problem-space responsibility for reusable subject meaning needed to orient and teach within a domain: important concepts, meaningful relationships among them, the currently relevant subject scope, and coherent movement between overview and deeper detail.

**Derived from:** REQ-CAP-KNOWLEDGE-OVERVIEW, REQ-CAP-KNOWLEDGE-RELATIONSHIPS, REQ-CAP-KNOWLEDGE-SCOPE, REQ-CAP-KNOWLEDGE-DEPTH.

**Why CORE:** accepted product behavior now requires Prep to help the learner understand the structure of unfamiliar subject knowledge itself, not merely manage preparation around external learning material. Preserving concept and relationship meaning across scope/depth changes is therefore part of the differentiating learning value.

**Concrete consumers:** Model Context Strategy must decide whether Subject Knowledge is independently modeled and how it relates to Preparation Direction, Practice Enablement and Learner Evidence; Tactical Domain Design must later decide the actual subject semantics without importing presentation choices.

### DS-04 Practice Enablement — SUPPORTING

Owns the problem-space responsibility for enabling or delegating learning, practice, and diagnostic activity that can produce target-relevant evidence.

**Derived from:** REQ-CAP-PRACTICE, REQ-CAP-EVIDENCE-CONTEXT.

**Why SUPPORTING:** Prep must support the activity contract, but the execution runtime may remain external and no specific question, card, exercise, or study mechanism is part of the accepted core product meaning.

**Concrete consumers:** Model Context Strategy decides whether this responsibility needs independent modeling; Application Design later decides orchestration with internal or external activity execution.

### DS-05 Preparation Bootstrap — SUPPORTING

Owns the problem-space responsibility for turning fragmented or incomplete source material into enough usable preparation support to begin work and for allowing supporting knowledge data to be introduced or corrected incrementally without making corpus maintenance a learner obligation.

**Derived from:** REQ-CAP-BOOTSTRAP, REQ-CAP-TARGET.

**Why SUPPORTING:** bootstrap and corpus evolution are necessary to make the core preparation and Subject Knowledge responsibilities usable from imperfect inputs, but current accepted behavior does not establish an independently valuable curation product, mandatory curator/operator actor, or separate corpus-management lifecycle.

**Concrete consumers:** Model Context Strategy decides whether bootstrap requires an independent model language or remains a translation boundary; Application Design later decides how incomplete source material and accepted maintenance enter the flow.

## Strategic relationship constraints

- Preparation Direction decides target-relative purpose and focus; it may select which Subject Knowledge is currently relevant but does not own reusable subject truth.
- Subject Knowledge owns reusable concept and relationship meaning independent of a particular learner's current evidence state or a specific interface representation.
- Learner Evidence and State may reference Subject Knowledge semantics when interpreting evidence, but learner observations do not mutate reusable subject truth.
- Practice Enablement may consume Preparation Direction and Subject Knowledge and may produce observations/evidence, but it does not itself own target, subject-truth, or learner-state semantics.
- Preparation Bootstrap may introduce or correct candidate supporting knowledge from sources, but accepted reusable subject meaning remains a Subject Knowledge responsibility.
- Corpus maintenance is not currently assigned to the learner and is not yet an independently classified strategic subdomain.
- None of these strategic subdomains implies a service, package, database, graph database, UI area, graph visualization, or bounded context.

## Explicitly not established by current evidence

The accepted product capabilities do **not** independently justify strategic subdomains for:

- a standalone corpus-curation/authoring product;
- a mandatory curator/operator workflow;
- a graph or spatial visualization system;
- spaced-repetition or retention scheduling;
- a standalone quality-control system;
- a production import subsystem.

These may appear only if later accepted product behavior or domain evidence creates an independently changing strategic responsibility.

## Reopening conditions

Revisit the strategic decomposition when:

- target definition/focus/adaptation acquire independently changing strategic responsibilities;
- evidence capture and learner-state interpretation become independently valuable responsibilities with separate lifecycle or consumers;
- Subject Knowledge orientation, relation meaning, scope control, and depth no longer form one coherent strategic responsibility;
- practice execution becomes a product-owned differentiator rather than an enable/delegate responsibility;
- corpus authoring/curation gains an accepted actor, independently valuable workflow, lifecycle, or product capability distinct from bootstrap;
- new accepted product capabilities establish retention, quality-control, import, or other independent strategic responsibilities.
