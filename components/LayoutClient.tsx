"use client";
import { useEffect } from "react"; // ✅ correct import from react

import { Box, CssBaseline, Toolbar } from "@mui/material";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { User } from "@prisma/client";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { setupFetchInterceptor } from "@/lib/setupFetchInterceptor";

export default function LayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  useEffect(() => {
    setupFetchInterceptor();
  }, []);

  return (
    <SnackbarProvider>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Navbar user={user} />
        <Sidebar user={user} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "grey.50",
            p: 3,
            minHeight: "100vh",
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </SnackbarProvider>
  );
}
// function setupFetchInterceptor() {
//   // placeholder implementation — replace with real fetch interceptor logic as needed
// }
