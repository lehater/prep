#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "experiments/reference_model_rematerialization"
EXP = ROOT / "experiments/project_refinement_contract_v0"
HARNESS = ROOT / ".harness-reference"


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def dump(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.safe_dump(value, sort_keys=False, allow_unicode=True), encoding="utf-8")


def production_index(graph: dict[str, Any]) -> dict[str, dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for authority in graph.get("authorities", []) or []:
        for prod in authority.get("produces", []) or []:
            out[prod["capability"]] = prod
    return out


def provider_index(core: dict[str, Any]) -> dict[str, dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for artifact in core.get("artifacts", []) or []:
        for cap in artifact.get("provides", []) or []:
            if cap in out:
                raise SystemExit(f"duplicate provider for {cap}")
            out[cap] = artifact
    return out


def req_caps(prod: dict[str, Any]) -> list[str]:
    return [
        item["capability"] if isinstance(item, dict) else item
        for item in (prod.get("requires", []) or [])
    ]


def require_evidence(rule: dict[str, Any]) -> None:
    evidence = rule.get("evidence", []) or []
    if not evidence:
        raise SystemExit(f"refinement rule has no evidence: {rule}")
    missing = [p for p in evidence if not (ROOT / p).exists()]
    if missing:
        raise SystemExit(f"missing refinement evidence paths: {missing}")


def apply_contract(base_graph: dict[str, Any], contract: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    graph = copy.deepcopy(base_graph)
    prod = production_index(graph)

    changes: dict[str, Any] = {
        "added_dependencies": [],
        "replaced_dependencies": [],
        "suppressed_capabilities": [],
        "removed_authorities": [],
    }

    dep = contract.get("dependency_refinements", {}) or {}
    for rule in dep.get("add", []) or []:
        require_evidence(rule)
        cap = rule["capability"]
        if cap not in prod:
            raise SystemExit(f"add-dependency target not found: {cap}")
        existing = req_caps(prod[cap])
        added = []
        for req in rule.get("requires", []) or []:
            if req not in prod:
                raise SystemExit(f"add-dependency prerequisite not found: {req}")
            if req not in existing:
                prod[cap].setdefault("requires", []).append({"capability": req})
                existing.append(req)
                added.append(req)
        changes["added_dependencies"].append({
            "capability": cap,
            "requires": added,
            "evidence": rule["evidence"],
        })

    for rule in dep.get("replace", []) or []:
        require_evidence(rule)
        cap = rule["capability"]
        if cap not in prod:
            raise SystemExit(f"replace-dependency target not found: {cap}")
        requires = list(rule.get("requires", []) or [])
        unknown = [req for req in requires if req not in prod]
        if unknown:
            raise SystemExit(f"replace-dependency prerequisites not found for {cap}: {unknown}")
        old = req_caps(prod[cap])
        prod[cap]["requires"] = [{"capability": req} for req in requires]
        changes["replaced_dependencies"].append({
            "capability": cap,
            "old_count": len(old),
            "new_count": len(requires),
            "old_requires": old,
            "new_requires": requires,
            "evidence": rule["evidence"],
        })

    suppressed_rules = contract.get("applicability_refinements", {}).get(
        "not_applicable_capabilities", []
    ) or []
    suppressed = set()
    for rule in suppressed_rules:
        require_evidence(rule)
        cap = rule["capability"]
        if cap not in prod:
            raise SystemExit(f"not-applicable capability not found: {cap}")
        if not rule.get("reopen_when"):
            raise SystemExit(f"not-applicable capability lacks reopening conditions: {cap}")
        suppressed.add(cap)

    retained_refs = []
    for cap, row in prod.items():
        if cap in suppressed:
            continue
        bad = sorted(set(req_caps(row)) & suppressed)
        if bad:
            retained_refs.append({"capability": cap, "requires_suppressed": bad})
    if retained_refs:
        raise SystemExit(
            "retained capabilities still depend on not-applicable capabilities: "
            + json.dumps(retained_refs, sort_keys=True)
        )

    kept_authorities = []
    for authority in graph.get("authorities", []) or []:
        original = authority.get("produces", []) or []
        kept = [row for row in original if row["capability"] not in suppressed]
        for row in original:
            if row["capability"] in suppressed:
                rule = next(x for x in suppressed_rules if x["capability"] == row["capability"])
                changes["suppressed_capabilities"].append({
                    "capability": row["capability"],
                    "authority": authority["id"],
                    "evidence": rule["evidence"],
                    "reopen_when": rule["reopen_when"],
                })
        if kept:
            authority["produces"] = kept
            kept_authorities.append(authority)
        else:
            changes["removed_authorities"].append(authority["id"])
    graph["authorities"] = kept_authorities

    return graph, changes


def refine_core(graph: dict[str, Any], base_core: dict[str, Any]) -> dict[str, Any]:
    core = copy.deepcopy(base_core)
    active = set(production_index(graph))
    for artifact in core.get("artifacts", []) or []:
        artifact["provides"] = [cap for cap in (artifact.get("provides", []) or []) if cap in active]
    core["artifacts"] = [a for a in core.get("artifacts", []) or [] if a.get("provides")]

    providers = provider_index(core)
    prod = production_index(graph)
    for artifact in core.get("artifacts", []) or []:
        deps = set()
        for cap in artifact.get("provides", []) or []:
            for req in req_caps(prod[cap]):
                provider = providers.get(req)
                if provider and provider["id"] != artifact["id"]:
                    deps.add(provider["id"])
        artifact["depends_on"] = sorted(deps)
    return core


def refined_assessments(graph: dict[str, Any], base: dict[str, Any], contract: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(base)
    active_authorities = {a["id"] for a in graph.get("authorities", []) or []}
    suppressed = {
        row["capability"]: row
        for row in contract.get("applicability_refinements", {}).get(
            "not_applicable_capabilities", []
        ) or []
    }
    suppressed_authority: dict[str, list[dict[str, Any]]] = {}
    base_graph = load(BASE / "generated/engineering-graph.yaml")
    for authority in base_graph.get("authorities", []) or []:
        for prod in authority.get("produces", []) or []:
            if prod["capability"] in suppressed:
                suppressed_authority.setdefault(authority["id"], []).append(
                    suppressed[prod["capability"]]
                )

    for row in result.get("assessments", []) or []:
        aid = row["authority_id"]
        if aid in active_authorities:
            row["applicability"] = "REQUIRED"
            continue
        if aid in suppressed_authority:
            row["applicability"] = "NOT_APPLICABLE"
            row["evidence"] = sorted({
                p for rule in suppressed_authority[aid] for p in rule["evidence"]
            })
            row["rationale"] = "Project Refinement Contract v0 marks all materialized capabilities under this Authority not applicable to the current accepted PREP target."
            row["reopening_conditions"] = sorted({
                item for rule in suppressed_authority[aid] for item in rule["reopen_when"]
            })
    return result


def main() -> int:
    contract = load(EXP / "project-refinement.yaml")
    base_graph = load(BASE / "generated/engineering-graph.yaml")
    base_core = load(BASE / "new-harness/core.yaml")

    refined_graph, changes = apply_contract(base_graph, contract)
    refined_core = refine_core(refined_graph, base_core)

    sys.path.insert(0, str(HARNESS))
    from engineering_graph import (
        evaluate_engineering_target,
        validate_engineering_graph,
        validate_realization,
    )

    validate_engineering_graph(refined_graph)
    validate_realization(refined_graph, refined_core)
    target = evaluate_engineering_target(
        refined_graph, "FRONTEND-IMPLEMENTATION", refined_core
    )

    out = EXP / "generated"
    dump(out / "engineering-graph.yaml", refined_graph)
    dump(out / "core.yaml", refined_core)
    dump(
        out / "authority-assessments.yaml",
        refined_assessments(
            refined_graph,
            load(BASE / "new-harness/authority-assessments.yaml"),
            contract,
        ),
    )
    dump(out / "engineering-coverage.yaml", load(BASE / "new-harness/engineering-coverage.yaml"))

    active_caps = set(production_index(refined_graph))
    baseline = load(BASE / "new-harness/semantic-baseline.yaml")
    baseline["reviews"] = [
        row for row in baseline.get("reviews", []) or []
        if row.get("capability") in active_caps
    ]
    dump(out / "semantic-baseline.yaml", baseline)

    (out / "target-state.json").write_text(
        json.dumps(target, indent=2, sort_keys=True), encoding="utf-8"
    )
    summary = {
        "version": 1,
        "kind": "prep-project-refinement-build-summary",
        "base_capability_count": len(production_index(base_graph)),
        "refined_capability_count": len(production_index(refined_graph)),
        "refinement_rule_count": (
            len(contract.get("dependency_refinements", {}).get("add", []) or [])
            + len(contract.get("dependency_refinements", {}).get("replace", []) or [])
            + len(contract.get("applicability_refinements", {}).get("not_applicable_capabilities", []) or [])
            + len(contract.get("concern_refinements", {}).get("not_applicable", []) or [])
        ),
        "target_status": target["status"],
        "create": [x["capability"] for x in target.get("create", [])],
        "wait": [x["capability"] for x in target.get("wait", [])],
        "pending": [x["capability"] for x in target.get("pending", [])],
        "changes": changes,
    }
    dump(out / "build-summary.yaml", summary)
    print(yaml.safe_dump(summary, sort_keys=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
