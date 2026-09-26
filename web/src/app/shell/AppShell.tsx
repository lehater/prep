import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link, Outlet, useLocation } from "react-router-dom";

import type { RuntimeStatusPort } from "./RuntimeStatusPort";
import { RuntimeStatusEntry } from "./RuntimeStatusEntry";

interface AppShellProps {
  readonly learningEntryPath: string;
  readonly runtimeStatusPort: RuntimeStatusPort;
}

const CURATION_SECTIONS = ["targets", "knowledge", "requirements", "questions"] as const;
const LEARNING_SECTIONS = ["overview", "knowledge", "study", "statistics"] as const;

function navLabel(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

export function AppShell({
  learningEntryPath,
  runtimeStatusPort,
}: AppShellProps) {
  const location = useLocation();
  const inCuration = location.pathname.startsWith("/curation");
  const inLearning = location.pathname.startsWith("/learning");
  const parts = location.pathname.split("/").filter(Boolean);
  const targetId = parts[0] === "learning" && parts.length >= 2 ? parts[1] : undefined;
  const activeCurationSection = inCuration ? parts[1] : undefined;
  const activeLearningSection = targetId ? parts[2] ?? "overview" : undefined;

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: { xs: "block", md: "grid" },
        gridTemplateColumns: { md: "216px minmax(0, 1fr)" },
        backgroundColor: "background.default",
      }}
    >
      <Box
        component="aside"
        sx={{
          position: { md: "sticky" },
          top: 0,
          height: { md: "100dvh" },
          borderRight: { md: 1 },
          borderBottom: { xs: 1, md: 0 },
          borderColor: "divider",
          backgroundColor: "background.paper",
          px: 1.5,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          zIndex: 10,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ px: 0.75 }}>
          Prep
        </Typography>

        <Stack
          component="nav"
          aria-label="Primary"
          direction={{ xs: "row", md: "column" }}
          spacing={0.25}
          sx={{ flexWrap: "wrap", alignItems: { md: "stretch" } }}
        >
          <Button
            component={Link}
            to={learningEntryPath}
            variant={inLearning ? "contained" : "text"}
            sx={{ justifyContent: "flex-start" }}
          >
            Learning
          </Button>
          <Button
            component={Link}
            to="/curation/knowledge"
            variant={inCuration ? "contained" : "text"}
            sx={{ justifyContent: "flex-start" }}
          >
            Curation
          </Button>
        </Stack>

        {inCuration ? (
          <>
            <Divider />
            <Stack component="nav" aria-label="Curation sections" spacing={0.25}>
              {CURATION_SECTIONS.map((section) => (
                <Button
                  key={section}
                  component={Link}
                  to={`/curation/${section}`}
                  variant={activeCurationSection === section ? "outlined" : "text"}
                  sx={{ justifyContent: "flex-start" }}
                >
                  {navLabel(section)}
                </Button>
              ))}
            </Stack>
          </>
        ) : null}

        {targetId ? (
          <>
            <Divider />
            <Stack component="nav" aria-label="Learning target sections" spacing={0.25}>
              {LEARNING_SECTIONS.map((section) => (
                <Button
                  key={section}
                  component={Link}
                  to={`/learning/${encodeURIComponent(targetId)}/${section}`}
                  variant={activeLearningSection === section ? "outlined" : "text"}
                  sx={{ justifyContent: "flex-start" }}
                >
                  {navLabel(section)}
                </Button>
              ))}
              <Button
                component={Link}
                to="/learning"
                sx={{ justifyContent: "flex-start" }}
              >
                Choose target
              </Button>
            </Stack>
          </>
        ) : null}

        <Box sx={{ mt: { md: "auto" } }}>
          <RuntimeStatusEntry port={runtimeStatusPort} />
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          minWidth: 0,
          px: { xs: 1.5, sm: 2, lg: 2.5 },
          py: { xs: 1.25, md: 1.5 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
