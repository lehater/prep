#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from collections import Counter, defaultdict, deque
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[2]
EXP = ROOT / "experiments/reference_model_rematerialization"
OLD = EXP / "baseline/old-harness"
NEW = EXP / "new-harness"
HARNESS = ROOT / ".harness-reference"


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def dump(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.safe_dump(value, sort_keys=False, allow_unicode=True), encoding="utf-8")


def productions(graph: dict[str, Any]) -> dict[str, dict[str, Any]]:
    out = {}
    for authority in graph.get("authorities", []) or []:
        for prod in authority.get("produces", []) or []:
            if isinstance(prod, str):
                prod = {"capability": prod, "requires": []}
            out[prod["capability"]] = {
                **prod,
                "authority": authority["id"],
                "requires": [
                    r if isinstance(r, dict) else {"capability": r}
                    for r in (prod.get("requires", []) or [])
                ],
            }
    return out


def reverse_dependencies(prod: dict[str, dict[str, Any]]) -> dict[str, set[str]]:
    rev = {cap: set() for cap in prod}
    for cap, row in prod.items():
        for req in row.get("requires", []):
            upstream = req["capability"]
            if upstream in rev:
                rev[upstream].add(cap)
    return rev


def affected(prod: dict[str, dict[str, Any]], seeds: list[str]) -> list[str]:
    rev = reverse_dependencies(prod)
    seen = set()
    q = deque(seed for seed in seeds if seed in rev)
    while q:
        cur = q.popleft()
        for nxt in sorted(rev[cur]):
            if nxt not in seen and nxt not in seeds:
                seen.add(nxt)
                q.append(nxt)
    return sorted(seen)


def closure(graph: dict[str, Any], consumer: str) -> list[str]:
    prod = productions(graph)
    consumers = {c["id"]: c for c in graph.get("consumers", []) or []}
    if consumer not in consumers:
        return []
    result = set()
    stack = [
        r if isinstance(r, dict) else {"capability": r}
        for r in consumers[consumer].get("requires", []) or []
    ]
    while stack:
        cap = stack.pop()["capability"]
        if cap in result:
            continue
        result.add(cap)
        for req in prod[cap].get("requires", []):
            stack.append(req)
    return sorted(result)


def claim_key(value: Any) -> str:
    if isinstance(value, str):
        return value
    return f"{value.get('claim')}@{value.get('subject', '')}".rstrip("@")


def graph_digest(graph: dict[str, Any], consumer: str) -> dict[str, Any]:
    prod = productions(graph)
    kinds = Counter(row.get("knowledge_kind", "<none>") for row in prod.values())
    claims = Counter()
    for row in prod.values():
        for claim in row.get("semantic_claims", []) or []:
            claims[claim_key(claim)] += 1
    return {
        "graph_id": graph.get("id"),
        "authority_count": len(graph.get("authorities", []) or []),
        "authorities": [a["id"] for a in graph.get("authorities", []) or []],
        "capability_count": len(prod),
        "consumer_count": len(graph.get("consumers", []) or []),
        "consumers": [c["id"] for c in graph.get("consumers", []) or []],
        "selected_consumer": consumer,
        "selected_consumer_closure_count": len(closure(graph, consumer)),
        "selected_consumer_closure": closure(graph, consumer),
        "knowledge_kind_counts": dict(sorted(kinds.items())),
        "semantic_claim_counts": dict(sorted(claims.items())),
        "productions": {
            cap: {
                "authority": row["authority"],
                "knowledge_kind": row.get("knowledge_kind"),
                "semantic_claims": [claim_key(v) for v in row.get("semantic_claims", []) or []],
                "requires": [r["capability"] for r in row.get("requires", []) or []],
            }
            for cap, row in sorted(prod.items())
        },
    }


def old_baseline_digest() -> dict[str, Any]:
    graph = load(OLD / "engineering-graph.yaml")
    core = load(OLD / "core.yaml")
    assessments = load(OLD / "authority-assessments.yaml")
    coverage = load(OLD / "engineering-coverage.yaml")
    baseline = load(OLD / "semantic-baseline.yaml")
    return {
        "baseline_commit": "ac9d97af3357663207d7c063c415a84327ab71f7",
        "graph": graph_digest(graph, "FRONTEND-IMPLEMENTATION"),
        "core": {
            "artifact_count": len(core.get("artifacts", []) or []),
            "question_count": len(core.get("questions", []) or []),
            "providers": {
                art["id"]: {
                    "authority": art["authority"],
                    "path": art["path"],
                    "provides": art.get("provides", []) or [],
                    "depends_on": art.get("depends_on", []) or [],
                }
                for art in core.get("artifacts", []) or []
            },
        },
        "authority_applicability": dict(Counter(
            row["applicability"] for row in assessments.get("assessments", []) or []
        )),
        "authority_assessments": {
            row["authority_id"]: row["applicability"]
            for row in assessments.get("assessments", []) or []
        },
        "coverage_decision_counts": dict(Counter(
            row.get("state", "<none>") for row in coverage.get("decisions", []) or []
        )),
        "semantic_review_count": len(baseline.get("reviews", []) or []),
    }


def main() -> int:
    old_graph = load(OLD / "engineering-graph.yaml")
    new_graph = load(EXP / "generated/engineering-graph.yaml")
    old_prod = productions(old_graph)
    new_prod = productions(new_graph)

    sys.path.insert(0, str(HARNESS))
    from engineering_graph import evaluate_engineering_target

    old_core = load(OLD / "core.yaml")
    new_core = load(NEW / "core.yaml")
    old_state = evaluate_engineering_target(old_graph, "FRONTEND-IMPLEMENTATION", old_core)
    new_state = evaluate_engineering_target(new_graph, "FRONTEND-IMPLEMENTATION", new_core)

    mutation_pairs = {
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

    mutations = {}
    for name, pair in mutation_pairs.items():
        mutations[name] = {
            "old_seeds": pair["old"],
            "old_affected": affected(old_prod, pair["old"]),
            "new_seeds": pair["new"],
            "new_affected": affected(new_prod, pair["new"]),
        }

    old_domain = [
        "prep.knowledge-relation-classification",
        "prep.knowledge-model",
        "prep.learning-design",
        "prep.learner-model",
    ]
    new_domain = [
        "prep-reference-v0.domain-model.knowledge-model",
        "prep-reference-v0.domain-model.learning-design",
        "prep-reference-v0.domain-model.learner-model",
    ]

    comparison = {
        "version": 1,
        "kind": "prep-reference-topology-observation",
        "old": graph_digest(old_graph, "FRONTEND-IMPLEMENTATION"),
        "new": graph_digest(new_graph, "FRONTEND-IMPLEMENTATION"),
        "target_state": {
            "old": {
                "status": old_state["status"],
                "create": [x["capability"] for x in old_state.get("create", [])],
                "wait": [x["capability"] for x in old_state.get("wait", [])],
                "pending": [x["capability"] for x in old_state.get("pending", [])],
                "satisfied_count": len(old_state.get("satisfied", [])),
            },
            "new": {
                "status": new_state["status"],
                "create": [x["capability"] for x in new_state.get("create", [])],
                "wait": [x["capability"] for x in new_state.get("wait", [])],
                "pending": [x["capability"] for x in new_state.get("pending", [])],
                "satisfied_count": len(new_state.get("satisfied", [])),
            },
        },
        "stress_case": {
            "old": {
                cap: old_prod.get(cap, {}).get("requires", [])
                for cap in old_domain
            },
            "new": {
                cap: new_prod.get(cap, {}).get("requires", [])
                for cap in new_domain
            },
        },
        "mutation_revalidation_frontiers": mutations,
    }

    dump(EXP / "analysis/old-baseline-digest.yaml", old_baseline_digest())
    dump(EXP / "analysis/topology-observation.yaml", comparison)
    print(
        json.dumps(
            {
                "old_capabilities": len(old_prod),
                "new_capabilities": len(new_prod),
                "old_target": comparison["target_state"]["old"],
                "new_target": comparison["target_state"]["new"],
                "knowledge_domain_old_affected": len(mutations["knowledge_domain"]["old_affected"]),
                "knowledge_domain_new_affected": len(mutations["knowledge_domain"]["new_affected"]),
            },
            indent=2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
