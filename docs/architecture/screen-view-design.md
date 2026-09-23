# Screen and View Design

## Primary shell

Desktop-first responsive web application with persistent global navigation and a graph-centered workspace.

## Core views

### Graph Explorer

Main 3D canvas plus:

- search;
- node-kind / area / facet filters;
- relation-type toggles;
- semantic/coverage/plan/learner overlay switch;
- visible-scope counters;
- selected-node/relation detail drawer.

### Node / Relation Detail

Side panel (without losing graph context) showing current semantic content, relations, evidence and learning state/coverage.

### Target / Plan Workspace

Build or inspect TargetScope/Curriculum/LearningPlan from current graph selection; show included/optional subjects and publication/content coverage.

### Curation Inbox

Administrative review of unresolved candidate identity, assertion conflicts, relations, merges/retirements and registry-extension proposals.

### Study Runtime / Sync

Show desired/observed Anki state, bridge connectivity, drift/conflicts and latest evidence ingestion.

### Progress

Graph/list views over plan progress, weak/stale/not-started regions and content-coverage gaps.

### Settings / Integrations

Bridge tokens/bindings, model provider configuration references and operational settings.

## UX constraints

- 3D is primary exploration, not the only navigation mechanism;
- every graph operation has a searchable/list-based path where practical;
- semantic edits enter curation workflows rather than direct canvas mutation;
- large scopes guide the user toward filters/clusters instead of rendering an unreadable ball.
