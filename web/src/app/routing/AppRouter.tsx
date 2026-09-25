import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "../shell/AppShell";
import { FoundationView } from "../shell/FoundationView";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<FoundationView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
