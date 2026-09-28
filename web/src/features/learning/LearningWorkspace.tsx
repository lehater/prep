import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { LoadingState, StateNotice } from "../../ui/patterns/ViewState";
import { KnowledgeExplorer } from "../knowledge-explorer/ui/KnowledgeExplorer";
import type { KnowledgeQueryPort } from "../knowledge-explorer/ports/KnowledgeQueryPort";
import type { GraphRenderer } from "../knowledge-explorer/ports/GraphRenderer";
import type { LearningTargetModel } from "./model/learningTarget";
import type { LearningFocusModel } from "./model/targetWork";
import type { TargetQueryPort } from "./ports/TargetQueryPort";
import type { TargetWorkPort } from "./ports/TargetWorkPort";
import {
  CurrentStateView,
  DiagnosticsView,
  GapsView,
  LearningFocusView,
  ProgressView,
} from "./ui/TargetWorkViews";
import { TargetOverviewView } from "./ui/TargetOverviewView";
import type { LearningSection } from "./ui/learningRoutes";

interface LearningWorkspaceProps {
  readonly targetId: string;
  readonly section: LearningSection;
  readonly targetQueryPort: TargetQueryPort;
  readonly targetWorkPort: TargetWorkPort;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly Renderer: GraphRenderer;
}

type TargetState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly target: LearningTargetModel }
  | { readonly status: "not_found"; readonly message: string }
  | { readonly status: "problem"; readonly message: string };

export function LearningWorkspace({
  targetId,
  section,
  targetQueryPort,
  targetWorkPort,
  knowledgeQueryPort,
  Renderer,
}: LearningWorkspaceProps) {
  const [targetState, setTargetState] = useState<TargetState>({ status: "loading" });
  const [focus, setFocus] = useState<LearningFocusModel | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setTargetState({ status: "loading" });
    void targetQueryPort.get(targetId).then((outcome) => {
      if (!active) return;
      if (outcome.status === "success") {
        setTargetState({ status: "ready", target: outcome.value });
      } else if (outcome.status === "not_found") {
        setTargetState(outcome);
      } else {
        setTargetState({ status: "problem", message: outcome.message });
      }
    });
    return () => {
      active = false;
    };
  }, [reloadVersion, targetId, targetQueryPort]);

  useEffect(() => {
    let active = true;
    void targetWorkPort.getFocus(targetId).then((outcome) => {
      if (active && outcome.status === "success") {
        setFocus(outcome.value);
      }
    });
    return () => {
      active = false;
    };
  }, [section, targetId, targetWorkPort]);

  if (targetState.status === "loading") {
    return <LoadingState label="Loading target" />;
  }
  if (targetState.status === "not_found") {
    return <StateNotice title="Target not found" message={targetState.message} severity="warning" />;
  }
  if (targetState.status === "problem") {
    return (
      <StateNotice
        title="Target unavailable"
        message={targetState.message}
        severity="warning"
        retryLabel="Retry"
        onRetry={() => setReloadVersion((value) => value + 1)}
      />
    );
  }

  const target = targetState.target;

  return (
    <Stack spacing={2.5}>
      <header>
        <Typography component="p" color="text.secondary">
          Target Work / {target.name}
        </Typography>
        <Typography component="h2" variant="h5">
          {target.name}
        </Typography>
        <Typography>{target.definition}</Typography>
        {focus ? (
          <Typography variant="body2" color="text.secondary">
            Current focus: {focus.title} · {focus.intentKind}
          </Typography>
        ) : null}
      </header>

      {section === "overview" ? (
        <TargetOverviewView target={target} knowledgeQueryPort={knowledgeQueryPort} />
      ) : section === "state" ? (
        <CurrentStateView targetId={targetId} targetWorkPort={targetWorkPort} />
      ) : section === "gaps" ? (
        <GapsView targetId={targetId} targetWorkPort={targetWorkPort} />
      ) : section === "learning" ? (
        <LearningFocusView targetId={targetId} targetWorkPort={targetWorkPort} />
      ) : section === "diagnostics" ? (
        <DiagnosticsView targetId={targetId} targetWorkPort={targetWorkPort} />
      ) : section === "knowledge" ? (
        <KnowledgeExplorer
          scope={{
            kind: "target",
            targetId,
            focusId: focus?.id,
          }}
          queryPort={knowledgeQueryPort}
          Renderer={Renderer}
        />
      ) : (
        <ProgressView targetId={targetId} targetWorkPort={targetWorkPort} />
      )}
    </Stack>
  );
}
