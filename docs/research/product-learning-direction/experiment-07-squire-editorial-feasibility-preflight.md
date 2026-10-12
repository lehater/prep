# EX-PLD-07 — SQUIRE vacancy editorial preflight and reviewability audit

> **Retrospective Owner-scope correction (2026-10-12; later than this report):** The desk observations and single-author limitation below remain as recorded. The report's section 6 conclusion that independent subject reviews are **mandatory entry criteria for EX-PLD-06 is superseded** by the Owner's subsequent clarification: Prep is evaluated as a tool working on a controlled, task-appropriate user-supplied dataset, not as a producer/guarantor of an authoritative syllabus. See the [current research framing](research-framing.md) and the updated [EX-PLD-06/07 register](open-experiments.md). The **original EX-PLD-07 expert editorial study remains not run**, but it is optional and not an EX-PLD-06 gate. This annotation does not convert the original desk preflight into a user or expert experiment.

**Date:** 2026-10-12. **Classification:** NONCANONICAL RESEARCH EVIDENCE, **single-author desk preflight**, NOT a two-independent-expert review, participant observation, user-value test, verified training curriculum, or Harness approval.

**Protocol and fixed boundary:** [EX-PLD-07](open-experiments.md#ex-pld-07--editorial-feasibility-of-a-trustworthy-goal--knowledge-scope--practice-packet); [current research framing](research-framing.md); [EX-PLD-06](open-experiments.md#ex-pld-06--goal--capability--knowledge--external-theoretical-study-loop). The two-reviewer requirement was **not satisfied**. All classifications and draft items below come from **one research pass**; agreement, independently validated correctness and human sustainable cost are unknown.

## 1. Frozen input and review contract

- **Source:** [SQUIRE, Backend Engineer, Payments Team (Lever)](https://jobs.lever.co/getsquire/5bd354f4-9823-4716-a7e5-a747a5aef3c9), publicly accessible on 2026-10-12; same vacancy used by [Iteration 04](iteration-04-goal-to-useful-action-market-and-scenarios.md). Source is a mutable live page, **not** an archived immutable employer snapshot. The normalized extraction below is the frozen research input; any subsequent page changes must be reported before comparing future reviewers.
- **Goal G1 (constructed, not a real participant):** review theoretical payments-backend knowledge relevant to deciding what to study for this vacancy. No inference of hiring readiness, practical capability or interview scoring criteria.
- **Employer-stated topic requirements, normalized from vacancy:** Node.js application development; payment processing lifecycle (authorization, capture, refund, void, chargebacks); production payments/fintech; reconciliation between internal and provider records; financial ledger/double-entry principles; idempotent distributed payment operations; architecture patterns; integration, troubleshooting, collaboration. Stripe API experience is **nice-to-have**, not a required provider.
- **Other gates outside the theoretical study packet:** at least 7 years Node.js, proven production payments experience, English, Buenos Aires location, two on-site days per week; degree is preferred. The study packet does not satisfy or evaluate these conditions.
- **Unknown, not silently supplied:** actual interview questions, employer architecture/provider(s), ledger semantics, consistency requirements, risk controls, current codebase, performance expectations, question importance/weighting and candidate background.
- **Constructed lenses:** **C1** = explain/design retry-safe payment operations under failure; **C2** = explain reconciliation of payment lifecycle records and ledger integrity. They are not measured abilities, employer-issued requirements or necessary formal decompositions.

**Rubric held constant for this desk pass and proposed unchanged for future independent review:** source support = directly mentioned / defensible inference / conditional-optional / unknown; necessity must refer to a specific objective (direct mention ≠ universally necessary). For each item check (i) factual accuracy and source trace, (ii) fit to intended *theoretical* learning objective and C scope, (iii) bounded reviewable answer vs open-ended reasoning requiring external feedback, (iv) hidden assumptions, (v) disposition: **Anki candidate**, **external written scenario**, **hold**, or **reject**. A second reviewer must make judgments *without seeing this author's answers* before agreement is computed; present judgments cannot substitute for this procedure.

## 2. Ten-topic scope — traceable editorial proposal, not a complete syllabus

| ID | Knowledge topic | Vacancy support | Lens | Intended study objective |
| K01 | Node.js runtime, asynchronous failures | direct: Node.js; mechanisms inferred | C1 | Explain the possible ambiguity after timeout; no specific concurrency model asserted |
| K02 | Authorization, capture, void, refund, chargeback | direct | C1, C2 | C1: state transitions; C2: align internal/provider records |
| K03 | Idempotency and repeated payment operations | direct | C1, C2 | C1: client retry semantics; C2: duplicate effects on financial posting |
| K04 | Internal/provider reconciliation and settlement timing | direct: reconciliation; timing scenario inferred | C2 | Distinguish transient lag from unexplained mismatch |
| K05 | Ledger and double-entry bookkeeping | direct | C2 | Balanced entries, plus why balance alone cannot establish correctness |
| K06 | Distributed failure, retries, duplicate processing | inferred | C1, C2 | Failure modes; not an employer-approved interview syllabus |
| K07 | Provider events / webhooks | conditional inference | C1, C2 | Only if chosen integration receives asynchronous provider events |
| K08 | Transactional boundaries and concurrency | inferred from integrity/idempotency | C1, C2 | Reason about races, atomic posting and alternative designs |
| K09 | Payment-critical incident diagnosis | direct: troubleshooting; metrics inferred | C1, C2 | Describe signals, delayed information and investigation limits |
| K10 | Stripe API-specific details | nice-to-have only | C1, C2 | Conditional on provider; cannot treat as mandatory |

**Key distinctions observed in desk trace:** K02 and K03 can be reused across C1 and C2 with **different learning objectives**, not one intrinsic global depth. K06–K08 are plausible supporting explanations rather than textually required subtopics; K07 only applies under a specific integration design. K10 is optional. The table supports a *bounded and explicitly incomplete* study proposal, not a verified necessary/sufficient competency graph. Whether a person can understand and use this scope is unobserved.

## 3. Ten mixed study items — single-author source/fit triage

| ID | Candidate prompt (not production-ready) | Knowledge | Scope | Desk disposition | Provisional review rationale / expected answer boundary | Trace |
| I01 | Short distinction: authorization vs capture; void vs refund | K02 | C1 | Anki candidate | Explain reserve/collection and before-/after-capture correction; provider differences explicit | payment lifecycle; source vacancy + Adyen |
| I02 | Why use a stable idempotency key for retrying one logical request? | K03 | C1 | Anki candidate | Deduplicate an eligible API request; not a blanket guarantee for every downstream side effect | Stripe idempotent requests |
| I03 | True/false: an idempotency key guarantees exactly-once effects across API, ledger, and all providers | K03, K06 | C1 | Reject | False universal guarantee; cannot export an unqualified affirmative answer | Stripe idempotent requests scope |
| I04 | What invariant holds for a balanced double-entry journal entry, and what does it not prove? | K05 | C2 | Anki candidate | Total debits = total credits; does not by itself prove correct account, timing or economic meaning | AccountingCoach double entry |
| I05 | True/false: every captured payment must immediately debit cash and credit revenue | K04, K05 | C2 | Reject | False as universal rule: settlement, funds ownership and revenue-recognition context unspecified | vacancy omits ledger/accounting policy |
| I06 | Internal record says captured, provider report says not settled today: explain two hypotheses and next checks | K02, K04 | C2 | External written scenario | Check event timing/report period and actual mismatch; avoid treating all lag as data corruption | Adyen reconciliation |
| I07 | Distinguish a merchant-initiated refund from a cardholder dispute/chargeback | K02 | C2 | Anki candidate | Refund is merchant-initiated return; dispute involves cardholder/issuer and its separate process; details vary | Stripe dispute API |
| I08 | If provider events arrive twice or out of order, explain safeguards and unresolved uncertainties | K03, K06, K07, K08 | C1, C2 | External written scenario; conditional | Explain deduplication, state checks, retries and which facts require confirmation; not a one-fact card | Stripe webhooks; conditional provider |
| I09 | Explain every Node.js event-loop detail relevant to payment retries | K01 | C1 | Hold / rewrite | Unbounded, not calibrated to job-relevant objective; needs narrower failure vignette | vacancy requires Node.js, not this depth |
| I10 | Memorize exact Stripe-specific endpoints/events as a mandatory SQUIRE interview checklist | K10 | C1 | Hold / optional only | Stripe is nice-to-have; provider and interview rubric unknown; version-specific | vacancy optional Stripe |

**Desk disposition counts (classification, not independent quality scores):** 4 Anki candidate; 2 Reject; 1 External written scenario; 1 External written scenario; conditional; 1 Hold / rewrite; 1 Hold / optional only. Exact IDs, hypotheses and rubric above permit independent reviewers to record agreement per topic and per item. These counts say nothing about user learning or expert agreement.

### Material boundary: what could be used externally

- **Anki candidate items I01, I02, I04, I07:** a short Q/A note could be prepared for each. The answers in the table are **provisional editorial keys**, not independently validated canonical answers. For I01 the wording must remain provider-aware; I02 must not turn into “exactly once everywhere”; I04 is an invariant rather than proof of correctness; I07 distinguishes merchant refund from issuer-involved dispute. Verify final phrasing and sources independently before user delivery.
- **External theoretical written cases I06 and I08:** retain a scenario, source facts and explicit evaluation points; accept multiple technically defensible explanations. They could support reasoning about knowledge, but compressing them into a single yes/no flashcard would misrepresent their objective. No interview, deployed system or actual Capability execution is assessed.
- **Rejected I03 and I05:** falsify a naive “everything relevant is ready to export” assumption. I03 incorrectly extends a provider's idempotent-request guarantee to every downstream side effect; I05 invents an unconditional accounting policy. These are **negative controls**, not releasable misinformation cards.
- **Held I09 and I10:** I09 is under-specified and overbroad; I10 upgrades an optional/versioned provider detail to a mandatory interview requirement. Neither should enter a default packet without clarification.
- The actual Anki import, learner recall and applicability to real hiring **were not tested**. Importability of a UTF-8 text format is documented by [Anki](https://docs.ankiweb.net/importing/text-files.html), but syntax is not content validation. [Anki's effective-learning guidance](https://docs.ankiweb.net/editing.html) cautions that long cards and memorization without understanding impair the study experience.

## 4. Source cross-checks performed (separate from peer review)

| Check / source | What can be checked from the source | What remains unsupported |
| --- | --- | --- |
| [SQUIRE vacancy](https://jobs.lever.co/getsquire/5bd354f4-9823-4716-a7e5-a747a5aef3c9) | Listed requirements, explicit nice-to-have Stripe, years/location/production gates, missing interview rubric | The exact technical stack, task weights, completeness or candidate's personal deficits |
| [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests) | Same-key API request retries have defined API-level behavior and limits | Global exactly-once processing across independent ledgers/providers (reject I03) |
| [Stripe webhook guidance](https://docs.stripe.com/webhooks) | Provider event delivery and handler considerations; source for *conditional* event scenario I08 | That SQUIRE uses Stripe webhooks or any specific delivery architecture |
| [Adyen reconciliation example](https://docs.adyen.com/platforms/reconciliation-use-cases/reconcile-payments/) | Payment states and differences in booking/availability timing; enough to motivate I06 as conditional scenario | Employer's chosen PSP, reporting schedule or actual reconciliation design |
| [AccountingCoach on double entry](https://www.accountingcoach.com/blog/what-is-double-entry-bookkeeping) | Balanced debit/credit invariant supports I04 | Revenue timing/ledger accounts for this employer or universal entry asserted by I05 |
| [Stripe disputes](https://docs.stripe.com/api/disputes) | Cardholder/issuer dispute is a distinct workflow; limited support for I07 | Universal legal/procedural details of every provider and market |

**Result of desk cross-check:** At least two unsafe generalizations (I03/I05) and two unjustified unconditional study demands (I09/I10) are exposed by source/fit review. The reviewed sources establish **examples and boundaries**, not employer-specific truth. A technically plausible prompt is not an independently expert-approved item.

## 5. Effort, falsifiers and alternative workflows

**Actual work counted from this single pass:** one vacancy normalization; 2 constructed C lenses; 10 proposed topic/source classifications; 10 prompt trace/fit dispositions; 6 external technical/reference cross-checks. Counts are observable artifacts, not work hours or maintenance measurements. **Independent reviewer contributions = 0; topic/item agreement statistic = NOT COMPUTABLE; learner trials = 0; measured human editor-minutes = unavailable.**

**Illustrative staffing model, NOT measured cost or a forecast:** assuming *each* of two independent experts needs 2–4 minutes per topic and 3–8 minutes per prompt, plus 15–30 minutes joint disagreement resolution, the review-only range is **115–270 minutes** for this small fixture (2 × [10 × (2–4) + 10 × (3–8)] + 15–30). Excludes recruitment, onboarding, rubric preparation, source acquisition, edits after review, Anki formatting/import, and version monitoring. These assumed unit rates must be replaced by actual timestamps before “sustainable cost” can be decided. No inference of incremental cost versus AI + vacancy notes + direct Anki/RemNote is possible without measuring **both** routes fairly.

**Falsification checks, present evidence vs missing evidence:**

| Original falsifier | Desk observation | Proper verdict |
| --- | --- | --- |
| Experts cannot agree without invented employer criteria | Interview criteria absent; two experts unavailable | **UNTESTED**; absence of rubric confirms uncertainty, not disagreement |
| “Complete scope” misleads | Live posting includes unsatisfied non-study gates; K06–K10 conditional/inferred | **COUNTEREXAMPLE to any completeness assertion**; not a measured user misinterpretation |
| Too much editorial time per goal | 10 topics/10 items need source attribution and heterogeneous dispositions | **UNTESTED**; no timed experts or comparable existing-tools route |
| Recall items fail to support applied objective | I06/I08 require longer theoretical argument; cards I01/I02/I04/I07 cover only slices | **LOGICAL FIT LIMIT**; practical performance was outside this study, no learning outcome measured |
| Simpler manual/AI workflow sufficient | No head-to-head authoring or use observed | **UNTESTED** |

**Maintenance risk (inference):** vacancy edits, provider/API version changes, scenario assumptions, and changing technical references may each invalidate at least one item or scope edge. Maintenance frequency and cost are unknown. The minimal cost driver is **editorial verification of evidence, conditional relevance and item-to-objective fit**, not the number of exported records.

## 6. Conclusion, evidence level and decision for EX-PLD-06

**Confirmed by direct source checks:** the specific real vacancy can anchor a *provisional* Goal → two C perspectives → ten conditionally related Knowledge topics → heterogeneous ten-item packet; requirement origins can be traced; one-size-fits-all export is unsafe; source text explicitly lacks interview scoring criteria and includes non-study eligibility requirements. These are desk/source-trace findings only.

**Refuted as universal content assertions:** “Stripe mandatory”; “all recommended topics necessarily belong to the interview”; “all ten prompts are appropriate Anki cards”; “idempotency gives cross-system exactly-once”; “every capture entails immediately booking cash/revenue”. The actual employer study objective and the truth of nuanced scenario model answers still require expert checking.

**Not established:** independent agreement on relevance/necessity, independently verified answer keys, credible per-goal editorial/maintenance cost, suitability to a real learner's starting point, usable Anki first retrieval, user understanding/trust, or incremental benefit versus existing tools.

**EX-PLD-07 study completion:** **NO** — this is a completed *bounded desk preflight* of part of its fixture, not the required **two independently working subject reviewers**. Preserve the register's full-protocol status as **not run** and link this preflight. **EX-PLD-06 user-value experiment entry criteria:** **NOT MET**: independent topic/material review and a real learner with an authentic goal remain missing. The desk fixture can be reused as *candidate material* only after two blinded domain reviewers independently classify items and reconcile disagreements. Do not infer product validation, run a weaker synthetic exercise as if it were EX-PLD-06, or alter Harness.

**Next narrow action:** obtain two genuinely independent payments-backend/accounting reviewers, give them the frozen vacancy/rubric and clean candidate items without this author's judgments, capture per-K necessity/relevance and per-item accept/rewrite/reject + timestamps + source citations, then reconcile differences. If that fails or costs too much, compare a source-grounded manual/AI workflow before recruiting EX-PLD-06 learner participants.
