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
OLD=BASE/"baseline/old-harness"

def load(p:Path)->dict[str,Any]:
    v=yaml.safe_load(p.read_text(encoding="utf-8"))
    if not isinstance(v,dict): raise SystemExit(f"{p} must be mapping")
    return v

def dump(p:Path,v:Any):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(yaml.safe_dump(v,sort_keys=False,allow_unicode=True),encoding="utf-8")

def providers(core):
    return {c:a for a in core.get("artifacts",[]) or [] for c in a.get("provides",[]) or []}

def projection(graph,core):
    pi=providers(core); rows=[]
    for a in graph.get("authorities",[]) or []:
        for p in a.get("produces",[]) or []:
            c=p["capability"]
            if c not in pi: continue
            req=[r["capability"] if isinstance(r,dict) else r for r in p.get("requires",[]) or []]
            rows.append({"artifact":pi[c]["id"],"capability":c,"acceptance_id":f"acceptance-v1::{c}",
                         "accepted_prerequisites":{r:f"acceptance-v1::{r}" for r in sorted(req)},
                         "semantic_atom_fingerprints":{},"accepted_prerequisite_semantics":{}})
    return {"version":1,"kind":"harness-capability-lifecycle","providers":rows}

def synthetic_complete(graph,core):
    out=copy.deepcopy(core); pi=providers(out); owner={}
    for a in graph.get("authorities",[]) or []:
        for p in a.get("produces",[]) or []: owner[p["capability"]]=a["id"]
    missing=sorted(set(owner)-set(pi))
    for i,c in enumerate(missing,1):
        out.setdefault("artifacts",[]).append({"id":f"SYNTH-{i}","authority":owner[c],
          "path":f"synthetic/{i}.yaml","provides":[c],"depends_on":[]})
    return out

def stale(lifecycle_states,graph,core,seeds):
    base=projection(graph,core); mutated=copy.deepcopy(base); ss=set(seeds)
    for r in mutated["providers"]:
        if r["capability"] in ss: r["acceptance_id"]=f"acceptance-v2::{r['capability']}"
    states=lifecycle_states(graph,core,mutated)
    caps=sorted(c for c,r in states.items() if r["state"]=="STALE")
    pi=providers(core)
    paths=sorted({pi[c]["path"] for c in caps if c in pi})
    return {"capability_count":len(caps),"provider_path_count":len(paths),"capabilities":caps,"provider_paths":paths}

def ctx_digest(ctx):
    return {"status":ctx["status"],"requirement_count":len(ctx["requirements"]),
      "input_artifact_count":len(ctx["input_artifacts"]),
      "supporting_input_artifact_count":len(ctx["supporting_input_artifacts"]),
      "allowed_read_path_count":len(ctx["access"]["read"]),
      "allowed_read_paths":ctx["access"]["read"],
      "blocker_count":len(ctx["blockers"])}

def main():
    sys.path.insert(0,str(HARNESS))
    from capability_lifecycle import lifecycle_states
    from authority_context import build_authority_context
    from engineering_graph import evaluate_engineering_target

    og=load(OLD/"engineering-graph.yaml"); oc=load(OLD/"core.yaml")
    ng=load(BASE/"generated/engineering-graph.yaml"); nc=synthetic_complete(ng,load(BASE/"new-harness/core.yaml"))
    rg=load(EXP/"generated/engineering-graph.yaml"); rc=load(EXP/"generated/core.yaml")

    cases={
      "knowledge_domain":{"old":["prep.knowledge-model"],"new":["prep-reference-v0.domain-model.knowledge-model"]},
      "machine_interface":{"old":["prep.machine-interfaces"],"new":["prep-reference-v0.machine-interface-contract.prep-application-api","prep-reference-v0.machine-interface-contract.external-learning-runtime"]},
      "product_intent":{"old":["prep.product-intent","prep.product-capabilities"],"new":["prep-reference-v0.product-intent","prep-reference-v0.product-acceptance"]},
    }
    muts={}
    for name,pair in cases.items():
        muts[name]={"old":stale(lifecycle_states,og,oc,pair["old"]),
                    "new":stale(lifecycle_states,ng,nc,pair["new"]),
                    "refined":stale(lifecycle_states,rg,rc,pair["new"])}

    oldctx=build_authority_context(og,oc,"IMPLEMENTATION-DESIGN",["prep.frontend-implementation-design"])
    newctx=build_authority_context(ng,nc,"IMPLEMENTATION-DESIGN",["prep-reference-v0.implementation-plan"])
    refctx=build_authority_context(rg,rc,"IMPLEMENTATION-DESIGN",["prep-reference-v0.implementation-plan"])
    target=evaluate_engineering_target(rg,"FRONTEND-IMPLEMENTATION",rc)

    out={"version":1,"kind":"prep-project-refinement-behavioral-comparison",
      "mutations":muts,
      "implementation_context":{"old":ctx_digest(oldctx),"new":ctx_digest(newctx),"refined":ctx_digest(refctx)},
      "refined_target":{"status":target["status"],"create":[x["capability"] for x in target.get("create",[])],
        "wait":[x["capability"] for x in target.get("wait",[])],"pending":[x["capability"] for x in target.get("pending",[])]}}
    dump(EXP/"analysis/behavioral-comparison.yaml",out)
    print(json.dumps({
      "mutations":{k:{m:{"caps":v[m]["capability_count"],"paths":v[m]["provider_path_count"]} for m in ("old","new","refined")} for k,v in muts.items()},
      "context":{k:v["allowed_read_path_count"] for k,v in out["implementation_context"].items()},
      "target":out["refined_target"]},indent=2,sort_keys=True))
    return 0
if __name__=="__main__": raise SystemExit(main())
