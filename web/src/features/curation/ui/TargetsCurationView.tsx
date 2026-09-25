import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import type {
  CurationRequirementEntity,
  CurationTargetModel,
} from "../model/curationModels";
import type {
  RequirementCurationPort,
  TargetCurationPort,
} from "../ports/CurationPorts";

interface TargetsCurationViewProps {
  readonly targetPort: TargetCurationPort;
  readonly requirementPort: RequirementCurationPort;
}

export function TargetsCurationView({
  targetPort,
  requirementPort,
}: TargetsCurationViewProps) {
  const [items, setItems] = useState<readonly CurationTargetModel[]>([]);
  const [requirements, setRequirements] = useState<
    readonly CurationRequirementEntity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<string>();
  const [query, setQuery] = useState("");
  const [draftQuery, setDraftQuery] = useState("");
  const [selected, setSelected] = useState<CurationTargetModel>();
  const [newName, setNewName] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [editName, setEditName] = useState("");
  const [editDefinition, setEditDefinition] = useState("");
  const [scopeCandidate, setScopeCandidate] = useState("");
  const [operationMessage, setOperationMessage] = useState<string>();
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([
      targetPort.list({ search: query || undefined }),
      requirementPort.list({}),
    ]).then(([targets, scopeItems]) => {
      if (!active) return;
      setLoading(false);
      if (targets.status !== "success") {
        setProblem(targets.message);
        return;
      }
      if (scopeItems.status !== "success") {
        setProblem(scopeItems.message);
        return;
      }
      setProblem(undefined);
      setItems(targets.value.items);
      setRequirements(scopeItems.value.items);
      setSelected((current) =>
        current
          ? targets.value.items.find((item) => item.id === current.id) ?? current
          : undefined,
      );
    });
    return () => {
      active = false;
    };
  }, [query, reloadVersion, requirementPort, targetPort]);

  useEffect(() => {
    if (!selected) return;
    setEditName(selected.name);
    setEditDefinition(selected.definition);
  }, [selected]);

  const search = (event: FormEvent) => {
    event.preventDefault();
    setQuery(draftQuery.trim());
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    const outcome = await targetPort.create({
      name: newName,
      definition: newDefinition,
    });
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setNewName("");
      setNewDefinition("");
      setOperationMessage("LearningTarget created.");
      setReloadVersion((value) => value + 1);
    } else {
      setOperationMessage(outcome.message);
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    const outcome = await targetPort.update(selected.id, {
      name: editName,
      definition: editDefinition,
    });
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setOperationMessage("LearningTarget saved.");
      setReloadVersion((value) => value + 1);
    } else {
      setOperationMessage(outcome.message);
    }
  };

  const changeScope = async (scopeItemId: string, add: boolean) => {
    if (!selected || !scopeItemId) return;
    const outcome = add
      ? await targetPort.addScope(selected.id, scopeItemId)
      : await targetPort.removeScope(selected.id, scopeItemId);
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setScopeCandidate("");
      setOperationMessage("Target scope updated.");
      setReloadVersion((value) => value + 1);
    } else {
      setOperationMessage(outcome.message);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">
            LearningTargets
          </Typography>
          <Stack component="form" direction="row" spacing={1} onSubmit={search}>
            <TextField
              label="Search targets"
              size="small"
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
            />
            <Button type="submit">Search</Button>
          </Stack>
          {loading ? (
            <LoadingState label="Loading curated targets" />
          ) : problem ? (
            <StateNotice
              title="Targets unavailable"
              message={problem}
              severity="warning"
              retryLabel="Retry"
              onRetry={() => setReloadVersion((value) => value + 1)}
            />
          ) : items.length === 0 ? (
            <StateNotice title="No targets found" />
          ) : (
            <Stack component="ul" sx={{ listStyle: "none", p: 0 }}>
              {items.map((target) => (
                <li key={target.id}>
                  <Button onClick={() => setSelected(target)}>{target.name}</Button>
                </li>
              ))}
            </Stack>
          )}
          <Button component={Link} to="/curation/import?kind=targets">
            Import targets
          </Button>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">
            New target
          </Typography>
          <Stack component="form" spacing={1} onSubmit={create}>
            <TextField
              label="Target name"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
            />
            <TextField
              label="Target definition"
              multiline
              minRows={3}
              value={newDefinition}
              onChange={(event) => setNewDefinition(event.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
              Create target
            </Button>
          </Stack>
        </Paper>
      </Stack>

      {operationMessage ? <Alert severity="info">{operationMessage}</Alert> : null}

      {selected ? (
        <Paper component="section" aria-label="Target editor" variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography component="h3" variant="h6">
              Target editor
            </Typography>
            <Stack component="form" spacing={1} onSubmit={save}>
              <TextField
                label="Target name"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
              <TextField
                label="Target definition"
                multiline
                minRows={3}
                value={editDefinition}
                onChange={(event) => setEditDefinition(event.target.value)}
              />
              <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
                Save target
              </Button>
            </Stack>

            <Typography component="h4" variant="subtitle1">
              Scope
            </Typography>
            {selected.scopeItems.length === 0 ? (
              <Typography color="text.secondary">No scope items selected.</Typography>
            ) : (
              <Stack component="ul">
                {selected.scopeItems.map((item) => (
                  <li key={item.id}>
                    {item.title} ({item.kind}){" "}
                    <Button size="small" onClick={() => void changeScope(item.id, false)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </Stack>
            )}
            <Stack direction="row" spacing={1}>
              <label>
                Add existing{" "}
                <select
                  aria-label="Add scope item"
                  value={scopeCandidate}
                  onChange={(event) => setScopeCandidate(event.target.value)}
                >
                  <option value="">Select</option>
                  {requirements.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} ({item.kind})
                    </option>
                  ))}
                </select>
              </label>
              <Button
                onClick={() => void changeScope(scopeCandidate, true)}
                disabled={!scopeCandidate}
              >
                Add to scope
              </Button>
            </Stack>
            <Button
              component={Link}
              to={`/learning/${encodeURIComponent(selected.id)}/overview`}
              sx={{ alignSelf: "flex-start" }}
            >
              Preview in Learning
            </Button>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  );
}
