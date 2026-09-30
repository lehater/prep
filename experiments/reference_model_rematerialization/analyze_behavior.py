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
OLD = EXP / "baseline/old-harness"
NEW = EXP / "new-harness"


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def dump(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.safe_dump(value, sort_keys=False, allow_unicode=True), encoding="utf-8")


def provider_index(core: dict[str, Any]) -> dict[str, dict[str, Any]]:
    result = {}
    for artifact in core.get("artifacts", []) or []:
        for cap in artifact.get("provides", []) or []:
            result[cap] = artifact
    return result


def synthetic_complete_new_core(graph: dict[str, Any], core: dict[str, Any]) -> tuple[dict[str, Any], list[str]]:
    result = copy.deepcopy(core)
    providers = provider_index(result)
    owner = {}
    for authority in graph.get("authorities", []) or []:
        for prod in authority.get("produces", []) or []:
            owner[prod["capability"]] = authority["id"]
    missing = sorted(set(owner) - set(providers))
    for i, cap in enumerate(missing, 1):
        result.setdefault("artifacts", []).append({
            "id": f"SYNTHETIC-TOPOLOGY-PROVIDER-{i}",
            "authority": owner[cap],
            "path": f"experiments/reference_model_rematerialization/synthetic/{i}.yaml",
            "provides": [cap],
            "depends_on": [],
        })
    return result, missing


def lifecycle_projection(graph: dict[str, Any], core: dict[str, Any]) -> dict[str, Any]:
    providers = provider_index(core)
    rows = []
    for authority in graph.get("authorities", []) or []:
        for prod in authority.get("produces", []) or []:
            cap = prod["capability"]
            artifact = providers.get(cap)
            if artifact is None:
                continue
            reqs = [
                r["capability"] if isinstance(r, dict) else r
                for r in (prod.get("requires", []) or [])
            ]
            rows.append({
                "artifact": artifact["id"],
                "capability": cap,
                "acceptance_id": f"acceptance-v1::{cap}",
                "accepted_prerequisites": {
                    req: f"acceptance-v1::{req}" for req in sorted(reqs)
                },
                "semantic_atom_fingerprints": {},
                "accepted_prerequisite_semantics": {},
            })
    return {
        "version": 1,
        "kind": "harness-capability-lifecycle",
        "providers": rows,
    }


def mutate_projection(projection: dict[str, Any], seeds: list[str]) -> dict[str, Any]:
    result = copy.deepcopy(projection)
    seed_set = set(seeds)
    for row in result.get("providers", []) or []:
        if row["capability"] in seed_set:
            row["acceptance_id"] = f"acceptance-v2::{row['capability']}"
    return result


def stale_after(lifecycle_states, graph, core, base_projection, seeds):
    mutated = mutate_projection(base_projection, seeds)
    states = lifecycle_states(graph, core, mutated)
    return sorted(cap for cap, row in states.items() if row["state"] == "STALE")


def target_provider_paths(derive_profile, graph, core, target):
    profile = derive_profile(graph, target)
    providers = provider_index(core)
    paths = set()
    missing = []
    for exp in profile["expectations"]:
        cap = exp["capability"]
        provider = providers.get(cap)
        if provider is None:
            missing.append(cap)
        else:
            paths.add(provider["path"])
    return {
        "capability_count": len(profile["expectations"]),
        "unique_provider_path_count": len(paths),
        "provider_paths": sorted(paths),
        "missing_provider_capabilities": sorted(missing),
    }


def context_digest(ctx: dict[str, Any]) -> dict[str, Any]:
    return {
        "status": ctx["status"],
        "selected_outputs": ctx["selected_outputs"],
        "requirement_count": len(ctx["requirements"]),
        "satisfied_requirement_count": sum(1 for x in ctx["requirements"] if x["status"] == "SATISFIED"),
        "gap_requirement_count": sum(1 for x in ctx["requirements"] if x["status"] != "SATISFIED"),
        "input_artifact_count": len(ctx["input_artifacts"]),
        "supporting_input_artifact_count": len(ctx["supporting_input_artifacts"]),
        "owned_artifact_count": len(ctx["owned_artifacts"]),
        "allowed_read_path_count": len(ctx["access"]["read"]),
        "allowed_read_paths": ctx["access"]["read"],
        "blockers": [
            {
                "capability": x["capability"],
                "status": x["status"],
                "authority": x["authority"],
            }
            for x in ctx["blockers"]
        ],
    }


def route_digest(value: dict[str, Any]) -> dict[str, Any]:
    return {
        "target_status": value["target_status"],
        "routed": value["routed"],
        "unrouted": value["unrouted"],
        "wait_count": len(value["wait"]),
        "pending_count": len(value["pending"]),
    }


def main() -> int:
    sys.path.insert(0, str(HARNESS))
    from agent_router import route_create_work
    from authority_context import build_authority_context
    from capability_lifecycle import lifecycle_states
    from engineering_graph import derive_profile

    old_graph = load(OLD / "engineering-graph.yaml")
    new_graph = load(EXP / "generated/engineering-graph.yaml")
    old_core = load(OLD / "core.yaml")
    new_core = load(NEW / "core.yaml")
    registry = load(HARNESS / "skills/artifact-skill-registry-v0.yaml")

    synthetic_new_core, synthetic_caps = synthetic_complete_new_core(new_graph, new_core)
    old_projection = lifecycle_projection(old_graph, old_core)
    new_projection = lifecycle_projection(new_graph, synthetic_new_core)

    old_initial = lifecycle_states(old_graph, old_core, old_projection)
    new_initial = lifecycle_states(new_graph, synthetic_new_core, new_projection)
    if any(row["state"] != "CURRENT" for row in old_initial.values()):
        raise SystemExit("OLD synthetic lifecycle baseline must start CURRENT")
    if any(row["state"] != "CURRENT" for row in new_initial.values()):
        raise SystemExit("NEW synthetic lifecycle baseline must start CURRENT")

    mutations = {
        "product_intent": {
            "old": ["prep.product-intent", "prep.product-capabilities"],
            "new": ["prep-reference-v0.product-intent", "prep-reference-v0.product-acceptance"],
        },
        "knowledge_domain": {
            "old": ["prep.knowledge-model"],
            "new": ["prep-reference-v0.domain-model.knowledge-model"],
        },
        "machine_interface": {
            "old": ["prep.machine-interfaces"],
            "new": [
                "prep-reference-v0.machine-interface-contract.prep-application-api",
                "prep-reference-v0.machine-interface-contract.external-learning-runtime",
            ],
        },
        "presentation": {
            "old": ["prep.presentation-system"],
            "new": ["prep-reference-v0.presentation-system"],
        },
        "persistence": {
            "old": ["prep.data-design", "prep.import-consistency"],
            "new": ["prep-reference-v0.data-design", "prep-reference-v0.concurrency-consistency"],
        },
    }

    lifecycle_results = {}
    for name, pair in mutations.items():
        old_stale = stale_after(
            lifecycle_states, old_graph, old_core, old_projection, pair["old"]
        )
        new_stale = stale_after(
            lifecycle_states, new_graph, synthetic_new_core, new_projection, pair["new"]
        )
        lifecycle_results[name] = {
            "old_mutated_capabilities": pair["old"],
            "old_stale_count": len(old_stale),
            "old_stale": old_stale,
            "new_mutated_capabilities": pair["new"],
            "new_stale_count": len(new_stale),
            "new_stale": new_stale,
        }

    old_route = route_create_work(old_graph, "FRONTEND-IMPLEMENTATION", old_core, registry)
    new_route = route_create_work(new_graph, "FRONTEND-IMPLEMENTATION", new_core, registry)

    old_ctx = build_authority_context(
        old_graph,
        old_core,
        "IMPLEMENTATION-DESIGN",
        ["prep.frontend-implementation-design"],
    )
    new_ctx_real = build_authority_context(
        new_graph,
        new_core,
        "IMPLEMENTATION-DESIGN",
        ["prep-reference-v0.implementation-plan"],
    )
    new_ctx_topology_only = build_authority_context(
        new_graph,
        synthetic_new_core,
        "IMPLEMENTATION-DESIGN",
        ["prep-reference-v0.implementation-plan"],
    )

    output = {
        "version": 1,
        "kind": "prep-reference-behavioral-comparison",
        "lifecycle_mutations": lifecycle_results,
        "lifecycle_method": {
            "old": "Canonical Core providers with synthetic acceptance ids; only selected upstream acceptance ids changed.",
            "new": "Same method; three unrelated missing providers are filled by explicitly synthetic topology-only fixtures so propagation can be compared independently of realization gaps.",
            "synthetic_new_capabilities": synthetic_caps,
        },
        "agent_routing": {
            "old": route_digest(old_route),
            "new": route_digest(new_route),
        },
        "consumer_context": {
            "old_frontend_implementation": target_provider_paths(
                derive_profile, old_graph, old_core, "FRONTEND-IMPLEMENTATION"
            ),
            "new_frontend_implementation": target_provider_paths(
                derive_profile, new_graph, new_core, "FRONTEND-IMPLEMENTATION"
            ),
        },
        "implementation_authority_context": {
            "old": context_digest(old_ctx),
            "new_real": context_digest(new_ctx_real),
            "new_topology_only": context_digest(new_ctx_topology_only),
        },
    }

    dump(EXP / "analysis/behavioral-comparison.yaml", output)
    dump(EXP / "analysis/lifecycle-old-fixture.yaml", old_projection)
    dump(EXP / "analysis/lifecycle-new-topology-fixture.yaml", new_projection)
    print(json.dumps({
        "lifecycle_counts": {
            name: {
                "old": row["old_stale_count"],
                "new": row["new_stale_count"],
            }
            for name, row in lifecycle_results.items()
        },
        "old_route": route_digest(old_route),
        "new_route": route_digest(new_route),
        "old_context": context_digest(old_ctx),
        "new_context": context_digest(new_ctx_real),
    }, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
