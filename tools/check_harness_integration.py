#!/usr/bin/env python3
from __future__ import annotations

import os
import re
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
from engineering_coverage import evaluate_with_repository_policy  # noqa: E402
from semantic_closure import evaluate_semantic_closure  # noqa: E402
from frontend_interface_knowledge import (  # noqa: E402
    evaluate_frontend_ux_closure,
    evaluate_topology_screen_subject_coverage,
)


def load(path: str) -> dict:
    value = yaml.safe_load((ROOT / path).read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def load_harness(path: str) -> dict:
    full_path = HARNESS_ROOT / path
    value = yaml.safe_load(full_path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{full_path} must contain a mapping")
    return value


def extract_screen_subjects(path: str) -> list[str]:
    text = (ROOT / path).read_text(encoding="utf-8")
    subjects = re.findall(r"(?m)^#{2,3}\s+\[([A-Z0-9][A-Z0-9-]*)\]\s+", text)
    duplicates = sorted({item for item in subjects if subjects.count(item) > 1})
    if duplicates:
        raise SystemExit(f"Duplicate Screen/View subject ids in {path}: {duplicates}")
    return subjects


def require_complete(
    graph: dict,
    core: dict,
    target: str,
    *,
    implementation_consumer: bool,
) -> dict:
    result = evaluate_engineering_target(graph, target, core)
    if result.get("status") != "COMPLETE":
        raise SystemExit(
            f"{target} must be structurally COMPLETE; "
            f"got {result.get('status')}: create={result.get('create')} "
            f"wait={result.get('wait')} pending={result.get('pending')}"
        )
    if result.get("implementation_consumer") is not implementation_consumer:
        raise SystemExit(
            f"{target} implementation classification mismatch: "
            f"expected {implementation_consumer}, "
            f"got {result.get('implementation_consumer')}"
        )
    print(
        f"{target}: COMPLETE (structural coverage only; "
        f"implementation_consumer={implementation_consumer})"
    )
    return result


def report_target(
    graph: dict,
    core: dict,
    target: str,
    *,
    implementation_consumer: bool,
) -> dict:
    result = evaluate_engineering_target(graph, target, core)
    if result.get("implementation_consumer") is not implementation_consumer:
        raise SystemExit(
            f"{target} implementation classification mismatch: "
            f"expected {implementation_consumer}, "
            f"got {result.get('implementation_consumer')}"
        )

    def caps(key: str) -> list[str]:
        return [item["capability"] for item in result.get(key, [])]

    print(
        f"{target}: {result.get('status')} "
        f"(implementation_consumer={implementation_consumer}; "
        f"create={caps('create')} wait={caps('wait')} "
        f"pending={caps('pending')})"
    )
    return result


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

    subject_coverage = evaluate_topology_screen_subject_coverage(
        load("docs/interface/interface-topology.yaml"),
        extract_screen_subjects("docs/interface/screen-view-design.md"),
    )
    if subject_coverage.get("status") != "ACCEPTED":
        raise SystemExit(
            "Screen/View subject coverage rejected: "
            f"{subject_coverage.get('findings')}"
        )
    print(
        "Frontend UX closure: ACCEPTED "
        f"({len(subject_coverage['expected_subjects'])} topology views covered)"
    )

    require_complete(
        graph,
        core,
        "CURRENT-REVALIDATION",
        implementation_consumer=False,
    )
    report_target(
        graph,
        core,
        "FRONTEND-PROTOTYPE",
        implementation_consumer=False,
    )
    production = report_target(
        graph,
        core,
        "FRONTEND-IMPLEMENTATION",
        implementation_consumer=True,
    )

    coverage = evaluate_with_repository_policy(
        graph=graph,
        realization=core,
        consumer="FRONTEND-IMPLEMENTATION",
        scope="frontend",
        project_overlay=load(".harness/engineering-coverage.yaml"),
        semantic_evaluations=load(".harness/semantic-evaluations.yaml"),
    )
    print(
        "FRONTEND-IMPLEMENTATION Engineering Coverage: "
        f"completion_ready={coverage['completion_ready']} "
        f"remaining_work={coverage['remaining_work_count']} "
        f"questions={coverage['question_frontier_count']}"
    )
    for item in coverage.get("work_items", []):
        action = item.get("action")
        capability = item.get("capability")
        concern = item.get("concern")
        print(
            "  coverage-work: "
            f"action={action} "
            f"capability={capability or '-'} "
            f"concern={concern or '-'}"
        )

    if production.get("status") == "COMPLETE":
        if not coverage.get("completion_ready"):
            raise SystemExit(
                "FRONTEND-IMPLEMENTATION is structurally COMPLETE but "
                "Engineering Coverage is not completion-ready"
            )

        semantic_path = ROOT / ".harness/semantic-evaluations.yaml"
        lifecycle_path = ROOT / ".harness/capability-lifecycle.yaml"
        missing = [
            str(path.relative_to(ROOT))
            for path in (semantic_path, lifecycle_path)
            if not path.is_file()
        ]
        if missing:
            raise SystemExit(
                "FRONTEND-IMPLEMENTATION is structurally COMPLETE but strict "
                "semantic/currentness evidence is missing: "
                f"{missing}"
            )

        semantic = yaml.safe_load(semantic_path.read_text(encoding="utf-8"))
        lifecycle = yaml.safe_load(lifecycle_path.read_text(encoding="utf-8"))
        if not isinstance(semantic, dict) or not isinstance(lifecycle, dict):
            raise SystemExit(
                "Strict semantic/currentness evidence files must contain mappings"
            )

        closure = evaluate_semantic_closure(
            graph=graph,
            model=core,
            target="FRONTEND-IMPLEMENTATION",
            skill_registry=load_harness(
                "skills/artifact-skill-registry-v0.yaml"
            ),
            semantic_evaluations=semantic,
            lifecycle=lifecycle,
        )
        if closure.get("status") != "COMPLETE":
            raise SystemExit(
                "FRONTEND-IMPLEMENTATION strict semantic/currentness closure "
                f"is {closure.get('status')}: "
                f"semantic_gaps={closure.get('semantic_gaps')} "
                f"currentness_gaps={closure.get('currentness_gaps')}"
            )
        print("FRONTEND-IMPLEMENTATION strict semantic/currentness: COMPLETE")

    print("Prep pinned Harness integration PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
