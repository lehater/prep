#!/usr/bin/env python3
from __future__ import annotations
import copy, os, re, sys
from pathlib import Path
from typing import Any
import yaml

ROOT=Path(__file__).resolve().parents[1]
HARNESS_ROOT=Path(os.environ["HARNESS_ROOT"]).resolve()
sys.path.insert(0,str(HARNESS_ROOT/"src"))

from harness.application.project_publication import read_project_publication
from harness.application.semantic_admission import admit_artifact
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index

STOP_BEFORE={"prep.interface-topology"}
OVERRIDES={
 "prep.product-intent":".harness/candidates/product-intent-capability-repair-admission.yaml",
 "prep.product-capabilities":".harness/candidates/product-capabilities-capability-repair-admission.yaml",
 "prep.domain-strategy":".harness/candidates/domain-strategy-capability-repair-admission.yaml",
 "prep.model-context-strategy":".harness/candidates/model-context-capability-repair-admission.yaml",
 "prep.application-design":".harness/candidates/process-migration-application-design-admission.yaml",
 "prep.application-process.activity-evidence-cycle":".harness/candidates/process-migration-activity-evidence-admission.yaml",
 "prep.application-process.prepare-support":".harness/candidates/process-migration-prepare-support-admission.yaml",
 "prep.user-journeys":".harness/candidates/process-migration-user-journeys-admission.yaml",
 "prep.machine-interfaces":".harness/candidates/frontend-boundary-machine-admission.yaml",
 "prep.interaction-design":".harness/candidates/frontend-boundary-interaction-admission.yaml",
}

def load(p:Path)->dict[str,Any]:
    v=yaml.safe_load(p.read_text())
    if not isinstance(v,dict): raise SystemExit(f"{p} not mapping")
    return v

def topo(graph):
    prod=production_index(graph); seen=set(); out=[]
    def visit(c):
        if c in seen:return
        for r in prod[c].get("requires",[]) or []: visit(r["capability"])
        seen.add(c); out.append(c)
    visit("prep.frontend-implementation-design")
    return out

def cand_index():
    d={}
    for p in (ROOT/".harness/candidates").glob("*-admission.yaml"):
        try:v=load(p)
        except:continue
        if v.get("kind")=="harness-artifact-admission-candidate" and isinstance(v.get("capability"),str):
            d.setdefault(v["capability"],[]).append((p,v))
    return d

def deriv_index(s):
    return {(x["source_capability"],x["target_capability"]):x for x in s.get("derivation_evaluations",[]) or []}

def current_surface(cap,derivs):
    for (src,_),item in derivs.items():
        if src!=cap: continue
        sf=(item.get("lifecycle_dependency") or {}).get("source_surface_fingerprints")
        if sf:return sf
    return None

def choose(cap,cands,derivs):
    if cap in OVERRIDES:return load(ROOT/OVERRIDES[cap])
    rows=cands.get(cap,[])
    if len(rows)==1:return copy.deepcopy(rows[0][1])
    expected=current_surface(cap,derivs)
    if expected:
        m=[v for _,v in rows if semantic_assertion_fingerprints(v)==expected]
        if len(m)==1:return copy.deepcopy(m[0])
    raise RuntimeError(f"candidate select {cap}: {[str(p) for p,_ in rows]}")

def contracts():
    d={}
    for p in (ROOT/".harness/candidates").glob("*-contract.yaml"):
        try:v=load(p)
        except:continue
        if v.get("kind")=="harness-semantic-derivation-contract":
            d.setdefault((v.get("source_capability"),v.get("target_capability")),[]).append((p,v))
    return d

def artifact(core,cap):
    m=[x["id"] for x in core["artifacts"] if cap in (x.get("provides") or [])]
    if len(m)!=1:raise RuntimeError((cap,m))
    return m[0]

def next_id(old):
    m=re.match(r"^(.*-STRICT-)(\d+)$",old)
    return f"{m.group(1)}{int(m.group(2))+1}" if m else old+"-POLICY-REVALIDATION-1"

def replace_eval(bundle,e):
    k=(e["artifact"],e["capability"])
    for i,x in enumerate(bundle["semantic_evaluations"]):
        if (x.get("artifact"),x.get("capability"))==k:
            bundle["semantic_evaluations"][i]=e;return
    raise RuntimeError(("missing eval",k))

def replace_deriv(bundle,e):
    k=(e["source_capability"],e["target_capability"])
    for i,x in enumerate(bundle["derivation_evaluations"]):
        if (x.get("source_capability"),x.get("target_capability"))==k:
            bundle["derivation_evaluations"][i]=e;return
    raise RuntimeError(("missing deriv",k))

def replace_life(life,row):
    for i,x in enumerate(life["providers"]):
        if x.get("capability")==row["capability"]:
            life["providers"][i]=row;return
    raise RuntimeError(("missing life",row["capability"]))

def select_contract(key,rows,previous,graph,source,candidate,evidence):
    acc=[]
    for p,c in rows:
        e=evaluate_derivation(graph=graph,contract=c,source=source,candidate=candidate,evidence=evidence)
        if e.get("status")=="ACCEPTED":acc.append((p,e))
    prev=set(previous.get("required_sources",[]) or [])
    comp=[(p,e) for p,e in acc if set(e.get("required_sources",[]) or [])==prev]
    if len(comp)==1:return comp[0][1]
    if len(acc)==1:return acc[0][1]
    raise RuntimeError(f"derivation contract {key}: {[str(p) for p,_ in acc]}")

def main():
    graph=load(ROOT/".harness/engineering-graph.yaml")
    pub=read_project_publication(ROOT/".harness/project-publication.yaml",graph=graph)
    core=copy.deepcopy(pub["state"]["core_model"])
    sem=copy.deepcopy(pub["state"]["semantic_evaluations"])
    life=copy.deepcopy(pub["state"]["lifecycle"])
    derivs=deriv_index(sem); lifeidx={x["capability"]:x for x in life["providers"]}
    cands=cand_index(); cons=contracts(); prod=production_index(graph)
    registry=load(HARNESS_ROOT/"skills/artifact-skill-registry-v0.yaml")
    kcontracts=load(HARNESS_ROOT/"spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    dcontracts=load(HARNESS_ROOT/"spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml")
    policy=load(ROOT/".harness/candidates/application-design-decision-policy.yaml")
    report=[]
    for cap in topo(graph):
        if cap in STOP_BEFORE: break
        try:
            candidate=choose(cap,cands,derivs)
            incoming=[]; sources={"semantic_assertions":[]}
            for req in prod[cap].get("requires",[]) or []:
                sc=req["capability"]; source=choose(sc,cands,derivs)
                sa=artifact(core,sc)
                for a in source.get("semantic_assertions",[]) or []:
                    z=copy.deepcopy(a);z["source_artifact"]=sa;sources["semantic_assertions"].append(z)
                key=(sc,cap); prev=derivs.get(key); rows=cons.get(key,[])
                if prev is None or not rows: raise RuntimeError(f"missing derivation input {key}")
                evidence={"version":1,"kind":"harness-semantic-derivation-evidence","source_capability":sc,"target_capability":cap,
                          "links":copy.deepcopy(prev.get("links",[])),"dispositions":copy.deepcopy(prev.get("dispositions",[]))}
                incoming.append(select_contract(key,rows,prev,graph,source,candidate,evidence))
            admitted=admit_artifact(graph=graph,model=core,skill_registry=registry,knowledge_contracts=kcontracts,
                decision_contracts=dcontracts,decision_policy=policy,derivation_evaluations=incoming,
                capability=cap,sources=sources,candidate=candidate,acceptance_id=next_id(lifeidx[cap]["acceptance_id"]),
                lifecycle=life,decision_request_mode="REVISION")
            if admitted.get("status")!="ACCEPTED":
                report.append({"capability":cap,"status":"BLOCKED","findings":admitted.get("findings"),
                               "decision_exploration":admitted.get("admission",{}).get("decision_exploration"),
                               "decision_governance":admitted.get("admission",{}).get("decision_governance")})
                break
            replace_eval(sem,admitted)
            for e in incoming: replace_deriv(sem,e);derivs[(e["source_capability"],e["target_capability"])]=e
            replace_life(life,admitted["lifecycle_assertion"]);lifeidx[cap]=admitted["lifecycle_assertion"]
            report.append({"capability":cap,"status":"ACCEPTED","acceptance_id":admitted["admission"]["acceptance_id"]})
        except Exception as e:
            report.append({"capability":cap,"status":"ERROR","error":str(e)})
            break
    print(yaml.safe_dump(report,sort_keys=False,allow_unicode=True))
    return 0
if __name__=="__main__":raise SystemExit(main())
