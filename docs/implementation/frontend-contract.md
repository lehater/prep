# Frontend Implementation Contract

## Stack

- React 19;
- TypeScript;
- Vite;
- TanStack Query for server state;
- React Router for route ownership;
- react-force-graph-3d behind `GraphRenderer`.

No second general-purpose client state library is introduced initially.

## Routes

```text
/                         -> Graph Explorer
/graph/node/:nodeId       -> Graph Explorer + node detail
/graph/relation/:id       -> Graph Explorer + relation detail
/plans                    -> target/plan workspace
/plans/:planId            -> plan detail/progress
/curation                 -> curation inbox
/curation/:proposalId     -> proposal detail
/runtime                  -> bridge/sync diagnostics
/progress                 -> learner progress
/settings                 -> integrations/settings
/login                    -> authentication
```

Deep links preserve selected graph subject while graph context remains available.

## State ownership

### TanStack Query

Owns cached server query/mutation state: graph slices, node detail, plans, progress, proposals, jobs and runtime status.

Query keys include graph/plan/overlay revision inputs that affect meaning.

### URL/search params

Own shareable navigation/filter state:

- selected subject;
- area/kind/relation filters;
- overlay mode;
- TargetScope/plan selection when appropriate.

### Local React state

Owns transient camera/hover/panel sizing/unsaved form state.

### Server SavedView

Owns intentionally persisted filter/pinned-node/layout preferences. Renderer physics coordinates are not automatically persisted as knowledge.

## GraphRenderer boundary

Input:

```text
GraphSlice DTO
selection
visibility/filter projection
presentation options
```

Output callbacks:

```text
on_select_node
on_select_relation
on_expand_neighborhood
on_view_state_change
```

No domain/API mutation occurs inside renderer callbacks.

## UI mutation path

Canvas drag = view state only.

Semantic feedback/change request -> explicit curation command.

Plan creation -> explicit learning command.

## Error handling

Global API client maps typed error codes to recoverable UX; 401 routes to login, 403 remains authorization error, 409 version/conflict prompts refresh/review, retryable job/runtime failures remain visible rather than hidden by infinite auto-retry.
