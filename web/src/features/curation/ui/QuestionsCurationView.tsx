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
import type { CurationQuestionModel } from "../model/curationModels";
import type {
  QuestionAlignmentFilter,
  QuestionCurationPort,
} from "../ports/CurationPorts";

interface QuestionsCurationViewProps {
  readonly questionPort: QuestionCurationPort;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
}

export function QuestionsCurationView({
  questionPort,
  knowledgeQueryPort,
}: QuestionsCurationViewProps) {
  const [items, setItems] = useState<readonly CurationQuestionModel[]>([]);
  const [knowledge, setKnowledge] = useState<readonly KnowledgeNodeModel[]>([]);
  const [selected, setSelected] = useState<CurationQuestionModel>();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [draftQuery, setDraftQuery] = useState("");
  const [alignment, setAlignment] = useState<QuestionAlignmentFilter>("all");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [knowledgeCandidate, setKnowledgeCandidate] = useState("");
  const [message, setMessage] = useState<string>();
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([
      questionPort.list({ search: query || undefined, alignment }),
      knowledgeQueryPort.list({ kind: "global" }, {}),
    ]).then(([questions, knowledgeResult]) => {
      if (!active) return;
      setLoading(false);
      if (questions.status === "success") {
        setItems(questions.value.items);
        setSelected((current) =>
          current
            ? questions.value.items.find((item) => item.id === current.id) ?? current
            : undefined,
        );
      } else {
        setMessage(questions.message);
      }
      if (knowledgeResult.status === "success") {
        setKnowledge(knowledgeResult.value.items);
      }
    });
    return () => {
      active = false;
    };
  }, [alignment, knowledgeQueryPort, query, questionPort, reloadVersion]);

  useEffect(() => {
    if (!selected) return;
    setEditQuestion(selected.questionText);
    setEditAnswer(selected.answerText);
  }, [selected]);

  const search = (event: FormEvent) => {
    event.preventDefault();
    setQuery(draftQuery.trim());
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    const outcome = await questionPort.create({
      questionText: newQuestion,
      answerText: newAnswer,
    });
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setNewQuestion("");
      setNewAnswer("");
      setMessage("Question created.");
      setReloadVersion((value) => value + 1);
    } else {
      setMessage(outcome.message);
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    const outcome = await questionPort.update(selected.id, {
      questionText: editQuestion,
      answerText: editAnswer,
    });
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setMessage("Question saved.");
      setReloadVersion((value) => value + 1);
    } else {
      setMessage(outcome.message);
    }
  };

  const changeAlignment = async (knowledgeId: string, add: boolean) => {
    if (!selected || !knowledgeId) return;
    const outcome = add
      ? await questionPort.alignKnowledge(selected.id, knowledgeId)
      : await questionPort.unalignKnowledge(selected.id, knowledgeId);
    if (outcome.status === "success") {
      setSelected(outcome.value);
      setKnowledgeCandidate("");
      setMessage("Question Knowledge alignment updated.");
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
            Questions
          </Typography>
          <Stack component="form" direction="row" spacing={1} onSubmit={search}>
            <TextField
              label="Search questions"
              size="small"
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
            />
            <Button type="submit">Search</Button>
            <label>
              Alignment{" "}
              <select
                aria-label="Question alignment filter"
                value={alignment}
                onChange={(event) =>
                  setAlignment(event.target.value as QuestionAlignmentFilter)
                }
              >
                <option value="all">All</option>
                <option value="aligned">Aligned</option>
                <option value="unaligned">Unaligned</option>
              </select>
            </label>
          </Stack>
          {loading ? (
            <LoadingState label="Loading Questions" />
          ) : items.length === 0 ? (
            <StateNotice title="No Questions found" />
          ) : (
            <Stack component="ul" sx={{ listStyle: "none", p: 0 }}>
              {items.map((question) => (
                <li key={question.id}>
                  <Button onClick={() => setSelected(question)}>
                    {question.questionText}
                  </Button>
                </li>
              ))}
            </Stack>
          )}
          <Button component={Link} to="/curation/import?kind=questions">
            Import Questions
          </Button>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography component="h3" variant="h6">
            New Question
          </Typography>
          <Stack component="form" spacing={1} onSubmit={create}>
            <TextField
              label="Question text"
              multiline
              value={newQuestion}
              onChange={(event) => setNewQuestion(event.target.value)}
            />
            <TextField
              label="Direct answer"
              multiline
              value={newAnswer}
              onChange={(event) => setNewAnswer(event.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
              Create Question
            </Button>
          </Stack>
        </Paper>
      </Stack>

      {message ? <Alert severity="info">{message}</Alert> : null}

      {selected ? (
        <Paper component="section" aria-label="Question editor" variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography component="h3" variant="h6">
              Question editor
            </Typography>
            <Stack component="form" spacing={1} onSubmit={save}>
              <TextField
                label="Question text"
                multiline
                value={editQuestion}
                onChange={(event) => setEditQuestion(event.target.value)}
              />
              <TextField
                label="Direct answer"
                multiline
                value={editAnswer}
                onChange={(event) => setEditAnswer(event.target.value)}
              />
              <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
                Save Question
              </Button>
            </Stack>

            <Typography component="h4" variant="subtitle1">
              Knowledge alignments
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {selected.knowledgeIds.map((id) => (
                <Chip
                  key={id}
                  label={id}
                  onDelete={() => void changeAlignment(id, false)}
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1}>
              <label>
                Knowledge{" "}
                <select
                  aria-label="Question Knowledge candidate"
                  value={knowledgeCandidate}
                  onChange={(event) => setKnowledgeCandidate(event.target.value)}
                >
                  <option value="">Select</option>
                  {knowledge.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.title}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                onClick={() => void changeAlignment(knowledgeCandidate, true)}
                disabled={!knowledgeCandidate}
              >
                Align Knowledge
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  );
}
