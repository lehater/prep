# Presentation System Design

## Purpose
Define the shared visual and interaction language for the current Prep human interface without choosing a frontend framework or encoding domain semantics in styling.

## Interaction principles
- Collection-first maintenance: canonical objects are primarily found through catalogues/lists and opened into detail/edit contexts.
- Detail before manipulation: relationships, alignments and composition are inspectable as explicit data rather than requiring graph gestures.
- Graph is an optional Knowledge exploration projection, never the only navigation or editing path.
- Stable semantic state is communicated by text/structure as well as any visual treatment.
- Destructive or invariant-sensitive actions expose their consequence and validation result.
- External-runtime availability/failure is visually distinct from empty canonical data.

## Shared composition
The application shell provides persistent access to Knowledge, Requirements, Questions, Targets, Study, Statistics and Import.

Collection surfaces share page/area identity, primary create/import action when applicable, search/filter controls when useful, collection results, and empty/loading/error states.

Detail/editor surfaces share object identity and primary content, editable canonical fields, related-object sections using identity-preserving links/selectors, explicit edit completion, and inline validation with entered values preserved after recoverable rejection.

## Collection and relationship language
The default collection representation is a catalogue/table/list suited to scanning, filtering and opening one object. Cards or graph projections may supplement it when they improve a concrete task but do not replace the canonical collection path.

Unaligned or incomplete preparation state is shown as an explicit textual status/filterable attribute where required.

Relations and alignments are explicit structures exposing endpoint identity and relation meaning. Cross-reference selection uses searchable canonical-object selectors; raw IDs are not the normal interaction mechanism.

## Feedback language
Common patterns distinguish loading, valid empty state, validation rejection, successful completion, recoverable failure, and unavailable/degraded external integration. Recoverable failures retain user input and a retry path.

Bulk import reports accepted/rejected counts and rejected-item identity plus reason without treating partial success as total failure.

## Study and statistics language
Study Set presentation emphasizes target context and selected Questions without inventing mastery, priority or recommended order.

Statistics use factual labels for recorded reviews and aggregates and must not imply mastery/readiness/retention states absent from the accepted model.

## Accessibility baseline
Core navigation/actions are keyboard accessible, focus is visible, labels do not depend on placeholders, semantic state does not depend on color alone, and every core graph task has a non-graph equivalent.

## Deliberately unconstrained
Color palette, typography family, spacing scale, icon set, component library, animation language, exact responsive breakpoints and exact visual density remain downstream choices.
