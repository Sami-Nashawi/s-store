"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { registerGlobalSnackbar } from "@/utils/globalSnackbar";

type SnackbarType = "success" | "error" | "info" | "warning";

const SnackbarContext = createContext({ showSnackbar: (_: string) => {} });

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackbarType>("info");

  const showSnackbar = (msg: string, sev: SnackbarType = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  useEffect(() => {
    registerGlobalSnackbar(showSnackbar);
  }, []);

  return (
    <>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert variant="filled" severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
