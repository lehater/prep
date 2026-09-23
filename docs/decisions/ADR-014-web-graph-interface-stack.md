# ADR-014 — Use a browser React/TypeScript graph-first interface

Status: Accepted

## Context

The primary UI is an interactive 3D graph with filtering, dragging, node/link selection, overlays and persistent detail panels. Companion list/search/admin views are also required.

## Decision

- Use a browser application written in React + TypeScript.
- Use `react-force-graph-3d` as the initial 3D graph renderer (Three.js/WebGL).
- Keep graph view data in Prep-owned DTOs; renderer objects/coordinates are presentation state only.
- Provide 2D/list/detail fallbacks where 3D is unsuitable for density, accessibility or device performance.
- Select exact package versions only in the implementation lockfile.

## Consequences

- Required graph interactions are available without building a Three.js graph engine from scratch.
- The renderer remains replaceable behind the graph-view component boundary.
- Large graph display still depends on server-side bounded subgraphs and client-side visibility limits.
