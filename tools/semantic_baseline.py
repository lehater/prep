#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))

if not (HARNESS_ROOT / "semantic_admission.py").exists():
    raise SystemExit(
        "Pinned Harness runtime not found. Run python tools/bootstrap_harness.py "
        "or set HARNESS_ROOT."
    )

sys.path.insert(0, str(HARNESS_ROOT))

from capability_lifecycle import validate_projection  # noqa: E402
from engineering_graph import production_index, validate_realization  # noqa: E402
from semantic_admission import admit_artifact, knowledge_contract_index  # noqa: E402


def load_yaml(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def _provider_index(core: dict[str, Any]) -> dict[str, dict[str, Any]]:
    providers: dict[str, dict[str, Any]] = {}
    for artifact in core.get("artifacts", []) or []:
        for capability in artifact.get("provides", []) or []:
            if capability in providers:
                raise SystemExit(
                    f"Strict baseline requires one selected Core provider per "
                    f"capability; duplicate: {capability}"
                )
            providers[capability] = artifact
    return providers


def _review_index(manifest: dict[str, Any]) -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    for review in manifest.get("reviews", []) or []:
        capability = review.get("capability")
        revision = review.get("revision")
        basis = review.get("basis")
        if not isinstance(capability, str) or not capability:
            raise SystemExit("Semantic baseline review requires capability")
        if capability in result:
            raise SystemExit(f"Duplicate semantic baseline review: {capability}")
        if not isinstance(revision, int) or revision < 1:
            raise SystemExit(
                f"Semantic baseline review {capability} requires positive revision"
            )
        if not isinstance(basis, str) or not basis.strip():
            raise SystemExit(
                f"Semantic baseline review {capability} requires review basis"
            )
        result[capability] = review
    return result


def _task_model_semantic_assertions(
    artifact_path: str,
    *,
    authority: str,
) -> list[dict[str, Any]]:
    document = load_yaml(ROOT / artifact_path)
    if document.get("kind") != "task-model":
        raise SystemExit(
            f"Task Model semantic projection expected kind=task-model in {artifact_path}"
        )

    assertions: list[dict[str, Any]] = []
    seen_tasks: set[str] = set()

    for goal in document.get("goals", []) or []:
        if not isinstance(goal, dict):
            raise SystemExit(f"{artifact_path} goals must contain mappings")
        goal_id = goal.get("id")
        description = goal.get("description")
        if not isinstance(goal_id, str) or not goal_id:
            raise SystemExit(f"{artifact_path} goal requires id")
        if not isinstance(description, str) or not description.strip():
            raise SystemExit(f"{artifact_path} goal {goal_id} requires description")

        assertions.append(
            {
                "id": goal_id,
                "kind": "task-goal",
                "subject": goal_id,
                "semantic_value": description.strip(),
                "decision_authority": authority,
            }
        )

        for task in goal.get("tasks", []) or []:
            if not isinstance(task, dict):
                raise SystemExit(f"{artifact_path} goal {goal_id} tasks must be mappings")
            task_id = task.get("id")
            if not isinstance(task_id, str) or not task_id:
                raise SystemExit(f"{artifact_path} goal {goal_id} task requires id")
            if task_id in seen_tasks:
                raise SystemExit(f"{artifact_path} duplicate task id: {task_id}")
            seen_tasks.add(task_id)

            required_information = task.get("required_information")
            if (
                not isinstance(required_information, list)
                or not required_information
                or any(not isinstance(item, str) or not item.strip() for item in required_information)
            ):
                raise SystemExit(
                    f"{artifact_path} task {task_id} requires non-empty required_information"
                )

            fields = {
                "task-goal-ref": goal_id,
                "task-responsibility": task.get("responsibility"),
                "task-information": " | ".join(item.strip() for item in required_information),
                "task-decision-input": task.get("decision_or_input"),
                "task-outcome": task.get("outcome"),
                "task-system-support": task.get("system_support"),
                "task-recovery": task.get("recovery"),
            }
            for kind, value in fields.items():
                if not isinstance(value, str) or not value.strip():
                    raise SystemExit(
                        f"{artifact_path} task {task_id} requires {kind}"
                    )

            assertions.append(
                {
                    "id": task_id,
                    "kind": "task",
                    "subject": task_id,
                    "semantic_value": task_id,
                    "decision_authority": authority,
                }
            )
            for kind, value in fields.items():
                assertions.append(
                    {
                        "id": f"{task_id}::{kind}",
                        "kind": kind,
                        "subject": task_id,
                        "semantic_value": value.strip(),
                        "decision_authority": authority,
                    }
                )

    if not assertions:
        raise SystemExit(f"{artifact_path} contains no Task Model goals/tasks")
    return assertions


def _artifact_semantic_assertions(
    *,
    knowledge_kind: str,
    artifact_path: str,
    authority: str,
) -> list[dict[str, Any]]:
    if knowledge_kind == "task-model":
        return _task_model_semantic_assertions(
            artifact_path,
            authority=authority,
        )
    return []


def _topological_existing_capabilities(
    productions: dict[str, dict[str, Any]],
    providers: dict[str, dict[str, Any]],
) -> list[str]:
    pending = set(providers)
    accepted: set[str] = set()
    order: list[str] = []

    while pending:
        ready = sorted(
            capability
            for capability in pending
            if all(
                requirement["capability"] in accepted
                for requirement in productions[capability].get("requires", []) or []
            )
        )
        if not ready:
            unresolved = {
                capability: [
                    requirement["capability"]
                    for requirement in productions[capability].get("requires", []) or []
                    if requirement["capability"] not in accepted
                ]
                for capability in sorted(pending)
            }
            raise SystemExit(
                "Cannot order current Core capabilities for strict baseline: "
                f"{unresolved}"
            )
        for capability in ready:
            pending.remove(capability)
            accepted.add(capability)
            order.append(capability)

    return order


def build_strict_semantic_baseline(
    graph: dict[str, Any],
    core: dict[str, Any],
) -> tuple[dict[str, Any], dict[str, Any]]:
    validate_realization(graph, core)

    manifest = load_yaml(ROOT / ".harness/semantic-baseline.yaml")
    baseline_id = manifest.get("baseline_id")
    if not isinstance(baseline_id, str) or not baseline_id:
        raise SystemExit("Semantic baseline requires baseline_id")

    skill_registry = load_yaml(
        HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml"
    )
    knowledge_contracts = load_yaml(
        HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
    )
    contracts = knowledge_contract_index(knowledge_contracts)
    productions = production_index(graph)
    providers = _provider_index(core)
    reviews = _review_index(manifest)

    unknown_providers = sorted(set(providers) - set(productions))
    if unknown_providers:
        raise SystemExit(
            "Core provides capabilities absent from Engineering Graph: "
            f"{unknown_providers}"
        )

    missing_reviews = sorted(set(providers) - set(reviews))
    extra_reviews = sorted(set(reviews) - set(providers))
    if missing_reviews or extra_reviews:
        raise SystemExit(
            "Strict semantic baseline must cover exactly current Core providers; "
            f"missing={missing_reviews} extra={extra_reviews}"
        )

    order = _topological_existing_capabilities(productions, providers)
    lifecycle: dict[str, Any] = {
        "version": 1,
        "kind": "harness-capability-lifecycle",
        "providers": [],
    }
    evaluations: dict[str, Any] = {
        "version": 1,
        "kind": "prep-strict-semantic-evaluation-bundle",
        "baseline_id": baseline_id,
        "semantic_evaluations": [],
    }

    for capability in order:
        production = productions[capability]
        artifact = providers[capability]
        review = reviews[capability]
        knowledge_kind = production.get("knowledge_kind")
        contract = contracts.get(knowledge_kind)
        if contract is None:
            raise SystemExit(
                f"No strict semantic contract for {capability} "
                f"knowledge_kind={knowledge_kind}"
            )

        prerequisite_capabilities = [
            requirement["capability"]
            for requirement in production.get("requires", []) or []
        ]
        canonical_references = [
            {"referenced_path": providers[upstream]["path"]}
            for upstream in prerequisite_capabilities
        ]
        acceptance_id = (
            f"{baseline_id}::{capability}::r{review['revision']}"
        )

        authority = next(
            item["id"]
            for item in graph.get("authorities", []) or []
            if any(
                produced.get("capability") == capability
                for produced in item.get("produces", []) or []
            )
        )
        semantic_assertions = _artifact_semantic_assertions(
            knowledge_kind=knowledge_kind,
            artifact_path=artifact["path"],
            authority=authority,
        )

        candidate = {
            "id": artifact["id"],
            "path": artifact["path"],
            "capability": capability,
            "changed_paths": [],
            "canonical_references": canonical_references,
            "semantic_assertions": semantic_assertions,
            "semantic_review": {
                "status": "ACCEPTED",
                "checks": contract.get("required_review_checks", []) or [],
                "basis": review["basis"],
            },
        }
        sources = {
            "version": 1,
            "kind": "prep-semantic-revalidation-sources",
            "semantic_assertions": [],
        }

        result = admit_artifact(
            graph=graph,
            model=core,
            skill_registry=skill_registry,
            knowledge_contracts=knowledge_contracts,
            capability=capability,
            sources=sources,
            candidate=candidate,
            acceptance_id=acceptance_id,
            lifecycle=lifecycle if prerequisite_capabilities else None,
        )
        if result.get("status") != "ACCEPTED":
            raise SystemExit(
                f"Strict semantic admission rejected {capability}: "
                f"{result.get('findings')}"
            )

        lifecycle_assertion = result.pop("lifecycle_assertion")
        result["review_evidence"] = {
            "baseline_id": baseline_id,
            "revision": review["revision"],
            "basis": review["basis"],
        }
        evaluations["semantic_evaluations"].append(result)
        lifecycle["providers"].append(lifecycle_assertion)

    validate_projection(graph, core, lifecycle)
    return evaluations, lifecycle


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build Prep strict semantic/currentness baseline in memory."
    )
    parser.parse_args()

    graph = load_yaml(ROOT / ".harness/engineering-graph.yaml")
    core = load_yaml(ROOT / ".harness/core.yaml")
    evaluations, lifecycle = build_strict_semantic_baseline(graph, core)
    print(
        f"Strict semantic baseline PASS: "
        f"{len(evaluations['semantic_evaluations'])} capabilities admitted, "
        f"{len(lifecycle['providers'])} lifecycle assertions CURRENT-capable"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
