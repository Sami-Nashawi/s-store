"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

// Emotion cache (isolated for Next.js)
export default function MuiThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = React.useMemo(
    () => createCache({ key: "mui", prepend: true }),
    []
  );

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
