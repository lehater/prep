#!/usr/bin/env python3
from __future__ import annotations

import copy
import os
import re
import sys
from collections import deque
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ["HARNESS_ROOT"]).resolve()
sys.path.insert(0, str(HARNESS_ROOT / "src"))

from harness.application.project_publication import build_project_publication, publish_project_publication, read_project_publication
from harness.application.semantic_admission import admit_artifact, derive_acceptance_policy_fingerprints
from harness.application.semantic_closure import evaluate_semantic_closure
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise RuntimeError(f"{path} must contain a mapping")
    return value


def candidate_index() -> dict[str, list[tuple[Path, dict[str, Any]]]]:
    result: dict[str, list[tuple[Path, dict[str, Any]]]] = {}
    for path in sorted((ROOT / ".harness/candidates").glob("*-admission.yaml")):
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
    for path in sorted((ROOT / ".harness/candidates").glob("*-contract.yaml")):
        try:
            doc = load(path)
        except Exception:
            continue
        if doc.get("kind") != "harness-semantic-derivation-contract":
            continue
        source = doc.get("source_capability")
        target = doc.get("target_capability")
        if isinstance(source, str) and isinstance(target, str):
            result.setdefault((source, target), []).append((path, doc))
    return result


def exploration_index() -> dict[str, list[tuple[Path, dict[str, Any]]]]:
    result: dict[str, list[tuple[Path, dict[str, Any]]]] = {}
    for path in sorted((ROOT / ".harness/candidates").glob("*exploration*.yaml")):
        try:
            doc = load(path)
        except Exception:
            continue
        if doc.get("kind") != "harness-decision-exploration":
            continue
        capability = doc.get("capability")
        if not isinstance(capability, str):
            continue
        review = doc.get("decision_space_review")
        if not isinstance(review, dict) or review.get("status") != "COMPLETE":
            continue
        result.setdefault(capability, []).append((path, doc))
    return result


def derivation_index(bundle: dict[str, Any]) -> dict[tuple[str, str], dict[str, Any]]:
    return {
        (row["source_capability"], row["target_capability"]): row
        for row in bundle.get("derivation_evaluations", []) or []
        if isinstance(row, dict)
        and isinstance(row.get("source_capability"), str)
        and isinstance(row.get("target_capability"), str)
    }


def lifecycle_index(lifecycle: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        row["capability"]: row
        for row in lifecycle.get("providers", []) or []
        if isinstance(row, dict) and isinstance(row.get("capability"), str)
    }


def artifact_for_capability(core: dict[str, Any], capability: str) -> str:
    matches = [
        row["id"]
        for row in core.get("artifacts", []) or []
        if isinstance(row, dict) and capability in (row.get("provides", []) or [])
    ]
    if len(matches) != 1:
        raise RuntimeError(f"{capability}: expected one Core artifact, got {matches}")
    return matches[0]


def choose_candidate(
    capability: str,
    candidates: dict[str, list[tuple[Path, dict[str, Any]]]],
    lifecycle_rows: dict[str, dict[str, Any]],
) -> tuple[Path, dict[str, Any]]:
    rows = candidates.get(capability, [])
    expected = (lifecycle_rows.get(capability) or {}).get("semantic_atom_fingerprints")
    if isinstance(expected, dict) and expected:
        matches = [
            (path, copy.deepcopy(doc))
            for path, doc in rows
            if semantic_assertion_fingerprints(doc) == expected
        ]
        if len(matches) == 1:
            return matches[0]
        if len(matches) > 1:
            canonical = [
                item for item in matches
                if item[1].get("id") == artifact_for_capability(CORE, capability)
            ]
            if len(canonical) == 1:
                return canonical[0]
    if len(rows) == 1:
        return rows[0][0], copy.deepcopy(rows[0][1])
    raise RuntimeError(
        f"cannot select accepted candidate for {capability}; "
        f"candidates={[str(path) for path, _ in rows]}"
    )


def topo_order(graph: dict[str, Any], capabilities: set[str]) -> list[str]:
    productions = production_index(graph)
    indegree = {capability: 0 for capability in capabilities}
    children = {capability: set() for capability in capabilities}
    for capability in capabilities:
        if capability not in productions:
            raise RuntimeError(f"missing production for {capability}")
        for requirement in productions[capability].get("requires", []) or []:
            dependency = requirement.get("capability") if isinstance(requirement, dict) else None
            if dependency in capabilities:
                indegree[capability] += 1
                children[dependency].add(capability)
    queue = deque(sorted(cap for cap, degree in indegree.items() if degree == 0))
    order: list[str] = []
    while queue:
        capability = queue.popleft()
        order.append(capability)
        for child in sorted(children[capability]):
            indegree[child] -= 1
            if indegree[child] == 0:
                queue.append(child)
    if len(order) != len(capabilities):
        raise RuntimeError("capability graph contains a cycle or missing dependency")
    return order


def next_acceptance_id(old: str) -> str:
    match = re.match(r"^(.*-STRICT-)(\d+)$", old)
    if match:
        return f"{match.group(1)}{int(match.group(2)) + 1}"
    return old + "-POLICY-REVALIDATION-1"


def upsert_artifact_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["artifact"], evaluation["capability"])
    for index, row in enumerate(bundle["semantic_evaluations"]):
        if (row.get("artifact"), row.get("capability")) == key:
            bundle["semantic_evaluations"][index] = evaluation
            return
    bundle["semantic_evaluations"].append(evaluation)


def upsert_derivation_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["source_capability"], evaluation["target_capability"])
    for index, row in enumerate(bundle["derivation_evaluations"]):
        if (row.get("source_capability"), row.get("target_capability")) == key:
            bundle["derivation_evaluations"][index] = evaluation
            return
    bundle["derivation_evaluations"].append(evaluation)


def upsert_provider(lifecycle: dict[str, Any], provider: dict[str, Any]) -> None:
    for index, row in enumerate(lifecycle["providers"]):
        if row.get("capability") == provider["capability"]:
            lifecycle["providers"][index] = provider
            return
    lifecycle["providers"].append(provider)


def mentioned_sources(evidence: dict[str, Any]) -> set[str]:
    result: set[str] = set()
    for row in evidence.get("links", []) or []:
        for source in row.get("sources", []) or []:
            if isinstance(source, str):
                result.add(source)
    for row in evidence.get("dispositions", []) or []:
        source = row.get("source")
        if isinstance(source, str):
            result.add(source)
    return result


def enrich_evidence(
    source_capability: str,
    target_capability: str,
    source_candidate: dict[str, Any],
    target_candidate: dict[str, Any],
    previous: dict[str, Any],
) -> dict[str, Any]:
    evidence = {
        "version": 1,
        "kind": "harness-semantic-derivation-evidence",
        "source_capability": source_capability,
        "target_capability": target_capability,
        "links": copy.deepcopy(previous.get("links", [])),
        "dispositions": copy.deepcopy(previous.get("dispositions", [])),
    }
    already = mentioned_sources(evidence)
    targets = [
        row
        for row in target_candidate.get("semantic_assertions", []) or []
        if isinstance(row, dict) and isinstance(row.get("id"), str)
    ]
    for source in source_candidate.get("semantic_assertions", []) or []:
        if not isinstance(source, dict):
            continue
        source_id = source.get("id")
        if not isinstance(source_id, str) or source_id in already:
            continue
        target_ids = [
            row["id"]
            for row in targets
            if source_id in (row.get("derived_from", []) or [])
        ]
        if target_ids:
            evidence["links"].append(
                {"relation": "TRANSFORMS", "sources": [source_id], "targets": target_ids}
            )
        else:
            evidence["dispositions"].append(
                {
                    "source": source_id,
                    "status": "NOT_APPLICABLE",
                    "rationale": (
                        f"{source_id} introduces meaning outside the responsibility of "
                        f"{target_capability}; no target assertion derives from it, so the "
                        "capability boundary preserves it as not applicable rather than "
                        "inventing downstream semantics."
                    ),
                }
            )
    return evidence


def select_derivation(
    key: tuple[str, str],
    rows: list[tuple[Path, dict[str, Any]]],
    previous: dict[str, Any],
    *,
    graph: dict[str, Any],
    source: dict[str, Any],
    candidate: dict[str, Any],
    evidence: dict[str, Any],
) -> dict[str, Any]:
    accepted: list[tuple[Path, dict[str, Any]]] = []
    rejected: list[tuple[str, Any]] = []
    for path, contract in rows:
        attempt = evaluate_derivation(
            graph=graph,
            contract=contract,
            source=source,
            candidate=candidate,
            evidence=evidence,
        )
        if attempt.get("status") == "ACCEPTED":
            accepted.append((path, attempt))
        else:
            rejected.append((str(path), attempt.get("findings")))
    if not accepted:
        raise RuntimeError(f"no accepted derivation contract for {key}; rejected={rejected}")
    old_required = set(previous.get("required_sources", []) or [])
    compatible = [
        item
        for item in accepted
        if old_required <= set(item[1].get("required_sources", []) or [])
    ]
    pool = compatible or accepted
    if len(pool) > 1:
        normalized = {
            yaml.safe_dump(item[1], sort_keys=True, allow_unicode=True)
            for item in pool
        }
        if len(normalized) != 1:
            raise RuntimeError(
                f"ambiguous derivation contracts for {key}: {[str(path) for path, _ in pool]}"
            )
    return pool[0][1]


def bind_exploration(
    capability: str,
    request_id: str,
    templates: dict[str, list[tuple[Path, dict[str, Any]]]],
) -> tuple[Path, dict[str, Any]]:
    rows = templates.get(capability, [])
    if not rows:
        raise RuntimeError(
            f"{capability} requires decision exploration but no COMPLETE exploration template exists"
        )
    ranked = sorted(
        rows,
        key=lambda item: (
            0 if "-current" in item[0].name else 1,
            0 if item[0].name.startswith(capability.removeprefix("prep.").replace(".", "-")) else 1,
            item[0].name,
        ),
    )
    path, template = ranked[0]
    review = copy.deepcopy(template["decision_space_review"])
    if review.get("open_gaps"):
        raise RuntimeError(f"{capability} exploration template has open gaps: {path}")
    bound = {
        "version": 1,
        "kind": "harness-decision-exploration",
        "capability": capability,
        "knowledge_kind": template["knowledge_kind"],
        "explorer_request_id": request_id,
        "research_sources": copy.deepcopy(template.get("research_sources", [])),
        "axes": copy.deepcopy(template.get("axes", [])),
        "decision_space_review": review,
    }
    return path, bound


def admit_with_exploration(
    *,
    capability: str,
    kwargs: dict[str, Any],
    templates: dict[str, list[tuple[Path, dict[str, Any]]]],
) -> tuple[dict[str, Any], tuple[Path, dict[str, Any]] | None]:
    probe = admit_artifact(**kwargs)
    if probe.get("status") == "ACCEPTED":
        return probe, None
    admission = probe.get("admission", {}) or {}
    request_id = admission.get("decision_explorer_request_id")
    if not isinstance(request_id, str) or not request_id:
        raise RuntimeError(
            yaml.safe_dump(
                {
                    "capability": capability,
                    "status": probe.get("status"),
                    "findings": probe.get("findings"),
                    "admission": admission,
                },
                sort_keys=False,
                allow_unicode=True,
            )
        )
    template_path, exploration = bind_exploration(capability, request_id, templates)
    admitted = admit_artifact(**kwargs, decision_exploration=exploration)
    if admitted.get("status") != "ACCEPTED":
        raise RuntimeError(
            yaml.safe_dump(
                {
                    "capability": capability,
                    "template": str(template_path.relative_to(ROOT)),
                    "status": admitted.get("status"),
                    "findings": admitted.get("findings"),
                    "admission": admitted.get("admission"),
                },
                sort_keys=False,
                allow_unicode=True,
            )
        )
    return admitted, (template_path, exploration)


def main() -> int:
    global CORE
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    CORE = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(
        ROOT / ".harness/project-publication.yaml", graph=graph
    )
    semantic_set = copy.deepcopy(publication["state"]["semantic_evaluations"])
    lifecycle = copy.deepcopy(publication["state"]["lifecycle"])
    failures = copy.deepcopy(publication["state"]["decision_failures"])

    candidates = candidate_index()
    contracts = contract_index()
    explorations = exploration_index()
    derivations = derivation_index(semantic_set)
    lifecycle_rows = lifecycle_index(lifecycle)
    all_current_caps = set(lifecycle_rows)
    selected_caps = {
        "prep.frontend-implementation-design",
    }
    order = topo_order(graph, selected_caps)
    productions = production_index(graph)

    registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    knowledge_contracts = load(
        HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
    )
    decision_contracts = load(
        HARNESS_ROOT / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml"
    )
    decision_policy = None

    report: list[dict[str, Any]] = []
    rebound: dict[Path, dict[str, Any]] = {}

    for capability in order:
        candidate_path, candidate = choose_candidate(
            capability, candidates, lifecycle_rows
        )
        sources = {"semantic_assertions": []}
        incoming: list[dict[str, Any]] = []

        for requirement in productions[capability].get("requires", []) or []:
            source_capability = requirement.get("capability")
            if source_capability not in all_current_caps:
                raise RuntimeError(
                    f"{capability}: required upstream capability is not CURRENT/published: "
                    f"{source_capability}"
                )
            _, source_candidate = choose_candidate(
                source_capability, candidates, lifecycle_rows
            )
            source_artifact = artifact_for_capability(CORE, source_capability)
            for assertion in source_candidate.get("semantic_assertions", []) or []:
                copied = copy.deepcopy(assertion)
                copied["source_artifact"] = source_artifact
                sources["semantic_assertions"].append(copied)

            key = (source_capability, capability)
            previous = derivations.get(key)
            rows = contracts.get(key, [])
            if previous is None and not rows:
                continue
            if not rows:
                raise RuntimeError(
                    f"published derivation evidence has no current contract for {key}"
                )
            baseline_derivation = previous or {
                "links": [],
                "dispositions": [],
                "required_sources": [],
            }
            evidence = enrich_evidence(
                source_capability,
                capability,
                source_candidate,
                candidate,
                baseline_derivation,
            )
            incoming.append(
                select_derivation(
                    key,
                    rows,
                    baseline_derivation,
                    graph=graph,
                    source=source_candidate,
                    candidate=candidate,
                    evidence=evidence,
                )
            )

        old_provider = lifecycle_rows.get(capability)
        if old_provider is None:
            artifact_id = artifact_for_capability(CORE, capability)
            acceptance_id = f"PREP-{artifact_id}-STRICT-1"
            request_mode = "CREATE"
        else:
            acceptance_id = next_acceptance_id(old_provider["acceptance_id"])
            request_mode = "REVISION"
        kwargs = dict(
            graph=graph,
            model=CORE,
            skill_registry=registry,
            knowledge_contracts=knowledge_contracts,
            decision_contracts=decision_contracts,
            decision_policy=decision_policy,
            derivation_evaluations=incoming,
            capability=capability,
            sources=sources,
            candidate=candidate,
            acceptance_id=acceptance_id,
            lifecycle=lifecycle,
            decision_request_mode=request_mode,
        )
        admitted, bound = admit_with_exploration(
            capability=capability,
            kwargs=kwargs,
            templates=explorations,
        )

        upsert_artifact_evaluation(semantic_set, admitted)
        for edge in incoming:
            upsert_derivation_evaluation(semantic_set, edge)
            derivations[(edge["source_capability"], edge["target_capability"])] = edge
        upsert_provider(lifecycle, admitted["lifecycle_assertion"])
        lifecycle_rows[capability] = admitted["lifecycle_assertion"]
        all_current_caps.add(capability)

        if bound is not None:
            template_path, exploration = bound
            rebound[template_path] = exploration

        report.append(
            {
                "capability": capability,
                "candidate": str(candidate_path.relative_to(ROOT)),
                "status": "ACCEPTED",
                "acceptance_id": acceptance_id,
                "derivations": len(incoming),
                "decision_exploration": admitted.get("admission", {}).get(
                    "decision_exploration"
                ),
                "decision_governance": admitted.get("admission", {}).get(
                    "decision_governance"
                ),
            }
        )

    next_publication = build_project_publication(
        graph=graph,
        core_model=CORE,
        semantic_evaluations=semantic_set,
        lifecycle=lifecycle,
        decision_failures=failures,
        parent_revision=publication["revision"],
    )

    policy_fingerprints = derive_acceptance_policy_fingerprints(
        graph=graph,
        knowledge_contracts=knowledge_contracts,
        decision_contracts=decision_contracts,
        decision_policy=decision_policy,
    )
    states = lifecycle_states(
        graph,
        CORE,
        lifecycle,
        current_acceptance_policy_fingerprints=policy_fingerprints,
    )
    noncurrent = {
        capability: state
        for capability, state in states.items()
        if capability in all_current_caps and state.get("state") != "CURRENT"
    }
    if noncurrent:
        raise RuntimeError(
            "revalidated lifecycle still non-current:\n"
            + yaml.safe_dump(noncurrent, sort_keys=False, allow_unicode=True)
        )

    closure_results = {}
    for target in ("FRONTEND-PROTOTYPE", "FRONTEND-IMPLEMENTATION"):
        closure = evaluate_semantic_closure(
            graph=graph,
            model=CORE,
            target=target,
            skill_registry=registry,
            semantic_evaluations=semantic_set,
            lifecycle=lifecycle,
            knowledge_contracts=knowledge_contracts,
            decision_contracts=decision_contracts,
            decision_policy=decision_policy,
        )
        closure_results[target] = {
            "status": closure.get("status"),
            "semantic_gaps": closure.get("semantic_gaps"),
            "currentness_gaps": closure.get("currentness_gaps"),
            "revalidate": closure.get("revalidate"),
        }
        if closure.get("status") != "COMPLETE":
            raise RuntimeError(
                f"{target} closure is {closure.get('status')}: "
                + yaml.safe_dump(closure_results[target], sort_keys=False, allow_unicode=True)
            )

    out = ROOT / ".harness/project-publication.frontend-next.yaml"
    out.write_text(
        yaml.safe_dump(next_publication, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    for path, exploration in rebound.items():
        path.write_text(
            yaml.safe_dump(exploration, sort_keys=False, allow_unicode=True),
            encoding="utf-8",
        )
    if os.environ.get("PUBLISH") == "1":
        publish_project_publication(
            ROOT / ".harness/project-publication.yaml",
            graph=graph,
            publication=next_publication,
            expected_revision=publication["revision"],
        )
    (ROOT / ".harness/frontend-tail-revalidation-report.yaml").write_text(
        yaml.safe_dump(
            {
                "version": 1,
                "kind": "prep-frontend-tail-revalidation-report",
                "parent_revision": publication["revision"],
                "next_revision": next_publication["revision"],
                "results": report,
                "closure": closure_results,
                "rebound_explorations": [
                    str(path.relative_to(ROOT)) for path in sorted(rebound)
                ],
            },
            sort_keys=False,
            allow_unicode=True,
        ),
        encoding="utf-8",
    )
    print(
        yaml.safe_dump(
            {
                "parent_revision": publication["revision"],
                "next_revision": next_publication["revision"],
                "accepted": len(report),
                "rebound_explorations": len(rebound),
                "closure": closure_results,
            },
            sort_keys=False,
            allow_unicode=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
