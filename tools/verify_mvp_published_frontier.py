#!/usr/bin/env python3
"""Guard the original MVP semantic frontier without blocking future accepted capabilities.

The five applicable frontier capabilities must remain policy-bound CURRENT. The project may
accept additional downstream capabilities without modifying this verifier.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))
if not HARNESS_ROOT.is_absolute():
    HARNESS_ROOT = (ROOT / HARNESS_ROOT).resolve()
sys.path.insert(0, str(HARNESS_ROOT / "src"))

from harness.application.project_publication import read_project_publication
from harness.application.semantic_admission import derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.core import capability_blockers
from harness.project_model.engineering_graph import validate_realization

FRONTIER = {
    "prep.problem-evidence": ("PROBLEM-EVIDENCE", "docs/discovery/problem-evidence.yaml"),
    "prep.user-needs": ("USER-NEEDS", "docs/discovery/user-needs.yaml"),
    "prep.product-intent": ("PRODUCT-VISION", ".harness/knowledge/product-intent.yaml"),
    "prep.product-capabilities": ("PRODUCT-CAPABILITIES", ".harness/knowledge/product-capabilities.yaml"),
    "prep.domain-strategy": ("CONTEXT-MAP", "docs/architecture/context-map.md"),
}


def yaml_file(path: Path) -> dict:
    document = yaml.safe_load(path.read_text(encoding="utf-8"))
    assert isinstance(document, dict), path
    return document


def main() -> None:
    graph = yaml_file(ROOT / ".harness/engineering-graph.yaml")
    core = yaml_file(ROOT / ".harness/core.yaml")
    validate_realization(graph, core)
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    state = publication["state"]
    assert state["core_model"] == core, "Working Core differs from published Core"

    evaluations = state["semantic_evaluations"]["semantic_evaluations"]
    providers = state["lifecycle"]["providers"]
    by_evaluation = {entry["capability"]: entry for entry in evaluations}
    by_provider = {entry["capability"]: entry for entry in providers}
    assert len(by_evaluation) == len(evaluations), "Duplicate semantic evaluations"
    assert len(by_provider) == len(providers), "Duplicate lifecycle providers"
    assert set(by_evaluation) == set(by_provider), "Evaluation/provider mismatch"

    policies = derive_acceptance_policy_fingerprints(
        graph=graph,
        knowledge_contracts=yaml_file(
            HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
        ),
    )
    states = lifecycle_states(
        graph, core, state["lifecycle"],
        current_acceptance_policy_fingerprints=policies,
    )
    assert "prep.model-context-strategy" not in states
    assert "prep.model-context-strategy" not in by_provider
    assert "prep.model-context-strategy" not in by_evaluation
    core_artifacts = {artifact["id"]: artifact for artifact in core["artifacts"]}
    for capability, (artifact_id, path) in FRONTIER.items():
        assert capability in states, f"Capability not realized: {capability}"
        assert states[capability]["state"] == "CURRENT", (
            f"Frontier capability is no longer CURRENT: {capability}: {states[capability]}"
        )
        assert capability_blockers(core, capability) == [], (
            f"Unresolved Question blocks {capability}"
        )
        assert artifact_id in core_artifacts
        artifact = core_artifacts[artifact_id]
        assert artifact["path"] == path and capability in artifact["provides"]
        assert (ROOT / path).is_file(), path

        evaluation = by_evaluation[capability]
        provider = by_provider[capability]
        acceptance_id = evaluation["admission"]["acceptance_id"]
        assert evaluation["artifact"] == provider["artifact"] == artifact_id
        assert evaluation["status"] == evaluation["admission"]["status"] == "ACCEPTED"
        assert provider["acceptance_id"] == acceptance_id
        assert provider["acceptance_policy_fingerprint"] == policies[capability]
        assert evaluation["admission"]["acceptance_policy_fingerprint"] == policies[capability]
        assert evaluation["lifecycle_assertion"] == provider

        suffix = capability.removeprefix("prep.")
        candidate = yaml_file(ROOT / f".harness/candidates/mvp-{suffix}-admission.yaml")
        assert candidate["capability"] == capability
        assert candidate["id"] == artifact_id
        assert candidate["path"] == path
        assert semantic_assertion_fingerprints(candidate) == provider["semantic_atom_fingerprints"], (
            f"Semantic assertion fingerprint mismatch for {capability}"
        )

    print(
        f"PASS: {len(FRONTIER)} pinned MVP frontier capabilities remain CURRENT "
        f"with valid policy, evaluation, provider, Core, and assertion fingerprints "
        f"({len(by_provider)} total accepted providers; future downstream additions allowed)"
    )


if __name__ == "__main__":
    main()
