#!/usr/bin/env python3
from __future__ import annotations
import copy, json, sys
from pathlib import Path
from typing import Any
import yaml

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/"experiments/reference_model_rematerialization"
EXP=ROOT/"experiments/project_refinement_contract_v0"
HARNESS=ROOT/".harness-reference"

def load(p:Path)->dict[str,Any]:
    v=yaml.safe_load(p.read_text(encoding="utf-8"))
    if not isinstance(v,dict): raise SystemExit(f"{p} must contain mapping")
    return v

def dump(p:Path,v:Any):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(yaml.safe_dump(v,sort_keys=False,allow_unicode=True),encoding="utf-8")

def main():
    sys.path.insert(0,str(HARNESS))
    sys.path.insert(0,str(EXP))
    from engineering_coverage import evaluate_with_repository_policy
    from reference_materializer import materialize
    from engineering_graph import validate_engineering_graph
    from apply_refinement import apply_contract

    graph=load(EXP/"generated/engineering-graph.yaml")
    core=load(EXP/"generated/core.yaml")
    overlay=load(EXP/"generated/engineering-coverage.yaml")
    contract=load(EXP/"project-refinement.yaml")

    coverage=evaluate_with_repository_policy(graph=graph,realization=core,
        consumer="FRONTEND-IMPLEMENTATION",scope="frontend",project_overlay=overlay)
    raw=sorted({r["concern"] for r in coverage.get("rows",[]) or []
                if isinstance(r,dict) and isinstance(r.get("concern"),str)})
    excluded={r["concern"]:r for r in contract.get("concern_refinements",{}).get("not_applicable",[]) or []}
    active=[c for c in raw if c not in excluded]
    for rule in excluded.values():
        if not rule.get("evidence") or not rule.get("reopen_when"):
            raise SystemExit(f"invalid concern refinement: {rule}")

    facts=copy.deepcopy(load(BASE/"project-facts.yaml"))
    facts["activated_concerns"]=active
    result=materialize(
        load(HARNESS/"spec/research/reference-engineering-model-v0.yaml"),
        load(HARNESS/"catalogs/software-authorities-v0.yaml"),
        load(HARNESS/"spec/engineering-coverage/semantic-proof-contract-v1.yaml"),
        facts,load(BASE/"materialization-request.yaml"))

    refined_semantic=None
    if "graph" in result:
        refined_semantic,_=apply_contract(result["graph"],contract)
        validate_engineering_graph(refined_semantic)
        dump(EXP/"analysis/semantic-pass-refined-graph.yaml",refined_semantic)

    out={"version":1,"kind":"prep-project-refinement-semantic-pass",
      "coverage_completion_ready":coverage.get("completion_ready"),
      "coverage_remaining_work_count":coverage.get("remaining_work_count"),
      "raw_concern_count":len(raw),"excluded_concern_count":len(set(raw)&set(excluded)),
      "excluded_concerns":sorted(set(raw)&set(excluded)),
      "activated_concern_count":len(active),
      "materialization_status":result.get("status"),
      "diagnostics":result.get("diagnostics",[])}
    if refined_semantic is not None:
        out["refined_semantic_capability_count"]=sum(len(a.get("produces",[]) or []) for a in refined_semantic.get("authorities",[]) or [])
    (EXP/"analysis").mkdir(parents=True,exist_ok=True)
    (EXP/"analysis/semantic-pass-materialization-result.json").write_text(json.dumps(result,indent=2,sort_keys=True),encoding="utf-8")
    dump(EXP/"analysis/semantic-pass-summary.yaml",out)
    dump(EXP/"analysis/activated-concerns.yaml",{"version":1,"raw":raw,"excluded":out["excluded_concerns"],"active":active})
    print(yaml.safe_dump(out,sort_keys=False))
    return 0

if __name__=="__main__": raise SystemExit(main())
