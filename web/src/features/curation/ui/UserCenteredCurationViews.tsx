import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import type { KnowledgeNodeModel } from "../../knowledge-explorer/model/knowledge";
import type { KnowledgeQueryPort } from "../../knowledge-explorer/ports/KnowledgeQueryPort";
import type {
  AssessmentCurationModel,
  CapabilityCurationModel,
  CorpusDiagnosticModel,
  LearningSupportCurationModel,
  LearningSupportKind,
  TargetProfileModel,
  TargetProfilePurpose,
} from "../model/userCenteredCurationModels";
import type {
  AssessmentCurationPortV2,
  CapabilityCurationPortV2,
  CorpusQualityPort,
  LearningSupportCurationPortV2,
  TargetProfileCurationPort,
} from "../ports/UserCenteredCurationPorts";

function selectedValues(event: ChangeEvent<HTMLSelectElement>): string[] {
  return Array.from(event.target.selectedOptions, (option) => option.value);
}

function MultiSelect({
  label,
  value,
  options,
  onChange,
}: {
  readonly label: string;
  readonly value: readonly string[];
  readonly options: readonly { readonly id: string; readonly label: string }[];
  readonly onChange: (values: string[]) => void;
}) {
  return (
    <label>
      <Typography component="span" variant="body2">{label}</Typography>
      <select
        multiple
        aria-label={label}
        value={[...value]}
        onChange={(event) => onChange(selectedValues(event))}
        style={{ width: "100%", minHeight: 104 }}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export function TargetProfilesCurationView({
  targetPort,
  capabilityPort,
}: {
  readonly targetPort: TargetProfileCurationPort;
  readonly capabilityPort: CapabilityCurationPortV2;
}) {
  const [items, setItems] = useState<readonly TargetProfileModel[]>([]);
  const [capabilities, setCapabilities] = useState<readonly CapabilityCurationModel[]>([]);
  const [selected, setSelected] = useState<TargetProfileModel>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>();
  const [reload, setReload] = useState(0);

  const [newDraft, setNewDraft] = useState({
    name: "",
    definition: "",
    targetPurpose: "role-capability" as TargetProfilePurpose,
    provenance: "",
    unresolvedExpectations: "",
    relatedTargetRefs: [] as string[],
  });
  const [editDraft, setEditDraft] = useState({
    name: "",
    definition: "",
    targetPurpose: "role-capability" as TargetProfilePurpose,
    provenance: "",
    unresolvedExpectations: "",
    relatedTargetRefs: [] as string[],
    capabilityIds: [] as string[],
  });

  const lines = (value: string) =>
    value
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([targetPort.list({}), capabilityPort.list({})]).then(([targets, caps]) => {
      if (!active) return;
      setLoading(false);
      if (targets.status === "success") setItems(targets.value.items);
      else setMessage(targets.message);
      if (caps.status === "success") setCapabilities(caps.value.items);
      else setMessage(caps.message);
    });
    return () => { active = false; };
  }, [capabilityPort, reload, targetPort]);

  useEffect(() => {
    if (!selected) return;
    setEditDraft({
      name: selected.name,
      definition: selected.definition,
      targetPurpose: selected.targetPurpose,
      provenance: selected.provenance.join("\n"),
      unresolvedExpectations: selected.unresolvedExpectations.join("\n"),
      relatedTargetRefs: [...selected.relatedTargetRefs],
      capabilityIds: [...selected.capabilityIds],
    });
  }, [selected]);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    const outcome = await targetPort.create({
      name: newDraft.name,
      definition: newDraft.definition,
      targetPurpose: newDraft.targetPurpose,
      provenance: lines(newDraft.provenance),
      unresolvedExpectations: lines(newDraft.unresolvedExpectations),
      relatedTargetRefs: newDraft.relatedTargetRefs,
    });
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setNewDraft({
        name: "",
        definition: "",
        targetPurpose: "role-capability",
        provenance: "",
        unresolvedExpectations: "",
        relatedTargetRefs: [],
      });
      setMessage("Target created. Add required capabilities before using it for assessment.");
      setReload((value) => value + 1);
    } else setMessage(outcome.message);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    const updated = await targetPort.update(selected.id, {
      name: editDraft.name,
      definition: editDraft.definition,
      targetPurpose: editDraft.targetPurpose,
      provenance: lines(editDraft.provenance),
      unresolvedExpectations: lines(editDraft.unresolvedExpectations),
      relatedTargetRefs: editDraft.relatedTargetRefs,
    });
    if (updated.status !== "success") {
      setMessage(updated.message);
      return;
    }
    const scoped = await targetPort.setCapabilities(selected.id, editDraft.capabilityIds);
    if (scoped.status === "success") {
      setSelected(scoped.value);
      setMessage("Target capability profile saved.");
      setReload((value) => value + 1);
    } else setMessage(scoped.message);
  };

  const targetOptions = items.map((item) => ({
    id: item.id,
    label: item.name + " (" + item.targetPurpose + ")",
  }));

  return (
    <Stack spacing={2}>
      {message ? <Alert severity="info">{message}</Alert> : null}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">Targets</Typography>
          {loading ? <LoadingState label="Loading targets" /> : (
            <Stack component="ul" sx={{ listStyle: "none", p: 0 }}>
              {items.map((item) => (
                <li key={item.id}>
                  <Button onClick={() => setSelected(item)}>{item.name}</Button>{" "}
                  <Chip size="small" label={item.targetPurpose} />
                </li>
              ))}
            </Stack>
          )}
          <Button component={Link} to="/curation/import?kind=targets">Import targets</Button>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">New target</Typography>
          <Stack component="form" spacing={1} onSubmit={create}>
            <TextField label="Target name" value={newDraft.name} onChange={(e) => setNewDraft({ ...newDraft, name: e.target.value })} />
            <TextField label="Target context / definition" multiline value={newDraft.definition} onChange={(e) => setNewDraft({ ...newDraft, definition: e.target.value })} />
            <label>
              <Typography component="span" variant="body2">Target purpose</Typography>
              <select
                aria-label="Target purpose"
                value={newDraft.targetPurpose}
                onChange={(e) => setNewDraft({ ...newDraft, targetPurpose: e.target.value as TargetProfilePurpose })}
              >
                <option value="role-capability">Professional role capability</option>
                <option value="selection-interview">Selection / interview performance</option>
                <option value="other">Other</option>
              </select>
            </label>
            <TextField label="Target provenance" multiline value={newDraft.provenance} onChange={(e) => setNewDraft({ ...newDraft, provenance: e.target.value })} />
            <TextField label="Unresolved expectations" multiline value={newDraft.unresolvedExpectations} onChange={(e) => setNewDraft({ ...newDraft, unresolvedExpectations: e.target.value })} />
            <MultiSelect
              label="Related targets"
              value={newDraft.relatedTargetRefs}
              options={targetOptions}
              onChange={(values) => setNewDraft({ ...newDraft, relatedTargetRefs: values })}
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>Create target</Button>
          </Stack>
        </Paper>
      </Stack>

      {selected ? (
        <Paper component="section" aria-label="Target profile editor" variant="outlined" sx={{ p: 2 }}>
          <Stack component="form" spacing={1.5} onSubmit={save}>
            <Typography component="h3" variant="h6">Target profile</Typography>
            <TextField label="Target name" value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} />
            <TextField label="Target context / definition" multiline value={editDraft.definition} onChange={(e) => setEditDraft({ ...editDraft, definition: e.target.value })} />
            <label>
              <Typography component="span" variant="body2">Target purpose</Typography>
              <select
                aria-label="Target purpose"
                value={editDraft.targetPurpose}
                onChange={(e) => setEditDraft({ ...editDraft, targetPurpose: e.target.value as TargetProfilePurpose })}
              >
                <option value="role-capability">Professional role capability</option>
                <option value="selection-interview">Selection / interview performance</option>
                <option value="other">Other</option>
              </select>
            </label>
            <TextField label="Target provenance" multiline value={editDraft.provenance} onChange={(e) => setEditDraft({ ...editDraft, provenance: e.target.value })} />
            <TextField label="Unresolved expectations" multiline value={editDraft.unresolvedExpectations} onChange={(e) => setEditDraft({ ...editDraft, unresolvedExpectations: e.target.value })} />
            <MultiSelect
              label="Related targets"
              value={editDraft.relatedTargetRefs}
              options={targetOptions.filter((item) => item.id !== selected.id)}
              onChange={(values) => setEditDraft({ ...editDraft, relatedTargetRefs: values })}
            />
            <MultiSelect
              label="Required capabilities"
              value={editDraft.capabilityIds}
              options={capabilities.map((item) => ({ id: item.id, label: item.title }))}
              onChange={(values) => setEditDraft({ ...editDraft, capabilityIds: values })}
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>Save target profile</Button>
            <Button
              component={Link}
              to={"/learning/" + encodeURIComponent(selected.id) + "/overview"}
              sx={{ alignSelf: "flex-start" }}
            >
              Preview in Target Work
            </Button>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  );
}

export function CapabilitiesCurationView({
  capabilityPort,
  knowledgeQueryPort,
}: {
  readonly capabilityPort: CapabilityCurationPortV2;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
}) {
  const [items, setItems] = useState<readonly CapabilityCurationModel[]>([]);
  const [knowledge, setKnowledge] = useState<readonly KnowledgeNodeModel[]>([]);
  const [selected, setSelected] = useState<CapabilityCurationModel>();
  const [message, setMessage] = useState<string>();
  const [reload, setReload] = useState(0);
  const [draft, setDraft] = useState({
    title: "",
    performanceExpectation: "",
    conditionSummary: "",
    criterionSummary: "",
    knowledgeIds: [] as string[],
  });

  useEffect(() => {
    let active = true;
    void Promise.all([
      capabilityPort.list({}),
      knowledgeQueryPort.list({ kind: "global" }, {}),
    ]).then(([caps, knowledgeResult]) => {
      if (!active) return;
      if (caps.status === "success") setItems(caps.value.items);
      else setMessage(caps.message);
      if (knowledgeResult.status === "success") setKnowledge(knowledgeResult.value.items);
    });
    return () => { active = false; };
  }, [capabilityPort, knowledgeQueryPort, reload]);

  useEffect(() => {
    if (!selected) return;
    setDraft({
      title: selected.title,
      performanceExpectation: selected.performanceExpectation,
      conditionSummary: selected.conditionSummary,
      criterionSummary: selected.criterionSummary,
      knowledgeIds: [...selected.knowledgeIds],
    });
  }, [selected]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const outcome = selected
      ? await capabilityPort.update(selected.id, draft)
      : await capabilityPort.create(draft);
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setMessage(selected ? "Capability saved." : "Capability created.");
      setReload((value) => value + 1);
    } else setMessage(outcome.message);
  };

  return (
    <Stack spacing={2}>
      {message ? <Alert severity="info">{message}</Alert> : null}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">Capabilities</Typography>
          <Stack component="ul" sx={{ listStyle: "none", p: 0 }}>
            {items.map((item) => (
              <li key={item.id}><Button onClick={() => setSelected(item)}>{item.title}</Button></li>
            ))}
          </Stack>
          <Button onClick={() => {
            setSelected(undefined);
            setDraft({ title: "", performanceExpectation: "", conditionSummary: "", criterionSummary: "", knowledgeIds: [] });
          }}>New capability</Button>
        </Paper>
        <Paper component="section" aria-label="Capability editor" variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Stack component="form" spacing={1.25} onSubmit={submit}>
            <Typography component="h3" variant="h6">{selected ? "Capability editor" : "New capability"}</Typography>
            <TextField label="Capability title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <TextField label="Performance expectation" multiline value={draft.performanceExpectation} onChange={(e) => setDraft({ ...draft, performanceExpectation: e.target.value })} />
            <TextField label="Condition scope" multiline value={draft.conditionSummary} onChange={(e) => setDraft({ ...draft, conditionSummary: e.target.value })} />
            <TextField label="Criteria / standard" multiline value={draft.criterionSummary} onChange={(e) => setDraft({ ...draft, criterionSummary: e.target.value })} />
            <MultiSelect
              label="Knowledge focus"
              value={draft.knowledgeIds}
              options={knowledge.map((item) => ({ id: item.id, label: item.title }))}
              onChange={(values) => setDraft({ ...draft, knowledgeIds: values })}
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>Save capability</Button>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

export function LearningSupportCurationViewV2({
  supportPort,
  capabilityPort,
  knowledgeQueryPort,
}: {
  readonly supportPort: LearningSupportCurationPortV2;
  readonly capabilityPort: CapabilityCurationPortV2;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
}) {
  const [items, setItems] = useState<readonly LearningSupportCurationModel[]>([]);
  const [capabilities, setCapabilities] = useState<readonly CapabilityCurationModel[]>([]);
  const [knowledge, setKnowledge] = useState<readonly KnowledgeNodeModel[]>([]);
  const [selected, setSelected] = useState<LearningSupportCurationModel>();
  const [message, setMessage] = useState<string>();
  const [reload, setReload] = useState(0);
  const [draft, setDraft] = useState({
    title: "",
    kind: "material" as LearningSupportKind,
    summary: "",
    capabilityIds: [] as string[],
    knowledgeIds: [] as string[],
  });

  useEffect(() => {
    let active = true;
    void Promise.all([
      supportPort.list({}),
      capabilityPort.list({}),
      knowledgeQueryPort.list({ kind: "global" }, {}),
    ]).then(([support, caps, knowledgeResult]) => {
      if (!active) return;
      if (support.status === "success") setItems(support.value.items);
      else setMessage(support.message);
      if (caps.status === "success") setCapabilities(caps.value.items);
      if (knowledgeResult.status === "success") setKnowledge(knowledgeResult.value.items);
    });
    return () => { active = false; };
  }, [capabilityPort, knowledgeQueryPort, reload, supportPort]);

  useEffect(() => {
    if (!selected) return;
    setDraft({
      title: selected.title,
      kind: selected.kind,
      summary: selected.summary,
      capabilityIds: [...selected.capabilityIds],
      knowledgeIds: [...selected.knowledgeIds],
    });
  }, [selected]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const outcome = selected
      ? await supportPort.update(selected.id, draft)
      : await supportPort.create(draft);
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setMessage(selected ? "Learning support saved." : "Learning support created.");
      setReload((value) => value + 1);
    } else setMessage(outcome.message);
  };

  return (
    <Stack spacing={2}>
      {message ? <Alert severity="info">{message}</Alert> : null}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">Learning Support</Typography>
          <Stack component="ul" sx={{ listStyle: "none", p: 0 }}>
            {items.map((item) => (
              <li key={item.id}>
                <Button onClick={() => setSelected(item)}>{item.title}</Button>{" "}
                <Chip size="small" label={item.kind} />
              </li>
            ))}
          </Stack>
          <Button component={Link} to="/curation/import?kind=learning_support">Import support</Button>
          <Button onClick={() => {
            setSelected(undefined);
            setDraft({ title: "", kind: "material", summary: "", capabilityIds: [], knowledgeIds: [] });
          }}>New support</Button>
        </Paper>
        <Paper component="section" aria-label="Learning support editor" variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Stack component="form" spacing={1.25} onSubmit={submit}>
            <Typography component="h3" variant="h6">{selected ? "Learning support editor" : "New learning support"}</Typography>
            <TextField label="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <label>
              <Typography component="span" variant="body2">Support kind</Typography>
              <select aria-label="Support kind" value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as LearningSupportKind })}>
                <option value="material">Material</option>
                <option value="practice">Practice / task</option>
              </select>
            </label>
            <TextField label="Learner-facing content / task summary" multiline value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
            <MultiSelect label="Intended capabilities" value={draft.capabilityIds} options={capabilities.map((item) => ({ id: item.id, label: item.title }))} onChange={(values) => setDraft({ ...draft, capabilityIds: values })} />
            <MultiSelect label="Related Knowledge" value={draft.knowledgeIds} options={knowledge.map((item) => ({ id: item.id, label: item.title }))} onChange={(values) => setDraft({ ...draft, knowledgeIds: values })} />
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>Save learning support</Button>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

export function AssessmentCurationViewV2({
  assessmentPort,
  capabilityPort,
}: {
  readonly assessmentPort: AssessmentCurationPortV2;
  readonly capabilityPort: CapabilityCurationPortV2;
}) {
  const [items, setItems] = useState<readonly AssessmentCurationModel[]>([]);
  const [capabilities, setCapabilities] = useState<readonly CapabilityCurationModel[]>([]);
  const [selected, setSelected] = useState<AssessmentCurationModel>();
  const [message, setMessage] = useState<string>();
  const [reload, setReload] = useState(0);
  const [draft, setDraft] = useState({
    title: "",
    capabilityIds: [] as string[],
    taskSummary: "",
    observationSummary: "",
    evidenceRuleSummary: "",
    evidenceBearing: "supports" as "supports" | "challenges",
  });

  useEffect(() => {
    let active = true;
    void Promise.all([assessmentPort.list({}), capabilityPort.list({})]).then(([assessments, caps]) => {
      if (!active) return;
      if (assessments.status === "success") setItems(assessments.value.items);
      else setMessage(assessments.message);
      if (caps.status === "success") setCapabilities(caps.value.items);
    });
    return () => { active = false; };
  }, [assessmentPort, capabilityPort, reload]);

  useEffect(() => {
    if (!selected) return;
    setDraft({
      title: selected.title,
      capabilityIds: [...selected.capabilityIds],
      taskSummary: selected.taskSummary,
      observationSummary: selected.observationSummary,
      evidenceRuleSummary: selected.evidenceRuleSummary,
      evidenceBearing: selected.evidenceBearing,
    });
  }, [selected]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const outcome = selected
      ? await assessmentPort.update(selected.id, draft)
      : await assessmentPort.create(draft);
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setMessage(selected ? "Assessment design saved." : "Assessment design created.");
      setReload((value) => value + 1);
    } else setMessage(outcome.message);
  };

  return (
    <Stack spacing={2}>
      {message ? <Alert severity="info">{message}</Alert> : null}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">Assessment</Typography>
          <Stack component="ul" sx={{ listStyle: "none", p: 0 }}>
            {items.map((item) => <li key={item.id}><Button onClick={() => setSelected(item)}>{item.title}</Button></li>)}
          </Stack>
          <Button component={Link} to="/curation/import?kind=assessment_design">Import assessment design</Button>
          <Button onClick={() => {
            setSelected(undefined);
            setDraft({
              title: "",
              capabilityIds: [],
              taskSummary: "",
              observationSummary: "",
              evidenceRuleSummary: "",
              evidenceBearing: "supports",
            });
          }}>New assessment</Button>
        </Paper>
        <Paper component="section" aria-label="Assessment editor" variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Stack component="form" spacing={1.25} onSubmit={submit}>
            <Typography component="h3" variant="h6">{selected ? "Assessment editor" : "New assessment"}</Typography>
            <TextField label="Assessment title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <MultiSelect label="Target capabilities" value={draft.capabilityIds} options={capabilities.map((item) => ({ id: item.id, label: item.title }))} onChange={(values) => setDraft({ ...draft, capabilityIds: values })} />
            <TextField label="Task specification" multiline value={draft.taskSummary} onChange={(e) => setDraft({ ...draft, taskSummary: e.target.value })} />
            <TextField label="Observation specification" multiline value={draft.observationSummary} onChange={(e) => setDraft({ ...draft, observationSummary: e.target.value })} />
            <TextField label="Evidence warrant / pattern" multiline value={draft.evidenceRuleSummary} onChange={(e) => setDraft({ ...draft, evidenceRuleSummary: e.target.value })} />
            <label>
              <Typography component="span" variant="body2">Evidence bearing</Typography>
              <select
                aria-label="Evidence bearing"
                value={draft.evidenceBearing}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    evidenceBearing: event.target.value as "supports" | "challenges",
                  })
                }
              >
                <option value="supports">Supports</option>
                <option value="challenges">Challenges</option>
              </select>
            </label>
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>Save assessment design</Button>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

export function CorpusQualityView({ qualityPort }: { readonly qualityPort: CorpusQualityPort }) {
  const [state, setState] = useState<
    | { readonly status: "loading" }
    | { readonly status: "ready"; readonly items: readonly CorpusDiagnosticModel[] }
    | { readonly status: "problem"; readonly message: string }
  >({ status: "loading" });

  useEffect(() => {
    let active = true;
    void qualityPort.get().then((outcome) => {
      if (!active) return;
      if (outcome.status === "success") setState({ status: "ready", items: outcome.value });
      else setState({ status: "problem", message: outcome.message });
    });
    return () => { active = false; };
  }, [qualityPort]);

  if (state.status === "loading") return <LoadingState label="Loading corpus diagnostics" />;
  if (state.status === "problem") return <StateNotice title="Corpus diagnostics unavailable" message={state.message} severity="warning" />;
  if (state.items.length === 0) return <StateNotice title="No known diagnostics" message="No currently reported issue; this is not proof of completeness." severity="info" />;

  return (
    <Stack spacing={1.25}>
      <Typography component="h3" variant="h6">Known corpus diagnostics</Typography>
      {state.items.map((item) => (
        <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Chip size="small" label={item.area} color={item.severity === "warning" ? "warning" : "default"} />
              <Typography>{item.summary}</Typography>
            </Stack>
            <Button component={Link} to={`/curation/${item.ownerSection}`} sx={{ alignSelf: "flex-start" }}>
              Fix in {item.ownerSection}
            </Button>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
