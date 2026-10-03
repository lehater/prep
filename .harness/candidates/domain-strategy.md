# Domain Strategy

## Purpose

Define Prep's strategic problem-space responsibilities from accepted product capabilities. This artifact decides investment and isolation attention only. It does not define bounded contexts, model-language applicability, tactical domain objects, services, APIs, storage, or deployment units.

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

**Concrete consumers:** Model Context Strategy must decide the applicable model language and relationships; downstream application behavior consumes the accepted state without redefining its evidence basis.

### DS-03 Practice Enablement — SUPPORTING

Owns the problem-space responsibility for enabling or delegating learning, practice, and diagnostic activity that can produce target-relevant evidence.

**Derived from:** REQ-CAP-PRACTICE, REQ-CAP-EVIDENCE-CONTEXT.

**Why SUPPORTING:** Prep must support the activity contract, but the execution runtime may remain external and no specific question, card, exercise, or study mechanism is part of the accepted core product meaning.

**Concrete consumers:** Model Context Strategy decides whether this responsibility needs independent modeling; Application Design later decides orchestration with internal or external activity execution.

### DS-04 Preparation Bootstrap — SUPPORTING

Owns the problem-space responsibility for turning fragmented or incomplete source material into enough usable preparation scope to begin work with low learner overhead.

**Derived from:** REQ-CAP-BOOTSTRAP, REQ-CAP-TARGET.

**Why SUPPORTING:** bootstrap is necessary to make the core preparation loop usable from imperfect inputs, but reusable corpus curation and arbitrary automatic extraction are not accepted product obligations.

**Concrete consumers:** Model Context Strategy decides whether bootstrap concepts require an independent language boundary; Application Design later decides how source material enters the preparation flow.

## Strategic relationship constraints

- Preparation Direction depends on evidence-bounded learner state when evidence exists, but learner evidence does not own or redefine the preparation target.
- Learner Evidence and State records or interprets learner-specific evidence; it does not decide what the learner should work on next.
- Practice Enablement may produce observations/evidence but does not itself decide learner state or target-relative priority.
- Preparation Bootstrap may propose or construct preparation scope from source material, but accepted target meaning remains a Preparation Direction concern.
- None of these strategic subdomains implies a service, package, database, UI area, or bounded context.

## Explicitly not established by current evidence

The accepted product capabilities do **not** independently justify strategic subdomains for:

- a reusable subject-knowledge corpus;
- graph/knowledge exploration;
- spaced-repetition or retention scheduling;
- a standalone quality-control system;
- a mandatory curator/operator workflow;
- a production import subsystem.

These may reappear only if later accepted product behavior or domain evidence creates an independently changing strategic responsibility.

## Reopening conditions

Revisit the strategic decomposition when:

- target definition/focus/adaptation acquire independently changing language or consumers;
- evidence capture and learner-state interpretation become independently valuable responsibilities with separate lifecycle or consumers;
- practice execution becomes a product-owned differentiator rather than an enable/delegate responsibility;
- bootstrap/source preparation gains accepted behavior beyond low-overhead preparation startup;
- new accepted product capabilities establish an independent subject-knowledge, retention, quality, curation, or import responsibility.
