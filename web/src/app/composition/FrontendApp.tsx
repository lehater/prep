import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { MockKnowledgeAdapter } from "../../adapters/mock/MockKnowledgeAdapter";
import { PlaceholderGraphRenderer } from "../../adapters/mock/PlaceholderGraphRenderer";
import { MockTargetAdapter } from "../../adapters/mock/MockTargetAdapter";
import { PREPARED_TARGET_ID } from "../../adapters/mock/mockFixtures";
import { appTheme } from "../../ui/theme/appTheme";
import { AppRouter } from "../routing/AppRouter";

const knowledgeQueryPort = new MockKnowledgeAdapter();
const targetQueryPort = new MockTargetAdapter();

export function FrontendApp() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppRouter
        defaultTargetId={PREPARED_TARGET_ID}
        targetQueryPort={targetQueryPort}
        knowledgeQueryPort={knowledgeQueryPort}
        Renderer={PlaceholderGraphRenderer}
      />
    </ThemeProvider>
  );
}
