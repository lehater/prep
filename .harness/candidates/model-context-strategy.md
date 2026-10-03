# Model Context Strategy

## Purpose

Define where Prep's independently modeled semantic languages apply and how they relate. This artifact does not re-own strategic investment classification, tactical domain structures, services, APIs, storage, packages, or deployment topology.

## Accepted model contexts

### MC-01 Preparation Direction

Applies to the language of:

- the active preparation target;
- explicit uncertainty about target expectations;
- target-relative next focus;
- revision of preparation direction when target information changes;
- adaptation of focus when accepted learner-state evidence changes.

This context owns normative preparation direction: what the learner is preparing toward and what deserves attention next.

It does **not** own learner observations, evidence provenance, or learner-state conclusions.

**Evidence:** DS-PREPARATION-DIRECTION; REQ-CAP-TARGET; REQ-CAP-FOCUS; REQ-CAP-ADAPT.

**Consumers:** Tactical Domain Design needs one coherent language boundary for target/focus/adaptation semantics; Application Design later orchestrates work against this language.

### MC-02 Learner Evidence & State

Applies to the learner-specific descriptive and epistemic language of:

- observations or imported evidence;
- evidence context and provenance needed to bound interpretation;
- evidence-backed conclusions about demonstrated, challenged, or unknown target-relative capability;
- uncertainty or insufficiency of current evidence.

This context owns what can currently be concluded about the learner from accepted evidence.

It does **not** own the preparation target, target refinement, or the decision about what the learner should work on next.

**Evidence:** DS-LEARNER-EVIDENCE-STATE; REQ-CAP-EVIDENCE-CONTEXT; REQ-CAP-STATE; REQ-CAP-ADAPT.

**Consumers:** Tactical Domain Design needs a separate learner-specific language that cannot silently redefine target semantics; Preparation Direction consumes its accepted conclusions.

## Translation and boundary contracts

### TR-01 Learner state → Preparation Direction

Accepted learner-state conclusions and explicit uncertainty may inform target-relative focus and adaptation.

The translation must preserve:

- what evidence or uncertainty the conclusion is based on;
- the distinction between learner-state change and target change;
- the rule that learner evidence cannot by itself redefine target expectations.

### TR-02 Preparation Direction → practice execution

Preparation Direction may provide target-relative purpose, focus, or required performance context to an internal or external learning/practice/diagnostic runtime.

The runtime does not thereby become a Prep model context and does not acquire ownership of target or learner-state semantics.

### TR-03 practice execution → Learner Evidence & State

Internal or external learning/practice/diagnostic execution may return observations or evidence.

Those observations enter Learner Evidence & State with enough context to distinguish the observation from any inferred conclusion.

### TR-04 bootstrap/source material → Preparation Direction

Fragmented or incomplete source material may be translated into candidate preparation scope or target information.

The source material does not own Prep's target model. Accepted target meaning belongs to Preparation Direction, and unresolved source ambiguity remains explicit.

## Contexts not justified by current evidence

### No reusable Knowledge Model context

Current accepted Product Capabilities do not require the learner to maintain a reusable subject-knowledge corpus and do not establish knowledge exploration as an independent product capability. A separate reusable subject-language context is therefore not currently justified.

### No independent Practice context

Practice Enablement is a supporting strategic responsibility, but current evidence only requires Prep to support or delegate evidence-producing activity. It does not establish an independently changing Prep-owned practice language with its own consumer lifecycle.

### No independent Bootstrap context

Preparation Bootstrap is a supporting strategic responsibility, but current evidence requires translation from imperfect sources into usable preparation scope, not a separate durable model language.

## Boundary invariants

- target/focus/adaptation semantics and learner-evidence/state semantics remain independently modeled;
- observations remain distinguishable from conclusions;
- learner evidence may inform preparation direction but cannot silently redefine the target;
- target information may change preparation direction without being treated as learner-performance evidence;
- practice execution is a mechanism boundary, not automatically a semantic context;
- source/bootstrap input is a translation boundary, not automatically a semantic context;
- model contexts do not imply services, packages, databases, UI areas, or deployment units.

## Reopening conditions

Revisit this strategy when:

- practice semantics acquire independently changing language, lifecycle, or public consumers;
- bootstrap/source semantics become independently durable rather than translational;
- evidence capture and learner-state interpretation can no longer remain coherent in one learner-specific language;
- accepted product capabilities establish reusable subject-knowledge semantics as an independent product responsibility;
- target definition, focus, and adaptation cease to share one coherent normative preparation language.
