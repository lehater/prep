import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import type { LearningStatisticsModel } from "../model/learningStatistics";
import type { LearningStatisticsPort } from "../ports/LearningStatisticsPort";

interface StatisticsViewProps {
  readonly targetId: string;
  readonly statisticsPort: LearningStatisticsPort;
}

type StatisticsState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly value: LearningStatisticsModel }
  | { readonly status: "problem"; readonly message: string };

export function StatisticsView({
  targetId,
  statisticsPort,
}: StatisticsViewProps) {
  const [state, setState] = useState<StatisticsState>({ status: "loading" });
  const [reloadVersion, setReloadVersion] = useState(0);
  const [syncMessage, setSyncMessage] = useState<string>();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    void statisticsPort.get(targetId).then((outcome) => {
      if (!active) {
        return;
      }
      if (outcome.status === "success") {
        setState({ status: "ready", value: outcome.value });
      } else {
        setState({ status: "problem", message: outcome.message });
      }
    });
    return () => {
      active = false;
    };
  }, [reloadVersion, statisticsPort, targetId]);

  const sync = async () => {
    setSyncing(true);
    const outcome = await statisticsPort.sync();
    setSyncing(false);
    if (outcome.status === "success") {
      setSyncMessage(
        `Review sync completed: ${outcome.value.imported} imported, ${outcome.value.rejected} rejected.`,
      );
      setReloadVersion((value) => value + 1);
    } else {
      setSyncMessage(outcome.message);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Typography component="h3" variant="h6">
          Review statistics
        </Typography>
        <Button onClick={() => void sync()} disabled={syncing}>
          Sync reviews from Anki
        </Button>
      </Stack>
      {syncMessage ? <Typography role="status">{syncMessage}</Typography> : null}

      {state.status === "loading" ? (
        <LoadingState label="Loading review statistics" />
      ) : state.status === "problem" ? (
        <StateNotice
          title="Review statistics unavailable"
          message={state.message}
          severity="warning"
          retryLabel="Retry"
          onRetry={() => setReloadVersion((value) => value + 1)}
        />
      ) : (
        <>
          <Stack
            component="section"
            aria-label="Review aggregates"
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
          >
            {[
              ["Total", state.value.aggregates.total],
              ["Again", state.value.aggregates.again],
              ["Hard", state.value.aggregates.hard],
              ["Good", state.value.aggregates.good],
              ["Easy", state.value.aggregates.easy],
            ].map(([label, value]) => (
              <Paper key={String(label)} variant="outlined" sx={{ p: 2, minWidth: 100 }}>
                <Typography color="text.secondary">{label}</Typography>
                <Typography variant="h6">{value}</Typography>
              </Paper>
            ))}
          </Stack>

          <section aria-labelledby="review-history-heading">
            <Typography id="review-history-heading" component="h4" variant="subtitle1">
              Review history
            </Typography>
            {state.value.observations.length === 0 ? (
              <StateNotice title="No review observations recorded" />
            ) : (
              <Stack component="ul" spacing={1}>
                {state.value.observations.map((observation) => (
                  <li key={observation.id}>
                    <Typography>
                      {observation.questionId} · {observation.occurredAt} ·{" "}
                      {observation.rating} · {observation.previousInterval} →{" "}
                      {observation.nextInterval} · {observation.duration} ·{" "}
                      {observation.reviewPhase}
                    </Typography>
                  </li>
                ))}
              </Stack>
            )}
          </section>
        </>
      )}
    </Stack>
  );
}
