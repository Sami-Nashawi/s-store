"use client";

let enqueueSnackbar:
  | ((
      message: string,
      severity: "success" | "error" | "info" | "warning"
    ) => void)
  | null = null;

export function registerGlobalSnackbar(fn: typeof enqueueSnackbar) {
  enqueueSnackbar = fn;
}

export function showGlobalSnackbar(
  message: string,
  severity: "success" | "error" | "info" | "warning" = "info"
) {
  if (enqueueSnackbar) enqueueSnackbar(message, severity);
}
