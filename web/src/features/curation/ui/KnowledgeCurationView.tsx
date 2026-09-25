import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  KNOWLEDGE_RELATION_TYPES,
  KNOWLEDGE_SEMANTIC_KINDS,
  type KnowledgeNodeModel,
  type KnowledgeRelationType,
  type KnowledgeSemanticKind,
} from "../../knowledge-explorer/model/knowledge";
import type { GraphRenderer } from "../../knowledge-explorer/ports/GraphRenderer";
import type { KnowledgeQueryPort } from "../../knowledge-explorer/ports/KnowledgeQueryPort";
import { KnowledgeExplorer } from "../../knowledge-explorer/ui/KnowledgeExplorer";
import type { CurationKnowledgeDetailModel } from "../model/curationModels";
import type { KnowledgeCurationPort } from "../ports/CurationPorts";

interface KnowledgeCurationViewProps {
  readonly queryPort: KnowledgeQueryPort;
  readonly curationPort: KnowledgeCurationPort;
  readonly Renderer: GraphRenderer;
}

export function KnowledgeCurationView({
  queryPort,
  curationPort,
  Renderer,
}: KnowledgeCurationViewProps) {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("selected") || undefined;
  const [detail, setDetail] = useState<CurationKnowledgeDetailModel>();
  const [candidates, setCandidates] = useState<readonly KnowledgeNodeModel[]>([]);
  const [semanticKind, setSemanticKind] = useState<KnowledgeSemanticKind>("concept");
  const [content, setContent] = useState("");
  const [newKind, setNewKind] = useState<KnowledgeSemanticKind>("concept");
  const [newContent, setNewContent] = useState("");
  const [relationTarget, setRelationTarget] = useState("");
  const [relationType, setRelationType] =
    useState<KnowledgeRelationType>("addresses");
  const [message, setMessage] = useState<string>();
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    void queryPort.list({ kind: "global" }, {}).then((outcome) => {
      if (active && outcome.status === "success") {
        setCandidates(outcome.value.items);
      }
    });
    return () => {
      active = false;
    };
  }, [queryPort, reloadVersion]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(undefined);
      return;
    }
    let active = true;
    void curationPort.get(selectedId).then((outcome) => {
      if (!active) return;
      if (outcome.status === "success") {
        setDetail(outcome.value);
        setSemanticKind(outcome.value.node.semanticKind);
        setContent(outcome.value.node.summary);
      } else {
        setMessage(outcome.message);
      }
    });
    return () => {
      active = false;
    };
  }, [curationPort, reloadVersion, selectedId]);

  const selectKnowledge = (knowledgeId: string) => {
    const next = new URLSearchParams(params);
    next.set("selected", knowledgeId);
    setParams(next);
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    const outcome = await curationPort.create({
      semanticKind: newKind,
      content: newContent,
    });
    if (outcome.status === "success") {
      setNewContent("");
      setMessage("KnowledgeNode created.");
      setReloadVersion((value) => value + 1);
      selectKnowledge(outcome.value.node.id);
    } else {
      setMessage(outcome.message);
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedId) return;
    const outcome = await curationPort.update(selectedId, {
      semanticKind,
      content,
    });
    if (outcome.status === "success") {
      setDetail(outcome.value);
      setMessage("KnowledgeNode saved.");
      setReloadVersion((value) => value + 1);
    } else {
      setMessage(outcome.message);
    }
  };

  const addRelation = async () => {
    if (!selectedId || !relationTarget) return;
    const outcome = await curationPort.addRelation({
      sourceId: selectedId,
      targetId: relationTarget,
      type: relationType,
    });
    if (outcome.status === "success") {
      setDetail(outcome.value);
      setRelationTarget("");
      setMessage("KnowledgeRelation added.");
      setReloadVersion((value) => value + 1);
    } else {
      setMessage(outcome.message);
    }
  };

  const removeRelation = async (relationId: string) => {
    const outcome = await curationPort.removeRelation(relationId);
    if (outcome.status === "success") {
      setMessage("KnowledgeRelation removed.");
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
            New KnowledgeNode
          </Typography>
          <Stack component="form" spacing={1} onSubmit={create}>
            <label>
              Semantic kind{" "}
              <select
                aria-label="New Knowledge semantic kind"
                value={newKind}
                onChange={(event) =>
                  setNewKind(event.target.value as KnowledgeSemanticKind)
                }
              >
                {KNOWLEDGE_SEMANTIC_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
            </label>
            <TextField
              label="Knowledge content"
              multiline
              minRows={3}
              value={newContent}
              onChange={(event) => setNewContent(event.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
              Create Knowledge
            </Button>
          </Stack>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">
            Contextual import
          </Typography>
          <Typography color="text.secondary">
            Apply a prepared Knowledge document without introducing source-extraction behavior.
          </Typography>
          <Button component={Link} to="/curation/import?kind=knowledge">
            Import Knowledge
          </Button>
        </Paper>
      </Stack>

      {message ? <Alert severity="info">{message}</Alert> : null}

      <KnowledgeExplorer
        key={reloadVersion}
        scope={{ kind: "global" }}
        queryPort={queryPort}
        Renderer={Renderer}
      />

      {detail ? (
        <Paper component="section" aria-label="Knowledge editor" variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography component="h3" variant="h6">
              Knowledge editor
            </Typography>
            <Stack component="form" spacing={1} onSubmit={save}>
              <label>
                Semantic kind{" "}
                <select
                  aria-label="Knowledge semantic kind"
                  value={semanticKind}
                  onChange={(event) =>
                    setSemanticKind(event.target.value as KnowledgeSemanticKind)
                  }
                >
                  {KNOWLEDGE_SEMANTIC_KINDS.map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                label="Knowledge content"
                multiline
                minRows={4}
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
                Save Knowledge
              </Button>
            </Stack>

            <Typography component="h4" variant="subtitle1">
              Relations
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {[...detail.incomingRelations, ...detail.outgoingRelations].map((relation) => (
                <Chip
                  key={relation.id}
                  label={`${relation.sourceId} —${relation.type}→ ${relation.targetId}`}
                  onDelete={() => void removeRelation(relation.id)}
                />
              ))}
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <label>
                Relation type{" "}
                <select
                  aria-label="New relation type"
                  value={relationType}
                  onChange={(event) =>
                    setRelationType(event.target.value as KnowledgeRelationType)
                  }
                >
                  {KNOWLEDGE_RELATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Target Knowledge{" "}
                <select
                  aria-label="Relation target"
                  value={relationTarget}
                  onChange={(event) => setRelationTarget(event.target.value)}
                >
                  <option value="">Select</option>
                  {candidates
                    .filter((node) => node.id !== selectedId)
                    .map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.title}
                      </option>
                    ))}
                </select>
              </label>
              <Button onClick={() => void addRelation()} disabled={!relationTarget}>
                Add relation
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  );
}
