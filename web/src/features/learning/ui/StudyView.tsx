import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useReducer, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import type { QuestionModel } from "../model/question";
import type { QuestionQueryPort } from "../ports/QuestionQueryPort";
import type { StudyPort } from "../ports/StudyPort";
import { knowledgeFocusPath } from "./learningRoutes";
import { initialStudyFlowState, studyFlowReducer } from "./studyFlow";

interface StudyViewProps {
  readonly targetId: string;
  readonly questionQueryPort: QuestionQueryPort;
  readonly studyPort: StudyPort;
}

type QuestionState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly items: readonly QuestionModel[] }
  | { readonly status: "problem"; readonly message: string };

export function StudyView({
  targetId,
  questionQueryPort,
  studyPort,
}: StudyViewProps) {
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [questionState, setQuestionState] = useState<QuestionState>({
    status: "loading",
  });
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>();
  const [flow, dispatch] = useReducer(studyFlowReducer, initialStudyFlowState);

  useEffect(() => {
    let active = true;
    setQuestionState({ status: "loading" });
    void questionQueryPort
      .list(targetId, { search: query || undefined })
      .then((outcome) => {
        if (!active) {
          return;
        }
        if (outcome.status === "success") {
          setQuestionState({ status: "ready", items: outcome.value.items });
          setSelectedQuestionId((current) =>
            current && outcome.value.items.some((item) => item.id === current)
              ? current
              : outcome.value.items[0]?.id,
          );
        } else {
          setQuestionState({
            status: "problem",
            message: outcome.message,
          });
        }
      });
    return () => {
      active = false;
    };
  }, [query, questionQueryPort, targetId]);

  const selectedQuestion =
    questionState.status === "ready"
      ? questionState.items.find((question) => question.id === selectedQuestionId)
      : undefined;

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setQuery(draft.trim());
  };

  const build = async () => {
    dispatch({ type: "build-start" });
    const outcome = await studyPort.build(targetId);
    if (outcome.status === "success") {
      dispatch({ type: "build-success", preview: outcome.value });
    } else {
      dispatch({ type: "build-failure", message: outcome.message });
    }
  };

  const exportPreview = async () => {
    if (!flow.preview) {
      return;
    }
    dispatch({ type: "export-start" });
    dispatch({
      type: "export-result",
      outcome: await studyPort.export(targetId, flow.preview.materializationToken),
    });
  };

  return (
    <Stack spacing={3}>
      <Stack
        component="form"
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        onSubmit={submitSearch}
      >
        <TextField
          label="Search Questions"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
        <Button onClick={() => void build()} disabled={flow.buildStatus === "loading"}>
          {flow.preview ? "Rebuild Study Set" : "Build Study Set"}
        </Button>
      </Stack>

      {flow.buildStatus === "failure" ? (
        <StateNotice
          title="Study Set could not be built"
          message={flow.buildMessage}
          severity="error"
          retryLabel="Retry build"
          onRetry={() => void build()}
        />
      ) : null}

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Paper
          component="section"
          aria-label="Question list"
          variant="outlined"
          sx={{ p: 2, flex: 1 }}
        >
          <Typography component="h3" variant="h6">
            Questions
          </Typography>
          {questionState.status === "loading" ? (
            <LoadingState label="Loading Questions" />
          ) : questionState.status === "problem" ? (
            <StateNotice
              title="Questions unavailable"
              message={questionState.message}
              severity="warning"
            />
          ) : questionState.items.length === 0 ? (
            <StateNotice
              title="No Questions available"
              message="The current target has no Questions matching this search."
            />
          ) : (
            <Stack component="ul" sx={{ listStyle: "none", p: 0 }}>
              {questionState.items.map((question) => (
                <li key={question.id}>
                  <Button onClick={() => setSelectedQuestionId(question.id)}>
                    {question.questionText}
                  </Button>
                </li>
              ))}
            </Stack>
          )}
        </Paper>

        <Paper
          component="section"
          aria-label="Selected Question"
          variant="outlined"
          sx={{ p: 2, flex: 1 }}
        >
          <Typography component="h3" variant="h6">
            Selected Question
          </Typography>
          {selectedQuestion ? (
            <Stack spacing={2}>
              <Typography component="h4" variant="subtitle1">
                {selectedQuestion.questionText}
              </Typography>
              <Typography>{selectedQuestion.answerText}</Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                {selectedQuestion.knowledgeIds.map((knowledgeId) => (
                  <Chip key={knowledgeId} label={knowledgeId} size="small" />
                ))}
              </Stack>
              <Button
                component={Link}
                to={knowledgeFocusPath(targetId, selectedQuestion.knowledgeIds)}
                sx={{ alignSelf: "flex-start" }}
              >
                Show in Knowledge Map
              </Button>
            </Stack>
          ) : (
            <Typography color="text.secondary">Select a Question.</Typography>
          )}
        </Paper>
      </Stack>

      <Paper component="section" aria-label="Study Set preview" variant="outlined" sx={{ p: 2 }}>
        <Typography component="h3" variant="h6">
          Study Set preview
        </Typography>
        {flow.buildStatus === "loading" ? (
          <LoadingState label="Building Study Set" />
        ) : !flow.preview ? (
          <Typography color="text.secondary">
            Build the current resolvable Question set before export.
          </Typography>
        ) : flow.preview.questions.length === 0 ? (
          <StateNotice
            title="Study Set is empty"
            message="No currently resolvable Questions are available for this target."
          />
        ) : (
          <Stack spacing={2}>
            <Typography>
              {flow.preview.questions.length} Questions in the exact inspected preview.
            </Typography>
            <Stack component="ol">
              {flow.preview.questions.map((question) => (
                <li key={question.id}>{question.questionText}</li>
              ))}
            </Stack>
            <Button
              variant="contained"
              onClick={() => void exportPreview()}
              disabled={flow.exportStatus === "loading"}
              sx={{ alignSelf: "flex-start" }}
            >
              Export to Anki
            </Button>
          </Stack>
        )}
      </Paper>

      {flow.exportStatus === "loading" ? (
        <LoadingState label="Exporting Study Set" />
      ) : flow.exportOutcome?.status === "conflict" ? (
        <StateNotice
          title="Study Set changed"
          message={flow.exportOutcome.message}
          severity="warning"
          retryLabel="Rebuild Study Set"
          onRetry={() => void build()}
        />
      ) : flow.exportOutcome?.status === "unavailable" ||
        flow.exportOutcome?.status === "failure" ? (
        <StateNotice
          title={
            flow.exportOutcome.status === "unavailable"
              ? "External runtime unavailable"
              : "Study Set export failed"
          }
          message={flow.exportOutcome.message}
          severity={flow.exportOutcome.status === "unavailable" ? "warning" : "error"}
          retryLabel="Retry export"
          onRetry={() => void exportPreview()}
        />
      ) : flow.exportOutcome?.status === "success" ||
        flow.exportOutcome?.status === "partial" ? (
        <Alert severity={flow.exportOutcome.status === "partial" ? "warning" : "success"}>
          <Stack spacing={1}>
            <Typography component="strong">
              {flow.exportOutcome.status === "partial"
                ? "Study Set export partially completed"
                : "Study Set export completed"}
            </Typography>
            <Stack component="ul">
              {flow.exportOutcome.value.items.map((item) => (
                <li key={item.questionId}>
                  {item.questionId}: {item.status}
                  {item.message ? ` — ${item.message}` : ""}
                </li>
              ))}
            </Stack>
          </Stack>
        </Alert>
      ) : null}
    </Stack>
  );
}
