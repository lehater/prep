import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";

import type {
  ImportDataKind,
  ImportResultModel,
} from "../model/curationModels";
import type { CurationImportPort } from "../ports/CurationPorts";

interface ImportCurationViewProps {
  readonly importPort: CurationImportPort;
}

const DATA_KINDS: readonly ImportDataKind[] = [
  "knowledge",
  "requirements",
  "questions",
  "targets",
];

export function ImportCurationView({ importPort }: ImportCurationViewProps) {
  const [params] = useSearchParams();
  const expectedKind = useMemo(
    () => DATA_KINDS.find((kind) => kind === params.get("kind")),
    [params],
  );
  const [documentText, setDocumentText] = useState("");
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState<string>();
  const [result, setResult] = useState<ImportResultModel>();
  const [applying, setApplying] = useState(false);

  const selectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setDocumentText(await file.text());
    setResult(undefined);
    setMessage(undefined);
  };

  const apply = async () => {
    setApplying(true);
    const outcome = await importPort.apply(documentText, expectedKind);
    setApplying(false);
    if (outcome.status === "success") {
      setResult(outcome.value);
      setMessage("Prepared-data import applied.");
    } else {
      setResult(undefined);
      setMessage(outcome.message);
    }
  };

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography component="h3" variant="h6">
            Prepared-data document
          </Typography>
          <Typography color="text.secondary">
            {expectedKind
              ? `Expected contextual data kind: ${expectedKind}.`
              : "Select a homogeneous prepared-data document."}
          </Typography>
          <Button component="label" variant="outlined" sx={{ alignSelf: "flex-start" }}>
            Select JSON document
            <input
              hidden
              type="file"
              accept="application/json,.json"
              aria-label="Prepared-data document"
              onChange={(event) => void selectFile(event)}
            />
          </Button>
          {fileName ? <Typography>Selected: {fileName}</Typography> : null}
          <Button
            variant="contained"
            onClick={() => void apply()}
            disabled={!documentText || applying}
            sx={{ alignSelf: "flex-start" }}
          >
            Apply import
          </Button>
        </Stack>
      </Paper>

      {message ? (
        <Alert severity={result && result.rejected > 0 ? "warning" : "info"}>
          {message}
        </Alert>
      ) : null}

      {result ? (
        <Paper component="section" aria-label="Import outcomes" variant="outlined" sx={{ p: 2 }}>
          <Typography component="h3" variant="h6">
            Import outcomes
          </Typography>
          <Typography>
            Total {result.total} · applied {result.applied} · rejected {result.rejected}
          </Typography>
          <Stack component="ul">
            {result.items.map((item, index) => (
              <li key={`${item.item}-${index}`}>
                {item.item}: {item.status}
                {item.reason ? ` — ${item.reason}` : ""}
              </li>
            ))}
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  );
}
