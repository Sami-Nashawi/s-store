"use client";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Navbar from "@/components/Navbar";
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
       <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "grey.50",
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Toolbar /> {/* Push content below Navbar */}
        {children}
      </Box>
    </Box>
      </body>
    </html>
  );
}
