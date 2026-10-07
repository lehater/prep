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
if not HARNESS_ROOT.is_absolute():
    HARNESS_ROOT = (ROOT / HARNESS_ROOT).resolve()
sys.path.insert(0, str(HARNESS_ROOT / "src"))

from harness.application.project_publication import build_project_publication, read_project_publication
from harness.application.semantic_admission import admit_artifact, derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index

CAPABILITY = "prep.interaction-design"
ACCEPTANCE_ID = "PREP-INTERACTION-DESIGN-STRICT-6"
CANDIDATE_PATH = ".harness/candidates/frontend-boundary-interaction-admission.yaml"
CANONICAL_PATH = "docs/interface/interaction-design.yaml"

SOURCES = {
    "prep.conceptual-interface-model": {
        "candidate": ".harness/candidates/conceptual-interface-model-admission.yaml",
        "contract": ".harness/candidates/fb-interaction-concept-contract.yaml",
        "evidence": ".harness/candidates/process-migration-interaction-conceptual-evidence.yaml",
    },
    "prep.task-model": {
        "candidate": ".harness/candidates/task-model-admission.yaml",
        "contract": ".harness/candidates/fb-interaction-task-contract.yaml",
        "evidence": ".harness/candidates/process-migration-interaction-task-evidence.yaml",
    },
    "prep.user-journeys": {
        "candidate": ".harness/candidates/process-migration-user-journeys-admission.yaml",
        "contract": ".harness/candidates/fb-interaction-journey-contract.yaml",
        "evidence": ".harness/candidates/process-migration-interaction-journey-evidence.yaml",
    },
    "prep.application-design": {
        "candidate": ".harness/candidates/process-migration-application-design-admission.yaml",
        "contract": ".harness/candidates/fb-interaction-app-contract.yaml",
        "evidence": ".harness/candidates/process-migration-interaction-application-evidence.yaml",
    },
    "prep.machine-interfaces": {
        "candidate": ".harness/candidates/frontend-boundary-machine-admission.yaml",
        "contract": ".harness/candidates/fb-interaction-machine-contract.yaml",
        "evidence": ".harness/candidates/process-migration-interaction-machine-evidence.yaml",
    },
}

def load(path: str | Path) -> dict[str, Any]:
    path = Path(path)
    if not path.is_absolute():
        path = ROOT / path
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value

def lifecycle_index(lifecycle: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        row["capability"]: row
        for row in lifecycle.get("providers", []) or []
        if isinstance(row, dict) and isinstance(row.get("capability"), str)
    }

def artifact_for_capability(core: dict[str, Any], capability: str) -> str:
    matches = [
        item["id"]
        for item in core.get("artifacts", []) or []
        if isinstance(item, dict) and capability in (item.get("provides", []) or [])
    ]
    if len(matches) != 1:
        raise SystemExit(f"{capability} must have one Core artifact, got {matches}")
    return matches[0]

def replace_artifact_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["artifact"], evaluation["capability"])
    for index, row in enumerate(bundle["semantic_evaluations"]):
        if (row.get("artifact"), row.get("capability")) == key:
            bundle["semantic_evaluations"][index] = evaluation
            return
    raise SystemExit(f"artifact evaluation not found for {key}")

def replace_derivation_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["source_capability"], evaluation["target_capability"])
    for index, row in enumerate(bundle["derivation_evaluations"]):
        if (row.get("source_capability"), row.get("target_capability")) == key:
            bundle["derivation_evaluations"][index] = evaluation
            return
    raise SystemExit(f"derivation evaluation not found for {key}")

def replace_lifecycle_provider(lifecycle: dict[str, Any], provider: dict[str, Any]) -> None:
    for index, row in enumerate(lifecycle["providers"]):
        if row.get("capability") == provider["capability"]:
            lifecycle["providers"][index] = provider
            return
    raise SystemExit(f"lifecycle provider not found for {provider['capability']}")

def unresolved(evaluation: dict[str, Any]) -> list[str]:
    required = set(evaluation.get("required_sources", []) or [])
    covered = set(evaluation.get("covered_sources", []) or [])
    disposed = {
        item.get("source")
        for item in evaluation.get("dispositions", []) or []
        if isinstance(item, dict)
    }
    return sorted(required - covered - disposed)

def main() -> int:
    graph = load(".harness/engineering-graph.yaml")
    core = load(".harness/core.yaml")
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    semantic_set = copy.deepcopy(publication["state"]["semantic_evaluations"])
    lifecycle = copy.deepcopy(publication["state"]["lifecycle"])
    failures = copy.deepcopy(publication["state"]["decision_failures"])
    rows = lifecycle_index(lifecycle)
    productions = production_index(graph)

    registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    semantic_contracts = load(HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    policy_fingerprints = derive_acceptance_policy_fingerprints(
        graph=graph, knowledge_contracts=semantic_contracts
    )

    before_states = lifecycle_states(
        graph, core, lifecycle,
        current_acceptance_policy_fingerprints=policy_fingerprints,
    )
    before = before_states.get(CAPABILITY, {})
    if before.get("state") == "CURRENT":
        raise SystemExit("Expected stale/non-current Interaction before revalidation")

    old = rows[CAPABILITY]
    if old.get("acceptance_id") != "PREP-INTERACTION-DESIGN-STRICT-5":
        raise SystemExit(f"Unexpected old Interaction acceptance: {old.get('acceptance_id')}")
    old_prereqs = old.get("accepted_prerequisites", {}) or {}
    if old_prereqs.get("prep.user-journeys") != "PREP-USER-JOURNEYS-STRICT-5":
        raise SystemExit("Old Interaction does not record Journey STRICT-5")
    if old_prereqs.get("prep.conceptual-interface-model") != "PREP-CONCEPTUAL-INTERFACE-MODEL-STRICT-5":
        raise SystemExit("Old Interaction does not record CIM STRICT-5")

    expected_current = {
        "prep.user-journeys": "PREP-USER-JOURNEYS-STRICT-6",
        "prep.conceptual-interface-model": "PREP-CONCEPTUAL-INTERFACE-MODEL-STRICT-6",
        "prep.task-model": "PREP-TASK-MODEL-STRICT-4",
        "prep.application-design": "PREP-APPLICATION-DESIGN-STRICT-5",
        "prep.machine-interfaces": "PREP-MACHINE-INTERFACES-STRICT-5",
    }
    for capability, acceptance in expected_current.items():
        if rows[capability].get("acceptance_id") != acceptance:
            raise SystemExit(f"{capability} expected {acceptance}, got {rows[capability].get('acceptance_id')}")

    candidate = load(CANDIDATE_PATH)
    review = candidate.get("semantic_review", {}) or []
    required_checks = {
        "independent-obligation-granularity",
        "interaction-role-coherence",
        "observable-realization-applicability",
    }
    if not required_checks.issubset(set(review.get("checks", []) or [])):
        raise SystemExit("Corrected Interaction semantic review checks are incomplete")

    assertions = {x["id"]: x for x in candidate.get("semantic_assertions", []) or []}
    for required in [
        "IX-ACT-KNOWLEDGE-APPLY-CAPABILITY-SCOPE",
        "IX-ACT-KNOWLEDGE-CLEAR-CAPABILITY-SCOPE",
        "IX-DIST-TARGET-COMPARISON-NOT-ACTIVE",
        "IX-DIST-CAPABILITY-NEXT-FOCUS",
    ]:
        if required not in assertions:
            raise SystemExit(f"Required Interaction assertion missing: {required}")

    source_bundle = {"semantic_assertions": []}
    incoming: list[dict[str, Any]] = []
    for source_capability, paths in SOURCES.items():
        state = before_states.get(source_capability, {})
        if state.get("state") != "CURRENT":
            raise SystemExit(f"Prerequisite {source_capability} is not CURRENT: {state}")
        source_doc = load(paths["candidate"])
        if semantic_assertion_fingerprints(source_doc) != rows[source_capability].get("semantic_atom_fingerprints"):
            raise SystemExit(f"Source candidate surface differs from current provider: {source_capability}")
        source_artifact = artifact_for_capability(core, source_capability)
        for assertion in source_doc.get("semantic_assertions", []) or []:
            copied = copy.deepcopy(assertion)
            copied["source_artifact"] = source_artifact
            source_bundle["semantic_assertions"].append(copied)

        evaluated = evaluate_derivation(
            graph=graph,
            contract=load(paths["contract"]),
            source=source_doc,
            candidate=candidate,
            evidence=load(paths["evidence"]),
        )
        if evaluated.get("status") != "ACCEPTED":
            raise SystemExit(
                f"{source_capability} -> Interaction derivation rejected:\n"
                + yaml.safe_dump({
                    "findings": evaluated.get("findings"),
                    "coverage": evaluated.get("coverage"),
                    "unresolved": unresolved(evaluated),
                }, sort_keys=False, allow_unicode=True)
            )
        incoming.append(evaluated)

    journey_eval = next(x for x in incoming if x["source_capability"] == "prep.user-journeys")
    if len(journey_eval.get("required_sources", []) or []) != 78 or unresolved(journey_eval):
        raise SystemExit("Journey STRICT-6 exhaustive derivation is not 78/78 accounted")
    journey_links = {
        s: tuple(link.get("targets", []) or [])
        for link in journey_eval.get("links", []) or []
        for s in link.get("sources", []) or []
    }
    if journey_links.get("UJ-KNOWLEDGE-APPLY-CAPABILITY-SCOPE") != ("IX-ACT-KNOWLEDGE-APPLY-CAPABILITY-SCOPE",):
        raise SystemExit("Apply Capability scope is not independently derived")
    if journey_links.get("UJ-KNOWLEDGE-CLEAR-CAPABILITY-SCOPE") != ("IX-ACT-KNOWLEDGE-CLEAR-CAPABILITY-SCOPE",):
        raise SystemExit("Clear Capability scope is not independently derived")

    admitted = admit_artifact(
        graph=graph,
        model=core,
        skill_registry=registry,
        knowledge_contracts=semantic_contracts,
        derivation_evaluations=incoming,
        capability=CAPABILITY,
        sources=source_bundle,
        candidate=candidate,
        acceptance_id=ACCEPTANCE_ID,
        lifecycle=lifecycle,
        decision_request_mode="REVISION",
    )
    if admitted.get("status") != "ACCEPTED":
        raise SystemExit("Interaction admission rejected:\n" + yaml.safe_dump(admitted.get("findings"), allow_unicode=True))

    old_ids = {cap: row.get("acceptance_id") for cap, row in rows.items()}
    replace_artifact_evaluation(semantic_set, admitted)
    for item in incoming:
        replace_derivation_evaluation(semantic_set, item)
    replace_lifecycle_provider(lifecycle, admitted["lifecycle_assertion"])

    next_publication = build_project_publication(
        graph=graph,
        core_model=core,
        semantic_evaluations=semantic_set,
        lifecycle=lifecycle,
        decision_failures=failures,
        parent_revision=publication["revision"],
    )

    after_rows = lifecycle_index(lifecycle)
    reaccepted = [
        cap for cap, row in after_rows.items()
        if cap != CAPABILITY and row.get("acceptance_id") != old_ids.get(cap)
    ]
    if reaccepted:
        raise SystemExit(f"Artifacts reaccepted unexpectedly: {reaccepted}")

    after_states = lifecycle_states(
        graph, core, lifecycle,
        current_acceptance_policy_fingerprints=policy_fingerprints,
    )
    after = after_states.get(CAPABILITY, {})
    if after.get("state") != "CURRENT":
        raise SystemExit(f"Interaction did not become CURRENT: {after}")

    ordered = list(productions)
    ix_index = ordered.index(CAPABILITY)
    actionable = []
    for capability in ordered[ix_index + 1:]:
        state = after_states.get(capability, {})
        if state.get("state") == "CURRENT":
            continue
        requires = [
            item.get("capability")
            for item in productions[capability].get("requires", []) or []
            if isinstance(item, dict)
        ]
        if all(after_states.get(p, {}).get("state") == "CURRENT" for p in requires):
            actionable.append({
                "capability": capability,
                "authority": state.get("authority"),
                "state": state.get("state"),
                "details": state,
            })

    roles = candidate.get("interaction_roles", []) or []
    role_ids = [x.get("id") for x in roles if isinstance(x, dict)]
    obs = review.get("observable_realization_obligations", []) or []
    counts = {
        category: sum(1 for x in obs if x.get("category") == category and x.get("status") == "REQUIRED")
        for category in ("ACTION", "STATE", "DISTINCTION")
    }
    questions = [x.get("id") for x in obs if x.get("status") == "QUESTION"]

    canonical = (ROOT / CANONICAL_PATH).read_text(encoding="utf-8")
    if "apply-required-capability-scope" not in canonical or "clear-required-capability-scope" not in canonical:
        raise SystemExit("Canonical Knowledge apply/clear split missing")
    if "apply-or-clear-required-capability-scope" in canonical:
        raise SystemExit("Old combined Knowledge scope action remains")
    if "IX-ROLE-TARGET-CANDIDATE-CONTINUE" not in canonical:
        raise SystemExit("Canonical Target role contract missing")
    forbidden_ui = ["dropdown", "checkbox", "toolbar", "screen region"]
    if any(term in canonical.lower() for term in forbidden_ui):
        raise SystemExit("Concrete UI primitive leaked into canonical Interaction")

    report = {
        "version": 1,
        "kind": "prep-interaction-revalidation-report",
        "stage": "STAGE-P1-IX",
        "old_acceptance": old.get("acceptance_id"),
        "old_accepted_prerequisites": old_prereqs,
        "before_state": before,
        "derivations": {
            x["source_capability"]: {
                "status": x.get("status"),
                "required": len(x.get("required_sources", []) or []),
                "covered": len(x.get("covered_sources", []) or []),
                "disposed": len(x.get("dispositions", []) or []),
                "unresolved": unresolved(x),
            } for x in incoming
        },
        "independent_obligation_count": len(review.get("independent_obligations", []) or []),
        "knowledge_scope": {"apply_independent": True, "clear_independent": True},
        "target_roles": {
            "applicability": "REQUIRED",
            "roles": role_ids,
            "comparison_selection_activates_target": False,
            "material_transitions_complete": True,
            "opened_inspected_distinct_role": False,
        },
        "observable_applicability": {**counts, "questions": questions},
        "prep_ux_012": {
            "same_role_equivalence_established": False,
            "status": "BLOCKED:same-role-equivalence-not-established",
            "reason": "Comparison selection, candidate-to-continue and active Target are materially different accepted roles; no two same-role occurrences with unjustified inconsistent mechanics are established at Interaction level.",
        },
        "defect_evidence": {
            "PREP-UX-003": "Interaction-level omission confirmed and repaired by explicit cross-context Target role contracts.",
            "PREP-UX-005": "Apply/clear Required Capability scope are independent Interaction actions; realization remains downstream.",
            "PREP-UX-006": "Interaction-level distinction is now explicit: Capability Knowledge scope and Next Focus cannot silently mutate each other; observable realization remains downstream.",
            "PREP-UX-014": "Clear/apply local scope actions are independently required; concrete control realization remains downstream.",
            "PREP-UX-001": "Existing Active Target context continuity is semantically sufficient; earliest remaining owner is downstream presentation/screen/usability.",
            "PREP-UX-004": "Required Capability remains inspectable in Target requirements and usable as Knowledge scope; remaining visibility problem is downstream observable presentation.",
        },
        "new_acceptance": admitted["lifecycle_assertion"].get("acceptance_id"),
        "after_state": after,
        "reaccepted_artifacts": reaccepted,
        "actionable_frontier": actionable,
    }

    (ROOT / ".harness/project-publication.next.yaml").write_text(
        yaml.safe_dump(next_publication, sort_keys=False, allow_unicode=True), encoding="utf-8"
    )
    (ROOT / ".harness/interaction-revalidation-report.yaml").write_text(
        yaml.safe_dump(report, sort_keys=False, allow_unicode=True), encoding="utf-8"
    )
    print(yaml.safe_dump(report, sort_keys=False, allow_unicode=True))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
