import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";

import type {
  ImportContractModel,
  ImportDataKind,
  ImportResultModel,
  ImportValidationModel,
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
  const [contract, setContract] = useState<ImportContractModel>();
  const [documentText, setDocumentText] = useState("");
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState<string>();
  const [validation, setValidation] = useState<ImportValidationModel>();
  const [result, setResult] = useState<ImportResultModel>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void importPort.contract().then((outcome) => {
      if (active && outcome.status === "success") setContract(outcome.value);
    });
    return () => {
      active = false;
    };
  }, [importPort]);

  const selectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setDocumentText(await file.text());
    setValidation(undefined);
    setResult(undefined);
    setMessage(undefined);
  };

  const validate = async () => {
    setBusy(true);
    const outcome = await importPort.validate(documentText, expectedKind);
    setBusy(false);
    if (outcome.status === "success") {
      setValidation(outcome.value);
      setResult(undefined);
      setMessage(
        outcome.value.rejected > 0
          ? "Validation completed with rejected items."
          : "Validation completed. Document is ready to apply.",
      );
    } else {
      setValidation(undefined);
      setResult(undefined);
      setMessage(outcome.message);
    }
  };

  const apply = async () => {
    setBusy(true);
    const outcome = await importPort.apply(documentText, expectedKind);
    setBusy(false);
    if (outcome.status === "success") {
      setResult(outcome.value);
      setMessage("Prepared-data import applied.");
    } else {
      setResult(undefined);
      setMessage(outcome.message);
    }
  };

  const canApply = Boolean(validation && validation.valid > 0);

  return (
    <Stack spacing={2.5}>
      <Paper component="section" aria-label="Import contract" variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography component="h3" variant="h6">Import contract</Typography>
          {contract ? (
            <>
              <Typography>Schema version: {contract.schemaVersion}</Typography>
              <Typography color="text.secondary">
                Supported kinds: {contract.supportedKinds.join(", ")}
              </Typography>
              <Typography component="pre" sx={{ whiteSpace: "pre-wrap", fontSize: "0.75rem", m: 0 }}>
                {contract.exampleDocument}
              </Typography>
            </>
          ) : (
            <Typography color="text.secondary">Loading contract and example…</Typography>
          )}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography component="h3" variant="h6">Prepared-data document</Typography>
          <Typography color="text.secondary">
            {expectedKind
              ? `Expected contextual data kind: ${expectedKind}.`
              : "Prepare a homogeneous structured document using the contract above."}
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
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => void validate()}
              disabled={!documentText || busy}
            >
              Validate import
            </Button>
            <Button
              variant="contained"
              onClick={() => void apply()}
              disabled={!canApply || busy}
            >
              Apply import
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {message ? (
        <Alert severity={result?.rejected || validation?.rejected ? "warning" : "info"}>
          {message}
        </Alert>
      ) : null}

      {validation ? (
        <Paper component="section" aria-label="Validation outcomes" variant="outlined" sx={{ p: 2 }}>
          <Typography component="h3" variant="h6">Validation outcomes</Typography>
          <Typography>
            Total {validation.total} · valid {validation.valid} · rejected {validation.rejected}
          </Typography>
          <Stack component="ul">
            {validation.items.map((item, index) => (
              <li key={`${item.item}-${index}`}>
                {item.item}: {item.status}
                {item.reason ? ` — ${item.reason}` : ""}
              </li>
            ))}
          </Stack>
        </Paper>
      ) : null}

      {result ? (
        <Paper component="section" aria-label="Import outcomes" variant="outlined" sx={{ p: 2 }}>
          <Typography component="h3" variant="h6">Import outcomes</Typography>
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
