"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";
import { apiClientFetch } from "@/lib/apiClientFetch";

export default function LoginForm() {
  const [fileNo, setFileNo] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiClientFetch("auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileNo, password, rememberMe }),
      });
      console.log("Login response data:", data);
      if (!data?.user?.id) {
        throw new Error(data.error || "Invalid file number or password");
      }

      // role comes from the backend token payload OR response
      const role = data.user.role?.name || data.user.role; // support both formats

      if (role === "FOREMAN") {
        window.location.href = "/update-material";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        textAlign: "left",
      }}
    >
      <TextField
        label="File Number"
        type="number"
        value={fileNo}
        onChange={(e) => setFileNo(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        }
        label="Remember me"
      />

      {error && (
        <Typography color="error" fontSize={14} sx={{ mt: -1 }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        sx={{
          py: 1.3,
          fontWeight: "bold",
          borderRadius: 2,
          mt: 1,
        }}
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color: "white" }} />
        ) : (
          "Login"
        )}
      </Button>
    </Box>
  );
}
