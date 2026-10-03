#!/usr/bin/env python3
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))
if not HARNESS_ROOT.is_absolute():
    HARNESS_ROOT = (ROOT / HARNESS_ROOT).resolve()
HARNESS_SRC = HARNESS_ROOT / "src"

if not (HARNESS_SRC / "harness/application/project_publication.py").exists():
    raise SystemExit(
        "Pinned Harness package runtime not found. Run python tools/bootstrap_harness.py "
        "or set HARNESS_ROOT to a current Harness checkout."
    )

sys.path.insert(0, str(HARNESS_SRC))

from harness.application.project_publication import read_project_publication  # noqa: E402
from harness.project_model.engineering_graph import validate_realization  # noqa: E402


def load_yaml(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def build_strict_semantic_baseline(
    graph: dict[str, Any],
    core: dict[str, Any],
) -> tuple[dict[str, Any], dict[str, Any]]:
    validate_realization(graph, core)
    publication = read_project_publication(
        ROOT / ".harness/project-publication.yaml",
        graph=graph,
    )
    state = publication["state"]
    if state["core_model"] != core:
        raise SystemExit(
            ".harness/core.yaml differs from the atomically published Core model"
        )
    return state["semantic_evaluations"], state["lifecycle"]


def main() -> int:
    graph = load_yaml(ROOT / ".harness/engineering-graph.yaml")
    core = load_yaml(ROOT / ".harness/core.yaml")
    evaluations, lifecycle = build_strict_semantic_baseline(graph, core)
    print(
        "Published semantic baseline PASS: "
        f"{len(evaluations.get('semantic_evaluations', []))} semantic evaluations, "
        f"{len(evaluations.get('derivation_evaluations', []))} derivation evaluations, "
        f"{len(lifecycle.get('providers', []))} lifecycle providers"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
