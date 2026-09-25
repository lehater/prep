import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link, Outlet, useLocation } from "react-router-dom";

interface AppShellProps {
  readonly learningEntryPath: string;
}

export function AppShell({ learningEntryPath }: AppShellProps) {
  const location = useLocation();
  const inCuration = location.pathname.startsWith("/curation");

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack component="header" spacing={2} sx={{ mb: 3 }}>
        <Typography component="h1" variant="h4">
          Prep
        </Typography>
        <Stack
          component="nav"
          aria-label="Primary"
          direction="row"
          spacing={1}
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
        </Stack>
      </Stack>
      <Container component="main" disableGutters maxWidth={false}>
        <Outlet />
      </Container>
    </Container>
  );
}
