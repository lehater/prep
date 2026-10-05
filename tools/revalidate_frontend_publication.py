#!/usr/bin/env python3
from __future__ import annotations

import copy
import os
import re
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ["HARNESS_ROOT"]).resolve()
sys.path.insert(0, str(HARNESS_ROOT / "src"))

from harness.application.decision_explorer_request import derive_decision_explorer_request
from harness.application.project_publication import build_project_publication, read_project_publication
from harness.application.semantic_admission import (
    admit_artifact,
    derive_acceptance_policy_fingerprints,
)
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index

POLICY_PATH = ROOT / ".harness/candidates/application-design-decision-policy.yaml"

ORDER = [
    "prep.problem-evidence",
    "prep.user-needs",
    "prep.product-intent",
    "prep.product-capabilities",
    "prep.domain-strategy",
    "prep.model-context-strategy",
    "prep.knowledge-relation-classification",
    "prep.knowledge-model",
    "prep.frontend-performance-capacity",
    "prep.learning-design",
    "prep.learner-model",
    "prep.task-model",
    "prep.application-design",
    "prep.application-process.activity-evidence-cycle",
    "prep.application-process.prepare-support",
    "prep.user-journeys",
    "prep.conceptual-interface-model",
    "prep.machine-interfaces",
    "prep.information-architecture",
    "prep.interaction-design",
    "prep.interface-topology",
    "prep.presentation-system",
    "prep.screen-view-design",
    "prep.interface-verification",
    "prep.presentation-verification",
    "prep.frontend-system-architecture",
    "prep.frontend-engineering-policy",
    "prep.frontend-component-design",
    "prep.frontend-verification",
    "prep.frontend-test-design",
    "prep.frontend-implementation-design",
]

EXPLICIT_CANDIDATES = {
    "prep.interface-topology": ".harness/candidates/frontend-boundary-topology-admission.yaml",
    "prep.screen-view-design": ".harness/candidates/presentation-screen-screen-admission.yaml",
    "prep.interface-verification": ".harness/candidates/interface-verification-admission.yaml",
    "prep.presentation-verification": ".harness/candidates/presentation-verification-admission.yaml",
    "prep.frontend-system-architecture": ".harness/candidates/frontend-system-architecture-admission.yaml",
    "prep.frontend-engineering-policy": ".harness/candidates/frontend-engineering-policy-admission.yaml",
    "prep.frontend-component-design": ".harness/candidates/frontend-component-design-admission.yaml",
    "prep.frontend-verification": ".harness/candidates/frontend-verification-admission.yaml",
    "prep.frontend-test-design": ".harness/candidates/frontend-test-design-admission.yaml",
    "prep.frontend-implementation-design": ".harness/candidates/frontend-implementation-design-admission.yaml",
}

DRAFT_EXPLORATIONS = {
    "prep.frontend-system-architecture": ".harness/candidates/frontend-system-architecture-exploration-draft.yaml",
    "prep.frontend-component-design": ".harness/candidates/frontend-component-design-exploration-draft.yaml",
    "prep.frontend-implementation-design": ".harness/candidates/frontend-implementation-design-exploration-draft.yaml",
}

FINAL_EXPLORATIONS = {
    "prep.frontend-system-architecture": ".harness/candidates/frontend-system-architecture-exploration.yaml",
    "prep.frontend-component-design": ".harness/candidates/frontend-component-design-exploration.yaml",
    "prep.frontend-implementation-design": ".harness/candidates/frontend-implementation-design-exploration.yaml",
}


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def candidate_index() -> dict[str, list[tuple[Path, dict[str, Any]]]]:
    result: dict[str, list[tuple[Path, dict[str, Any]]]] = {}
    for path in sorted((ROOT / ".harness/candidates").glob("*admission*.yaml")):
        try:
            doc = load(path)
        except Exception:
            continue
        if doc.get("kind") != "harness-artifact-admission-candidate":
            continue
        capability = doc.get("capability")
        if isinstance(capability, str):
            result.setdefault(capability, []).append((path, doc))
    return result


def contract_index() -> dict[tuple[str, str], list[tuple[Path, dict[str, Any]]]]:
    result: dict[tuple[str, str], list[tuple[Path, dict[str, Any]]]] = {}
    for path in sorted((ROOT / ".harness/candidates").glob("*contract.yaml")):
        try:
            doc = load(path)
        except Exception:
            continue
        if doc.get("kind") != "harness-semantic-derivation-contract":
            continue
        key = (doc.get("source_capability"), doc.get("target_capability"))
        if all(isinstance(x, str) and x for x in key):
            result.setdefault(key, []).append((path, doc))
    return result


def valid_exploration_index() -> dict[str, list[tuple[Path, dict[str, Any]]]]:
    result: dict[str, list[tuple[Path, dict[str, Any]]]] = {}
    for path in sorted((ROOT / ".harness/candidates").glob("*exploration*.yaml")):
        try:
            doc = load(path)
        except Exception:
            continue
        if doc.get("kind") != "harness-decision-exploration":
            continue
        capability = doc.get("capability")
        if isinstance(capability, str):
            result.setdefault(capability, []).append((path, doc))
    return result


def derivation_index(bundle: dict[str, Any]) -> dict[tuple[str, str], dict[str, Any]]:
    return {
        (item["source_capability"], item["target_capability"]): item
        for item in bundle.get("derivation_evaluations", []) or []
    }


def lifecycle_index(lifecycle: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        item["capability"]: item
        for item in lifecycle.get("providers", []) or []
        if isinstance(item, dict) and isinstance(item.get("capability"), str)
    }


def artifact_for_capability(core: dict[str, Any], capability: str) -> str:
    matches = [
        item["id"]
        for item in core.get("artifacts", []) or []
        if isinstance(item, dict) and capability in (item.get("provides", []) or [])
    ]
    if len(matches) != 1:
        raise SystemExit(f"{capability} must have exactly one Core artifact, got {matches}")
    return matches[0]


def choose_candidates(
    rows: dict[str, list[tuple[Path, dict[str, Any]]]],
    lifecycle_rows: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    selected: dict[str, dict[str, Any]] = {}
    for capability in ORDER:
        explicit = EXPLICIT_CANDIDATES.get(capability)
        if explicit:
            selected[capability] = load(ROOT / explicit)
            continue
        options = rows.get(capability, [])
        provider = lifecycle_rows.get(capability)
        expected = (provider or {}).get("semantic_atom_fingerprints")
        if isinstance(expected, dict) and expected:
            matches = [
                copy.deepcopy(doc)
                for _path, doc in options
                if semantic_assertion_fingerprints(doc) == expected
            ]
            if len(matches) == 1:
                selected[capability] = matches[0]
                continue
        if len(options) == 1:
            selected[capability] = copy.deepcopy(options[0][1])
            continue
        raise SystemExit(
            f"cannot select candidate for {capability}; "
            f"options={[str(path) for path, _ in options]}"
        )
    return selected


def next_acceptance_id(capability: str, old: str | None) -> str:
    if old:
        match = re.match(r"^(.*-STRICT-)(\d+)$", old)
        if match:
            return f"{match.group(1)}{int(match.group(2)) + 1}"
        return old + "-REVALIDATION-1"
    suffix = capability.removeprefix("prep.").upper().replace(".", "-").replace("_", "-")
    return f"PREP-{suffix}-STRICT-1"


def replace_or_append_artifact_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["artifact"], evaluation["capability"])
    for index, row in enumerate(bundle["semantic_evaluations"]):
        if (row.get("artifact"), row.get("capability")) == key:
            bundle["semantic_evaluations"][index] = evaluation
            return
    bundle["semantic_evaluations"].append(evaluation)


def replace_or_append_derivation_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["source_capability"], evaluation["target_capability"])
    for index, row in enumerate(bundle["derivation_evaluations"]):
        if (row.get("source_capability"), row.get("target_capability")) == key:
            bundle["derivation_evaluations"][index] = evaluation
            return
    bundle["derivation_evaluations"].append(evaluation)


def replace_or_append_lifecycle(lifecycle: dict[str, Any], provider: dict[str, Any]) -> None:
    for index, row in enumerate(lifecycle["providers"]):
        if row.get("capability") == provider["capability"]:
            lifecycle["providers"][index] = provider
            return
    lifecycle["providers"].append(provider)


def evidence_from_previous(previous: dict[str, Any]) -> dict[str, Any]:
    return {
        "version": 1,
        "kind": "harness-semantic-derivation-evidence",
        "source_capability": previous["source_capability"],
        "target_capability": previous["target_capability"],
        "links": copy.deepcopy(previous.get("links", [])),
        "dispositions": copy.deepcopy(previous.get("dispositions", [])),
    }


def evidence_from_provenance(
    contract: dict[str, Any],
    source: dict[str, Any],
    candidate: dict[str, Any],
) -> dict[str, Any]:
    source_assertions = source.get("semantic_assertions", []) or []
    target_assertions = candidate.get("semantic_assertions", []) or []
    links: list[dict[str, Any]] = []
    for obligation in contract.get("obligations", []) or []:
        source_kind = obligation.get("source_kind")
        subject = obligation.get("subject")
        matches = [
            item
            for item in source_assertions
            if item.get("kind") == source_kind
            and (subject is None or item.get("subject") == subject)
        ]
        for item in matches:
            source_id = item["id"]
            targets = [
                target["id"]
                for target in target_assertions
                if source_id in (target.get("derived_from", []) or [])
            ]
            if targets:
                links.append({
                    "sources": [source_id],
                    "relation": "REALIZES",
                    "targets": targets,
                })
    return {
        "version": 1,
        "kind": "harness-semantic-derivation-evidence",
        "source_capability": contract["source_capability"],
        "target_capability": contract["target_capability"],
        "links": links,
        "dispositions": [],
    }


def select_derivation(
    key: tuple[str, str],
    rows: list[tuple[Path, dict[str, Any]]],
    previous: dict[str, Any] | None,
    *,
    graph: dict[str, Any],
    source: dict[str, Any],
    candidate: dict[str, Any],
) -> dict[str, Any]:
    accepted: list[tuple[Path, dict[str, Any]]] = []
    for path, contract in rows:
        evidence = (
            evidence_from_previous(previous)
            if previous is not None
            else evidence_from_provenance(contract, source, candidate)
        )
        evaluated = evaluate_derivation(
            graph=graph,
            contract=contract,
            source=source,
            candidate=candidate,
            evidence=evidence,
        )
        if evaluated.get("status") == "ACCEPTED":
            accepted.append((path, evaluated))

    if previous is not None:
        required = set(previous.get("required_sources", []) or [])
        compatible = [
            (path, evaluation)
            for path, evaluation in accepted
            if set(evaluation.get("required_sources", []) or []) == required
        ]
        if len(compatible) == 1:
            return compatible[0][1]
        if len(compatible) > 1:
            normalized = {
                yaml.safe_dump(evaluation, sort_keys=True, allow_unicode=True)
                for _path, evaluation in compatible
            }
            if len(normalized) == 1:
                return compatible[0][1]

    if len(accepted) == 1:
        return accepted[0][1]
    raise SystemExit(
        f"no unique accepted derivation for {key}; "
        f"contracts={[str(path) for path, _ in rows]}; "
        f"accepted={[str(path) for path, _ in accepted]}"
    )


def decision_ids_from_candidate(candidate: dict[str, Any]) -> set[str]:
    return {
        decision["id"]
        for axis in (candidate.get("decision_review", {}) or {}).get("axes", []) or []
        for decision in axis.get("decisions", []) or []
        if isinstance(decision, dict) and isinstance(decision.get("id"), str)
    }


def decision_ids_from_exploration(exploration: dict[str, Any]) -> set[str]:
    return {
        point["id"]
        for axis in exploration.get("axes", []) or []
        if axis.get("applicability") == "APPLICABLE"
        for point in axis.get("decision_points", []) or []
        if isinstance(point, dict) and isinstance(point.get("id"), str)
    }


def normalized_draft_exploration(
    capability: str,
    knowledge_kind: str,
    request_id: str,
) -> tuple[Path, dict[str, Any]]:
    draft = load(ROOT / DRAFT_EXPLORATIONS[capability])
    exploration = {
        "version": 1,
        "kind": "harness-decision-exploration",
        "capability": capability,
        "knowledge_kind": knowledge_kind,
        "explorer_request_id": request_id,
        "research_sources": copy.deepcopy(draft.get("research_sources", [])),
        "axes": copy.deepcopy(draft["axes"]),
        "decision_space_review": copy.deepcopy(draft["decision_space_review"]),
    }
    return ROOT / FINAL_EXPLORATIONS[capability], exploration


def choose_exploration(
    capability: str,
    candidate: dict[str, Any],
    request: dict[str, Any] | None,
    knowledge_kind: str,
    valid_index: dict[str, list[tuple[Path, dict[str, Any]]]],
) -> dict[str, Any] | None:
    if request is None:
        return None
    request_id = request["request_id"]
    if capability in DRAFT_EXPLORATIONS:
        path, exploration = normalized_draft_exploration(
            capability, knowledge_kind, request_id
        )
    else:
        rows = valid_index.get(capability, [])
        wanted = decision_ids_from_candidate(candidate)
        compatible = [
            (path, copy.deepcopy(doc))
            for path, doc in rows
            if decision_ids_from_exploration(doc) == wanted
        ]
        if len(compatible) != 1:
            raise SystemExit(
                f"cannot select decision exploration for {capability}; "
                f"wanted={sorted(wanted)}; options={[str(path) for path, _ in rows]}"
            )
        path, exploration = compatible[0]
        exploration["explorer_request_id"] = request_id

    if decision_ids_from_exploration(exploration) != decision_ids_from_candidate(candidate):
        raise SystemExit(f"decision set mismatch for {capability}")
    path.write_text(
        yaml.safe_dump(exploration, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    return exploration


def main() -> int:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(
        ROOT / ".harness/project-publication.yaml",
        graph=graph,
    )
    semantic_set = copy.deepcopy(publication["state"]["semantic_evaluations"])
    lifecycle = copy.deepcopy(publication["state"]["lifecycle"])
    failures = copy.deepcopy(publication["state"]["decision_failures"])

    productions = production_index(graph)
    contracts = contract_index()
    candidates_by_cap = candidate_index()
    valid_explorations = valid_exploration_index()
    derivations = derivation_index(semantic_set)
    lifecycle_rows = lifecycle_index(lifecycle)
    selected_candidates = choose_candidates(candidates_by_cap, lifecycle_rows)

    registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    semantic_contracts = load(
        HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
    )
    decision_contracts = load(
        HARNESS_ROOT / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml"
    )
    decision_policy = load(POLICY_PATH)

    report: list[dict[str, Any]] = []

    for capability in ORDER:
        candidate = selected_candidates[capability]
        production = productions[capability]
        prerequisites = [item["capability"] for item in production.get("requires", []) or []]
        sources = {"semantic_assertions": []}
        incoming: list[dict[str, Any]] = []

        for source_capability in prerequisites:
            if source_capability not in selected_candidates:
                raise SystemExit(
                    f"{capability} requires {source_capability}, which is outside selected revalidation closure"
                )
            source_candidate = selected_candidates[source_capability]
            source_artifact = artifact_for_capability(core, source_capability)
            for assertion in source_candidate.get("semantic_assertions", []) or []:
                copied = copy.deepcopy(assertion)
                copied["source_artifact"] = source_artifact
                sources["semantic_assertions"].append(copied)

            key = (source_capability, capability)
            rows = contracts.get(key, [])
            if not rows:
                raise SystemExit(f"missing derivation contract for {key}")
            evaluated = select_derivation(
                key,
                rows,
                derivations.get(key),
                graph=graph,
                source=source_candidate,
                candidate=candidate,
            )
            incoming.append(evaluated)

        old_provider = lifecycle_rows.get(capability)
        mode = "REDO" if old_provider is not None else "CREATE"
        request = derive_decision_explorer_request(
            graph=graph,
            model=core,
            decision_contracts=decision_contracts,
            decision_policy=decision_policy,
            capability=capability,
            lifecycle=lifecycle,
            mode=mode,
        )
        exploration = choose_exploration(
            capability,
            candidate,
            request,
            production["knowledge_kind"],
            valid_explorations,
        )

        acceptance_id = next_acceptance_id(
            capability,
            old_provider.get("acceptance_id") if old_provider else None,
        )
        admitted = admit_artifact(
            graph=graph,
            model=core,
            skill_registry=registry,
            knowledge_contracts=semantic_contracts,
            decision_contracts=decision_contracts,
            decision_policy=decision_policy,
            decision_exploration=exploration,
            derivation_evaluations=incoming,
            capability=capability,
            sources=sources,
            candidate=candidate,
            acceptance_id=acceptance_id,
            lifecycle=lifecycle,
            decision_request_mode=mode,
        )
        if admitted.get("status") != "ACCEPTED":
            raise SystemExit(
                f"admission rejected for {capability}: "
                f"findings={admitted.get('findings')} "
                f"decision_exploration={admitted.get('admission', {}).get('decision_exploration')} "
                f"decision_governance={admitted.get('admission', {}).get('decision_governance')}"
            )

        replace_or_append_artifact_evaluation(semantic_set, admitted)
        for item in incoming:
            replace_or_append_derivation_evaluation(semantic_set, item)
            derivations[(item["source_capability"], item["target_capability"])] = item

        provider = admitted["lifecycle_assertion"]
        replace_or_append_lifecycle(lifecycle, provider)
        lifecycle_rows[capability] = provider

        report.append({
            "capability": capability,
            "mode": mode,
            "status": "ACCEPTED",
            "acceptance_id": acceptance_id,
            "derivations": len(incoming),
            "decision_request": request["request_id"] if request else None,
        })

    next_publication = build_project_publication(
        graph=graph,
        core_model=core,
        semantic_evaluations=semantic_set,
        lifecycle=lifecycle,
        decision_failures=failures,
        parent_revision=publication["revision"],
    )

    policy_fingerprints = derive_acceptance_policy_fingerprints(
        graph=graph,
        knowledge_contracts=semantic_contracts,
        decision_contracts=decision_contracts,
        decision_policy=decision_policy,
    )
    states = lifecycle_states(
        graph,
        core,
        lifecycle,
        current_acceptance_policy_fingerprints=policy_fingerprints,
    )
    selected_noncurrent = {
        capability: states[capability]
        for capability in ORDER
        if states.get(capability, {}).get("state") != "CURRENT"
    }
    if selected_noncurrent:
        raise SystemExit(
            "selected frontend closure remains non-current:\n"
            + yaml.safe_dump(selected_noncurrent, sort_keys=False, allow_unicode=True)
        )

    (ROOT / ".harness/project-publication.next.yaml").write_text(
        yaml.safe_dump(next_publication, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    (ROOT / ".harness/candidates/current-lifecycle.next.yaml").write_text(
        yaml.safe_dump(lifecycle, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    (ROOT / ".harness/revalidation-report.yaml").write_text(
        yaml.safe_dump(
            {
                "version": 1,
                "kind": "prep-frontend-publication-revalidation-report",
                "parent_revision": publication["revision"],
                "next_revision": next_publication["revision"],
                "results": report,
                "selected_noncurrent": {},
            },
            sort_keys=False,
            allow_unicode=True,
        ),
        encoding="utf-8",
    )
    print(yaml.safe_dump({
        "parent_revision": publication["revision"],
        "next_revision": next_publication["revision"],
        "accepted": len(report),
        "selected_noncurrent": {},
    }, sort_keys=False, allow_unicode=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
