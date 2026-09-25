import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { LoadingState, StateNotice } from "../../ui/patterns/ViewState";
import { KnowledgeExplorer } from "../knowledge-explorer/ui/KnowledgeExplorer";
import type { KnowledgeQueryPort } from "../knowledge-explorer/ports/KnowledgeQueryPort";
import type { GraphRenderer } from "../knowledge-explorer/ports/GraphRenderer";
import type { LearningTargetModel } from "./model/learningTarget";
import type { TargetQueryPort } from "./ports/TargetQueryPort";

interface LearningWorkspaceProps {
  readonly targetId: string;
  readonly targetQueryPort: TargetQueryPort;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly Renderer: GraphRenderer;
}

type TargetState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly target: LearningTargetModel | null };

export function LearningWorkspace({
  targetId,
  targetQueryPort,
  knowledgeQueryPort,
  Renderer,
}: LearningWorkspaceProps) {
  const [targetState, setTargetState] = useState<TargetState>({
    status: "loading",
  });

  useEffect(() => {
    let active = true;
    setTargetState({ status: "loading" });
    void targetQueryPort.get(targetId).then((target) => {
      if (active) {
        setTargetState({ status: "ready", target });
      }
    });
    return () => {
      active = false;
    };
  }, [targetId, targetQueryPort]);

  if (targetState.status === "loading") {
    return <LoadingState label="Loading Learning target" />;
  }

  if (targetState.target === null) {
    return (
      <StateNotice
        title="Learning target not found"
        message="Choose an existing prepared LearningTarget."
        severity="warning"
      />
    );
  }

  return (
    <Stack spacing={2}>
      <header>
        <Typography component="p" color="text.secondary">
          Learning
        </Typography>
        <Typography component="h2" variant="h5">
          {targetState.target.name}
        </Typography>
        <Typography>{targetState.target.definition}</Typography>
        <Typography color="text.secondary">
          {targetState.target.scopeSummary}
        </Typography>
      </header>
      <Typography component="h3" variant="h6">
        Knowledge
      </Typography>
      <KnowledgeExplorer
        scope={{ kind: "target", targetId }}
        queryPort={knowledgeQueryPort}
        Renderer={Renderer}
      />
    </Stack>
  );
}
