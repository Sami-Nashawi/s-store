import { Box, Paper, Typography } from "@mui/material";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import logo from "@/public/logo-text.png";

export const metadata = {
  title: "Login",
  description: "Login page for logging the user into the system",
};

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            width: { xs: "100%", sm: 400, md: 420 },
            maxWidth: "420px",
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          {/* Logo + App Name */}
          <Box
            sx={{
              mb: { xs: 3, sm: 4 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={logo}
              alt="S Store Logo"
              priority
              style={{
                width: "100%",
                maxWidth: "220px",
                height: "auto",
              }}
            />
          </Box>

          <Typography
            variant="h5"
            mb={{ xs: 2, sm: 3 }}
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            🔑 Login
          </Typography>

          {/* Client form */}
          <LoginForm />

          <Typography
            variant="body2"
            color="text.secondary"
            mt={{ xs: 2, sm: 3 }}
            sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
          >
            Welcome back! Please login to continue.
          </Typography>
        </Paper>
      </Box>

      {/* Footer (No scroll, no overflow) */}
      <Box
        sx={{
          textAlign: "center",
          py: 2,
          opacity: 0.7,
          fontSize: "0.9rem",
        }}
      >
        © 2025 S Store – All Rights Reserved.
      </Box>
    </Box>
  );
}
