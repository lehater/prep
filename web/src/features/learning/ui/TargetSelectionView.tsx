import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import type { LearningTargetModel } from "../model/learningTarget";
import type { TargetQueryPort } from "../ports/TargetQueryPort";
import { targetSectionPath } from "./learningRoutes";

interface TargetSelectionViewProps {
  readonly targetQueryPort: TargetQueryPort;
}

type TargetListState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly items: readonly LearningTargetModel[] }
  | { readonly status: "unavailable"; readonly message: string }
  | { readonly status: "failure"; readonly message: string };

export function TargetSelectionView({
  targetQueryPort,
}: TargetSelectionViewProps) {
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);
  const [state, setState] = useState<TargetListState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    void targetQueryPort.list({ search: query || undefined }).then((outcome) => {
      if (!active) {
        return;
      }
      if (outcome.status === "success") {
        setState({ status: "ready", items: outcome.value.items });
      } else if (outcome.status === "unavailable" || outcome.status === "failure") {
        setState(outcome);
      } else {
        setState({ status: "ready", items: [] });
      }
    });
    return () => {
      active = false;
    };
  }, [query, reloadVersion, targetQueryPort]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setQuery(draft.trim());
  };

  return (
    <Stack spacing={3}>
      <header>
        <Typography component="p" color="text.secondary">
          Learning
        </Typography>
        <Typography component="h2" variant="h5">
          Choose a learning target
        </Typography>
        <Typography color="text.secondary">
          Select an existing curated LearningTarget. Target composition is read-only in Learning.
        </Typography>
      </header>

      <Stack component="form" direction="row" spacing={1} onSubmit={submit}>
        <TextField
          label="Search targets"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
      </Stack>

      {state.status === "loading" ? (
        <LoadingState label="Loading learning targets" />
      ) : state.status === "unavailable" ? (
        <StateNotice
          title="Learning targets unavailable"
          message={state.message}
          severity="warning"
          retryLabel="Retry"
          onRetry={() => setReloadVersion((value) => value + 1)}
        />
      ) : state.status === "failure" ? (
        <StateNotice
          title="Learning targets could not be loaded"
          message={state.message}
          severity="error"
          retryLabel="Retry"
          onRetry={() => setReloadVersion((value) => value + 1)}
        />
      ) : state.items.length === 0 ? (
        <StateNotice
          title="No learning targets found"
          message="Change the target search."
        />
      ) : (
        <Stack spacing={2} aria-label="Learning targets">
          {state.items.map((target) => (
            <Paper key={target.id} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography component="h3" variant="h6">
                  {target.name}
                </Typography>
                <Typography>{target.definition}</Typography>
                <Typography color="text.secondary">
                  {target.scopeSummary}
                </Typography>
                <Button
                  component={Link}
                  to={targetSectionPath(target.id, "overview")}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Open target
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
