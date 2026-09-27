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

from capability_lifecycle import lifecycle_index, validate_projection  # noqa: E402
from decision_pipeline import derive_decision_roadmap  # noqa: E402
from semantic_admission import admit_artifact  # noqa: E402

TARGETS = ("FRONTEND-IMPLEMENTATION", "CURRENT-REVALIDATION")
BASE_LIFECYCLE_PATH = ROOT / ".harness/candidates/frontend-decision-rebuild-lifecycle.yaml"
EVIDENCE_DIR = ROOT / ".harness/candidates/frontend-decision-rebuild"
UPSTREAM_REVISION_PATH = (
    EVIDENCE_DIR / "frontend-performance-capacity-revision.yaml"
)
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


def roadmaps_for(
    *,
    graph: dict[str, Any],
    core: dict[str, Any],
    lifecycle: dict[str, Any],
    contracts: dict[str, Any],
    policy: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    return {
        target: derive_decision_roadmap(
            graph=graph,
            model=core,
            target=target,
            lifecycle=lifecycle,
            decision_contracts=contracts,
            decision_policy=policy,
        )
        for target in TARGETS
    }


def assert_create_purity(
    roadmaps: dict[str, dict[str, Any]],
    providers: dict[str, dict[str, Any]],
) -> None:
    for roadmap in roadmaps.values():
        for unit in roadmap["ready"]:
            capability = unit["capability"]
            if capability not in REBUILT_CAPABILITIES:
                continue
            if unit["decision_request_mode"] != "CREATE":
                continue
            old_path = providers[capability]["path"]
            leaked = [
                item for item in unit["read_set"]
                if item.get("path") == old_path
            ]
            if leaked:
                raise SystemExit(
                    f"CREATE read set leaked prior provider for {capability}: {leaked}"
                )


def ready_units(
    roadmaps: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    for target, roadmap in roadmaps.items():
        for unit in roadmap["ready"]:
            capability = unit["capability"]
            if capability not in REBUILT_CAPABILITIES:
                continue
            previous = result.get(capability)
            if previous is not None and previous != unit:
                raise SystemExit(
                    f"inconsistent Roadmap unit for {capability} across targets; "
                    f"first={previous} target={target} unit={unit}"
                )
            result[capability] = unit
    return result


def roadmap_capabilities(
    roadmaps: dict[str, dict[str, Any]],
    bucket: str,
) -> list[str]:
    return sorted(
        {
            item["capability"]
            for roadmap in roadmaps.values()
            for item in roadmap[bucket]
            if item["capability"] in REBUILT_CAPABILITIES
        }
    )


def load_admission_evidence() -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    if not EVIDENCE_DIR.exists():
        return result
    for path in sorted(EVIDENCE_DIR.glob("*-admission.yaml")):
        doc = load(path)
        if doc.get("kind") != "prep-frontend-decision-rebuild-admission":
            raise SystemExit(f"unexpected rebuild evidence kind in {path}")
        capability = doc.get("capability")
        if capability not in REBUILT_CAPABILITIES:
            raise SystemExit(f"unexpected rebuild capability in {path}: {capability}")
        if capability in result:
            raise SystemExit(f"duplicate rebuild admission evidence: {capability}")
        result[capability] = doc
    return result


def apply_upstream_revision(
    *,
    graph: dict[str, Any],
    core: dict[str, Any],
    lifecycle: dict[str, Any],
    decision_contracts: dict[str, Any],
    policy: dict[str, Any],
    skill_registry: dict[str, Any],
    knowledge_contracts: dict[str, Any],
) -> dict[str, Any]:
    doc = load(UPSTREAM_REVISION_PATH)
    if doc.get("kind") != "prep-frontend-decision-rebuild-upstream-revision":
        raise SystemExit("unexpected upstream revision evidence kind")
    capability = doc.get("capability")
    if capability != "prep.frontend-performance-capacity":
        raise SystemExit(f"unexpected upstream revision capability: {capability}")
    if doc.get("decision_request_mode") != "REVISION":
        raise SystemExit("upstream quality correction must use REVISION mode")

    result = admit_artifact(
        graph=graph,
        model=core,
        skill_registry=skill_registry,
        knowledge_contracts=knowledge_contracts,
        decision_contracts=decision_contracts,
        decision_policy=policy,
        decision_exploration=doc.get("decision_exploration"),
        capability=capability,
        sources=doc.get("sources", {}),
        candidate=doc.get("candidate", {}),
        acceptance_id=doc["acceptance_id"],
        lifecycle=lifecycle,
        decision_request_mode="REVISION",
    )
    if result.get("status") != "ACCEPTED":
        raise SystemExit(
            "strict semantic admission rejected upstream quality revision: "
            + json.dumps(result.get("findings", []), sort_keys=True)
        )

    indices = [
        index
        for index, item in enumerate(lifecycle.get("providers", []) or [])
        if item.get("capability") == capability
    ]
    if len(indices) != 1:
        raise SystemExit(
            f"expected exactly one lifecycle provider for {capability}, got {indices}"
        )
    lifecycle["providers"][indices[0]] = result["lifecycle_assertion"]
    validate_projection(graph, core, lifecycle)
    return result


def main() -> int:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    lifecycle = load(BASE_LIFECYCLE_PATH)
    policy = load(ROOT / ".harness/decision-policy.yaml")
    decision_contracts = load(
        HARNESS_ROOT
        / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml"
    )
    skill_registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    knowledge_contracts = load(
        HARNESS_ROOT
        / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
    )

    validate_projection(graph, core, lifecycle)
    base_selected = sorted(
        set(lifecycle_index(lifecycle)) & REBUILT_CAPABILITIES
    )
    if base_selected:
        raise SystemExit(
            "reset lifecycle must not contain rebuilt capabilities: "
            + ", ".join(base_selected)
        )

    upstream_revision = apply_upstream_revision(
        graph=graph,
        core=core,
        lifecycle=lifecycle,
        decision_contracts=decision_contracts,
        policy=policy,
        skill_registry=skill_registry,
        knowledge_contracts=knowledge_contracts,
    )

    providers = provider_index(core)
    evidence = load_admission_evidence()
    admitted: list[str] = []
    evaluations: dict[str, Any] = {}

    while evidence:
        roadmaps = roadmaps_for(
            graph=graph,
            core=core,
            lifecycle=lifecycle,
            contracts=decision_contracts,
            policy=policy,
        )
        assert_create_purity(roadmaps, providers)
        ready = ready_units(roadmaps)
        executable = sorted(set(ready) & set(evidence))
        if not executable:
            raise SystemExit(
                "admission evidence is not executable from the current Harness Roadmaps: "
                + json.dumps(
                    {
                        "pending_evidence": sorted(evidence),
                        "ready": sorted(ready),
                        "blocked": roadmap_capabilities(roadmaps, "blocked"),
                    },
                    sort_keys=True,
                )
            )

        capability = executable[0]
        doc = evidence.pop(capability)
        unit = ready[capability]
        if doc.get("decision_request_mode", "CREATE") != unit["decision_request_mode"]:
            raise SystemExit(
                f"{capability} evidence mode does not match Roadmap mode"
            )

        result = admit_artifact(
            graph=graph,
            model=core,
            skill_registry=skill_registry,
            knowledge_contracts=knowledge_contracts,
            decision_contracts=decision_contracts,
            decision_policy=policy,
            decision_exploration=doc.get("decision_exploration"),
            capability=capability,
            sources=doc.get("sources", {}),
            candidate=doc.get("candidate", {}),
            acceptance_id=doc["acceptance_id"],
            lifecycle=lifecycle,
            decision_request_mode=unit["decision_request_mode"],
        )
        evaluations[capability] = result
        if result.get("status") != "ACCEPTED":
            raise SystemExit(
                f"strict semantic admission rejected {capability}: "
                + json.dumps(result.get("findings", []), sort_keys=True)
            )
        lifecycle["providers"].append(result["lifecycle_assertion"])
        validate_projection(graph, core, lifecycle)
        admitted.append(capability)

    roadmaps = roadmaps_for(
        graph=graph,
        core=core,
        lifecycle=lifecycle,
        contracts=decision_contracts,
        policy=policy,
    )
    assert_create_purity(roadmaps, providers)
    ready = ready_units(roadmaps)
    lifecycle_caps = set(lifecycle_index(lifecycle))

    summary = {
        "frontier_status": "READY" if ready else "EMPTY",
        "targets": list(TARGETS),
        "upstream_revision": {
            "capability": "prep.frontend-performance-capacity",
            "acceptance_id": upstream_revision["admission"]["acceptance_id"],
        },
        "admitted_rebuilt": admitted,
        "ready": sorted(ready),
        "blocked": roadmap_capabilities(roadmaps, "blocked"),
        "waiting_upstream": roadmap_capabilities(roadmaps, "waiting_upstream"),
        "completed_rebuilt": sorted(lifecycle_caps & REBUILT_CAPABILITIES),
    }
    print("FRONTEND DECISION REBUILD ROADMAP")
    print(json.dumps(summary, indent=2, sort_keys=False))
    print("UPSTREAM REVISION EVALUATION")
    print(json.dumps(upstream_revision, indent=2, sort_keys=False))
    print("ADMISSION EVALUATIONS")
    print(json.dumps(evaluations, indent=2, sort_keys=False))
    print("FINAL ROADMAPS")
    print(json.dumps(roadmaps, indent=2, sort_keys=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
