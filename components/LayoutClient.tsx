"use client";
import { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setupFetchInterceptor();
  }, []);

  // Auto-close sidebar on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <SnackbarProvider>
      <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <CssBaseline />
        <Navbar user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar
          user={user}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "grey.50",
            p: isMobile ? 1.5 : 3,
            minHeight: "100vh",
            width: "100%",
            overflowX: "hidden",
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </SnackbarProvider>
  );
}
