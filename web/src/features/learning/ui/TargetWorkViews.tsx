import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { LoadingState, StateNotice } from "../../../ui/patterns/ViewState";
import type {
  DiagnosticOpportunityModel,
  GapModel,
  LearningFocusModel,
  LearningSupportModel,
  ProgressComparisonModel,
  TargetStateModel,
  TargetRequirementState,
} from "../model/targetWork";
import type { TargetWorkPort } from "../ports/TargetWorkPort";
import { targetSectionPath } from "./learningRoutes";

interface TargetWorkViewProps {
  readonly targetId: string;
  readonly targetWorkPort: TargetWorkPort;
}

function stateLabel(state: TargetRequirementState) {
  return state === "satisfied"
    ? "Satisfied"
    : state === "challenged"
      ? "Challenged"
      : "Unresolved";
}

function stateColor(state: TargetRequirementState): "success" | "warning" | "default" {
  return state === "satisfied" ? "success" : state === "challenged" ? "warning" : "default";
}

export function CurrentStateView({ targetId, targetWorkPort }: TargetWorkViewProps) {
  const [state, setState] = useState<TargetStateModel | null>(null);

  useEffect(() => {
    let active = true;
    void targetWorkPort.getState(targetId).then((outcome) => {
      if (active && outcome.status === "success") setState(outcome.value);
    });
    return () => {
      active = false;
    };
  }, [targetId, targetWorkPort]);

  if (!state) return <LoadingState label="Loading current state" />;

  return (
    <Stack spacing={2}>
      <header>
        <Typography component="p" color="text.secondary">Target / Current state</Typography>
        <Typography component="h3" variant="h6">Where you are now</Typography>
        <Typography color="text.secondary">
          Evidence-backed state relative to this target. Missing evidence stays unresolved.
        </Typography>
      </header>
      <Stack spacing={1.25} aria-label="Target requirement state">
        {state.items.map((item) => (
          <Paper key={item.requirementId} variant="outlined" sx={{ p: 1.5 }}>
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography component="h4" fontWeight={700}>{item.title}</Typography>
                <Chip size="small" label={stateLabel(item.state)} color={stateColor(item.state)} />
              </Stack>
              <Typography>{item.summary}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.basis.length > 0
                  ? item.basis.map((basis) => basis.summary).join(" ")
                  : "No sufficient evidence currently establishes this requirement."}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Button component={Link} to={targetSectionPath(targetId, "gaps")} variant="contained" sx={{ alignSelf: "flex-start" }}>
        Review gaps
      </Button>
    </Stack>
  );
}

export function GapsView({ targetId, targetWorkPort }: TargetWorkViewProps) {
  const [gaps, setGaps] = useState<readonly GapModel[] | null>(null);
  const [focus, setFocus] = useState<LearningFocusModel | null>(null);

  const load = () => {
    void Promise.all([targetWorkPort.getGaps(targetId), targetWorkPort.getFocus(targetId)]).then(
      ([gapOutcome, focusOutcome]) => {
        if (gapOutcome.status === "success") setGaps(gapOutcome.value);
        if (focusOutcome.status === "success") setFocus(focusOutcome.value);
      },
    );
  };

  useEffect(load, [targetId, targetWorkPort]);

  if (!gaps) return <LoadingState label="Loading target gaps" />;

  const choose = (gap: GapModel, intentKind: "learning" | "diagnostic") => {
    void targetWorkPort
      .setFocus(targetId, { gapId: gap.id, intentKind })
      .then((outcome) => {
        if (outcome.status === "success") setFocus(outcome.value);
      });
  };

  return (
    <Stack spacing={2}>
      <header>
        <Typography component="p" color="text.secondary">Target / Gaps</Typography>
        <Typography component="h3" variant="h6">What remains between you and the target</Typography>
      </header>
      {focus ? (
        <StateNotice
          title="Current focus"
          message={`${focus.title} — ${focus.intentKind}: ${focus.rationale}`}
          severity="info"
        />
      ) : null}
      {gaps.length === 0 ? (
        <StateNotice title="No current gaps" message="Current accepted evidence establishes the target requirements represented by this prototype." severity="success" />
      ) : (
        <Stack spacing={1.25}>
          {gaps.map((gap) => (
            <Paper key={gap.id} variant="outlined" sx={{ p: 1.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography component="h4" fontWeight={700}>{gap.title}</Typography>
                  <Chip size="small" label={gap.kind === "challenged" ? "Challenged" : "Unresolved"} />
                  {gap.support === "missing" ? <Chip size="small" label="Support missing" color="warning" /> : null}
                </Stack>
                <Typography>{gap.summary}</Typography>
                <Typography variant="body2" color="text.secondary">{gap.basis}</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button size="small" variant="contained" onClick={() => choose(gap, "learning")}>Learn this</Button>
                  <Button size="small" variant="outlined" onClick={() => choose(gap, "diagnostic")}>Diagnose this</Button>
                  <Button size="small" component={Link} to={targetSectionPath(targetId, "knowledge")}>Knowledge</Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
      {focus ? (
        <Stack direction="row" spacing={1}>
          <Button component={Link} to={targetSectionPath(targetId, focus.intentKind === "diagnostic" ? "diagnostics" : "learning")}>
            Continue with focus
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}

export function LearningFocusView({ targetId, targetWorkPort }: TargetWorkViewProps) {
  const [focus, setFocus] = useState<LearningFocusModel | null | undefined>(undefined);
  const [support, setSupport] = useState<readonly LearningSupportModel[] | null>(null);

  useEffect(() => {
    let active = true;
    void targetWorkPort.getFocus(targetId).then(async (outcome) => {
      if (!active || outcome.status !== "success") return;
      setFocus(outcome.value);
      if (!outcome.value) {
        setSupport([]);
        return;
      }
      const supportOutcome = await targetWorkPort.listSupport(targetId, outcome.value.id);
      if (active && supportOutcome.status === "success") setSupport(supportOutcome.value);
    });
    return () => {
      active = false;
    };
  }, [targetId, targetWorkPort]);

  if (focus === undefined || support === null) return <LoadingState label="Loading learning focus" />;
  if (!focus) {
    return <StateNotice title="Choose a gap first" message="Select a target-relative gap before starting learning or practice." severity="info" retryLabel="Open gaps" onRetry={() => { window.location.href = targetSectionPath(targetId, "gaps"); }} />;
  }

  return (
    <Stack spacing={2}>
      <header>
        <Typography component="p" color="text.secondary">Target / Learning</Typography>
        <Typography component="h3" variant="h6">{focus.title}</Typography>
        <Typography color="text.secondary">{focus.rationale}</Typography>
      </header>
      {support.length === 0 ? (
        <StateNotice title="Learning support is missing" message="This gap remains valid, but the corpus does not yet contain usable learning support for it." severity="warning" />
      ) : (
        <Stack spacing={1.25} aria-label="Learning support">
          {support.map((item) => (
            <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
              <Typography component="h4" fontWeight={700}>{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">{item.kind}</Typography>
              <Typography>{item.summary}</Typography>
            </Paper>
          ))}
        </Stack>
      )}
      <Stack direction="row" spacing={1}>
        <Button component={Link} to={targetSectionPath(targetId, "knowledge")}>Explore Knowledge</Button>
        <Button component={Link} to={targetSectionPath(targetId, "diagnostics")} variant="outlined">Gather evidence</Button>
      </Stack>
    </Stack>
  );
}

export function DiagnosticsView({ targetId, targetWorkPort }: TargetWorkViewProps) {
  const [focus, setFocus] = useState<LearningFocusModel | null>(null);
  const [items, setItems] = useState<readonly DiagnosticOpportunityModel[] | null>(null);
  const [completed, setCompleted] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void targetWorkPort.getFocus(targetId).then(async (focusOutcome) => {
      if (!active || focusOutcome.status !== "success") return;
      setFocus(focusOutcome.value);
      const diagnosticOutcome = await targetWorkPort.listDiagnostics(
        targetId,
        focusOutcome.value?.gapId,
      );
      if (active && diagnosticOutcome.status === "success") setItems(diagnosticOutcome.value);
    });
    return () => {
      active = false;
    };
  }, [targetId, targetWorkPort]);

  if (!items) return <LoadingState label="Loading diagnostic opportunities" />;

  const complete = (item: DiagnosticOpportunityModel) => {
    void targetWorkPort.completeDiagnostic(targetId, item.id).then((outcome) => {
      if (outcome.status === "success") setCompleted(item.id);
    });
  };

  return (
    <Stack spacing={2}>
      <header>
        <Typography component="p" color="text.secondary">Target / Diagnostics</Typography>
        <Typography component="h3" variant="h6">Gather evidence</Typography>
        <Typography color="text.secondary">
          {focus ? `Current focus: ${focus.title}` : "Choose a diagnostic opportunity to reduce uncertainty."}
        </Typography>
      </header>
      {completed ? <StateNotice title="New evidence accepted" message="The target-relative state can now be reassessed." severity="success" /> : null}
      {items.length === 0 ? (
        <StateNotice title="No diagnostic opportunity prepared" message="Assessment support for this focus is not currently available." severity="warning" />
      ) : (
        <Stack spacing={1.25}>
          {items.map((item) => (
            <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
              <Stack spacing={1}>
                <Typography component="h4" fontWeight={700}>{item.title}</Typography>
                <Typography>{item.summary}</Typography>
                <Button size="small" variant="contained" onClick={() => complete(item)} sx={{ alignSelf: "flex-start" }}>
                  Complete mock diagnostic
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
      <Button component={Link} to={targetSectionPath(targetId, "progress")} sx={{ alignSelf: "flex-start" }}>
        Review progress
      </Button>
    </Stack>
  );
}

export function ProgressView({ targetId, targetWorkPort }: TargetWorkViewProps) {
  const [progress, setProgress] = useState<ProgressComparisonModel | null>(null);

  useEffect(() => {
    let active = true;
    void targetWorkPort.getProgress(targetId).then((outcome) => {
      if (active && outcome.status === "success") setProgress(outcome.value);
    });
    return () => {
      active = false;
    };
  }, [targetId, targetWorkPort]);

  if (!progress) return <LoadingState label="Loading progress" />;

  return (
    <Stack spacing={2}>
      <header>
        <Typography component="p" color="text.secondary">Target / Progress</Typography>
        <Typography component="h3" variant="h6">What changed</Typography>
        <Typography color="text.secondary">{progress.summary}</Typography>
      </header>
      {progress.changes.length === 0 ? (
        <StateNotice title="No established change yet" message="No-change is a valid result until new evidence changes target-relative state." severity="info" />
      ) : (
        <Stack spacing={1.25} aria-label="Progress changes">
          {progress.changes.map((change) => (
            <Paper key={change.requirementId} variant="outlined" sx={{ p: 1.5 }}>
              <Typography component="h4" fontWeight={700}>{change.title}</Typography>
              <Typography>{stateLabel(change.before)} → {stateLabel(change.after)}</Typography>
              <Typography variant="body2" color="text.secondary">{change.evidenceSummary}</Typography>
            </Paper>
          ))}
        </Stack>
      )}
      <Button component={Link} to={targetSectionPath(targetId, "gaps")} variant="contained" sx={{ alignSelf: "flex-start" }}>
        Revisit gaps
      </Button>
    </Stack>
  );
}
