#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[2]
EXP = ROOT / "experiments/reference_model_rematerialization"
HARNESS = ROOT / ".harness-reference"
GRAPH_PATH = EXP / "generated/engineering-graph.yaml"
OUT = EXP / "new-harness"


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def dump(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.safe_dump(value, sort_keys=False, allow_unicode=True), encoding="utf-8")


def production_index(graph: dict[str, Any]) -> dict[str, dict[str, Any]]:
    result = {}
    for authority in graph.get("authorities", []) or []:
        for production in authority.get("produces", []) or []:
            result[production["capability"]] = {
                **production,
                "authority": authority["id"],
            }
    return result


BINDINGS = [
    {
        "id": "PROBLEM-SPACE",
        "authority": "DISCOVERY",
        "path": "docs/vision/problem-space.md",
        "exact": [
            "prep-reference-v0.problem-evidence",
            "prep-reference-v0.user-needs",
        ],
    },
    {
        "id": "PRODUCT-VISION",
        "authority": "PRODUCT-REQUIREMENTS",
        "path": "docs/vision/vision.md",
        "exact": ["prep-reference-v0.product-intent"],
    },
    {
        "id": "PRODUCT-CAPABILITIES",
        "authority": "PRODUCT-REQUIREMENTS",
        "path": "docs/vision/product-capabilities.md",
        "exact": ["prep-reference-v0.product-acceptance"],
    },
    {
        "id": "CONTEXT-MAP",
        "authority": "DOMAIN-STRATEGY",
        "path": "docs/architecture/context-map.md",
        "exact": ["prep-reference-v0.domain-strategy"],
    },
    {
        "id": "MODEL-CONTEXT-MAP",
        "authority": "MODEL-CONTEXT-STRATEGY",
        "path": "docs/architecture/model-context-map.md",
        "exact": ["prep-reference-v0.model-context-strategy"],
    },
    {
        "id": "KNOWLEDGE-MODEL",
        "authority": "TACTICAL-DOMAIN-DESIGN",
        "path": "docs/domain/knowledge-model.md",
        "exact": ["prep-reference-v0.domain-model.knowledge-model"],
    },
    {
        "id": "LEARNING-DESIGN",
        "authority": "TACTICAL-DOMAIN-DESIGN",
        "path": "docs/domain/learning-design.md",
        "exact": ["prep-reference-v0.domain-model.learning-design"],
    },
    {
        "id": "LEARNER-MODEL",
        "authority": "TACTICAL-DOMAIN-DESIGN",
        "path": "docs/domain/learner-model.md",
        "exact": ["prep-reference-v0.domain-model.learner-model"],
    },
    {
        "id": "APPLICATION-DESIGN",
        "authority": "APPLICATION-DESIGN",
        "path": "docs/application/application-design.md",
        "exact": [
            "prep-reference-v0.application-failure-contract",
            "prep-reference-v0.application-orchestration",
        ],
    },
    {
        "id": "TASK-MODEL",
        "authority": "APPLICATION-DESIGN",
        "path": "docs/application/task-model.yaml",
        "exact": ["prep-reference-v0.task-model"],
    },
    {
        "id": "USER-JOURNEYS",
        "authority": "APPLICATION-DESIGN",
        "path": "docs/application/user-journeys.md",
        "exact": ["prep-reference-v0.user-journey"],
    },
    {
        "id": "SYSTEM-ARCHITECTURE",
        "authority": "SYSTEM-ARCHITECTURE",
        "path": "docs/architecture/system-architecture.md",
        "exact": [
            "prep-reference-v0.system-structure",
            "prep-reference-v0.runtime-architecture",
        ],
    },
    {
        "id": "FRONTEND-SYSTEM-ARCHITECTURE",
        "authority": "SYSTEM-ARCHITECTURE",
        "path": "docs/architecture/frontend-system-architecture.md",
        "exact": ["prep-reference-v0.system-boundary-rules"],
    },
    {
        "id": "IMPORT-CONSISTENCY",
        "authority": "CONCURRENCY-CONSISTENCY-DESIGN",
        "path": "docs/architecture/import-consistency.md",
        "exact": ["prep-reference-v0.concurrency-consistency"],
    },
    {
        "id": "MACHINE-INTERFACES",
        "authority": "MACHINE-INTERFACE-DESIGN",
        "path": "docs/interface/machine-interface.md",
        "prefix": "prep-reference-v0.machine-interface-contract.",
    },
    {
        "id": "CONCEPTUAL-INTERFACE-MODEL",
        "authority": "HUMAN-INTERFACE-DESIGN",
        "path": "docs/interface/conceptual-interface-model.yaml",
        "exact": ["prep-reference-v0.conceptual-interface-model"],
    },
    {
        "id": "INFORMATION-ARCHITECTURE",
        "authority": "HUMAN-INTERFACE-DESIGN",
        "path": "docs/interface/information-architecture.yaml",
        "exact": ["prep-reference-v0.information-architecture"],
    },
    {
        "id": "INTERACTION-DESIGN",
        "authority": "HUMAN-INTERFACE-DESIGN",
        "path": "docs/interface/interaction-design.yaml",
        "exact": ["prep-reference-v0.interaction-design"],
    },
    {
        "id": "INTERFACE-TOPOLOGY",
        "authority": "HUMAN-INTERFACE-DESIGN",
        "path": "docs/interface/interface-topology.yaml",
        "exact": ["prep-reference-v0.interface-topology"],
    },
    {
        "id": "PRESENTATION-SYSTEM",
        "authority": "HUMAN-INTERFACE-DESIGN",
        "path": "docs/interface/presentation-system.md",
        "exact": ["prep-reference-v0.presentation-system"],
    },
    {
        "id": "SCREEN-VIEW-DESIGN",
        "authority": "HUMAN-INTERFACE-DESIGN",
        "path": "docs/interface/screen-view-design.md",
        "prefix": "prep-reference-v0.screen-view-design.",
    },
    {
        "id": "DATA-DESIGN",
        "authority": "DATA-DESIGN",
        "path": "docs/architecture/data-design.md",
        "exact": ["prep-reference-v0.data-design"],
    },
    {
        "id": "FRONTEND-PERFORMANCE-CAPACITY",
        "authority": "QUALITY-DESIGN",
        "path": "docs/architecture/performance-capacity.md",
        "exact": ["prep-reference-v0.quality-design"],
    },
    {
        "id": "FRONTEND-ENGINEERING-POLICY",
        "authority": "ENGINEERING-POLICY",
        "path": "docs/engineering/frontend-engineering-policy.md",
        "exact": ["prep-reference-v0.engineering-policy"],
    },
    {
        "id": "FRONTEND-COMPONENT-DESIGN",
        "authority": "COMPONENT-DESIGN",
        "path": "docs/implementation/frontend-component-design.md",
        "exact": ["prep-reference-v0.component-design"],
    },
    {
        "id": "FRONTEND-VERIFICATION",
        "authority": "VERIFICATION-DESIGN",
        "path": "docs/verification/frontend-verification.md",
        "exact": ["prep-reference-v0.design-verification-obligations"],
    },
    {
        "id": "INTERFACE-VERIFICATION",
        "authority": "VERIFICATION-DESIGN",
        "path": "docs/verification/interface-verification.md",
        "exact": ["prep-reference-v0.realization-verification-plan"],
    },
    {
        "id": "PRESENTATION-VERIFICATION",
        "authority": "VERIFICATION-DESIGN",
        "path": "docs/verification/presentation-verification.md",
        "exact": ["prep-reference-v0.acceptance-scenarios"],
    },
    {
        "id": "FRONTEND-TEST-DESIGN",
        "authority": "TEST-DESIGN",
        "path": "docs/verification/frontend-test-design.yaml",
        "exact": ["prep-reference-v0.test-design"],
    },
    {
        "id": "FRONTEND-IMPLEMENTATION-DESIGN",
        "authority": "IMPLEMENTATION-DESIGN",
        "path": "docs/implementation/frontend-implementation-design.md",
        "exact": [
            "prep-reference-v0.implementation-stack",
            "prep-reference-v0.implementation-plan",
            "prep-reference-v0.completion-criteria",
        ],
    },
]

# Deliberately unbound on the first pass. The canonical PREP corpus has no
# independently owned provider at these Reference Model authorities. Creating one
# merely to make the graph green would hide the experiment's counterexample.
INTENTIONALLY_UNBOUND = {
    "prep-reference-v0.security-architecture",
    "prep-reference-v0.security-analysis",
    "prep-reference-v0.operability-design",
}


def selected_capabilities(binding: dict[str, Any], productions: dict[str, Any]) -> list[str]:
    result = list(binding.get("exact", []))
    prefix = binding.get("prefix")
    if prefix:
        result.extend(sorted(cap for cap in productions if cap.startswith(prefix)))
    return sorted(set(result))


def main() -> int:
    graph = load(GRAPH_PATH)
    productions = production_index(graph)

    cap_to_artifact: dict[str, str] = {}
    artifacts: list[dict[str, Any]] = []

    for binding in BINDINGS:
        capabilities = selected_capabilities(binding, productions)
        if not capabilities:
            raise SystemExit(f"binding {binding['id']} selects no generated capability")
        for capability in capabilities:
            if capability not in productions:
                raise SystemExit(f"binding {binding['id']} references unknown {capability}")
            actual_authority = productions[capability]["authority"]
            if actual_authority != binding["authority"]:
                raise SystemExit(
                    f"{binding['id']} authority mismatch for {capability}: "
                    f"{binding['authority']} != {actual_authority}"
                )
            if capability in cap_to_artifact:
                raise SystemExit(f"duplicate provider binding for {capability}")
            cap_to_artifact[capability] = binding["id"]

        artifacts.append(
            {
                "id": binding["id"],
                "authority": binding["authority"],
                "path": binding["path"],
                "provides": capabilities,
                "depends_on": [],
            }
        )

    unexpected_unbound = sorted(
        set(productions) - set(cap_to_artifact) - INTENTIONALLY_UNBOUND
    )
    missing_expected = sorted(INTENTIONALLY_UNBOUND - set(productions))
    if unexpected_unbound or missing_expected:
        raise SystemExit(
            f"provider binding inventory mismatch: unexpected_unbound={unexpected_unbound} "
            f"missing_expected={missing_expected}"
        )

    by_artifact = {item["id"]: item for item in artifacts}
    for artifact in artifacts:
        dependencies: set[str] = set()
        for capability in artifact["provides"]:
            for requirement in productions[capability].get("requires", []) or []:
                provider = cap_to_artifact.get(requirement["capability"])
                if provider and provider != artifact["id"]:
                    dependencies.add(provider)
        artifact["depends_on"] = sorted(dependencies)

    core = {
        "authorities": [],
        "artifacts": artifacts,
        "questions": [],
    }
    dump(OUT / "core.yaml", core)

    reviews = []
    for capability in sorted(cap_to_artifact):
        artifact_id = cap_to_artifact[capability]
        artifact = by_artifact[artifact_id]
        reviews.append(
            {
                "capability": capability,
                "revision": 1,
                "basis": (
                    f"Frozen v0 rematerialization provider binding: canonical "
                    f"{artifact['path']} is reused for {capability}; binding derived "
                    f"from the NEW capability responsibility/knowledge kind, not OLD CapabilityId topology."
                ),
            }
        )
    dump(
        OUT / "semantic-baseline.yaml",
        {
            "version": 1,
            "kind": "prep-semantic-baseline",
            "baseline_id": "PREP-REFERENCE-V0-FROZEN",
            "reviews": reviews,
        },
    )

    catalog = load(HARNESS / "catalogs/software-authorities-v0.yaml")
    required_authorities = {item["id"] for item in graph.get("authorities", []) or []}
    assessments = []
    for row in catalog.get("authorities", []) or []:
        authority_id = row["id"]
        applicability = "REQUIRED" if authority_id in required_authorities else "NOT_APPLICABLE"
        assessments.append(
            {
                "authority_id": authority_id,
                "applicability": applicability,
                "evidence": [
                    "experiments/reference_model_rematerialization/project-facts.yaml",
                    "experiments/reference_model_rematerialization/generated/materialization-result.json",
                ],
                "rationale": (
                    "Frozen Reference Model v0 materialized at least one required project capability "
                    "under this Authority from accepted Project Facts."
                    if applicability == "REQUIRED"
                    else
                    "Frozen Reference Model v0 materialized no required project capability under "
                    "this Authority for the accepted Project Facts snapshot."
                ),
                "depends_on_evidence": [
                    "experiments/reference_model_rematerialization/project-facts.yaml"
                ],
                "reopening_conditions": [
                    "accepted Project Facts or frozen Reference Model applicability rules change"
                ],
            }
        )
    dump(
        OUT / "authority-assessments.yaml",
        {
            "version": 1,
            "kind": "harness-project-authority-assessments",
            "assessments": assessments,
        },
    )

    dump(
        OUT / "engineering-coverage.yaml",
        {
            "version": 1,
            "kind": "prep-engineering-coverage-overlay",
            "project": "PREP-REFERENCE-V0",
            "subject_inventory": {
                "state": "DEFERRED",
                "rationale": (
                    "First frozen run intentionally does not copy OLD coverage decisions; "
                    "coverage is evaluated from the NEW graph before any project overlay is accepted."
                ),
            },
            "decisions": [],
        },
    )

    sys.path.insert(0, str(HARNESS))
    from engineering_graph import evaluate_engineering_target, validate_realization

    validate_realization(graph, core)
    target = evaluate_engineering_target(graph, "FRONTEND-IMPLEMENTATION", core)
    (OUT / "target-state.json").write_text(
        json.dumps(target, indent=2, sort_keys=True), encoding="utf-8"
    )

    summary = {
        "version": 1,
        "kind": "prep-reference-new-harness-build-summary",
        "graph_capability_count": len(productions),
        "bound_capability_count": len(cap_to_artifact),
        "unbound_capabilities": sorted(set(productions) - set(cap_to_artifact)),
        "artifact_count": len(artifacts),
        "target_status": target["status"],
        "create": [item["capability"] for item in target.get("create", [])],
        "wait": [item["capability"] for item in target.get("wait", [])],
        "pending": [item["capability"] for item in target.get("pending", [])],
    }
    dump(OUT / "build-summary.yaml", summary)
    print(yaml.safe_dump(summary, sort_keys=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
