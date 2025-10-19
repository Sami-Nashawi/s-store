"use client";

import { Box, CssBaseline, Toolbar } from "@mui/material";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { User } from "@prisma/client";

export default function LayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  return (
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
  );
}
