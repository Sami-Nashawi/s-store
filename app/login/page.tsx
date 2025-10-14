import { Box, Paper, Typography } from "@mui/material";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="grey.100"
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          🔐 Login
        </Typography>
        <LoginForm />
      </Paper>
    </Box>
  );
}
