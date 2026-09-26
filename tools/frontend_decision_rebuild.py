#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))

if not (HARNESS_ROOT / "decision_pipeline.py").exists():
    raise SystemExit(
        "Pinned Harness runtime does not contain sequential Decision Pipeline support."
    )

sys.path.insert(0, str(HARNESS_ROOT))

from capability_lifecycle import validate_projection  # noqa: E402
from decision_pipeline import derive_decision_roadmap  # noqa: E402

TARGET = "FRONTEND-IMPLEMENTATION"
LIFECYCLE_PATH = ROOT / ".harness/candidates/frontend-decision-rebuild-lifecycle.yaml"
REBUILT_CAPABILITIES = {
    "prep.task-model",
    "prep.user-journeys",
    "prep.conceptual-interface-model",
    "prep.information-architecture",
    "prep.interaction-design",
    "prep.interface-topology",
    "prep.presentation-system",
    "prep.screen-view-design",
    "prep.interface-verification",
    "prep.presentation-verification",
    "prep.system-architecture",
    "prep.data-design",
    "prep.frontend-system-architecture",
    "prep.frontend-engineering-policy",
    "prep.frontend-component-design",
    "prep.frontend-verification",
    "prep.frontend-test-design",
    "prep.frontend-implementation-design",
}


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def provider_index(core: dict[str, Any]) -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    for artifact in core.get("artifacts", []) or []:
        for capability in artifact.get("provides", []) or []:
            result[capability] = artifact
    return result


def main() -> int:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    lifecycle = load(LIFECYCLE_PATH)
    policy = load(ROOT / ".harness/decision-policy.yaml")
    contracts = load(
        HARNESS_ROOT
        / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml"
    )

    validate_projection(graph, core, lifecycle)
    roadmap = derive_decision_roadmap(
        graph=graph,
        model=core,
        target=TARGET,
        lifecycle=lifecycle,
        decision_contracts=contracts,
        decision_policy=policy,
    )

    providers = provider_index(core)
    for unit in roadmap["ready"]:
        capability = unit["capability"]
        if capability not in REBUILT_CAPABILITIES:
            continue
        provider = providers[capability]
        old_path = provider["path"]
        if unit["decision_request_mode"] == "CREATE":
            leaked = [
                item
                for item in unit["read_set"]
                if item.get("path") == old_path
            ]
            if leaked:
                raise SystemExit(
                    f"CREATE read set leaked prior provider for {capability}: {leaked}"
                )

    summary = {
        "frontier_status": roadmap["frontier_status"],
        "ready": [item["capability"] for item in roadmap["ready"]],
        "blocked": [item["capability"] for item in roadmap["blocked"]],
        "waiting_upstream": [
            item["capability"] for item in roadmap["waiting_upstream"]
        ],
        "completed_rebuilt": sorted(
            {
                item["capability"]
                for item in roadmap["completed"]
                if item["capability"] in REBUILT_CAPABILITIES
            }
        ),
    }
    print("FRONTEND DECISION REBUILD ROADMAP")
    print(json.dumps(summary, indent=2, sort_keys=False))
    print(json.dumps(roadmap, indent=2, sort_keys=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
