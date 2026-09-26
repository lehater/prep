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

if not (HARNESS_ROOT / "decision_pipeline.py").exists():
    raise SystemExit(
        "Pinned Harness runtime does not contain sequential Decision Pipeline support."
    )

sys.path.insert(0, str(HARNESS_ROOT))

from decision_exploration import evaluate_decision_exploration  # noqa: E402
from decision_governance import (  # noqa: E402
    axis_policies,
    decision_contract_index,
    evaluate_decision_governance,
)
from decision_pipeline import derive_decision_roadmap  # noqa: E402
from engineering_graph import producer_index  # noqa: E402

from semantic_baseline import build_strict_semantic_baseline  # noqa: E402


CAPABILITY = "prep.application-design"
TARGET = "FRONTEND-IMPLEMENTATION"
SPACE_PATH = ".harness/candidates/application-design-decision-space-redo.yaml"


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def provider_for(core: dict[str, Any], capability: str) -> dict[str, Any]:
    matches = [
        artifact
        for artifact in core.get("artifacts", []) or []
        if capability in (artifact.get("provides", []) or [])
    ]
    if len(matches) != 1:
        raise SystemExit(f"expected exactly one provider for {capability}")
    return matches[0]


def decision_review(authority: str) -> dict[str, Any]:
    def determined(
        decision_id: str,
        selected: str,
        rejected: str,
        rationale: str,
    ) -> dict[str, Any]:
        return {
            "id": decision_id,
            "owner_authority": authority,
            "alternatives": [
                {"id": selected, "state": "VIABLE"},
                {"id": rejected, "state": "REJECTED", "rationale": rationale},
            ],
            "disposition": "DETERMINED",
            "selected": selected,
        }

    def escalated(
        decision_id: str,
        first: str,
        second: str,
        question: str,
    ) -> dict[str, Any]:
        return {
            "id": decision_id,
            "owner_authority": authority,
            "alternatives": [
                {"id": first, "state": "VIABLE"},
                {"id": second, "state": "VIABLE"},
            ],
            "disposition": "ESCALATED",
            "question": question,
        }

    return {
        "axes": [
            {
                "axis": "operation-boundaries",
                "decisions": [
                    determined(
                        "modeled-data-mutation-boundary",
                        "semantic-owner-operations",
                        "workflow-bundled-operations",
                        "Accepted Application Design already separates canonical maintenance operations by semantic responsibility and prevents interfaces from bypassing application use cases.",
                    )
                ],
            },
            {
                "axis": "orchestration",
                "decisions": [
                    determined(
                        "external-study-orchestration-owner",
                        "prep-owned-study-orchestration",
                        "external-runtime-led-orchestration",
                        "Accepted Application Design explicitly owns external-study orchestration intent while transport/protocol remain downstream.",
                    )
                ],
            },
            {
                "axis": "failure-semantics",
                "decisions": [
                    escalated(
                        "canonical-validation-failure-policy",
                        "reject-invalid-canonical-change",
                        "best-effort-canonical-acceptance",
                        "Q-APP-CANONICAL-FAILURE",
                    ),
                    escalated(
                        "external-runtime-failure-recovery-policy",
                        "surface-external-failure",
                        "retry-external-failure",
                        "Q-APP-EXTERNAL-RECOVERY",
                    ),
                ],
            },
            {
                "axis": "partial-results",
                "decisions": [
                    determined(
                        "study-set-preparation-partiality",
                        "resolvable-study-subset",
                        "complete-study-coverage-gate",
                        "Accepted Application Design explicitly builds the currently resolvable subset and rejects completeness as a learner-facing preparation gate.",
                    ),
                    escalated(
                        "bulk-canonical-load-partiality",
                        "atomic-bulk-load",
                        "partial-bulk-acceptance",
                        "Q-APP-BULK-PARTIALITY",
                    ),
                ],
            },
            {
                "axis": "continuation-currentness",
                "decisions": [
                    determined(
                        "browser-query-currentness",
                        "live-browser-query",
                        "snapshot-browser-query",
                        "Accepted browser-facing queries expose current canonical state.",
                    ),
                    determined(
                        "study-set-preview-export-currentness",
                        "drift-detect-before-export",
                        "silent-live-recompute",
                        "Accepted Application Design requires detection when target/question resolution changes after preview rather than silently exporting different material.",
                    ),
                ],
            },
        ]
    }


def main() -> int:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    policy = load(ROOT / ".harness/decision-policy.yaml")
    contracts_document = load(
        HARNESS_ROOT
        / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml"
    )
    space_template = load(ROOT / SPACE_PATH)
    _, lifecycle = build_strict_semantic_baseline(graph, core)

    # Normal repeat over the fully CURRENT target is a no-op.
    ordinary = derive_decision_roadmap(
        graph=graph,
        model=core,
        target=TARGET,
        lifecycle=lifecycle,
        decision_contracts=contracts_document,
        decision_policy=policy,
    )
    if ordinary["ready"]:
        raise SystemExit(
            f"ordinary CURRENT pipeline must be idempotent: {ordinary['ready']}"
        )

    # Explicit redo reopens one Capability and includes its CURRENT provider as
    # accepted baseline knowledge during option formation.
    roadmap = derive_decision_roadmap(
        graph=graph,
        model=core,
        target=TARGET,
        lifecycle=lifecycle,
        decision_contracts=contracts_document,
        decision_policy=policy,
        redo_capabilities=[CAPABILITY],
    )
    units = [item for item in roadmap["ready"] if item["capability"] == CAPABILITY]
    if len(units) != 1:
        raise SystemExit(f"expected one Application Design REDO unit: {roadmap}")
    unit = units[0]
    if unit["decision_request_mode"] != "REDO":
        raise SystemExit(f"unexpected pipeline mode: {unit['decision_request_mode']}")

    provider = provider_for(core, CAPABILITY)
    baseline_items = [
        item
        for item in unit["read_set"]
        if item["path"] == provider["path"]
    ]
    if len(baseline_items) != 1:
        raise SystemExit("REDO option formation did not receive current provider")
    if baseline_items[0].get("purpose") != "CURRENT_ACCEPTED_BASELINE":
        raise SystemExit("current provider is not marked as accepted baseline")
    if "future_candidate" not in unit["decision_request"]["forbidden_inputs"]:
        raise SystemExit("future candidate is not forbidden pre-choice")

    contract = decision_contract_index(contracts_document)["application-design"]
    policies = axis_policies(contract, policy)
    exploration = copy.deepcopy(space_template)
    exploration["explorer_request_id"] = unit["decision_request"]["request_id"]
    evaluation = evaluate_decision_exploration(
        contract=contract,
        axis_policies=policies,
        capability=CAPABILITY,
        knowledge_kind="application-design",
        evidence=exploration,
        explorer_request=unit["decision_request"],
        model=core,
    )
    if evaluation["status"] != "ACCEPTED":
        raise SystemExit(
            f"reviewed decision space was rejected: {evaluation['findings']}"
        )
    if evaluation.get("decision_space_review") != "ACCEPTED":
        raise SystemExit("decision-space review gate did not accept")

    # Choice does not trigger another exploration cycle. Remaining semantic
    # choices are normal Core Questions addressed to the owning Authority.
    authority = producer_index(graph)[CAPABILITY]
    questions = [
        {
            "id": "Q-APP-CANONICAL-FAILURE",
            "authority": authority,
            "text": (
                "When a decoded canonical-data mutation contains invalid items, "
                "is the application operation atomic or may it accept valid items?"
            ),
            "blocks": [provider["id"]],
        },
        {
            "id": "Q-APP-EXTERNAL-RECOVERY",
            "authority": authority,
            "text": (
                "Should Prep automatically retry transient external-study "
                "export/import failures, or surface each failure to the caller?"
            ),
            "blocks": [provider["id"]],
        },
        {
            "id": "Q-APP-BULK-PARTIALITY",
            "authority": authority,
            "text": (
                "After bulk input is decoded, are canonical writes atomic for "
                "the load or may independently valid items be persisted?"
            ),
            "blocks": [provider["id"]],
        },
    ]
    question_model = copy.deepcopy(core)
    question_model["questions"] = [
        *(question_model.get("questions", []) or []),
        *questions,
    ]
    candidate = {
        "id": provider["id"],
        "capability": CAPABILITY,
        "path": provider["path"],
        "decision_review": decision_review(authority),
    }
    governance = evaluate_decision_governance(
        contract=contract,
        policy=policy,
        exploration_evaluation=evaluation,
        authority=authority,
        capability=CAPABILITY,
        candidate=candidate,
        model=question_model,
    )
    if governance["status"] != "ACCEPTED":
        raise SystemExit(
            f"choice/escalation review was rejected: {governance['findings']}"
        )

    expected_questions = sorted(item["id"] for item in questions)

    blocked_roadmap = derive_decision_roadmap(
        graph=graph,
        model=question_model,
        target=TARGET,
        lifecycle=lifecycle,
        decision_contracts=contracts_document,
        decision_policy=policy,
        redo_capabilities=[CAPABILITY],
    )
    blocked_unit = next(
        item
        for item in blocked_roadmap["blocked"]
        if item["capability"] == CAPABILITY
    )
    if blocked_unit["questions"] != expected_questions:
        raise SystemExit(
            f"roadmap did not route normal Core Questions: {blocked_unit}"
        )

    print(
        "SEQUENTIAL DECISION PIPELINE PASS: "
        f"capability={CAPABILITY} "
        "ordinary_frontier=EMPTY "
        "redo_current_baseline=True "
        "decision_space_review=ACCEPTED "
        "choice_outcome=BLOCKED "
        f"questions={','.join(expected_questions)} "
        "reexploration_protocol=False"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
