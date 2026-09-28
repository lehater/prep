import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import type { KnowledgeQueryPort } from "../../knowledge-explorer/ports/KnowledgeQueryPort";
import type { LearningTargetModel } from "../model/learningTarget";

interface TargetOverviewViewProps {
  readonly target: LearningTargetModel;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
}

type OverviewState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly knowledgeCount: number }
  | { readonly status: "problem"; readonly message: string };

export function TargetOverviewView({
  target,
  knowledgeQueryPort,
}: TargetOverviewViewProps) {
  const [state, setState] = useState<OverviewState>({ status: "loading" });
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    void knowledgeQueryPort
      .list({ kind: "target", targetId: target.id }, {})
      .then((outcome) => {
        if (!active) return;
        if (outcome.status === "success") {
          setState({ status: "ready", knowledgeCount: outcome.value.totalCount });
        } else {
          setState({ status: "problem", message: outcome.message });
        }
      });
    return () => {
      active = false;
    };
  }, [knowledgeQueryPort, reloadVersion, target.id]);

  return (
    <Stack spacing={2.5}>
      <section aria-labelledby="target-scope-heading">
        <Typography id="target-scope-heading" component="h3" variant="h6">
          Target capabilities
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          {target.scopeSummary}
        </Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 2 }}>
          {target.capabilities.map((item) => (
            <li key={item.id}>
              <Typography component="strong">{item.title}</Typography>
              <Typography color="text.secondary">
                Capability requirement · {item.summary}
              </Typography>
            </li>
          ))}
        </Stack>
      </section>

      <section aria-labelledby="target-context-heading">
        <Typography id="target-context-heading" component="h3" variant="h6">
          Target context
        </Typography>
        {state.status === "loading" ? (
          <LoadingState label="Loading target context" />
        ) : state.status === "problem" ? (
          <StateNotice
            title="Target Knowledge unavailable"
            message={state.message}
            severity="warning"
            retryLabel="Retry"
            onRetry={() => setReloadVersion((value) => value + 1)}
          />
        ) : (
          <Paper variant="outlined" sx={{ p: 1.5, maxWidth: 320 }}>
            <Typography color="text.secondary">Relevant Knowledge</Typography>
            <Typography variant="h5">{state.knowledgeCount}</Typography>
          </Paper>
        )}
      </section>
    </Stack>
  );
}
