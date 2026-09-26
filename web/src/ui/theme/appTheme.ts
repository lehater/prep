import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1280, xl: 1600 },
  },
  spacing: 6,
  palette: {
    primary: { main: "#2563eb" },
    background: { default: "#f7f8fa", paper: "#ffffff" },
    text: { primary: "#1f2937", secondary: "#667085" },
    divider: "#e4e7ec",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 13,
    h4: { fontSize: "1.375rem", lineHeight: 1.2, fontWeight: 650 },
    h5: { fontSize: "1.125rem", lineHeight: 1.25, fontWeight: 650 },
    h6: { fontSize: "0.9375rem", lineHeight: 1.3, fontWeight: 650 },
    subtitle1: { fontSize: "0.875rem", lineHeight: 1.35, fontWeight: 600 },
    subtitle2: { fontSize: "0.8125rem", lineHeight: 1.35, fontWeight: 600 },
    body1: { fontSize: "0.84375rem", lineHeight: 1.45 },
    body2: { fontSize: "0.78125rem", lineHeight: 1.4 },
    caption: { fontSize: "0.71875rem", lineHeight: 1.35 },
    overline: {
      fontSize: "0.6875rem",
      lineHeight: 1.3,
      fontWeight: 700,
      letterSpacing: "0.04em",
    },
    button: {
      fontSize: "0.78125rem",
      lineHeight: 1.2,
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { minWidth: 320 },
        body: { minWidth: 320 },
        "button, input, textarea, select": { font: "inherit" },
        select: {
          minHeight: 28,
          padding: "3px 24px 3px 7px",
          border: "1px solid #d0d5dd",
          borderRadius: 6,
          backgroundColor: "#fff",
          color: "#344054",
        },
      },
    },
    MuiButton: {
      defaultProps: { size: "small", disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 30,
          padding: "4px 9px",
          borderRadius: 6,
          whiteSpace: "nowrap",
        },
        sizeSmall: {
          minHeight: 28,
          padding: "3px 8px",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: "0.8125rem" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: { padding: "7px 9px" },
        root: { minHeight: 32, borderRadius: 6 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: "0.78125rem" },
      },
    },
    MuiChip: {
      defaultProps: { size: "small" },
      styleOverrides: {
        sizeSmall: { height: 20, fontSize: "0.6875rem" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: "#e4e7ec" },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: { fontSize: "0.78125rem" },
      },
    },
  },
});
