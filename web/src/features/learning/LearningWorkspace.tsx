import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { LoadingState, StateNotice } from "../../ui/patterns/ViewState";
import { KnowledgeExplorer } from "../knowledge-explorer/ui/KnowledgeExplorer";
import type { KnowledgeQueryPort } from "../knowledge-explorer/ports/KnowledgeQueryPort";
import type { GraphRenderer } from "../knowledge-explorer/ports/GraphRenderer";
import type { LearningTargetModel } from "./model/learningTarget";
import type { LearningStatisticsPort } from "./ports/LearningStatisticsPort";
import type { QuestionQueryPort } from "./ports/QuestionQueryPort";
import type { StudyPort } from "./ports/StudyPort";
import type { TargetQueryPort } from "./ports/TargetQueryPort";
import { StatisticsView } from "./ui/StatisticsView";
import { StudyView } from "./ui/StudyView";
import { TargetOverviewView } from "./ui/TargetOverviewView";
import { targetSectionPath } from "./ui/learningRoutes";

export type LearningSection = "overview" | "knowledge" | "study" | "statistics";

interface LearningWorkspaceProps {
  readonly targetId: string;
  readonly section: LearningSection;
  readonly targetQueryPort: TargetQueryPort;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly questionQueryPort: QuestionQueryPort;
  readonly studyPort: StudyPort;
  readonly statisticsPort: LearningStatisticsPort;
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
  knowledgeQueryPort,
  questionQueryPort,
  studyPort,
  statisticsPort,
  Renderer,
}: LearningWorkspaceProps) {
  const [targetState, setTargetState] = useState<TargetState>({
    status: "loading",
  });
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setTargetState({ status: "loading" });
    void targetQueryPort.get(targetId).then((outcome) => {
      if (!active) {
        return;
      }
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

  if (targetState.status === "loading") {
    return <LoadingState label="Loading Learning target" />;
  }

  if (targetState.status === "not_found") {
    return (
      <StateNotice
        title="Learning target not found"
        message={targetState.message}
        severity="warning"
      />
    );
  }

  if (targetState.status === "problem") {
    return (
      <StateNotice
        title="Learning target unavailable"
        message={targetState.message}
        severity="warning"
        retryLabel="Retry"
        onRetry={() => setReloadVersion((value) => value + 1)}
      />
    );
  }

  const target = targetState.target;

  return (
    <Stack spacing={3}>
      <header>
        <Typography component="p" color="text.secondary">
          Learning / {target.name}
        </Typography>
        <Typography component="h2" variant="h5">
          {target.name}
        </Typography>
        <Typography>{target.definition}</Typography>
      </header>

      <Stack
        component="nav"
        aria-label="Learning target sections"
        direction="row"
        spacing={1}
        sx={{ flexWrap: "wrap" }}
      >
        {(["overview", "knowledge", "study", "statistics"] as const).map(
          (item) => (
            <Button
              key={item}
              component={Link}
              to={targetSectionPath(targetId, item)}
              variant={item === section ? "contained" : "text"}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </Button>
          ),
        )}
        <Button component={Link} to="/learning">
          Choose another target
        </Button>
      </Stack>

      {section === "overview" ? (
        <TargetOverviewView
          target={target}
          knowledgeQueryPort={knowledgeQueryPort}
          questionQueryPort={questionQueryPort}
          statisticsPort={statisticsPort}
        />
      ) : section === "knowledge" ? (
        <KnowledgeExplorer
          scope={{ kind: "target", targetId }}
          queryPort={knowledgeQueryPort}
          Renderer={Renderer}
        />
      ) : section === "study" ? (
        <StudyView
          targetId={targetId}
          questionQueryPort={questionQueryPort}
          studyPort={studyPort}
        />
      ) : (
        <StatisticsView targetId={targetId} statisticsPort={statisticsPort} />
      )}
    </Stack>
  );
}
