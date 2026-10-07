#!/usr/bin/env python3
from __future__ import annotations
import copy, json, os, sys
from pathlib import Path
from typing import Any
import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))
if not HARNESS_ROOT.is_absolute():
    HARNESS_ROOT = (ROOT / HARNESS_ROOT).resolve()
sys.path.insert(0, str(HARNESS_ROOT / "src"))

from harness.application.authority_context import build_authority_context
from harness.application.decision_explorer_request import build_decision_explorer_request
from harness.application.project_publication import build_project_publication, read_project_publication
from harness.application.semantic_admission import admit_artifact, derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.decision.decision_governance import axis_policies, decision_contract_index
from harness.project_model.engineering_graph import production_index

CAP = "prep.interface-topology"
ACC = "PREP-INTERFACE-TOPOLOGY-STRICT-8"
ADM = ".harness/candidates/frontend-boundary-topology-admission.yaml"
EXP = ".harness/candidates/frontend-boundary-topology-exploration.yaml"
REQ = ".harness/candidates/frontend-boundary-topology-request.json"
DOC = "docs/interface/interface-topology.yaml"
MIRROR = ".harness/candidates/frontend-boundary-topology.yaml"
IA_EVID = ".harness/candidates/process-migration-topology-information-architecture-evidence.yaml"
IX_EVID = ".harness/candidates/process-migration-topology-interaction-evidence.yaml"
SOURCES = {
    "prep.information-architecture": (
        ".harness/candidates/information-architecture-admission.yaml",
        ".harness/candidates/fb-topology-ia-contract.yaml", IA_EVID),
    "prep.interaction-design": (
        ".harness/candidates/frontend-boundary-interaction-admission.yaml",
        ".harness/candidates/fb-topology-interaction-contract.yaml", IX_EVID),
}

def load(path: str | Path) -> dict[str, Any]:
    p = Path(path)
    if not p.is_absolute(): p = ROOT / p
    v = yaml.safe_load(p.read_text(encoding="utf-8"))
    if not isinstance(v, dict): raise SystemExit(f"{p} must contain a mapping")
    return v

def dump(path: str, value: dict[str, Any]) -> None:
    (ROOT / path).write_text(yaml.safe_dump(value, sort_keys=False, allow_unicode=True), encoding="utf-8")

def rows(lifecycle):
    return {x["capability"]: x for x in lifecycle.get("providers", []) or [] if isinstance(x, dict) and isinstance(x.get("capability"), str)}

def artifact_for(core, capability):
    found = [x["id"] for x in core.get("artifacts", []) or [] if capability in (x.get("provides", []) or [])]
    if len(found) != 1: raise SystemExit(f"{capability} provider ambiguity: {found}")
    return found[0]

def replace_eval(bundle, value, derivation=False):
    if derivation:
        key = (value["source_capability"], value["target_capability"])
        for i, x in enumerate(bundle["derivation_evaluations"]):
            if (x.get("source_capability"), x.get("target_capability")) == key:
                bundle["derivation_evaluations"][i] = value; return
    else:
        key = (value["artifact"], value["capability"])
        for i, x in enumerate(bundle["semantic_evaluations"]):
            if (x.get("artifact"), x.get("capability")) == key:
                bundle["semantic_evaluations"][i] = value; return
    raise SystemExit(f"evaluation not found: {key}")

def replace_provider(lifecycle, value):
    for i, x in enumerate(lifecycle["providers"]):
        if x.get("capability") == value["capability"]:
            lifecycle["providers"][i] = value; return
    raise SystemExit("provider not found")

def unresolved(e):
    req = set(e.get("required_sources", []) or [])
    cov = set(e.get("covered_sources", []) or [])
    disp = {x.get("source") for x in e.get("dispositions", []) or [] if isinstance(x, dict)}
    unc = set((e.get("lifecycle_dependency", {}) or {}).get("unaccounted_sources", []) or [])
    return sorted((req - cov - disp) | unc)

def effects(goal, info, state, recovery, mode, address):
    return {
        "goal-continuity": goal, "information-dependency": info,
        "working-state-continuity": state, "commit-recovery-boundary": recovery,
        "mode-authority-boundary": mode, "independent-addressability": address,
    }

def generate_inputs():
    topology = {
        "version": 1, "kind": "interface-topology-design", "id": "PREP-INTERFACE-TOPOLOGY",
        "views": [
            {"id":"FRAME-PREPARATION","structural":True,
             "responsibility":"Preserve candidate Target-direction work before commitment and active Target plus optional Next focus context after establishment across preparation work.",
             "ia_location_ref":"LOC-ACTIVE-PREPARATION","interaction_context_refs":[],"parent":"ROOT",
             "entries":["application-entry"],"exits":["VIEW-TARGETS","VIEW-CURRENT","VIEW-KNOWLEDGE","VIEW-ACTIVITY"]},
            {"id":"VIEW-TARGETS","structural":False,
             "responsibility":"Compare plausible Targets, choose a candidate to continue with, establish/refine the active Target, and understand its requirements as one continuous Target-work responsibility while preserving distinct comparison and active-Target roles.",
             "ia_location_ref":"LOC-TARGETS","ia_sublocation_refs":["LOC-TARGET-COMPARISON","LOC-TARGET"],
             "interaction_context_refs":["IX-TARGET-DIRECTION","IX-TARGET"],
             "interaction_role_refs":["IX-ROLE-TARGET-SELECTED-COMPARISON","IX-ROLE-TARGET-CANDIDATE-CONTINUE","IX-ROLE-TARGET-ACTIVE"],
             "parent":"FRAME-PREPARATION",
             "entries":["application-entry","VIEW-CURRENT","direct-link-with-candidate-targets","direct-link-with-target-context","missing-target-context"],
             "exits":["VIEW-CURRENT","VIEW-KNOWLEDGE","VIEW-PREPARE-SUPPORT"]},
            {"id":"VIEW-CURRENT","structural":False,
             "responsibility":"Understand current evidence-backed position, gaps/uncertainty and choose the Next focus.",
             "ia_location_ref":"LOC-CURRENT-POSITION","interaction_context_refs":["IX-DIRECTION"],"parent":"FRAME-PREPARATION",
             "entries":["VIEW-TARGETS","VIEW-EVIDENCE-CHANGE","direct-link-with-target-context"],
             "exits":["VIEW-TARGETS","VIEW-KNOWLEDGE","VIEW-ACTIVITY","VIEW-PREPARE-SUPPORT"]},
            {"id":"VIEW-KNOWLEDGE","structural":False,
             "responsibility":"Orient within Target/focus-relevant Subject Knowledge and semantic relationships, optionally bounded by a selected Required Capability.",
             "ia_location_ref":"LOC-KNOWLEDGE","interaction_context_refs":["IX-KNOWLEDGE"],"parent":"FRAME-PREPARATION",
             "entries":["VIEW-TARGETS","VIEW-CURRENT","VIEW-ACTIVITY","direct-link-with-target-context"],
             "exits":["VIEW-CURRENT","VIEW-ACTIVITY","VIEW-PREPARE-SUPPORT"]},
            {"id":"VIEW-ACTIVITY","structural":False,
             "responsibility":"Select suitable support and carry out one learning/practice/diagnostic activity attempt.",
             "ia_location_ref":"LOC-ACTIVITIES","interaction_context_refs":["IX-ACTIVITY"],"parent":"FRAME-PREPARATION",
             "entries":["VIEW-CURRENT","VIEW-KNOWLEDGE","direct-link-with-target-and-focus"],
             "exits":["VIEW-EVIDENCE-CHANGE","VIEW-KNOWLEDGE","VIEW-PREPARE-SUPPORT"]},
            {"id":"VIEW-EVIDENCE-CHANGE","structural":False,"contextual":"post-activity-review",
             "responsibility":"Review evaluated evidence/change for one completed or reviewable activity result and choose the next continuation.",
             "ia_location_ref":"LOC-EVIDENCE-CHANGES","interaction_context_refs":["IX-ACTIVITY"],"parent":"FRAME-PREPARATION",
             "entries":["VIEW-ACTIVITY","direct-link-with-reviewed-activity-context"],
             "exits":["VIEW-CURRENT","VIEW-ACTIVITY","VIEW-KNOWLEDGE"]},
            {"id":"VIEW-PREPARE-SUPPORT","structural":False,"contextual":"recovery",
             "responsibility":"Resolve a contextual missing-support need and return accepted support plus explicit remainder to the originating preparation work.",
             "ia_location_ref":"LOC-PREPARE-SUPPORT","interaction_context_refs":["IX-PREP-SUPPORT"],"parent":"FRAME-PREPARATION",
             "entries":["contextual-entry-from-target","contextual-entry-from-current","contextual-entry-from-knowledge","contextual-entry-from-activity"],
             "exits":["originating-view"]},
        ],
        "navigation_contracts":[
            {"id":"TOP-TARGET-ROLE-CONTINUITY","rule":"Inside VIEW-TARGETS, selected-for-comparison and candidate-to-continue do not activate a Target. Only accepted establishment/refinement moves candidate-to-continue into the active-Target role; reconsideration returns to comparison semantics without silently replacing the active Target."},
            {"id":"TOP-ACTIVE-TARGET","rule":"VIEW-TARGETS supports candidate comparison without an active Target and active-Target work after establishment. VIEW-CURRENT, VIEW-KNOWLEDGE, VIEW-ACTIVITY and VIEW-EVIDENCE-CHANGE require resolvable active Target context; a direct link without it enters VIEW-TARGETS in establishment/recovery context rather than inventing one."},
            {"id":"TOP-ACTIVE-FOCUS","rule":"VIEW-ACTIVITY requires an explicit Next focus; entry without one routes to VIEW-CURRENT. VIEW-KNOWLEDGE may exist without a focus. VIEW-EVIDENCE-CHANGE preserves originating focus when present."},
            {"id":"TOP-EVIDENCE-REVIEW","rule":"VIEW-EVIDENCE-CHANGE is contextual post-activity review, not a primary/global destination; direct entry requires resolvable reviewed activity/evidence context."},
            {"id":"TOP-PREP-RETURN","rule":"VIEW-PREPARE-SUPPORT is contextual recovery; it preserves an originating view/context and returns there after accepted support/remainder review."},
            {"id":"TOP-DIRECT-LINK","rule":"Direct links preserve referenced Target/focus/Knowledge identity where valid. Target-to-Knowledge entry may preserve selected Required Capability as local Knowledge scope; no link silently creates missing semantic context."},
        ],
        "coverage":{"user_tasks":{
            "TASK-U-COMPARE-TARGETS":"VIEW-TARGETS","TASK-U-ESTABLISH-TARGET":"VIEW-TARGETS",
            "TASK-U-UNDERSTAND-REQUIREMENTS":"VIEW-TARGETS","TASK-U-REVIEW-CURRENT-STATE":"VIEW-CURRENT",
            "TASK-U-REVIEW-GAPS":"VIEW-CURRENT","TASK-U-CHOOSE-NEXT-FOCUS":"VIEW-CURRENT",
            "TASK-U-EXPLORE-KNOWLEDGE":"VIEW-KNOWLEDGE","TASK-U-SELECT-SUPPORT":"VIEW-ACTIVITY",
            "TASK-U-PERFORM-ACTIVITY":"VIEW-ACTIVITY","TASK-U-REVIEW-CHANGE":"VIEW-EVIDENCE-CHANGE",
            "TASK-U-REQUEST-PREPARATION-SUPPORT":"VIEW-PREPARE-SUPPORT"}},
        "deliberately_unconstrained":["URL/path strings","sidebar/tab/menu mechanics","screen regions and layout",
            "component hierarchy","visual hierarchy and styling","graph/list/2D/3D presentation","responsive composition"],
        "unresolved_questions":[],
    }
    dump(DOC, topology); dump(MIRROR, topology)

    bounds = [
        ("BOUNDARY-TARGET-COMPARISON-ACTIVE-TARGET","target-comparison-active-target-boundary",
         ["LOC-TARGET-COMPARISON","LOC-TARGET","IX-TARGET-DIRECTION","IX-TARGET","VIEW-TARGETS"],"MERGED",
         [("TARGET-CONTINUITY","USER_FACING","Comparison, choose-to-continue, establishment/refinement and reconsideration form one reversible Target decision continuum with shared working context."),
          ("DISTINCT-IX-CONTEXTS","UPSTREAM_RESPONSIBILITY","IX-TARGET-DIRECTION and IX-TARGET remain behaviorally distinct; that distinction alone does not justify navigation.")]),
        ("BOUNDARY-TARGETS-CURRENT","target-current-boundary",["VIEW-TARGETS","VIEW-CURRENT"],"SEPARATE",
         [("TARGET-VS-POSITION-GOAL","USER_FACING","Target definition/requirements and evidence-backed current-position/focus choice are independently revisit-able goals with an intentional context switch.")]),
        ("BOUNDARY-TARGETS-KNOWLEDGE","target-knowledge-boundary",["VIEW-TARGETS","VIEW-KNOWLEDGE"],"SEPARATE",
         [("KNOWLEDGE-INDEPENDENT-ORIENTATION","USER_FACING","Knowledge orientation has independent findability/revisit value while Target-to-Knowledge entry preserves Required Capability scope as context.")]),
        ("BOUNDARY-CURRENT-KNOWLEDGE","current-knowledge-boundary",["VIEW-CURRENT","VIEW-KNOWLEDGE"],"SEPARATE",
         [("DIRECTION-VS-ORIENTATION","USER_FACING","Choosing preparation direction and exploring reusable Subject Knowledge are different goals with independent resume/findability value.")]),
        ("BOUNDARY-CURRENT-ACTIVITY","current-activity-boundary",["VIEW-CURRENT","VIEW-ACTIVITY"],"SEPARATE",
         [("PLAN-TO-ATTEMPT","USER_FACING","Moving from focus choice into an activity attempt is an intentional work-state transition with attempt continuity and recovery semantics.")]),
        ("BOUNDARY-KNOWLEDGE-ACTIVITY","knowledge-activity-boundary",["VIEW-KNOWLEDGE","VIEW-ACTIVITY"],"SEPARATE",
         [("ORIENTATION-TO-ATTEMPT","USER_FACING","Knowledge orientation is independently revisitable; beginning an activity creates a distinct attempt context.")]),
        ("BOUNDARY-ACTIVITY-EVIDENCE-CHANGE","activity-evidence-boundary",["VIEW-ACTIVITY","VIEW-EVIDENCE-CHANGE"],"SEPARATE",
         [("POST-ACTIVITY-REVIEW","USER_FACING","A completed/reviewable attempt crosses into contextual evidence/change review with its own recovery/continuation boundary while remaining non-global.")]),
        ("BOUNDARY-PREPARE-SUPPORT-ORIGIN","prepare-support-origin-boundary",["VIEW-PREPARE-SUPPORT","ORIGINATING-PREPARATION-VIEW"],"SEPARATE",
         [("CONTEXTUAL-RECOVERY","USER_FACING","Missing-support preparation is a resumable contextual recovery excursion that preserves and returns to originating work.")]),
    ]

    specs = [
        ("target-comparison-active-target-boundary","BOUNDARY-TARGET-COMPARISON-ACTIVE-TARGET","one-target-view",
         [("one-target-view","One Target view keeps comparison and active-Target roles behaviorally distinct without navigation.",
           effects("continuous Target decision","shared Target/evidence context","candidate state carries into establishment","activation stays semantic, not navigational","role transition stays explicit","contexts remain addressable within one view")),
          ("two-target-views","Separate comparison and active-Target views.",
           effects("splits continuous Target decision","shared context crosses navigation","candidate state must survive navigation","adds navigation around establishment/reconsideration","role transition risks coupling to destination change","adds independent destinations")),
          ("contextual-target-topology","Make one Target concern primary and the other contextual.",
           effects("creates unsupported asymmetry","shared context becomes subordinate","persistent state remains possible","adds enter/return semantics","implies primary role","limits contextual revisit"))],
         {"two-target-views":"No accepted user-facing need requires an independent destination; it adds refinding/navigation cost across a continuous Target transition.",
          "contextual-target-topology":"Comparison and active-Target work are mutually revisitable, not primary-versus-incidental."}),
        ("target-current-boundary","BOUNDARY-TARGETS-CURRENT","separate-target-current",
         [("separate-target-current","Keep Target and Current as separate views.",effects("intentional goal switch","different information dependencies","independent working states","clear recovery ownership","Target-definition vs preparation-direction contexts","both independently revisitable")),
          ("merge-target-current","Merge Target and Current.",effects("mixes distinct goals","increases simultaneous burden","couples working states","blurs recovery","collapses contexts","weakens resume/deep-link"))],
         {"merge-target-current":"Distinct user goals and resume/findability needs justify separation; persistent Target context preserves continuity."}),
        ("target-knowledge-boundary","BOUNDARY-TARGETS-KNOWLEDGE","separate-target-knowledge",
         [("separate-target-knowledge","Separate Target and Knowledge with context-preserving entry.",effects("explicit goal switch","Knowledge has independent dependencies","local scope independent","no Target mutation","distinct context","Knowledge independently revisitable")),
          ("merge-target-knowledge","Merge Knowledge into Target.",effects("mixes requirement and orientation goals","broadens Target dependencies","couples Knowledge scope","blurs recovery","collapses contexts","removes independent Knowledge destination"))],
         {"merge-target-knowledge":"Knowledge is independently findable/revisitable; direct context transfer preserves continuity."}),
        ("current-knowledge-boundary","BOUNDARY-CURRENT-KNOWLEDGE","separate-current-knowledge",
         [("separate-current-knowledge","Separate direction decisions and Knowledge orientation.",effects("intentional goal switch","different inputs","independent local states","clear return","distinct contexts","both addressable")),
          ("merge-current-knowledge","Merge Knowledge into Current.",effects("mixes decision/orientation","co-locates excess information","couples scope/focus","blurs return","collapses contexts","reduces Knowledge findability"))],
         {"merge-current-knowledge":"Independent Knowledge orientation/findability is accepted; context-preserving cross-linking is sufficient."}),
        ("current-activity-boundary","BOUNDARY-CURRENT-ACTIVITY","separate-current-activity",
         [("separate-current-activity","Separate focus choice from activity attempt.",effects("planning→doing transition","attempt-specific dependencies","attempt state independent","begin/submit/recovery boundary","decision→performance mode","activity resumable")),
          ("merge-current-activity","Run activity inside Current.",effects("mixes planning/execution","co-locates attempt data","couples focus/attempt","blurs recovery","collapses modes","weakens resume"))],
         {"merge-current-activity":"Activity attempt has a material work-state/recovery boundary; Target/focus context can persist across views."}),
        ("knowledge-activity-boundary","BOUNDARY-KNOWLEDGE-ACTIVITY","separate-knowledge-activity",
         [("separate-knowledge-activity","Separate orientation from activity attempt.",effects("understanding→performing transition","different dependencies","scope/attempt state independent","attempt boundary explicit","orientation→performance","both revisitable")),
          ("merge-knowledge-activity","Perform activity inside Knowledge.",effects("mixes goals","forces attempt data into Knowledge","couples states","blurs recovery","collapses contexts","weakens activity resume"))],
         {"merge-knowledge-activity":"Beginning an attempt is a distinct work-state transition; Knowledge remains reusable orientation."}),
        ("activity-evidence-boundary","BOUNDARY-ACTIVITY-EVIDENCE-CHANGE","contextual-evidence-view",
         [("contextual-evidence-view","Separate contextual post-activity review.",effects("activity→review continuation","reviewed-result dependency","attempt hands off to review","evaluation/review boundary explicit","performance→interpretation","contextual direct entry")),
          ("merge-evidence-into-activity","Review inside Activity.",effects("single activity surface","co-locates attempt/result","couples states","weakens post-evaluation boundary","reduces switch","no contextual review addressability")),
          ("global-evidence-destination","Make Evidence a global destination.",effects("turns continuation into browsing","requires unsupported discovery","detaches origin","weakens origin recovery","contextual→global mode","adds unsupported global addressability"))],
         {"merge-evidence-into-activity":"Post-evaluation review has a material continuation/recovery boundary.",
          "global-evidence-destination":"IA defines Evidence/change as contextual, not a peer global destination."}),
        ("prepare-support-origin-boundary","BOUNDARY-PREPARE-SUPPORT-ORIGIN","contextual-support-view",
         [("contextual-support-view","Separate contextual recovery preserving origin.",effects("temporarily suspends origin goal","request/remainder dependency","recovery state persists","request/resume/return boundary","recovery mode","contextual resume")),
          ("merge-support-inline","Resolve support inline in every origin.",effects("duplicates recovery","duplicates dependencies","couples recovery to origins","obscures boundary","no recovery context","no independent contextual resume")),
          ("global-support-destination","Make support global.",effects("detaches motivating work","requires unsupported browsing","loses origin risk","weakens return","recovery→global mode","adds unsupported global addressability"))],
         {"merge-support-inline":"Resumable request/remainder lifecycle is a shared material recovery boundary.",
          "global-support-destination":"Accepted semantics require origin-preserving contextual recovery, not a global destination."}),
    ]

    decisions, points, probes = [], [], []
    for did, subject, selected, alts, rejected in specs:
        decisions.append({"id":did,"owner_authority":"HUMAN-INTERFACE-DESIGN",
            "alternatives":[({"id":aid,"state":"VIABLE"} if aid == selected else {"id":aid,"state":"REJECTED","rationale":rejected[aid]}) for aid,_,_ in alts],
            "disposition":"DETERMINED","selected":selected})
        points.append({"id":did,"subjects":[subject],
            "alternatives":[{"id":aid,"difference":diff,"material_effects":eff} for aid,diff,eff in alts]})
        aids = [a[0] for a in alts]
        probes += [
            {"strategy":"merge-vs-separate-view","challenge":f"Challenge merge versus separation for {subject} using user-facing material effects.","alternatives":aids,"decision_points":[did]},
            {"strategy":"persistent-context-vs-navigation","challenge":f"Challenge whether persistent context preserves {subject} continuity without changing its boundary.","alternatives":aids,"decision_points":[did]},
        ]
        if did in {"activity-evidence-boundary","prepare-support-origin-boundary"}:
            probes.append({"strategy":"contextual-surface-vs-destination","challenge":f"Challenge contextual versus destination semantics for {subject}.","alternatives":aids,"decision_points":[did]})

    assertions = [
        {"id":"TOP-ROOT","kind":"topology-structural-frame","subject":"preparation-frame","semantic_value":"FRAME-PREPARATION preserves candidate Target work before commitment and active Target/optional Next focus context across task views; contextual review/recovery remains non-global.","derived_from":["IA-ROOT","IA-STRUCTURE","IX-CONTEXT-CONTINUITY"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-VIEW-TARGETS","kind":"topology-task-view","subject":"target-work-view","semantic_value":"VIEW-TARGETS is one Target task view covering LOC-TARGET-COMPARISON and LOC-TARGET and both IX-TARGET-DIRECTION and IX-TARGET; behavioral distinction is preserved without selecting regions/tabs/panes.","derived_from":["IA-LOC-TARGETS","IA-LOC-TARGET-COMPARISON","IA-LOC-TARGET","IX-TARGET-DIRECTION","IX-TARGET"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-TARGET-ROLE-CONTINUITY","kind":"topology-navigation","subject":"target-role-transition","semantic_value":"Comparison selection and candidate-to-continue remain non-active; accepted establishment/refinement transitions to active Target, and reconsideration can return to comparison semantics without silent replacement.","derived_from":["IX-ACT-TARGET-SELECT-COMPARISON","IX-ACT-TARGET-CHOOSE-CONTINUE","IX-DIST-TARGET-COMPARISON-NOT-ACTIVE","IX-ACT-TARGET-ESTABLISH-REFINE"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-VIEW-CURRENT","kind":"topology-task-view","subject":"current-position-view","semantic_value":"VIEW-CURRENT independently supports current position/gaps and Next focus choice.","derived_from":["IA-LOC-CURRENT","IX-DIRECTION"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-VIEW-KNOWLEDGE","kind":"topology-task-view","subject":"knowledge-view","semantic_value":"VIEW-KNOWLEDGE independently supports Subject Knowledge orientation without selecting a representation form.","derived_from":["IA-LOC-KNOWLEDGE","IX-KNOWLEDGE"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-KNOWLEDGE-SCOPE","kind":"topology-navigation","subject":"knowledge-capability-scope","semantic_value":"Target→Knowledge may carry selected Required Capability scope; local apply/clear does not choose Next focus.","derived_from":["IA-SCOPE-KNOWLEDGE","IX-ACT-KNOWLEDGE-APPLY-CAPABILITY-SCOPE","IX-ACT-KNOWLEDGE-CLEAR-CAPABILITY-SCOPE","IX-STATE-KNOWLEDGE-CAPABILITY-SCOPE","IX-DIST-CAPABILITY-NEXT-FOCUS"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-VIEW-ACTIVITY","kind":"topology-task-view","subject":"activity-view","semantic_value":"VIEW-ACTIVITY independently supports support selection and one activity attempt under explicit focus.","derived_from":["IA-LOC-ACTIVITIES","IX-ACTIVITY"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-VIEW-EVIDENCE","kind":"topology-task-view","subject":"evidence-change-view","semantic_value":"VIEW-EVIDENCE-CHANGE is contextual post-activity evidence/change review, not a global destination.","derived_from":["IA-LOC-EVIDENCE","IX-ACTIVITY"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-VIEW-PREP-SUPPORT","kind":"topology-task-view","subject":"prepare-support-view","semantic_value":"VIEW-PREPARE-SUPPORT is contextual missing-support recovery that preserves origin, supports resume and returns accepted support/remainder.","derived_from":["IA-LOC-PREP-SUPPORT","IX-PREP-SUPPORT"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-CONTEXT","kind":"topology-navigation","subject":"active-context-reachability","semantic_value":"Current/Knowledge/Activity/Evidence preserve active Target; Activity also requires Next focus; missing context enters owning work rather than inventing state.","derived_from":["IA-SCOPE-TARGET","IA-SCOPE-FOCUS","IX-CONTEXT-CONTINUITY","IX-CURRENTNESS"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-CROSSLINKS","kind":"topology-navigation","subject":"preparation-crosslinks","semantic_value":"Reachability preserves accepted Target↔Current, Target→Knowledge, Current→Knowledge/Activity, Knowledge→Activity, Activity→Evidence, Evidence→Current and contextual support return; Target reconsideration stays inside one Target view.","derived_from":["IA-CROSSLINKS","IX-TARGET-DIRECTION","IX-TARGET","IX-DIRECTION","IX-KNOWLEDGE","IX-ACTIVITY","IX-PREP-SUPPORT"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-EVIDENCE-REVIEW","kind":"topology-navigation","subject":"evidence-review-reachability","semantic_value":"Evidence/change direct entry requires reviewed activity/evidence context and remains a contextual continuation.","derived_from":["IA-LOC-EVIDENCE","IA-CROSSLINKS","IX-ACTIVITY","IX-OUTCOMES"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-DIRECT-LINK","kind":"topology-navigation","subject":"direct-link-semantics","semantic_value":"Direct links preserve valid context; missing Target enters VIEW-TARGETS establishment/recovery and missing Activity focus enters VIEW-CURRENT.","derived_from":["IA-FINDABILITY","IX-CURRENTNESS","IX-OUTCOMES"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-LABELS","kind":"topology-navigation","subject":"learner-facing-view-labels","semantic_value":"View identity follows learner-facing semantics rather than task/application/component decomposition.","derived_from":["IA-TAXONOMY"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-NONSPATIAL-REACHABILITY","kind":"topology-invariant","subject":"nonspatial-view-reachability","semantic_value":"Every required view/recovery path remains semantically reachable without pointer-only or spatial navigation mechanics; concrete controls remain downstream.","derived_from":["IX-KEYBOARD"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
        {"id":"TOP-NO-COMPOSITION","kind":"topology-invariant","subject":"topology-screen-boundary","semantic_value":"Topology decides view identity/responsibility/reachability only; regions/layout/components/styling/responsive composition and representation remain downstream.","derived_from":["IA-NO-SCREEN","IX-NO-LAYOUT"],"decision_authority":"HUMAN-INTERFACE-DESIGN"},
    ]
    boundary_review = []
    for bid, did, participants, outcome, bases in bounds:
        boundary_review.append({"id":bid,"participants":participants,"materiality":"MATERIAL",
            "contestability":"CONTESTABLE","outcome":outcome,
            "rationale_bases":[{"id":i,"classification":c,"rationale":r} for i,c,r in bases],
            "decision_refs":[did]})
    admission = {
        "version":1,"kind":"harness-artifact-admission-candidate","id":"INTERFACE-TOPOLOGY",
        "capability":CAP,"path":DOC,"changed_paths":[DOC],
        "canonical_references":[
            {"artifact":"INTERFACE-TOPOLOGY","referenced_path":"docs/interface/information-architecture.yaml"},
            {"artifact":"INTERFACE-TOPOLOGY","referenced_path":"docs/interface/interaction-design.yaml"}],
        "decision_review":{"axes":[{"axis":"view-boundaries","decisions":decisions}]},
        "semantic_assertions":assertions,
        "semantic_review":{"status":"ACCEPTED",
            "checks":["source-discipline","authority-boundary","no-invention","topology-not-screen-composition","view-boundary-semantics"],
            "view_boundary_requirements":boundary_review,"shared_boundary_decision_groups":[]},
    }
    dump(ADM, admission)
    exploration = {
        "version":1,"kind":"harness-decision-exploration","capability":CAP,
        "knowledge_kind":"interface-topology-design","explorer_request_id":"GENERATE-AT-REVALIDATION",
        "research_sources":[],
        "axes":[{"axis":"view-boundaries","applicability":"APPLICABLE","exploration_level":"EXPLORE",
                 "probes":probes,"decision_points":points}],
        "decision_space_review":{"status":"COMPLETE",
            "checks":["mixed-decision-split","missing-material-case-search","impact-and-reversal-frontier-check","accepted-constraint-cross-check","authority-boundary-cross-check"],
            "reviewed_decisions":[x[0] for x in specs],"open_gaps":[]},
    }
    dump(EXP, exploration)

    ia = {"version":1,"kind":"harness-semantic-derivation-evidence",
        "source_capability":"prep.information-architecture","target_capability":CAP,
        "links":[
            {"sources":["IA-ROOT","IA-STRUCTURE"],"relation":"CONSTRAINS","targets":["TOP-ROOT"]},
            {"sources":["IA-LOC-TARGETS","IA-LOC-TARGET-COMPARISON","IA-LOC-TARGET"],"relation":"CONSTRAINS","targets":["TOP-VIEW-TARGETS"]},
            {"sources":["IA-LOC-CURRENT"],"relation":"CONSTRAINS","targets":["TOP-VIEW-CURRENT"]},
            {"sources":["IA-LOC-KNOWLEDGE"],"relation":"CONSTRAINS","targets":["TOP-VIEW-KNOWLEDGE"]},
            {"sources":["IA-LOC-ACTIVITIES"],"relation":"CONSTRAINS","targets":["TOP-VIEW-ACTIVITY"]},
            {"sources":["IA-LOC-EVIDENCE"],"relation":"CONSTRAINS","targets":["TOP-VIEW-EVIDENCE","TOP-EVIDENCE-REVIEW"]},
            {"sources":["IA-LOC-PREP-SUPPORT"],"relation":"CONSTRAINS","targets":["TOP-VIEW-PREP-SUPPORT"]},
            {"sources":["IA-SCOPE-TARGET","IA-SCOPE-FOCUS"],"relation":"CONSTRAINS","targets":["TOP-CONTEXT"]},
            {"sources":["IA-SCOPE-KNOWLEDGE"],"relation":"CONSTRAINS","targets":["TOP-KNOWLEDGE-SCOPE"]},
            {"sources":["IA-CROSSLINKS"],"relation":"CONSTRAINS","targets":["TOP-CROSSLINKS","TOP-EVIDENCE-REVIEW"]},
            {"sources":["IA-TAXONOMY"],"relation":"CONSTRAINS","targets":["TOP-LABELS"]},
            {"sources":["IA-FINDABILITY"],"relation":"CONSTRAINS","targets":["TOP-DIRECT-LINK","TOP-VIEW-TARGETS"]},
            {"sources":["IA-NO-SCREEN"],"relation":"CONSTRAINS","targets":["TOP-NO-COMPOSITION"]},
        ],"dispositions":[]}
    dump(IA_EVID, ia)

    ix = {"version":1,"kind":"harness-semantic-derivation-evidence",
        "source_capability":"prep.interaction-design","target_capability":CAP,
        "links":[
            {"sources":["IX-TARGET-DIRECTION","IX-TARGET","IX-ACT-TARGET-SELECT-COMPARISON","IX-ACT-TARGET-INSPECT-COMPARISON","IX-ACT-TARGET-CHOOSE-CONTINUE","IX-ACT-TARGET-DEFER-CHOICE","IX-DIST-TARGET-COMPARISON-NOT-ACTIVE","IX-STATE-TARGET-COMPARISON-UNCERTAINTY","IX-ACT-TARGET-ESTABLISH-REFINE","IX-ACT-TARGET-INSPECT-REQUIREMENTS","IX-ACT-TARGET-CONFIRM"],"relation":"CONSTRAINS","targets":["TOP-VIEW-TARGETS","TOP-TARGET-ROLE-CONTINUITY"]},
            {"sources":["IX-DIRECTION","IX-ACT-DIRECTION-INSPECT-CURRENT","IX-ACT-DIRECTION-INSPECT-EVIDENCE","IX-ACT-DIRECTION-INSPECT-GAPS","IX-ACT-DIRECTION-INSPECT-INPUTS","IX-ACT-DIRECTION-CHOOSE-FOCUS","IX-STATE-CAPABILITY-DEMONSTRATED","IX-STATE-CAPABILITY-CHALLENGED","IX-STATE-CAPABILITY-UNKNOWN"],"relation":"CONSTRAINS","targets":["TOP-VIEW-CURRENT","TOP-CONTEXT"]},
            {"sources":["IX-KNOWLEDGE","IX-ACT-KNOWLEDGE-QUERY","IX-ACT-KNOWLEDGE-APPLY-CAPABILITY-SCOPE","IX-ACT-KNOWLEDGE-CLEAR-CAPABILITY-SCOPE","IX-ACT-KNOWLEDGE-CHANGE-SCOPE","IX-ACT-KNOWLEDGE-CHANGE-DEPTH","IX-ACT-KNOWLEDGE-SELECT","IX-ACT-KNOWLEDGE-FOLLOW-RELATION","IX-STATE-KNOWLEDGE-CAPABILITY-SCOPE","IX-DIST-CAPABILITY-NEXT-FOCUS"],"relation":"CONSTRAINS","targets":["TOP-VIEW-KNOWLEDGE","TOP-KNOWLEDGE-SCOPE"]},
            {"sources":["IX-ACTIVITY","IX-ACT-ACTIVITY-INSPECT-SUPPORT-FIT","IX-ACT-ACTIVITY-SELECT-SUPPORT","IX-ACT-ACTIVITY-BEGIN","IX-ACT-ACTIVITY-SUBMIT"],"relation":"CONSTRAINS","targets":["TOP-VIEW-ACTIVITY","TOP-CONTEXT"]},
            {"sources":["IX-ACT-ACTIVITY-INSPECT-EVIDENCE","IX-ACT-ACTIVITY-REVIEW-CHANGE","IX-ACT-ACTIVITY-CONTINUE","IX-STATE-ACTIVITY-NO-CHANGE","IX-STATE-ACTIVITY-INCREASED-UNCERTAINTY","IX-DIST-ACTIVITY-NOT-CLAIM"],"relation":"CONSTRAINS","targets":["TOP-VIEW-EVIDENCE","TOP-EVIDENCE-REVIEW"]},
            {"sources":["IX-PREP-SUPPORT","IX-ACT-PREP-SUPPORT-INSPECT-NEED","IX-ACT-PREP-SUPPORT-PROVIDE-SOURCE","IX-ACT-PREP-SUPPORT-REQUEST","IX-ACT-PREP-SUPPORT-INSPECT-PARTIAL","IX-ACT-PREP-SUPPORT-INSPECT-REMAINDER","IX-ACT-PREP-SUPPORT-RESUME","IX-ACT-PREP-SUPPORT-RETURN"],"relation":"CONSTRAINS","targets":["TOP-VIEW-PREP-SUPPORT","TOP-CROSSLINKS"]},
            {"sources":["IX-OUTCOMES","IX-STATE-OUTCOME-SUCCESS","IX-STATE-OUTCOME-UNRESOLVED","IX-STATE-OUTCOME-REJECTED","IX-STATE-OUTCOME-DEPENDENCY-UNAVAILABLE","IX-STATE-OUTCOME-STALE-BASIS","IX-STATE-OUTCOME-OPERATIONAL-FAILURE"],"relation":"CONSTRAINS","targets":["TOP-EVIDENCE-REVIEW","TOP-DIRECT-LINK","TOP-CONTEXT"]},
            {"sources":["IX-CURRENTNESS","IX-CONTEXT-CONTINUITY"],"relation":"CONSTRAINS","targets":["TOP-ROOT","TOP-CONTEXT","TOP-DIRECT-LINK"]},
            {"sources":["IX-KEYBOARD"],"relation":"CONSTRAINS","targets":["TOP-NONSPATIAL-REACHABILITY"]},
            {"sources":["IX-NO-LAYOUT"],"relation":"CONSTRAINS","targets":["TOP-NO-COMPOSITION"]},
        ],
        "dispositions":[
            {"source":"IX-PENDING","status":"NOT_APPLICABLE","rationale":"Pending mutation feedback does not determine view identity or reachability."},
            {"source":"IX-DIST-SEMANTIC-OWNERSHIP","status":"NOT_APPLICABLE","rationale":"Semantic ownership introduces no additional topology boundary beyond mapped contexts and recovery links."},
        ]}
    dump(IX_EVID, ix)

def main():
    graph, core = load(".harness/engineering-graph.yaml"), load(".harness/core.yaml")
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    semantic_set = copy.deepcopy(publication["state"]["semantic_evaluations"])
    lifecycle = copy.deepcopy(publication["state"]["lifecycle"])
    failures = copy.deepcopy(publication["state"]["decision_failures"])
    index = rows(lifecycle)
    registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    sem_contracts = load(HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    dec_contracts = load(HARNESS_ROOT / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml")
    dec_policy = load(".harness/candidates/ui-materiality-decision-policy.yaml")
    fingerprints = derive_acceptance_policy_fingerprints(graph=graph, knowledge_contracts=sem_contracts,
        decision_contracts=dec_contracts, decision_policy=dec_policy)
    before_states = lifecycle_states(graph, core, lifecycle, current_acceptance_policy_fingerprints=fingerprints)
    before = before_states[CAP]
    if before.get("state") == "CURRENT": raise SystemExit("Expected stale Topology")
    old = index[CAP]
    if old.get("acceptance_id") != "PREP-INTERFACE-TOPOLOGY-STRICT-7": raise SystemExit("Unexpected old Topology acceptance")
    oldp = old.get("accepted_prerequisites", {}) or {}
    if oldp.get("prep.information-architecture") != "PREP-INFORMATION-ARCHITECTURE-STRICT-6" or oldp.get("prep.interaction-design") != "PREP-INTERACTION-DESIGN-STRICT-5":
        raise SystemExit(f"Old prerequisite baseline unexpected: {oldp}")
    expected = {"prep.information-architecture":"PREP-INFORMATION-ARCHITECTURE-STRICT-7",
                "prep.interaction-design":"PREP-INTERACTION-DESIGN-STRICT-6"}
    for cap, acc in expected.items():
        if index[cap].get("acceptance_id") != acc or before_states[cap].get("state") != "CURRENT":
            raise SystemExit(f"{cap} is not current {acc}")

    generate_inputs()
    candidate, exploration = load(ADM), load(EXP)
    review = candidate["semantic_review"]
    if "view-boundary-semantics" not in review["checks"]: raise SystemExit("H4 review missing")
    bounds = review["view_boundary_requirements"]
    if len(bounds) != 8 or any(x.get("materiality") != "MATERIAL" for x in bounds): raise SystemExit("Boundary inventory incomplete")
    target = next(x for x in bounds if x["id"] == "BOUNDARY-TARGET-COMPARISON-ACTIVE-TARGET")
    if target.get("outcome") != "MERGED": raise SystemExit("Target boundary must be explicitly MERGED")

    dc = decision_contract_index(dec_contracts)["interface-topology-design"]
    ctx = build_authority_context(graph, core, "HUMAN-INTERFACE-DESIGN", [CAP])
    current_provider = next(x for x in core.get("artifacts", []) or [] if x.get("id") == old.get("artifact"))
    request = build_decision_explorer_request(capability=CAP, knowledge_kind="interface-topology-design",
        authority="HUMAN-INTERFACE-DESIGN", authority_context=ctx, contract=dc,
        axis_policies=axis_policies(dc, dec_policy), prerequisite_baseline={k:index[k]["acceptance_id"] for k in expected},
        model=core, mode="REVISION", current_provider_baseline=current_provider)
    exploration["explorer_request_id"] = request["request_id"]
    (ROOT / REQ).write_text(json.dumps(request, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    dump(EXP, exploration)

    source_bundle, incoming = {"semantic_assertions":[]}, []
    for source_cap, (source_path, contract_path, evidence_path) in SOURCES.items():
        source = load(source_path)
        if semantic_assertion_fingerprints(source) != index[source_cap].get("semantic_atom_fingerprints"):
            raise SystemExit(f"Current source surface mismatch: {source_cap}")
        aid = artifact_for(core, source_cap)
        for a in source.get("semantic_assertions", []) or []:
            v = copy.deepcopy(a); v["source_artifact"] = aid; source_bundle["semantic_assertions"].append(v)
        ev = evaluate_derivation(graph=graph, contract=load(contract_path), source=source,
                                 candidate=candidate, evidence=load(evidence_path))
        if ev.get("status") != "ACCEPTED" or unresolved(ev):
            raise SystemExit(yaml.safe_dump({"source":source_cap,"findings":ev.get("findings"),"coverage":ev.get("coverage"),"unresolved":unresolved(ev)}, sort_keys=False))
        incoming.append(ev)

    admitted = admit_artifact(graph=graph, model=core, skill_registry=registry, knowledge_contracts=sem_contracts,
        decision_contracts=dec_contracts, decision_policy=dec_policy, decision_exploration=exploration,
        derivation_evaluations=incoming, capability=CAP, sources=source_bundle, candidate=candidate,
        acceptance_id=ACC, lifecycle=lifecycle, decision_request_mode="REVISION")
    if admitted.get("status") != "ACCEPTED":
        raise SystemExit(yaml.safe_dump({"findings":admitted.get("findings"),"decision_exploration":admitted.get("decision_exploration"),"decision_governance":admitted.get("decision_governance")}, sort_keys=False))

    old_ids = {k:v.get("acceptance_id") for k,v in index.items()}
    replace_eval(semantic_set, admitted)
    for ev in incoming: replace_eval(semantic_set, ev, derivation=True)
    replace_provider(lifecycle, admitted["lifecycle_assertion"])
    next_pub = build_project_publication(graph=graph, core_model=core, semantic_evaluations=semantic_set,
        lifecycle=lifecycle, decision_failures=failures, parent_revision=publication["revision"])
    after_index = rows(lifecycle)
    reaccepted = [k for k,v in after_index.items() if k != CAP and v.get("acceptance_id") != old_ids.get(k)]
    if reaccepted: raise SystemExit(f"Unexpected reacceptance: {reaccepted}")
    after_states = lifecycle_states(graph, core, lifecycle, current_acceptance_policy_fingerprints=fingerprints)
    if after_states[CAP].get("state") != "CURRENT": raise SystemExit(f"Topology not CURRENT: {after_states[CAP]}")

    prods, ordered = production_index(graph), list(production_index(graph))
    frontier = []
    for cap in ordered[ordered.index(CAP)+1:]:
        if after_states.get(cap, {}).get("state") == "CURRENT": continue
        reqs = [x.get("capability") for x in prods[cap].get("requires", []) or [] if isinstance(x, dict)]
        if all(after_states.get(p, {}).get("state") == "CURRENT" for p in reqs):
            frontier.append({"capability":cap,"state":after_states.get(cap,{}).get("state"),"authority":after_states.get(cap,{}).get("authority")})

    report = {
        "stage":"STAGE-P1-TOP","old_acceptance":old.get("acceptance_id"),"old_prerequisites":oldp,
        "before_state":before,"boundary_inventory":{"material":8,"contestable":8,"deterministic":0,"unresolved":0},
        "target_boundary":{"id":target["id"],"selected":"one view","responsibility_decomposition_used_as_proof":False,"local_decision_governance":"PASS"},
        "target_role_continuity":{"comparison_selection_activates_target":False,"candidate_to_active_transition_preserved":True},
        "derivations":{x["source_capability"]:{"status":x["status"],"required":len(x.get("required_sources",[]) or []),"covered":len(x.get("covered_sources",[]) or []),"disposed":len(x.get("dispositions",[]) or []),"unresolved":unresolved(x)} for x in incoming},
        "new_acceptance":admitted["lifecycle_assertion"]["acceptance_id"],"after_state":after_states[CAP],
        "reaccepted_artifacts":reaccepted,"actionable_frontier":frontier,
        "defect_status":{"PREP-UX-002":"PREP_REVALIDATION","PREP-UX-013":"PREP_REVALIDATION","PREP-UX-003":"PREP_REVALIDATION",
            "PREP-UX-005":"PREP_REVALIDATION","PREP-UX-006":"PREP_REVALIDATION","PREP-UX-014":"PREP_REVALIDATION","PREP-UX-012":"BLOCKED"},
    }
    (ROOT / ".harness/project-publication.next.yaml").write_text(yaml.safe_dump(next_pub, sort_keys=False, allow_unicode=True), encoding="utf-8")
    (ROOT / ".harness/topology-revalidation-report.yaml").write_text(yaml.safe_dump(report, sort_keys=False, allow_unicode=True), encoding="utf-8")
    print(yaml.safe_dump(report, sort_keys=False, allow_unicode=True))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
