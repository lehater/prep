import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { appTheme } from "../../ui/theme/appTheme";
import { appConfig } from "../config/appConfig";
import { createFrontendPorts } from "./createFrontendPorts";
import { AppRouter } from "../routing/AppRouter";

const ports = createFrontendPorts(appConfig);

export function FrontendApp() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppRouter {...ports} />
    </ThemeProvider>
  );
}
