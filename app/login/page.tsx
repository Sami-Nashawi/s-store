import { Box, Paper, Typography } from "@mui/material";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import logo from "@/public/logo-text.png";

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 380,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        {/* Logo + App Name */}
        <Box
          sx={{
            mb: 4,
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
              width: "220px",
              height: "auto",
            }}
          />
        </Box>

        <Typography variant="h5" mb={3} fontWeight="bold">
          🔑 Login
        </Typography>

        {/* Client component */}
        <LoginForm />

        <Typography variant="body2" color="text.secondary" mt={3}>
          Welcome back! Please login to continue.
        </Typography>
      </Paper>
    </Box>
  );
}
