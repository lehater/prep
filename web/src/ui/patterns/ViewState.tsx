import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface StateNoticeProps {
  readonly title: string;
  readonly message?: string;
  readonly severity?: "info" | "warning" | "error";
  readonly retryLabel?: string;
  readonly onRetry?: () => void;
}

export function LoadingState({ label = "Loading" }: { readonly label?: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }} role="status">
      <CircularProgress size={20} />
      <Typography>{label}</Typography>
    </Stack>
  );
}

export function StateNotice({
  title,
  message,
  severity = "info",
  retryLabel,
  onRetry,
}: StateNoticeProps) {
  return (
    <Alert severity={severity}>
      <Stack spacing={1}>
        <Typography component="strong">{title}</Typography>
        {message ? <Typography>{message}</Typography> : null}
        {retryLabel && onRetry ? (
          <Button color="inherit" onClick={onRetry} size="small">
            {retryLabel}
          </Button>
        ) : null}
      </Stack>
    </Alert>
  );
}
