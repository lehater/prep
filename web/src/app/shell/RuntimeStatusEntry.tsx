import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";

import type {
  RuntimeStatusModel,
  RuntimeStatusPort,
} from "./RuntimeStatusPort";

interface RuntimeStatusEntryProps {
  readonly port: RuntimeStatusPort;
}

type RuntimeViewState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly value: RuntimeStatusModel }
  | { readonly status: "unavailable"; readonly message: string }
  | { readonly status: "failure"; readonly message: string };

export function RuntimeStatusEntry({ port }: RuntimeStatusEntryProps) {
  const [state, setState] = useState<RuntimeViewState>({ status: "loading" });
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    void port.get().then((outcome) => {
      if (!active) return;
      setState(
        outcome.status === "success"
          ? { status: "ready", value: outcome.value }
          : outcome,
      );
    });
    return () => {
      active = false;
    };
  }, [port, reloadVersion]);

  const label =
    state.status === "loading"
      ? "Anki: checking"
      : state.status === "ready"
        ? !state.value.reachable
          ? "Anki: unavailable"
          : state.value.compatible
            ? "Anki: reachable"
            : "Anki: incompatible"
        : "Anki: unavailable";

  const detail =
    state.status === "ready"
      ? [
          state.value.endpointSummary,
          state.value.profileSummary,
        ]
          .filter(Boolean)
          .join(" · ") || label
      : state.status === "loading"
        ? "Checking configured external runtime."
        : state.message;

  return (
    <Tooltip title={detail}>
      <Button
        size="small"
        onClick={() => setReloadVersion((value) => value + 1)}
        aria-label="Refresh Anki runtime status"
      >
        {label}
      </Button>
    </Tooltip>
  );
}
