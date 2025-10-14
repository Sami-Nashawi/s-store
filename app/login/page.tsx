import { Box, Paper, Typography } from "@mui/material";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={3}>
          🔑 Login
        </Typography>
        {/* Client component */}
        <LoginForm />
      </Paper>
    </Box>
  );
}
