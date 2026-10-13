# Product-learning research framing

**Classification:** owner-confirmed research direction, **not** a Product Requirements change or Harness acceptance.

## Job and responsibilities

Prep is investigated as a **user-populated information container and working tool**: preserve user-supplied entities and meaningful assertions, let a person orient in a reusable space of subject Knowledge, inspect Goal/CapabilityDescription viewpoints, select suitable theoretical StudyMaterial and prepare a subset for study in an external system. Orientation itself can be useful without material export. Anki is an example, not a prescribed runtime.

Users may add, change, delete and bulk-load content. The data can come from external standards, books, notes, vacancies, expert sources or tools; a job listing is a Goal hint, not a complete authoritative ontology. In this study, Prep does **not** certify completeness, accuracy, source authority, an exhaustive syllabus, professional readiness or a person's actual ability.

The study deliberately assumes a coherent supplied dataset to test the **utility of navigating and selecting it**, not the economics of sourcing and independently validating a corpus. Compare with plausible existing-tool and simple material-selection baselines on the **same information**.

## Subject boundaries

- **Goal:** an independently identifiable user preparation purpose or context. May be incomplete, with zero CapabilityDescriptions.
- **CapabilityDescription:** independently identifiable and reusable *description of an ability/outcome*, potentially involving action, object, conditions and expected result; **not a measured learner Capability** and not necessarily a list of Knowledge.
- **Knowledge:** independently identifiable, heterogeneous and reusable subject information, including descriptions of principles, strategies and relations; its presence says nothing about the person knowing it.
- **StudyMaterial / PracticeMaterial:** independently identifiable material suitable for studying or theoretical retrieval/practice. Its direct relation to Knowledge, CapabilityDescription or other objects is **not decided**.
- **Recorded Activity/Result:** a separately meaningful factual record if supported; external statistics may be recorded as source-supplied data, not interpreted by Prep as proficiency.

For Goal-specific navigation, the **subject path is Goal → CapabilityDescription → Knowledge**. There is **no direct Goal–Knowledge semantic link**. The semantics of Goal–CapabilityDescription and CapabilityDescription–Knowledge links are not yet fixed. Knowledge–Knowledge assertions, **when present**, must have an explicit meaningful type. The absence of an assertion is unknown, not a denial.

Information instances have separate identity; asserted relation instances have separate identity; permitted relation kinds require justified endpoint roles and meanings. These are owner inputs for research, **not** a completed subject ontology. Description-of-ability, study objective/depth, Knowledge content detail, and observed human attainment must remain distinct.

## Scope and external history

The current research value test stops at **orientation + material preparation/transfer**; it does not require an internal applied-practice coach, assessment, competence inference, automated generation or an expert-verified corpus.

**Engineering qualification:** the accepted `mvp-vertical-slice` Product Requirements additionally include CRUD/bulk operations for all admitted kinds and intake/exploration of externally recorded Activity/Result. This research framing does not revoke them. Any narrower formal MVP requires a separate product-owner/Harness change.
