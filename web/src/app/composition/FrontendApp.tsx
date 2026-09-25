import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { Rfg3dGraphRenderer } from "../../adapters/graph-rfg3d/Rfg3dGraphRenderer";
import { MockKnowledgeAdapter } from "../../adapters/mock/MockKnowledgeAdapter";
import { MockLearningStatisticsAdapter } from "../../adapters/mock/MockLearningStatisticsAdapter";
import { MockQuestionAdapter } from "../../adapters/mock/MockQuestionAdapter";
import { MockStudyAdapter } from "../../adapters/mock/MockStudyAdapter";
import { MockTargetAdapter } from "../../adapters/mock/MockTargetAdapter";
import { appTheme } from "../../ui/theme/appTheme";
import { AppRouter } from "../routing/AppRouter";

const knowledgeQueryPort = new MockKnowledgeAdapter();
const targetQueryPort = new MockTargetAdapter();
const questionQueryPort = new MockQuestionAdapter();
const studyPort = new MockStudyAdapter();
const statisticsPort = new MockLearningStatisticsAdapter();

export function FrontendApp() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppRouter
        targetQueryPort={targetQueryPort}
        knowledgeQueryPort={knowledgeQueryPort}
        questionQueryPort={questionQueryPort}
        studyPort={studyPort}
        statisticsPort={statisticsPort}
        Renderer={Rfg3dGraphRenderer}
      />
    </ThemeProvider>
  );
}
