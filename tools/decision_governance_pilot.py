#!/usr/bin/env python3
from __future__ import annotations

import copy
import os
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))

if not (HARNESS_ROOT / "decision_explorer_request.py").exists():
    raise SystemExit(
        "Pinned Harness runtime does not contain Decision Explorer request support. "
        "Run python tools/bootstrap_harness.py or set HARNESS_ROOT."
    )

sys.path.insert(0, str(HARNESS_ROOT))

from decision_explorer_request import derive_decision_explorer_request  # noqa: E402
from engineering_graph import production_index  # noqa: E402
from semantic_admission import admit_artifact, knowledge_contract_index  # noqa: E402

from semantic_baseline import build_strict_semantic_baseline  # noqa: E402


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


def index_cases(path: Path, key: str) -> dict[str, dict[str, Any]]:
    document = load(path)
    return {
        item["capability"]: item[key]
        for item in document.get("cases", []) or []
        if isinstance(item, dict)
        and isinstance(item.get("capability"), str)
        and isinstance(item.get(key), dict)
    }


def baseline_review_index() -> dict[str, dict[str, Any]]:
    baseline = load(ROOT / ".harness/semantic-baseline.yaml")
    return {
        item["capability"]: item
        for item in baseline.get("reviews", []) or []
        if isinstance(item, dict) and isinstance(item.get("capability"), str)
    }


def with_kind_autonomy(
    policy: dict[str, Any],
    knowledge_kind: str,
    autonomy: str,
) -> dict[str, Any]:
    value = copy.deepcopy(policy)
    items = value.setdefault("knowledge_kinds", [])
    for item in items:
        if item.get("knowledge_kind") == knowledge_kind:
            item["autonomy"] = autonomy
            return value
    items.append({"knowledge_kind": knowledge_kind, "autonomy": autonomy})
    return value


def with_execution_assurance(
    policy: dict[str, Any],
    assurance: str,
) -> dict[str, Any]:
    value = copy.deepcopy(policy)
    value.setdefault("defaults", {})["execution_assurance"] = assurance
    return value


def with_axis_exploration(
    policy: dict[str, Any],
    knowledge_kind: str,
    axis: str,
    exploration: str,
) -> dict[str, Any]:
    value = copy.deepcopy(policy)
    items = value.setdefault("knowledge_kinds", [])
    target = None
    for item in items:
        if item.get("knowledge_kind") == knowledge_kind:
            target = item
            break
    if target is None:
        target = {"knowledge_kind": knowledge_kind}
        items.append(target)
    overrides = target.setdefault("axes", [])
    for item in overrides:
        if item.get("axis") == axis:
            item["exploration"] = exploration
            return value
    overrides.append({"axis": axis, "exploration": exploration})
    return value


def bind_exploration(
    *,
    template: dict[str, Any],
    graph: dict[str, Any],
    core: dict[str, Any],
    decision_contracts: dict[str, Any],
    policy: dict[str, Any],
    capability: str,
    lifecycle: dict[str, Any],
) -> tuple[dict[str, Any], dict[str, Any]]:
    production = production_index(graph)[capability]
    prerequisites = production.get("requires", []) or []
    request = derive_decision_explorer_request(
        graph=graph,
        model=core,
        decision_contracts=decision_contracts,
        decision_policy=policy,
        capability=capability,
        lifecycle=lifecycle if prerequisites else None,
    )
    if request is None:
        raise SystemExit(f"{capability}: explorer request unexpectedly NOT_REQUIRED")
    evidence = copy.deepcopy(template)
    evidence["explorer_request_id"] = request["request_id"]
    return evidence, request


def candidate_for(
    *,
    capability: str,
    decision_review: dict[str, Any],
    productions: dict[str, dict[str, Any]],
    providers: dict[str, dict[str, Any]],
    semantic_contracts: dict[str, dict[str, Any]],
    reviews: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    production = productions[capability]
    artifact = providers[capability]
    knowledge_kind = production["knowledge_kind"]
    semantic_contract = semantic_contracts[knowledge_kind]
    review = reviews[capability]
    prerequisites = [
        requirement["capability"]
        for requirement in production.get("requires", []) or []
    ]
    return {
        "id": artifact["id"],
        "path": artifact["path"],
        "capability": capability,
        "changed_paths": [],
        "canonical_references": [
            {"referenced_path": providers[upstream]["path"]}
            for upstream in prerequisites
        ],
        "semantic_assertions": [],
        "semantic_review": {
            "status": "ACCEPTED",
            "checks": semantic_contract.get("required_review_checks", []) or [],
            "basis": review["basis"],
        },
        "decision_review": copy.deepcopy(decision_review),
    }


def run_case(
    *,
    name: str,
    capability: str,
    decision_review: dict[str, Any],
    exploration: dict[str, Any] | None,
    policy: dict[str, Any],
    expected_status: str,
    expected_finding: str | None,
    graph: dict[str, Any],
    core: dict[str, Any],
    registry: dict[str, Any],
    contracts_document: dict[str, Any],
    decision_contracts: dict[str, Any],
    productions: dict[str, dict[str, Any]],
    providers: dict[str, dict[str, Any]],
    semantic_contracts: dict[str, dict[str, Any]],
    reviews: dict[str, dict[str, Any]],
    lifecycle: dict[str, Any],
) -> None:
    candidate = candidate_for(
        capability=capability,
        decision_review=decision_review,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
    )
    prerequisites = productions[capability].get("requires", []) or []
    result = admit_artifact(
        graph=graph,
        model=core,
        skill_registry=registry,
        knowledge_contracts=contracts_document,
        decision_contracts=decision_contracts,
        decision_policy=policy,
        decision_exploration=copy.deepcopy(exploration),
        capability=capability,
        sources={"semantic_assertions": []},
        candidate=candidate,
        acceptance_id=f"prep-decision-governance-v4::{name}",
        lifecycle=lifecycle if prerequisites else None,
    )
    actual = result["status"]
    codes = {item["code"] for item in result.get("findings", [])}
    if actual != expected_status:
        raise SystemExit(
            f"{name}: expected {expected_status}, got {actual}: "
            f"{result.get('findings')}"
        )
    if expected_finding is not None and expected_finding not in codes:
        raise SystemExit(
            f"{name}: expected finding {expected_finding}, got {sorted(codes)}"
        )
    exploration_result = result.get("decision_exploration", {})
    governance = result.get("decision_governance", {})
    print(
        f"{name}: {actual}; "
        f"exploration={exploration_result.get('status', 'NOT_REQUIRED')}; "
        f"governance={governance.get('status', 'NOT_REQUIRED')}; "
        f"findings={','.join(sorted(codes)) or '-'}"
    )


def main() -> int:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    contracts_document = load(
        HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
    )
    decision_contracts = load(
        HARNESS_ROOT
        / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml"
    )
    policy = load(ROOT / ".harness/decision-policy.yaml")
    productions = production_index(graph)
    providers = provider_index(core)
    reviews = baseline_review_index()
    semantic_contracts = knowledge_contract_index(contracts_document)
    governance_cases = index_cases(
        ROOT / ".harness/candidates/decision-governance-pilot.yaml",
        "decision_review",
    )
    exploration_cases = index_cases(
        ROOT / ".harness/candidates/decision-exploration-pilot.yaml",
        "exploration",
    )

    evaluations, lifecycle = build_strict_semantic_baseline(graph, core)
    print(
        "legacy strict baseline with no decision policy: ACCEPTED "
        f"({len(evaluations['semantic_evaluations'])} capabilities)"
    )

    architecture_capability = "prep.system-architecture"
    architecture_review = governance_cases[architecture_capability]
    architecture_template = exploration_cases[architecture_capability]

    # Mode 1: post-hoc/self-attested evidence may look structurally blind, but is
    # rejected because it is not bound to the Harness-generated pre-choice request.
    run_case(
        name="POSTHOC-UNBOUND-EXPLORATION",
        capability=architecture_capability,
        decision_review=architecture_review,
        exploration=architecture_template,
        policy=policy,
        expected_status="REJECTED",
        expected_finding="DECISION_EXPLORER_REQUEST_MISMATCH",
        graph=graph,
        core=core,
        registry=registry,
        contracts_document=contracts_document,
        decision_contracts=decision_contracts,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
        lifecycle=lifecycle,
    )

    # Mode 2: derive the exact candidate-free Explorer Request before production,
    # then bind the exploration result to that request identity.
    architecture_exploration, architecture_request = bind_exploration(
        template=architecture_template,
        graph=graph,
        core=core,
        decision_contracts=decision_contracts,
        policy=policy,
        capability=architecture_capability,
        lifecycle=lifecycle,
    )
    candidate_path = providers[architecture_capability]["path"]
    request_paths = {
        item["path"] for item in architecture_request["canonical_inputs"]
    }
    if candidate_path in request_paths:
        raise SystemExit(
            "Explorer Request leaked the current/candidate architecture artifact"
        )
    if "candidate" not in architecture_request["forbidden_inputs"]:
        raise SystemExit("Explorer Request does not explicitly forbid candidate input")
    print(
        "ISOLATED-REQUEST-CONTEXT: "
        f"{architecture_request['request_id']}; "
        f"candidate_path_excluded={candidate_path not in request_paths}"
    )

    run_case(
        name="SYSTEM-ARCHITECTURE-REQUEST-BOUND",
        capability=architecture_capability,
        decision_review=architecture_review,
        exploration=architecture_exploration,
        policy=policy,
        expected_status="ACCEPTED",
        expected_finding=None,
        graph=graph,
        core=core,
        registry=registry,
        contracts_document=contracts_document,
        decision_contracts=decision_contracts,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
        lifecycle=lifecycle,
    )

    # Stronger isolation must not be faked by producer-owned metadata. Until a
    # trusted external executor/verifier exists, a project that requires
    # ATTESTED_ISOLATED must fail closed.
    attested_policy = with_execution_assurance(
        policy,
        "ATTESTED_ISOLATED",
    )
    attested_exploration, _ = bind_exploration(
        template=architecture_template,
        graph=graph,
        core=core,
        decision_contracts=decision_contracts,
        policy=attested_policy,
        capability=architecture_capability,
        lifecycle=lifecycle,
    )
    run_case(
        name="ATTESTED-ISOLATION-WITHOUT-TRUSTED-VERIFIER",
        capability=architecture_capability,
        decision_review=architecture_review,
        exploration=attested_exploration,
        policy=attested_policy,
        expected_status="REJECTED",
        expected_finding="DECISION_TRUSTED_EXECUTION_VERIFIER_REQUIRED",
        graph=graph,
        core=core,
        registry=registry,
        contracts_document=contracts_document,
        decision_contracts=decision_contracts,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
        lifecycle=lifecycle,
    )

    lazy = copy.deepcopy(architecture_exploration)
    runtime = next(
        item for item in lazy["axes"] if item["axis"] == "runtime-boundaries"
    )
    runtime["decision_points"] = []
    for probe in runtime["probes"]:
        probe["alternatives"] = []
    run_case(
        name="LAZY-EMPTY-DECISION-SURFACE",
        capability=architecture_capability,
        decision_review=architecture_review,
        exploration=lazy,
        policy=policy,
        expected_status="REJECTED",
        expected_finding="DECISION_POINT_DISCOVERY_REQUIRED",
        graph=graph,
        core=core,
        registry=registry,
        contracts_document=contracts_document,
        decision_contracts=decision_contracts,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
        lifecycle=lifecycle,
    )

    contaminated = copy.deepcopy(architecture_exploration)
    contaminated["axes"][0]["selected"] = "single-backend-runtime"
    run_case(
        name="CONTAMINATED-PRECHOICE-EXPLORATION",
        capability=architecture_capability,
        decision_review=architecture_review,
        exploration=contaminated,
        policy=policy,
        expected_status="REJECTED",
        expected_finding="DECISION_EXPLORATION_NOT_BLIND",
        graph=graph,
        core=core,
        registry=registry,
        contracts_document=contracts_document,
        decision_contracts=decision_contracts,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
        lifecycle=lifecycle,
    )

    fake_diversity = copy.deepcopy(architecture_exploration)
    runtime = next(
        item
        for item in fake_diversity["axes"]
        if item["axis"] == "runtime-boundaries"
    )
    alternatives = runtime["decision_points"][0]["alternatives"]
    alternatives[1]["material_effects"] = copy.deepcopy(
        alternatives[0]["material_effects"]
    )
    run_case(
        name="FAKE-ALTERNATIVE-DIVERSITY",
        capability=architecture_capability,
        decision_review=architecture_review,
        exploration=fake_diversity,
        policy=policy,
        expected_status="REJECTED",
        expected_finding="DECISION_ALTERNATIVES_NOT_MATERIALLY_DISTINCT",
        graph=graph,
        core=core,
        registry=registry,
        contracts_document=contracts_document,
        decision_contracts=decision_contracts,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
        lifecycle=lifecycle,
    )

    missing_research = copy.deepcopy(architecture_exploration)
    missing_research["research_sources"] = []
    interaction = next(
        item
        for item in missing_research["axes"]
        if item["axis"] == "interaction-model"
    )
    interaction["research_sources"] = []
    run_case(
        name="SYSTEM-ARCHITECTURE-RESEARCH-MISSING",
        capability=architecture_capability,
        decision_review=architecture_review,
        exploration=missing_research,
        policy=policy,
        expected_status="REJECTED",
        expected_finding="DECISION_RESEARCH_EVIDENCE_MISSING",
        graph=graph,
        core=core,
        registry=registry,
        contracts_document=contracts_document,
        decision_contracts=decision_contracts,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
        lifecycle=lifecycle,
    )

    # Exploration policy is part of the request identity. Reusing old evidence
    # after increasing required exploration depth must fail before semantic use.
    stricter_policy = with_axis_exploration(
        policy,
        "system-architecture",
        "runtime-boundaries",
        "RESEARCH",
    )
    run_case(
        name="STALE-EXPLORER-REQUEST-AFTER-POLICY-CHANGE",
        capability=architecture_capability,
        decision_review=architecture_review,
        exploration=architecture_exploration,
        policy=stricter_policy,
        expected_status="REJECTED",
        expected_finding="DECISION_EXPLORER_REQUEST_MISMATCH",
        graph=graph,
        core=core,
        registry=registry,
        contracts_document=contracts_document,
        decision_contracts=decision_contracts,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
        lifecycle=lifecycle,
    )

    implementation_capability = "prep.frontend-implementation-design"
    implementation_review = governance_cases[implementation_capability]
    implementation_template = exploration_cases[implementation_capability]
    implementation_exploration, _ = bind_exploration(
        template=implementation_template,
        graph=graph,
        core=core,
        decision_contracts=decision_contracts,
        policy=policy,
        capability=implementation_capability,
        lifecycle=lifecycle,
    )

    run_case(
        name="IMPLEMENTATION-CONSERVATIVE-AUTONOMY",
        capability=implementation_capability,
        decision_review=implementation_review,
        exploration=implementation_exploration,
        policy=policy,
        expected_status="REJECTED",
        expected_finding="DECISION_AUTONOMY_EXCEEDED",
        graph=graph,
        core=core,
        registry=registry,
        contracts_document=contracts_document,
        decision_contracts=decision_contracts,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
        lifecycle=lifecycle,
    )

    broad_policy = with_kind_autonomy(
        policy, "implementation-design", "BROAD"
    )
    # Autonomy changes governance, not exploration diligence, so the same
    # Explorer Request remains valid under BROAD autonomy.
    run_case(
        name="IMPLEMENTATION-BROAD-AUTONOMY",
        capability=implementation_capability,
        decision_review=implementation_review,
        exploration=implementation_exploration,
        policy=broad_policy,
        expected_status="ACCEPTED",
        expected_finding=None,
        graph=graph,
        core=core,
        registry=registry,
        contracts_document=contracts_document,
        decision_contracts=decision_contracts,
        productions=productions,
        providers=providers,
        semantic_contracts=semantic_contracts,
        reviews=reviews,
        lifecycle=lifecycle,
    )

    print("PREP DECISION GOVERNANCE V4 PILOT PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
