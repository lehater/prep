import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Outlet />
    </Container>
  );
}
