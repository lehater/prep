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


def load(path: str) -> dict:
    value = yaml.safe_load((ROOT / path).read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def main() -> int:
    graph = load(".harness/engineering-graph.yaml")
    core = load(".harness/core.yaml")

    validate_engineering_graph(graph)

    for artifact in core.get("artifacts", []):
        path = artifact.get("path")
        if path and not (ROOT / path).is_file():
            raise SystemExit(f"Harness artifact path does not exist: {path}")

    result = evaluate_engineering_target(graph, "TOP-LEVEL-DESIGN", core)
    if result.get("status") != "COMPLETE":
        raise SystemExit(
            "TOP-LEVEL-DESIGN must be structurally COMPLETE; "
            f"got {result.get('status')}: create={result.get('create')} "
            f"wait={result.get('wait')} pending={result.get('pending')}"
        )

    print("Prep pinned Harness integration PASS")
    print("TOP-LEVEL-DESIGN: COMPLETE (structural coverage only)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
