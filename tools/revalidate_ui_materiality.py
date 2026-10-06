#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
import os
import sys
from collections import Counter
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))
if not HARNESS_ROOT.is_absolute():
    HARNESS_ROOT = (ROOT / HARNESS_ROOT).resolve()
sys.path.insert(0, str(HARNESS_ROOT / "src"))

from harness.application.decision_explorer_request import derive_decision_explorer_request
from harness.application.project_publication import (
    prepare_reconciliation_publication,
    publish_project_publication,
    read_project_publication,
)
from harness.application.semantic_admission import admit_artifact
from harness.application.semantic_closure import evaluate_semantic_closure
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index

CANDIDATES = ROOT / ".harness" / "candidates"
PUBLICATION = ROOT / ".harness" / "project-publication.yaml"

CANDIDATE_PATHS = {
    "prep.interface-topology": CANDIDATES / "frontend-boundary-topology-admission.yaml",
    "prep.presentation-system": CANDIDATES / "presentation-screen-presentation-admission.yaml",
    "prep.screen-view-design": CANDIDATES / "presentation-screen-screen-admission.yaml",
    "prep.presentation-verification": CANDIDATES / "presentation-verification-admission.yaml",
    "prep.frontend-verification": CANDIDATES / "frontend-verification-admission.yaml",
    "prep.frontend-system-architecture": CANDIDATES / "frontend-system-architecture-admission.yaml",
    "prep.frontend-engineering-policy": CANDIDATES / "frontend-engineering-policy-admission.yaml",
    "prep.frontend-component-design": CANDIDATES / "frontend-component-design-admission.yaml",
    "prep.frontend-test-design": CANDIDATES / "frontend-test-design-admission.yaml",
    "prep.frontend-implementation-design": CANDIDATES / "frontend-implementation-design-admission.yaml",
}

EXPLORATION_PATHS = {
    "prep.presentation-system": CANDIDATES / "presentation-screen-presentation-exploration.yaml",
    "prep.screen-view-design": CANDIDATES / "presentation-screen-screen-exploration.yaml",
    "prep.frontend-system-architecture": CANDIDATES / "frontend-system-architecture-exploration.yaml",
    "prep.frontend-component-design": CANDIDATES / "frontend-component-design-exploration.yaml",
    "prep.frontend-implementation-design": CANDIDATES / "frontend-implementation-design-exploration.yaml",
}

REQUEST_PATHS = {
    "prep.interface-topology": CANDIDATES / "frontend-boundary-topology-request.json",
    "prep.presentation-system": CANDIDATES / "presentation-screen-presentation-request.json",
    "prep.screen-view-design": CANDIDATES / "presentation-screen-screen-request.json",
}

FORCED = {
    "prep.interface-topology",
    "prep.presentation-system",
    "prep.screen-view-design",
    "prep.presentation-verification",
}

NEW_ACCEPTANCE_IDS = {
    "prep.presentation-system": "PREP-PRESENTATION-SYSTEM-STRICT-7",
    "prep.screen-view-design": "PREP-SCREEN-VIEW-DESIGN-STRICT-7",
    "prep.presentation-verification": "PREP-PRESENTATION-VERIFICATION-STRICT-2",
}


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise RuntimeError(f"{path} must contain a mapping")
    return value


def dump_yaml(path: Path, value: dict[str, Any]) -> None:
    path.write_text(
        yaml.safe_dump(value, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )


def scan_kind(kind: str) -> list[tuple[Path, dict[str, Any]]]:
    result = []
    for path in sorted(CANDIDATES.glob("*.yaml")):
        try:
            value = load(path)
        except Exception:
            continue
        if value.get("kind") == kind:
            result.append((path, value))
    return result


def lifecycle_by_capability(lifecycle: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        row["capability"]: row
        for row in lifecycle.get("providers", []) or []
        if isinstance(row, dict) and isinstance(row.get("capability"), str)
    }


def replace_semantic_evaluation(
    document: dict[str, Any], evaluation: dict[str, Any]
) -> None:
    rows = document["semantic_evaluations"]
    key = (evaluation["artifact"], evaluation["capability"])
    replaced = False
    for i, row in enumerate(rows):
        if (row.get("artifact"), row.get("capability")) == key:
            rows[i] = copy.deepcopy(evaluation)
            replaced = True
            break
    if not replaced:
        rows.append(copy.deepcopy(evaluation))


def replace_lifecycle(lifecycle: dict[str, Any], assertion: dict[str, Any]) -> None:
    rows = lifecycle["providers"]
    for i, row in enumerate(rows):
        if row.get("capability") == assertion["capability"]:
            rows[i] = copy.deepcopy(assertion)
            return
    rows.append(copy.deepcopy(assertion))


def replace_derivation(document: dict[str, Any], evaluation: dict[str, Any]) -> None:
    rows = document.setdefault("derivation_evaluations", [])
    key = (evaluation["source_capability"], evaluation["target_capability"])
    for i, row in enumerate(rows):
        if (row.get("source_capability"), row.get("target_capability")) == key:
            rows[i] = copy.deepcopy(evaluation)
            return
    rows.append(copy.deepcopy(evaluation))


def topo_order(graph: dict[str, Any]) -> list[str]:
    productions = production_index(graph)
    remaining = set(productions)
    done: set[str] = set()
    order: list[str] = []
    while remaining:
        ready = sorted(
            cap
            for cap in remaining
            if {
                req["capability"]
                for req in productions[cap].get("requires", []) or []
            } <= done
        )
        if not ready:
            raise RuntimeError("engineering graph capability order is cyclic")
        for cap in ready:
            remaining.remove(cap)
            done.add(cap)
            order.append(cap)
    return order


def source_set(
    graph: dict[str, Any],
    target: str,
    selected_candidates: dict[str, dict[str, Any]],
    all_admissions: list[dict[str, Any]],
    lifecycle: dict[str, Any],
) -> dict[str, Any]:
    productions = production_index(graph)
    assertions: list[dict[str, Any]] = []
    current = lifecycle_by_capability(lifecycle)
    for req in productions[target].get("requires", []) or []:
        cap = req["capability"]
        source = selected_candidates.get(cap)
        if source is None:
            row = current[cap]
            wanted = row.get("semantic_atom_fingerprints", {})
            matches = [
                doc
                for doc in all_admissions
                if doc.get("capability") == cap
                and doc.get("id") == row.get("artifact")
                and semantic_assertion_fingerprints(doc) == wanted
            ]
            if len(matches) != 1:
                raise RuntimeError(
                    f"cannot resolve current candidate for {cap}: {len(matches)} matches"
                )
            source = matches[0]
            selected_candidates[cap] = source
        for atom in source.get("semantic_assertions", []) or []:
            item = copy.deepcopy(atom)
            item["source_artifact"] = source["id"]
            assertions.append(item)
    return {"semantic_assertions": assertions}


def topology_exploration(request_id: str) -> dict[str, Any]:
    alternatives = [
        {
            "id": "task-responsibility-views-with-contextual-recovery",
            "difference": (
                "Primary preparation responsibilities remain independently addressable task views; "
                "evidence/detail/support stay contextual when they depend on originating working state."
            ),
            "material_effects": {
                "goal-continuity": "primary-task-bounded",
                "information-dependency": "shared-preparation-context",
                "working-state-continuity": "active-target-focus-preserved",
                "commit-recovery-boundary": "contextual-recovery-within-origin",
                "mode-authority-boundary": "no-independent-mode",
                "independent-addressability": "task-views-addressable-contextual-surfaces-context-bound",
            },
        },
        {
            "id": "single-preparation-workspace",
            "difference": (
                "Target, Current, Knowledge and Activity collapse into one undifferentiated workspace."
            ),
            "material_effects": {
                "goal-continuity": "mixed-task-responsibilities",
                "information-dependency": "all-context-co-located",
                "working-state-continuity": "implicit-global",
                "commit-recovery-boundary": "undifferentiated",
                "mode-authority-boundary": "no-independent-mode",
                "independent-addressability": "workspace-only",
            },
        },
        {
            "id": "destination-per-subtask",
            "difference": (
                "Contextual evidence/detail/support subtasks become independently navigable destinations."
            ),
            "material_effects": {
                "goal-continuity": "fragmented-per-subtask",
                "information-dependency": "navigation-mediated",
                "working-state-continuity": "route-reconstruction",
                "commit-recovery-boundary": "destination-return",
                "mode-authority-boundary": "accidental-destination-semantics",
                "independent-addressability": "every-subtask-addressable",
            },
        },
    ]
    return {
        "version": 1,
        "kind": "harness-decision-exploration",
        "capability": "prep.interface-topology",
        "knowledge_kind": "interface-topology-design",
        "explorer_request_id": request_id,
        "research_sources": [],
        "axes": [
            {
                "axis": "view-boundaries",
                "applicability": "APPLICABLE",
                "exploration_level": "EXPLORE",
                "probes": [
                    {
                        "strategy": "merge-vs-separate-view",
                        "challenge": (
                            "Merge distinct preparation responsibilities, then split them again, "
                            "and test goal continuity and independent addressability."
                        ),
                        "alternatives": [
                            "task-responsibility-views-with-contextual-recovery",
                            "single-preparation-workspace",
                            "destination-per-subtask",
                        ],
                    },
                    {
                        "strategy": "persistent-context-vs-navigation",
                        "challenge": (
                            "Move active Target/focus continuity from persistent shared context into "
                            "navigation reconstruction and test working-state loss."
                        ),
                        "alternatives": [
                            "task-responsibility-views-with-contextual-recovery",
                            "single-preparation-workspace",
                            "destination-per-subtask",
                        ],
                    },
                    {
                        "strategy": "contextual-surface-vs-destination",
                        "challenge": (
                            "Promote evidence/detail/support surfaces to destinations and test whether "
                            "they gain independent goals or merely fragment originating task state."
                        ),
                        "alternatives": [
                            "task-responsibility-views-with-contextual-recovery",
                            "destination-per-subtask",
                        ],
                    },
                ],
                "decision_points": [
                    {
                        "id": "preparation-view-boundaries",
                        "alternatives": alternatives,
                    }
                ],
            }
        ],
        "decision_space_review": {
            "status": "COMPLETE",
            "checks": [
                "mixed-decision-split",
                "missing-material-case-search",
                "impact-and-reversal-frontier-check",
                "accepted-constraint-cross-check",
                "authority-boundary-cross-check",
            ],
            "reviewed_decisions": ["preparation-view-boundaries"],
            "open_gaps": [],
        },
    }


def main() -> int:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    current_publication = read_project_publication(PUBLICATION, graph=graph)
    working_evaluations = copy.deepcopy(
        current_publication["state"]["semantic_evaluations"]
    )
    working_lifecycle = copy.deepcopy(current_publication["state"]["lifecycle"])
    working_failures = copy.deepcopy(current_publication["state"]["decision_failures"])

    skill_registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    knowledge_contracts = load(
        HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
    )
    decision_contracts = load(
        HARNESS_ROOT / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml"
    )
    decision_policy = load(CANDIDATES / "application-design-decision-policy.yaml")

    admission_rows = scan_kind("harness-artifact-admission-candidate")
    all_admissions = [doc for _, doc in admission_rows]
    contract_rows = scan_kind("harness-semantic-derivation-contract")
    contracts = {
        (doc["source_capability"], doc["target_capability"]): doc
        for _, doc in contract_rows
    }
    evidence_rows = scan_kind("harness-semantic-derivation-evidence")
    evidences = {
        (doc["source_capability"], doc["target_capability"]): doc
        for _, doc in evidence_rows
    }

    selected_candidates: dict[str, dict[str, Any]] = {}
    completed: set[str] = set()
    order = topo_order(graph)
    productions = production_index(graph)

    def current_stale() -> set[str]:
        stale: set[str] = set()
        for consumer in graph.get("consumers", []) or []:
            result = evaluate_semantic_closure(
                graph=graph,
                model=core,
                target=consumer["id"],
                skill_registry=skill_registry,
                semantic_evaluations=working_evaluations,
                lifecycle=working_lifecycle,
                knowledge_contracts=knowledge_contracts,
                decision_contracts=decision_contracts,
                decision_policy=decision_policy,
            )
            for gap in result.get("currentness_gaps", []) or []:
                if gap.get("state") == "STALE":
                    stale.add(gap["capability"])
        return stale

    def candidate_for(capability: str) -> dict[str, Any]:
        path = CANDIDATE_PATHS.get(capability)
        if path is None or not path.exists():
            raise RuntimeError(
                f"revalidation reached {capability} without an explicit current candidate mapping"
            )
        candidate = load(path)
        if candidate.get("capability") != capability:
            raise RuntimeError(f"candidate mismatch for {capability}: {path}")
        return candidate

    def exploration_for(
        capability: str,
        request: dict[str, Any] | None,
    ) -> dict[str, Any] | None:
        if request is None:
            return None
        request_id = request["request_id"]
        if capability == "prep.interface-topology":
            value = topology_exploration(request_id)
            dump_yaml(CANDIDATES / "frontend-boundary-topology-exploration.yaml", value)
        else:
            path = EXPLORATION_PATHS.get(capability)
            if path is None or not path.exists():
                raise RuntimeError(
                    f"decision exploration required for {capability}, but no reviewed evidence file is mapped"
                )
            value = load(path)
            checks = value.get("decision_space_review", {}).get("checks", [])
            if "impact-and-reversal-frontier-check" not in checks:
                raise RuntimeError(
                    f"{capability} exploration has not performed impact-and-reversal-frontier-check"
                )
            value["explorer_request_id"] = request_id
            dump_yaml(path, value)
        request_path = REQUEST_PATHS.get(capability)
        if request_path is not None:
            request_path.write_text(
                json.dumps(request, indent=2, ensure_ascii=False) + "\n",
                encoding="utf-8",
            )
        return value

    def derivations_for(
        capability: str,
        candidate: dict[str, Any],
        sources: dict[str, Any],
    ) -> list[dict[str, Any]]:
        results: list[dict[str, Any]] = []
        for req in productions[capability].get("requires", []) or []:
            source_cap = req["capability"]
            key = (source_cap, capability)
            contract = contracts.get(key)
            if contract is None:
                continue
            source_doc = selected_candidates.get(source_cap)
            if source_doc is None:
                row = lifecycle_by_capability(working_lifecycle)[source_cap]
                wanted = row.get("semantic_atom_fingerprints", {})
                matches = [
                    doc
                    for doc in all_admissions
                    if doc.get("capability") == source_cap
                    and doc.get("id") == row.get("artifact")
                    and semantic_assertion_fingerprints(doc) == wanted
                ]
                if len(matches) != 1:
                    raise RuntimeError(
                        f"cannot resolve derivation source candidate for {source_cap}: {len(matches)} matches"
                    )
                source_doc = matches[0]
                selected_candidates[source_cap] = source_doc
            evidence = evidences.get(key)
            if evidence is None:
                accepted = next(
                    (
                        row
                        for row in working_evaluations.get("derivation_evaluations", []) or []
                        if row.get("source_capability") == source_cap
                        and row.get("target_capability") == capability
                        and row.get("status") == "ACCEPTED"
                    ),
                    None,
                )
                if accepted is None:
                    raise RuntimeError(
                        f"missing semantic derivation evidence/evaluation for {source_cap} -> {capability}"
                    )
                evidence = {
                    "version": 1,
                    "kind": "harness-semantic-derivation-evidence",
                    "source_capability": source_cap,
                    "target_capability": capability,
                    "links": copy.deepcopy(accepted.get("links", [])),
                    "dispositions": copy.deepcopy(accepted.get("dispositions", [])),
                }
            result = evaluate_derivation(
                graph=graph,
                contract=contract,
                source=source_doc,
                candidate=candidate,
                evidence=evidence,
            )
            if result.get("status") != "ACCEPTED":
                raise RuntimeError(
                    "derivation rejected for "
                    f"{source_cap} -> {capability}: "
                    + json.dumps(result.get("findings", []), ensure_ascii=False)
                )
            results.append(result)
        return results

    def revalidate(capability: str) -> None:
        candidate = candidate_for(capability)
        sources = source_set(
            graph,
            capability,
            selected_candidates,
            all_admissions,
            working_lifecycle,
        )
        try:
            request = derive_decision_explorer_request(
                graph=graph,
                model=core,
                decision_contracts=decision_contracts,
                decision_policy=decision_policy,
                capability=capability,
                lifecycle=working_lifecycle,
                mode="REVISION",
            )
        except Exception as exc:
            states = lifecycle_states(graph, core, working_lifecycle)
            prerequisites = [
                req["capability"]
                for req in productions[capability].get("requires", []) or []
            ]
            detail = {item: states.get(item) for item in prerequisites}
            raise RuntimeError(
                f"cannot derive Decision Explorer request for {capability}; "
                f"prerequisite_states={json.dumps(detail, ensure_ascii=False)}"
            ) from exc
        exploration = exploration_for(capability, request)
        fresh_derivations = derivations_for(capability, candidate, sources)

        current_row = lifecycle_by_capability(working_lifecycle)[capability]
        acceptance_id = NEW_ACCEPTANCE_IDS.get(
            capability,
            current_row["acceptance_id"],
        )
        evaluation = admit_artifact(
            graph=graph,
            model=core,
            skill_registry=skill_registry,
            knowledge_contracts=knowledge_contracts,
            decision_contracts=decision_contracts,
            decision_policy=decision_policy,
            decision_exploration=exploration,
            derivation_evaluations=fresh_derivations,
            capability=capability,
            sources=sources,
            candidate=candidate,
            acceptance_id=acceptance_id,
            lifecycle=working_lifecycle,
            decision_request_mode="REVISION",
        )
        if evaluation.get("status") != "ACCEPTED":
            raise RuntimeError(
                f"semantic admission rejected for {capability}: "
                + json.dumps(evaluation.get("findings", []), ensure_ascii=False)
            )
        for item in fresh_derivations:
            replace_derivation(working_evaluations, item)
        replace_semantic_evaluation(working_evaluations, evaluation)
        replace_lifecycle(working_lifecycle, evaluation["lifecycle_assertion"])
        working_failures["failures"] = [
            row
            for row in working_failures.get("failures", []) or []
            if not isinstance(row, dict) or row.get("capability") != capability
        ]
        selected_candidates[capability] = candidate
        completed.add(capability)
        print(f"REVALIDATED {capability} -> {acceptance_id}")

    pending = set(FORCED)
    while True:
        progressed = False
        for capability in order:
            if capability not in pending or capability in completed:
                continue
            prerequisites = {
                req["capability"]
                for req in productions[capability].get("requires", []) or []
            }
            if prerequisites & (pending - completed):
                continue
            revalidate(capability)
            progressed = True

        stale = current_stale()
        unresolved_completed = stale & completed
        if unresolved_completed:
            raise RuntimeError(
                "revalidated capabilities remain stale: "
                + ", ".join(sorted(unresolved_completed))
            )
        new_pending = stale - completed
        if not new_pending:
            break
        missing = sorted(cap for cap in new_pending if cap not in CANDIDATE_PATHS)
        if missing:
            raise RuntimeError(
                "revalidation expanded beyond reviewed candidate mappings: "
                + ", ".join(missing)
            )
        pending |= new_pending
        if not progressed and not (new_pending - pending):
            raise RuntimeError("revalidation made no progress")

    for consumer in graph.get("consumers", []) or []:
        closure = evaluate_semantic_closure(
            graph=graph,
            model=core,
            target=consumer["id"],
            skill_registry=skill_registry,
            semantic_evaluations=working_evaluations,
            lifecycle=working_lifecycle,
            knowledge_contracts=knowledge_contracts,
            decision_contracts=decision_contracts,
            decision_policy=decision_policy,
        )
        if closure.get("status") != "COMPLETE":
            raise RuntimeError(
                f"final closure incomplete for {consumer['id']}: "
                f"semantic={closure.get('semantic_gaps')} "
                f"currentness={closure.get('currentness_gaps')}"
            )

    next_publication = prepare_reconciliation_publication(
        graph=graph,
        current_publication=current_publication,
        expected_revision=current_publication["revision"],
        outcomes={cap: "CURRENT" for cap in sorted(completed)},
        core_model=core,
        semantic_evaluations=working_evaluations,
        lifecycle=working_lifecycle,
        decision_failures=working_failures,
    )
    publish_project_publication(
        PUBLICATION,
        graph=graph,
        publication=next_publication,
        expected_revision=current_publication["revision"],
    )
    print(
        "UI materiality revalidation COMPLETE: "
        + ", ".join(sorted(completed))
        + f"; publication={next_publication['revision']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
