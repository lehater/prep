#!/usr/bin/env python3
from __future__ import annotations

import os
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))

if not (HARNESS_ROOT / "engineering_graph.py").exists():
    raise SystemExit(
        "Pinned Harness runtime not found. Run python tools/bootstrap_harness.py "
        "or set HARNESS_ROOT."
    )

sys.path.insert(0, str(HARNESS_ROOT))
from engineering_graph import evaluate_engineering_target, validate_engineering_graph  # noqa: E402
from frontend_interface_knowledge import evaluate_frontend_ux_closure, required_screen_ids  # noqa: E402


def load(path: str) -> dict:
    value = yaml.safe_load((ROOT / path).read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def require_complete(graph: dict, core: dict, target: str) -> None:
    result = evaluate_engineering_target(graph, target, core)
    if result.get("status") != "COMPLETE":
        raise SystemExit(
            f"{target} must be structurally COMPLETE; "
            f"got {result.get('status')}: create={result.get('create')} "
            f"wait={result.get('wait')} pending={result.get('pending')}"
        )
    print(f"{target}: COMPLETE (structural coverage only)")


def main() -> int:
    graph = load(".harness/engineering-graph.yaml")
    core = load(".harness/core.yaml")

    validate_engineering_graph(graph)

    for artifact in core.get("artifacts", []):
        path = artifact.get("path")
        if path and not (ROOT / path).is_file():
            raise SystemExit(f"Harness artifact path does not exist: {path}")

    ux = evaluate_frontend_ux_closure(
        load("docs/application/task-model.yaml"),
        load("docs/interface/conceptual-interface-model.yaml"),
        load("docs/interface/information-architecture.yaml"),
        load("docs/interface/interaction-design.yaml"),
        load("docs/interface/interface-topology.yaml"),
    )
    if ux.get("status") != "ACCEPTED":
        raise SystemExit(f"Frontend UX closure rejected: {ux.get('findings')}")

    expected = set(required_screen_ids(load("docs/interface/interface-topology.yaml")))
    coverage = load("docs/verification/screen-view-subject-coverage.yaml")
    actual = set(coverage.get("views", []) or [])
    if expected != actual:
        raise SystemExit(
            "Screen/View subject coverage mismatch: "
            f"missing={sorted(expected-actual)} extra={sorted(actual-expected)}"
        )
    print(f"Frontend UX closure: ACCEPTED ({len(expected)} topology views covered)")

    require_complete(graph, core, "CURRENT-REVALIDATION")

    print("Prep pinned Harness integration PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
