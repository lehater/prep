# Model Context Strategy

## Purpose

Define where Prep's independently modeled semantic languages apply and how they relate. This artifact does not re-own strategic classification, tactical structures, services, APIs, storage, packages, UI areas, or deployment topology.

## Accepted model contexts

### MC-01 Preparation Direction

Owns the normative language of:

- candidate preparation targets and target-direction comparison before active-target commitment;
- active preparation target and target purpose;
- explicit uncertainty about target expectations;
- target-relative required outcomes;
- next preparation focus;
- target refinement;
- focus adaptation when accepted learner-state conclusions change.

It answers: **which plausible target should this learner pursue, what are they preparing toward now, for what purpose, and what deserves attention next?**

It does not define reusable capability meaning, subject truth, or learner evidence.

### MC-02 Capability & Performance

Owns the reusable normative language of:

- what a person is expected to be able to perform;
- material conditions or constraints under which the performance matters;
- acceptable quality or standard;
- the stable performance meaning referenced by targets, practice/support, transfer judgments, and learner-state conclusions.

It answers: **what does it mean to be capable of doing this?**

Its meaning is independent of one learner, one target, one practice event, or one presentation.

### MC-03 Learner Evidence & State

Owns learner-specific descriptive and epistemic language for:

- contextualized observations;
- provenance, performance context, target relevance, and temporal applicability of evidence;
- evidence-bounded conclusions about demonstrated, challenged, unknown, or uncertain capability;
- limits on conclusions caused by insufficient coverage, stale evidence, or transfer mismatch.

It answers: **what has this learner actually demonstrated, and what can defensibly be concluded from the evidence?**

It cannot redefine reusable Capability & Performance or Subject Knowledge meaning.

### MC-04 Subject Knowledge

Owns reusable subject-semantic language for:

- important concepts or subject meanings;
- meaningful relationships among them;
- relevant subject scope;
- coherent movement between overview and deeper detail.

It answers: **what is true or meaningful in the subject, and how does that knowledge fit together?**

Its identity is independent of learner state, target, practice event, and interface representation.

## Translation contracts

### TR-01 Subject Knowledge → Capability & Performance

Capability/performance meaning may reference the subject knowledge that a performance concerns, uses, explains, applies, reasons about, or otherwise depends on.

Translation must preserve:

- Subject Knowledge semantic identity;
- the distinction between knowing something and being able to perform with or about it;
- the rule that a relation in Subject Knowledge is not itself evidence of learner capability.

### TR-02 Capability & Performance → Preparation Direction

Preparation Direction may select or compose target-relative required performance from reusable Capability & Performance meaning.

Translation must preserve:

- target purpose;
- applicable performance conditions/constraints;
- required quality/standard;
- the distinction between reusable capability meaning and one target's requirement.

Related targets do not inherit requirements automatically.

### TR-03 Capability & Performance + Subject Knowledge → practice/learning execution

Internal or external practice, learning, or diagnostic mechanisms may receive required performance meaning and relevant subject context to choose or provide suitable opportunities.

The runtime does not thereby become owner of Capability & Performance or Subject Knowledge semantics.

Support completion is not learner-state evidence by itself.

### TR-04 practice/learning execution → Learner Evidence & State

Practice or diagnostic execution may return contextualized observations.

Translation must preserve enough performance context, provenance, time, and relevant semantic references to keep the observation separate from the conclusion drawn from it.

### TR-05 Learner Evidence & State → Preparation Direction

Accepted learner-state conclusions and explicit uncertainty may be projected against multiple candidate target requirement sets to support target-direction comparison, and may inform next focus and adaptation after a target is active.

Translation must preserve:

- one reusable learner evidence/state basis rather than a separate learner profile per target;
- evidence limitations and target-relative applicability;
- the distinction between learner change and target change;
- the rule that comparison does not itself mutate learner state or activate a target;
- the rule that learner evidence does not redefine target requirements or reusable capability meaning.

### TR-06 bootstrap/source material → semantic owners

Fragmented source material may produce candidate target, capability/performance, subject-knowledge, or evidence-support information.

Bootstrap is a translation/preparation responsibility, not an owner of accepted semantic truth.

Accepted meaning belongs to the corresponding model context; unresolved source ambiguity remains explicit.

## Contexts not independently justified

### No independent Practice/Learning context yet

Practice & Learning Enablement is a supporting strategic responsibility, and accepted behavior requires support-fit and evidence-producing opportunities. Current evidence does not yet require a separate durable Prep-owned practice language with independent lifecycle beyond translation among Capability & Performance, Subject Knowledge, execution mechanisms, and Learner Evidence.

Reopen if learning/practice design gains independently changing semantics or consumers that cannot be expressed as those translation contracts.

### No independent Assessment/Evidence Design context yet

Current accepted behavior requires contextualized evidence and inspectable justification, but it does not yet establish reusable assessment-design rules as a separate strategic responsibility.

Reopen if evidence-pattern, warrant, sampling, or assessment-design semantics acquire independent lifecycle or consumers distinct from learner-specific evidence/state and practice enablement.

### No independent Bootstrap context

Preparation Bootstrap remains a source-to-model translation responsibility. It does not own accepted target, capability, knowledge, or learner-state meaning.

## Boundary invariants

- Subject Knowledge != Capability & Performance.
- Capability & Performance != one target requirement.
- Capability & Performance != learner state.
- Observation != capability conclusion.
- Practice/support activity != evidence of capability.
- Learner evidence may update Preparation Direction but cannot redefine reusable Capability & Performance or Subject Knowledge.
- Bootstrap may propose semantic data but cannot become the owner of accepted meaning.
- Model contexts do not imply services, packages, databases, graph databases, UI regions, or deployment units.

## Consumers

- Tactical Domain Design must give each accepted model language coherent semantics and may need to redistribute historical tactical artifacts accordingly.
- Application Design consumes the translation contracts without redefining model ownership.
- Interface and data design must preserve these distinctions rather than collapse them for presentation or persistence convenience.

## Reopening conditions

Revisit this strategy when:

- Practice/Learning design acquires independently changing model language or lifecycle;
- Assessment/Evidence Design acquires reusable rules and independent consumers;
- bootstrap/source semantics become independently durable rather than translational;
- Capability & Performance splits into independently changing semantic responsibilities;
- Subject Knowledge scope/relations/depth cease to form one coherent reusable subject language;
- evidence capture and learner-state interpretation can no longer remain coherent in one learner-specific language.
