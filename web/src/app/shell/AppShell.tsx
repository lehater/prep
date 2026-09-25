import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link, Outlet, useLocation } from "react-router-dom";

import type { RuntimeStatusPort } from "./RuntimeStatusPort";
import { RuntimeStatusEntry } from "./RuntimeStatusEntry";

interface AppShellProps {
  readonly learningEntryPath: string;
  readonly runtimeStatusPort: RuntimeStatusPort;
}

export function AppShell({
  learningEntryPath,
  runtimeStatusPort,
}: AppShellProps) {
  const location = useLocation();
  const inCuration = location.pathname.startsWith("/curation");

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100dvh",
        px: { xs: 2, sm: 3, lg: 4 },
        py: { xs: 1.5, md: 2 },
      }}
    >
      <Stack
        component="header"
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{
          mb: { xs: 2, md: 2.5 },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Typography component="h1" variant="h4">
          Prep
        </Typography>
        <Stack
          component="nav"
          aria-label="Primary"
          direction="row"
          spacing={1}
          sx={{ flexWrap: "wrap" }}
        >
          <Button
            component={Link}
            to={learningEntryPath}
            variant={inCuration ? "text" : "contained"}
          >
            Learning
          </Button>
          <Button
            component={Link}
            to="/curation/knowledge"
            variant={inCuration ? "contained" : "text"}
          >
            Curation
          </Button>
          <RuntimeStatusEntry port={runtimeStatusPort} />
        </Stack>
      </Stack>
      <Container component="main" disableGutters maxWidth={false}>
        <Outlet />
      </Container>
    </Container>
  );
}
