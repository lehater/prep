import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import type { LearningTargetModel } from "../model/learningTarget";
import type { PreparationNeedModel, PreparationRequestResultModel } from "../model/preparationSupport";
import type { PreparationSupportPort } from "../ports/PreparationSupportPort";
import type { TargetQueryPort } from "../ports/TargetQueryPort";
import { targetSectionPath } from "./learningRoutes";

interface TargetSelectionViewProps {
  readonly targetQueryPort: TargetQueryPort;
  readonly preparationSupportPort: PreparationSupportPort;
}

type TargetListState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly items: readonly LearningTargetModel[] }
  | { readonly status: "unavailable"; readonly message: string }
  | { readonly status: "failure"; readonly message: string };

export function TargetSelectionView({
  targetQueryPort,
  preparationSupportPort,
}: TargetSelectionViewProps) {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const scenario = searchParams.get("scenario");
  const [query, setQuery] = useState(initialSearch);
  const [draft, setDraft] = useState(initialSearch);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [state, setState] = useState<TargetListState>({ status: "loading" });
  const [preparationNeed, setPreparationNeed] = useState<PreparationNeedModel>();
  const [preparationResult, setPreparationResult] = useState<PreparationRequestResultModel>();
  const [preparationProblem, setPreparationProblem] = useState<string>();
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    setPreparationNeed(undefined);
    setPreparationResult(undefined);
    setPreparationProblem(undefined);
    void targetQueryPort.list({ search: query || undefined }).then((outcome) => {
      if (!active) return;
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

  useEffect(() => {
    if (state.status !== "ready" || state.items.length > 0) return;
    let active = true;
    const targetContext = query || "new learning target";
    void preparationSupportPort
      .getOptions({ targetContext })
      .then((outcome) => {
        if (!active) return;
        if (outcome.status === "success") setPreparationNeed(outcome.value);
        else setPreparationProblem(outcome.message);
      });
    return () => {
      active = false;
    };
  }, [preparationSupportPort, query, state]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setQuery(draft.trim());
  };

  const requestPreparation = async () => {
    setRequesting(true);
    setPreparationProblem(undefined);
    const outcome = await preparationSupportPort.request({
      targetContext: query || "new learning target",
      fulfillmentPreference: "delegated",
    });
    setRequesting(false);
    if (outcome.status === "success") setPreparationResult(outcome.value);
    else setPreparationProblem(outcome.message);
  };

  const selfCurationPath = () => {
    const params = new URLSearchParams();
    const returnParams = new URLSearchParams();
    if (query) returnParams.set("search", query);
    if (scenario) returnParams.set("scenario", scenario);
    params.set(
      "returnTo",
      "/learning" + (returnParams.toString() ? "?" + returnParams.toString() : ""),
    );
    if (query) params.set("intent", query);
    return "/curation/capabilities?" + params.toString();
  };

  return (
    <Stack spacing={3}>
      <header>
        <Typography component="p" color="text.secondary">
          Learning
        </Typography>
        <Typography component="h2" variant="h5">
          Choose a target
        </Typography>
        <Typography color="text.secondary">
          Choose the role, vacancy or other outcome you want to work toward. Target requirements stay read-only here.
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
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1.25}>
            <Typography component="h3" variant="h6">Preparation is missing</Typography>
            <Typography color="text.secondary">
              Prep does not yet have a reviewable target and support for this goal. You can ask Prep to prepare it without dealing with import schemas or corpus repair.
            </Typography>
            {query ? <Typography variant="body2">Target/search context: {query}</Typography> : null}

            {preparationNeed ? (
              <Stack component="ul" spacing={0.5} sx={{ pl: 2 }}>
                {preparationNeed.missing.map((item) => <li key={item}>{item}</li>)}
              </Stack>
            ) : preparationProblem ? (
              <StateNotice title="Preparation options unavailable" message={preparationProblem} severity="warning" />
            ) : (
              <LoadingState label="Checking preparation options" />
            )}

            {preparationResult?.preparedTarget ? (
              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <Stack spacing={0.75}>
                  <Typography component="h4" sx={{ fontWeight: 700 }}>Prepared target ready for review</Typography>
                  <Typography>{preparationResult.preparedTarget.name}</Typography>
                  <Typography color="text.secondary">{preparationResult.preparedTarget.definition}</Typography>
                  <Button
                    component={Link}
                    to={targetSectionPath(preparationResult.preparedTarget.id, "overview")}
                    variant="contained"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Review prepared target
                  </Button>
                </Stack>
              </Paper>
            ) : (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  onClick={requestPreparation}
                  disabled={requesting || !preparationNeed}
                  variant="contained"
                >
                  {requesting ? "Requesting preparation…" : "Ask Prep to prepare it"}
                </Button>
                <Button component={Link} to={selfCurationPath()} variant="outlined">
                  Self-curate instead
                </Button>
              </Stack>
            )}
          </Stack>
        </Paper>
      ) : (
        <Stack spacing={2} aria-label="Learning targets">
          {state.items.map((target) => (
            <Paper key={target.id} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography component="h3" variant="h6">{target.name}</Typography>
                <Typography>{target.definition}</Typography>
                <Typography color="text.secondary">{target.scopeSummary}</Typography>
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
