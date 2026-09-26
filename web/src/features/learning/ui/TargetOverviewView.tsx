import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import type { KnowledgeQueryPort } from "../../knowledge-explorer/ports/KnowledgeQueryPort";
import type { LearningStatisticsModel } from "../model/learningStatistics";
import type { LearningTargetModel } from "../model/learningTarget";
import type { QuestionCollection, QuestionQueryPort } from "../ports/QuestionQueryPort";
import type { LearningStatisticsPort } from "../ports/LearningStatisticsPort";

interface TargetOverviewViewProps {
  readonly target: LearningTargetModel;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly questionQueryPort: QuestionQueryPort;
  readonly statisticsPort: LearningStatisticsPort;
}

type OverviewMaterialState =
  | { readonly status: "loading" }
  | {
      readonly status: "ready";
      readonly knowledgeCount: number;
      readonly questions: QuestionCollection;
      readonly statistics: LearningStatisticsModel;
    }
  | { readonly status: "problem"; readonly message: string };

export function TargetOverviewView({
  target,
  knowledgeQueryPort,
  questionQueryPort,
  statisticsPort,
}: TargetOverviewViewProps) {
  const [state, setState] = useState<OverviewMaterialState>({ status: "loading" });
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    void Promise.all([
      knowledgeQueryPort.list(
        { kind: "target", targetId: target.id },
        {},
      ),
      questionQueryPort.list(target.id, {}),
      statisticsPort.get(target.id),
    ]).then(([knowledge, questions, statistics]) => {
      if (!active) {
        return;
      }
      if (
        knowledge.status === "success" &&
        questions.status === "success" &&
        statistics.status === "success"
      ) {
        setState({
          status: "ready",
          knowledgeCount: knowledge.value.totalCount,
          questions: questions.value,
          statistics: statistics.value,
        });
        return;
      }
      const problem = [knowledge, questions, statistics].find(
        (outcome) => outcome.status !== "success",
      );
      setState({
        status: "problem",
        message:
          problem && "message" in problem
            ? problem.message
            : "Target material summary could not be loaded.",
      });
    });
    return () => {
      active = false;
    };
  }, [
    knowledgeQueryPort,
    questionQueryPort,
    reloadVersion,
    statisticsPort,
    target.id,
  ]);

  return (
    <Stack spacing={3}>
      <section aria-labelledby="target-scope-heading">
        <Typography id="target-scope-heading" component="h3" variant="h6">
          Scope
        </Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 2 }}>
          {target.scopeItems.map((item) => (
            <li key={item.id}>
              <Typography component="strong">{item.title}</Typography>
              <Typography color="text.secondary">
                {item.kind === "requirement-set" ? "Requirement Set" : "Requirement"} ·{" "}
                {item.summary}
              </Typography>
            </li>
          ))}
        </Stack>
      </section>

      <section aria-labelledby="available-material-heading">
        <Typography id="available-material-heading" component="h3" variant="h6">
          Available material
        </Typography>
        {state.status === "loading" ? (
          <LoadingState label="Loading target material summary" />
        ) : state.status === "problem" ? (
          <StateNotice
            title="Target material summary unavailable"
            message={state.message}
            severity="warning"
            retryLabel="Retry"
            onRetry={() => setReloadVersion((value) => value + 1)}
          />
        ) : (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, minWidth: 150 }}>
              <Typography color="text.secondary">Knowledge</Typography>
              <Typography variant="h5">{state.knowledgeCount}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, minWidth: 150 }}>
              <Typography color="text.secondary">Questions</Typography>
              <Typography variant="h5">{state.questions.totalCount}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, minWidth: 150 }}>
              <Typography color="text.secondary">Study Set</Typography>
              <Typography variant="h6">
                {state.questions.totalCount > 0 ? "Available" : "Empty"}
              </Typography>
            </Paper>
          </Stack>
        )}
      </section>

      <section aria-labelledby="review-facts-heading">
        <Typography id="review-facts-heading" component="h3" variant="h6">
          Recent review facts
        </Typography>
        {state.status === "ready" ? (
          <Typography>
            {state.statistics.aggregates.total} recorded reviews ·{" "}
            {state.statistics.aggregates.again} Again ·{" "}
            {state.statistics.aggregates.hard} Hard ·{" "}
            {state.statistics.aggregates.good} Good ·{" "}
            {state.statistics.aggregates.easy} Easy
          </Typography>
        ) : (
          <Typography color="text.secondary">
            Review facts will appear when the material summary is available.
          </Typography>
        )}
      </section>
    </Stack>
  );
}
