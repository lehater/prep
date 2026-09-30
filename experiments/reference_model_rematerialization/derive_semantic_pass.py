#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[2]
EXP = ROOT / "experiments/reference_model_rematerialization"
HARNESS = ROOT / ".harness-reference"


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def dump_yaml(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.safe_dump(value, sort_keys=False, allow_unicode=True), encoding="utf-8")


def main() -> int:
    sys.path.insert(0, str(HARNESS))
    from engineering_coverage import evaluate_with_repository_policy
    from reference_materializer import materialize

    graph = load(EXP / "generated/engineering-graph.yaml")
    core = load(EXP / "new-harness/core.yaml")
    overlay = load(EXP / "new-harness/engineering-coverage.yaml")

    coverage = evaluate_with_repository_policy(
        graph=graph,
        realization=core,
        consumer="FRONTEND-IMPLEMENTATION",
        scope="frontend",
        project_overlay=overlay,
    )
    analysis = EXP / "analysis"
    analysis.mkdir(parents=True, exist_ok=True)
    (analysis / "coverage-evaluation.json").write_text(
        json.dumps(coverage, indent=2, sort_keys=True),
        encoding="utf-8",
    )

    concerns = sorted({
        row["concern"]
        for row in coverage.get("rows", []) or []
        if isinstance(row, dict) and isinstance(row.get("concern"), str)
    })
    dump_yaml(
        analysis / "derived-activated-concerns.yaml",
        {
            "version": 1,
            "kind": "prep-reference-derived-concern-set",
            "source": "NEW graph + frozen Harness engineering coverage activation policy",
            "old_harness_input": False,
            "consumer": "FRONTEND-IMPLEMENTATION",
            "scope": "frontend",
            "count": len(concerns),
            "concerns": concerns,
        },
    )

    facts = copy.deepcopy(load(EXP / "project-facts.yaml"))
    facts["activated_concerns"] = concerns
    dump_yaml(analysis / "semantic-pass-project-facts.yaml", facts)

    result = materialize(
        load(HARNESS / "spec/research/reference-engineering-model-v0.yaml"),
        load(HARNESS / "catalogs/software-authorities-v0.yaml"),
        load(HARNESS / "spec/engineering-coverage/semantic-proof-contract-v1.yaml"),
        facts,
        load(EXP / "materialization-request.yaml"),
    )
    (analysis / "semantic-pass-materialization-result.json").write_text(
        json.dumps(result, indent=2, sort_keys=True),
        encoding="utf-8",
    )
    if "graph" in result:
        dump_yaml(analysis / "semantic-pass-engineering-graph.yaml", result["graph"])

    summary = {
        "version": 1,
        "kind": "prep-reference-semantic-pass-summary",
        "derived_concern_count": len(concerns),
        "initial_coverage_completion_ready": coverage.get("completion_ready"),
        "initial_coverage_remaining_work_count": coverage.get("remaining_work_count"),
        "semantic_materialization_status": result.get("status"),
        "diagnostics": result.get("diagnostics", []),
    }
    if "graph" in result:
        summary["semantic_graph_capability_count"] = sum(
            len(a.get("produces", []) or [])
            for a in result["graph"].get("authorities", []) or []
        )
        summary["semantic_graph_authority_count"] = len(result["graph"].get("authorities", []) or [])
    dump_yaml(analysis / "semantic-pass-summary.yaml", summary)
    print(yaml.safe_dump(summary, sort_keys=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
