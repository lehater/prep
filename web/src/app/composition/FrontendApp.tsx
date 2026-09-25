import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { Rfg3dGraphRenderer } from "../../adapters/graph-rfg3d/Rfg3dGraphRenderer";
import {
  MockCurationKnowledgeAdapter,
  MockCurationQuestionAdapter,
  MockCurationTargetAdapter,
  MockImportAdapter,
  MockRequirementAdapter,
} from "../../adapters/mock/MockCurationAdapters";
import { createMockCurationStore } from "../../adapters/mock/MockCurationStore";
import { MockKnowledgeAdapter } from "../../adapters/mock/MockKnowledgeAdapter";
import { MockLearningStatisticsAdapter } from "../../adapters/mock/MockLearningStatisticsAdapter";
import { MockQuestionAdapter } from "../../adapters/mock/MockQuestionAdapter";
import { MockStudyAdapter } from "../../adapters/mock/MockStudyAdapter";
import { MockTargetAdapter } from "../../adapters/mock/MockTargetAdapter";
import { appTheme } from "../../ui/theme/appTheme";
import { AppRouter } from "../routing/AppRouter";

const store = createMockCurationStore();

const knowledgeQueryPort = new MockKnowledgeAdapter("success", store);
const targetQueryPort = new MockTargetAdapter("success", store);
const questionQueryPort = new MockQuestionAdapter("success", store);
const studyPort = new MockStudyAdapter("success", "success", store);
const statisticsPort = new MockLearningStatisticsAdapter();

const curationTargetPort = new MockCurationTargetAdapter(store);
const curationKnowledgePort = new MockCurationKnowledgeAdapter(store);
const curationRequirementPort = new MockRequirementAdapter(store);
const curationQuestionPort = new MockCurationQuestionAdapter(store);
const curationImportPort = new MockImportAdapter(
  store,
  curationTargetPort,
  curationKnowledgePort,
  curationRequirementPort,
  curationQuestionPort,
);

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
        curationTargetPort={curationTargetPort}
        curationKnowledgePort={curationKnowledgePort}
        curationRequirementPort={curationRequirementPort}
        curationQuestionPort={curationQuestionPort}
        curationImportPort={curationImportPort}
        Renderer={Rfg3dGraphRenderer}
      />
    </ThemeProvider>
  );
}
