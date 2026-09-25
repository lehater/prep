import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { AppRouter } from "../routing/AppRouter";
import { appTheme } from "../../ui/theme/appTheme";

export function FrontendApp() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}
