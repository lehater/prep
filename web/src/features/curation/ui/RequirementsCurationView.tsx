import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import type { KnowledgeNodeModel } from "../../knowledge-explorer/model/knowledge";
import type { KnowledgeQueryPort } from "../../knowledge-explorer/ports/KnowledgeQueryPort";
import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import type { CurationRequirementEntity } from "../model/curationModels";
import type { RequirementCurationPort } from "../ports/CurationPorts";

interface RequirementsCurationViewProps {
  readonly requirementPort: RequirementCurationPort;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
}

export function RequirementsCurationView({
  requirementPort,
  knowledgeQueryPort,
}: RequirementsCurationViewProps) {
  const [items, setItems] = useState<readonly CurationRequirementEntity[]>([]);
  const [knowledge, setKnowledge] = useState<readonly KnowledgeNodeModel[]>([]);
  const [selected, setSelected] = useState<CurationRequirementEntity>();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [draftQuery, setDraftQuery] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [editDefinition, setEditDefinition] = useState("");
  const [candidate, setCandidate] = useState("");
  const [message, setMessage] = useState<string>();
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([
      requirementPort.list({ search: query || undefined }),
      knowledgeQueryPort.list({ kind: "global" }, {}),
    ]).then(([requirements, knowledgeResult]) => {
      if (!active) return;
      setLoading(false);
      if (requirements.status === "success") {
        setItems(requirements.value.items);
        setSelected((current) =>
          current
            ? requirements.value.items.find((item) => item.id === current.id) ?? current
            : undefined,
        );
      } else {
        setMessage(requirements.message);
      }
      if (knowledgeResult.status === "success") {
        setKnowledge(knowledgeResult.value.items);
      }
    });
    return () => {
      active = false;
    };
  }, [knowledgeQueryPort, query, reloadVersion, requirementPort]);

  useEffect(() => {
    if (!selected) return;
    setEditDefinition(selected.definition);
  }, [selected]);

  const search = (event: FormEvent) => {
    event.preventDefault();
    setQuery(draftQuery.trim());
  };

  const create = async (kind: "requirement" | "requirement-set") => {
    const outcome =
      kind === "requirement"
        ? await requirementPort.createRequirement({
            definition: newDefinition,
          })
        : await requirementPort.createSet({
            definition: newDefinition,
          });
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setNewDefinition("");
      setMessage(kind === "requirement" ? "Requirement created." : "RequirementSet created.");
      setReloadVersion((value) => value + 1);
    } else {
      setMessage(outcome.message);
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    const outcome =
      selected.kind === "requirement"
        ? await requirementPort.updateRequirement(selected.id, {
            definition: editDefinition,
          })
        : await requirementPort.updateSet(selected.id, {
            definition: editDefinition,
          });
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setMessage("Requirement data saved.");
      setReloadVersion((value) => value + 1);
    } else {
      setMessage(outcome.message);
    }
  };

  const changeAssociation = async (id: string, add: boolean) => {
    if (!selected || !id) return;
    const outcome =
      selected.kind === "requirement"
        ? add
          ? await requirementPort.alignKnowledge(selected.id, id)
          : await requirementPort.unalignKnowledge(selected.id, id)
        : add
          ? await requirementPort.addMember(selected.id, id)
          : await requirementPort.removeMember(selected.id, id);
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setCandidate("");
      setMessage(
        selected.kind === "requirement"
          ? "Knowledge alignment updated."
          : "RequirementSet membership updated.",
      );
      setReloadVersion((value) => value + 1);
    } else {
      setMessage(outcome.message);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">
            Requirements and RequirementSets
          </Typography>
          <Stack component="form" direction="row" spacing={1} onSubmit={search}>
            <TextField
              label="Search requirements"
              size="small"
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
            />
            <Button type="submit">Search</Button>
          </Stack>
          {loading ? (
            <LoadingState label="Loading requirements" />
          ) : items.length === 0 ? (
            <StateNotice title="No Requirements found" />
          ) : (
            <Stack component="ul" sx={{ listStyle: "none", p: 0 }}>
              {items.map((item) => (
                <li key={item.id}>
                  <Button onClick={() => setSelected(item)}>
                    {item.label} ({item.kind})
                  </Button>
                </li>
              ))}
            </Stack>
          )}
          <Button component={Link} to="/curation/import?kind=requirements">
            Import requirements
          </Button>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">
            New reusable requirement
          </Typography>
          <Stack spacing={1}>
            <TextField
              label="Requirement definition"
              multiline
              minRows={3}
              value={newDefinition}
              onChange={(event) => setNewDefinition(event.target.value)}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => void create("requirement")}>
                Create Requirement
              </Button>
              <Button onClick={() => void create("requirement-set")}>
                Create RequirementSet
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>

      {message ? (
        <Alert severity={message.includes("cycle") ? "warning" : "info"}>{message}</Alert>
      ) : null}

      {selected ? (
        <Paper component="section" aria-label="Requirement editor" variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography component="h3" variant="h6">
              {selected.kind === "requirement" ? "Requirement editor" : "RequirementSet editor"}
            </Typography>
            <Stack component="form" spacing={1} onSubmit={save}>
              <TextField
                label="Definition"
                multiline
                minRows={3}
                value={editDefinition}
                onChange={(event) => setEditDefinition(event.target.value)}
              />
              <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
                Save
              </Button>
            </Stack>

            <Typography component="h4" variant="subtitle1">
              {selected.kind === "requirement" ? "Knowledge alignments" : "Members"}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {(selected.kind === "requirement"
                ? selected.knowledgeIds
                : selected.memberIds
              ).map((id) => (
                <Chip
                  key={id}
                  label={id}
                  onDelete={() => void changeAssociation(id, false)}
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1}>
              <label>
                {selected.kind === "requirement" ? "Knowledge" : "Member"}{" "}
                <select
                  aria-label={
                    selected.kind === "requirement"
                      ? "Knowledge alignment candidate"
                      : "RequirementSet member candidate"
                  }
                  value={candidate}
                  onChange={(event) => setCandidate(event.target.value)}
                >
                  <option value="">Select</option>
                  {(selected.kind === "requirement" ? knowledge : items).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                onClick={() => void changeAssociation(candidate, true)}
                disabled={!candidate}
              >
                {selected.kind === "requirement" ? "Align Knowledge" : "Add member"}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  );
}
