# EX-PLD-11 → EX-PLD-09 — owner-supplied interface layout reference

**Source:** two screenshots supplied by the project owner in conversation on 2026-10-13: (1) interactive L0 application shell and (2) L1 Capabilities table/graph selection synchronization. This document captures the **visual layout and interaction constraints**, not a new subject ontology, product UX acceptance, or Harness engineering decision. The original screenshots are conversation attachments, not repository image assets.

## L0: application-wide shell

The **persistent sidebar** is a separate application-level navigation area, **not one of the four workspace panels**. Default demonstrated width is **220 px**; the owner reference includes a width slider and Reset. Sidebar contains Prep branding and section navigation (Goals, Capabilities, Knowledge, Materials; Status appeared in the L0 shell example). The selected section is highlighted.

The remainder of the viewport contains:
- a persistent top contextual bar / breadcrumb (e.g. "Preparation / Workspace", context at the right);
- one L1 selected-section content region with its own heading/local tools and principal workspace;
- a persistent bottom contextual/status strip.
The example explicitly says **no general full-page scrolling**: scrolling belongs inside the necessary workspace panels. L0 and L1 are two selectable views of the *same shell*, not alternative overall layout variants.

```text
┌─────────────sidebar (~220 px, adjustable)──────────┬──────────────────── top context/breadcrumb bar ─────────────────────┐
│ Prep  · persistent navigation                       │                                                                  │
│ Goals / Capabilities / Knowledge / Materials        ├────────── selected L1 section heading + tools ─────────────────────┤
│                                                     │                                                                  │
│                                                     │                       main workspace                             │
│                                                     │                                                                  │
│                                                     ├────────────────── bottom context/status strip ────────────────────┤
└─────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────┘
```

## L1: concrete four-pane workspace inside the shell

**Position is part of the layout contract.** Above the panes is a horizontal page heading/breadcrumb and a separate search/filter/context bar. The main panes are a 2-column × 2-row grid arranged **1 upper-left, 3 upper-right, 2 lower-left, 4 lower-right**, as in the owner's screenshot. The left content column is wider than the right; the screenshot suggests approximately 65%/35% **of workspace width**, but the exact ratio/resize constraints are not yet owner-approved.

```text
┌──────────────── sidebar ───────────────┬──────────────────── Prep / Capabilities (breadcrumbs/tools) ──────────────────────────┐
│ Prep                                 │ Search and filters                                         Context: G01            │
│ Goals / Capabilities / Knowledge     ├─────────────────────────────────────┬──────────────────────────────────────────────┤
│ / Materials                          │ 1 · Capabilities                    │ 3 · Details                                  │
│                                      │ collection / table, selectable      │ selected object's own fields                 │
│                                      │ C01 or C02                         │                                              │
│                                      ├─────────────────────────────────────┼──────────────────────────────────────────────┤
│                                      │ 2 · Related entities               │ 4 · Graph                                    │
│                                      │ tabs: Knowledge / Goals / Materials│ selected/focused subgraph                    │
│                                      │ role-aware relationship listing    │ select C01 or C02                            │
│                                      ├─────────────────────────────────────┴──────────────────────────────────────────────┤
│                                      │ status/footer: G01 · active capability C02                                   │
└──────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────┘
```

**Pane identity:** (1) collection/table of the active selected section; (2) related entity types/actual relation records; (3) own details of the selected entity, not the relation list; (4) eligible graph based on actual assertions. A four-cell "1 | 2 / 3 | 4" grid, a free-form 2×2 recreation, or putting the catalog into the global sidebar **is not equivalent to this reference**.

**Demonstrated interaction:** selecting C01 or C02 in either the table or graph updates the common selection; details and related entities update consistently. The graph may focus on selected C; filters, display context, selected record and history must not silently mutate source facts. Related-entities tabs in the screenshot are Knowledge, Goals, Materials. If an apparent "Materials" connection is **derived via Knowledge rather than an asserted direct C–M relation**, the actual implementation must label it as an indirect topical candidate, not invent a C–M source assertion. The screenshot is a layout/interaction reference, **not evidence that all displayed tab counts represent direct subject links**.

**Testing obligations before saying "matches the mockup":**
1. Compare actual app layout side-by-side with this L0 shell and this exact L1 pane placement, separately from model and navigation tests.
2. Exercise sidebar width/reset, L0/L1 section selection, C01↔C02 table/graph bidirectional selection, related tabs, details update, and footer context.
3. Confirm responsive/overflow treatment intentionally, preserving conceptual location of panels; no undocumented independent redesign at smaller widths.
4. Mark visual fidelity unverified until the render is reviewed against the owner-provided screenshots. Model assertions passing **do not** establish layout fidelity.

**Status / ownership:** directly observed owner reference; geometry/placement and interaction behavior are the research comparison baseline. Pixel-perfect dimensions, visual styling and final product adoption are not claimed. Any engineering-meaning promotion requires the separate routed process.
