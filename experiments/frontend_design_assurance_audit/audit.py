#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import re
import yaml

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "experiments/frontend_design_assurance_audit"


def load_yaml(path: str):
    return yaml.safe_load((ROOT / path).read_text(encoding="utf-8"))


def read_text(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def ids_from_markdown(value: str, prefix: str) -> list[str]:
    return sorted(set(re.findall(rf"\b{re.escape(prefix)}-\d+\b", value)))


task_model = load_yaml("docs/application/task-model.yaml")
interaction = load_yaml("docs/interface/interaction-design.yaml")
topology = load_yaml("docs/interface/interface-topology.yaml")
ia = load_yaml("docs/interface/information-architecture.yaml")
tests = load_yaml("docs/verification/frontend-test-design.yaml")

journeys = read_text("docs/application/user-journeys.md")
screen = read_text("docs/interface/screen-view-design.md")
machine = read_text("docs/interface/machine-interface.md")
frontend_verification = read_text("docs/verification/frontend-verification.md")
presentation_verification = read_text("docs/verification/presentation-verification.md")
problem_space = read_text("docs/vision/problem-space.md")
implementation = read_text("docs/implementation/frontend-implementation-design.md")
product_capabilities = read_text("docs/vision/product-capabilities.md")

tasks = {}
for goal in task_model.get("goals", []) or []:
    for item in goal.get("tasks", []) or []:
        tasks[item["id"]] = item

contexts = {c["id"]: c for c in interaction.get("contexts", []) or []}
views = {v["id"]: v for v in topology.get("views", []) or []}
locations = {x["id"] for x in ia.get("locations", []) or []}

interaction_task_refs = {}
unknown_interaction_task_refs = []
for cid, ctx in contexts.items():
    for tid in ctx.get("task_refs", []) or []:
        interaction_task_refs.setdefault(tid, []).append(cid)
        if tid not in tasks:
            unknown_interaction_task_refs.append({"context": cid, "task": tid})

context_views = {}
unknown_topology_context_refs = []
unknown_location_refs = []
for vid, view in views.items():
    loc = view.get("location_ref")
    if loc and loc not in locations:
        unknown_location_refs.append({"view": vid, "location": loc})
    for cid in view.get("interaction_context_refs", []) or []:
        context_views.setdefault(cid, []).append(vid)
        if cid not in contexts:
            unknown_topology_context_refs.append({"view": vid, "context": cid})

journey_missing = sorted(tid for tid in tasks if tid not in journeys)
interaction_missing = sorted(tid for tid in tasks if tid not in interaction_task_refs)
context_unplaced = sorted(cid for cid in contexts if cid not in context_views)
screen_missing = sorted(vid for vid in views if f"[{vid}]" not in screen)

machine_ops = sorted({
    op
    for ctx in contexts.values()
    for op in (ctx.get("machine_operations", []) or [])
})
machine_missing = [op for op in machine_ops if op not in machine]

declared_pcs = ids_from_markdown(product_capabilities, "PC")
task_pcs = sorted({
    pc
    for item in tasks.values()
    for pc in (item.get("capability_refs", []) or [])
})
uncovered_pcs = sorted(set(declared_pcs) - set(task_pcs))

fv_ids = ids_from_markdown(frontend_verification, "FV")
test_fv_refs = sorted({
    ref
    for item in tests.get("content", {}).get("tests", []) or []
    for ref in (item.get("verification_refs", []) or [])
})
fv_without_test_contract = sorted(set(fv_ids) - set(test_fv_refs))

pv_ids = ids_from_markdown(presentation_verification, "PV")
representative_pv_ids = sorted(set(
    re.findall(
        r"(PV-\d+)[\s\S]{0,900}?REPRESENTATIVE-USER VALIDATION",
        presentation_verification,
    )
))

gate_b_untested = (
    "elicited_representative_status" in problem_space
    and "UNTESTED" in problem_space
    and "ELICITED-HUMAN-VALIDATED" in problem_space
)
prototype_only = (
    "READY FOR USABILITY VALIDATION" in implementation
    and "not ready for production UI implementation" in implementation
)
production_gate_declared = "## Production implementation gate" in implementation

structural_ok = not (
    journey_missing
    or interaction_missing
    or context_unplaced
    or screen_missing
    or machine_missing
    or uncovered_pcs
    or unknown_interaction_task_refs
    or unknown_topology_context_refs
    or unknown_location_refs
)

task_rows = []
for tid, item in sorted(tasks.items()):
    cids = sorted(interaction_task_refs.get(tid, []))
    mapped_views = sorted({v for cid in cids for v in context_views.get(cid, [])})
    task_rows.append({
        "task": tid,
        "capability_refs": item.get("capability_refs", []) or [],
        "journey": tid in journeys,
        "interaction_contexts": cids,
        "views": mapped_views,
        "screen_view_covered": all(f"[{v}]" in screen for v in mapped_views),
    })

result = {
    "version": 1,
    "kind": "prep-frontend-design-assurance-audit",
    "scope": {
        "source_branch": "experiment/frontend-design-assurance-audit",
        "purpose": "Audit current PREP frontend design completeness and readiness before production implementation.",
    },
    "structural_traceability": {
        "status": "PASS" if structural_ok else "FAIL",
        "task_count": len(tasks),
        "product_capability_count": len(declared_pcs),
        "interaction_context_count": len(contexts),
        "topology_view_count": len(views),
        "machine_operation_ref_count": len(machine_ops),
        "journey_missing_tasks": journey_missing,
        "interaction_missing_tasks": interaction_missing,
        "unplaced_interaction_contexts": context_unplaced,
        "screen_missing_views": screen_missing,
        "missing_machine_operations": machine_missing,
        "uncovered_product_capabilities": uncovered_pcs,
        "unknown_interaction_task_refs": unknown_interaction_task_refs,
        "unknown_topology_context_refs": unknown_topology_context_refs,
        "unknown_location_refs": unknown_location_refs,
        "tasks": task_rows,
    },
    "verification_contracts": {
        "frontend_verification_ids": fv_ids,
        "frontend_verification_without_test_contract": fv_without_test_contract,
        "presentation_verification_ids": pv_ids,
        "representative_user_required": representative_pv_ids,
    },
    "evidence_readiness": {
        "elicited_representative_user_status_unresolved": bool(gate_b_untested),
        "implementation_explicitly_prototype_only": bool(prototype_only),
        "production_gate_declared": bool(production_gate_declared),
        "production_implementation_ready": False if (gate_b_untested or prototype_only) else None,
    },
}

OUT.mkdir(parents=True, exist_ok=True)
(OUT / "audit-result.yaml").write_text(
    yaml.safe_dump(result, sort_keys=False, allow_unicode=True),
    encoding="utf-8",
)

print(yaml.safe_dump({
    "structural_status": result["structural_traceability"]["status"],
    "task_count": len(tasks),
    "journey_missing": journey_missing,
    "interaction_missing": interaction_missing,
    "unplaced_contexts": context_unplaced,
    "screen_missing": screen_missing,
    "missing_machine_ops": machine_missing,
    "uncovered_product_capabilities": uncovered_pcs,
    "fv_without_test_contract": fv_without_test_contract,
    "representative_user_required": representative_pv_ids,
    "production_implementation_ready": result["evidence_readiness"]["production_implementation_ready"],
}, sort_keys=False))
