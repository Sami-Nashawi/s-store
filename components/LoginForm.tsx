"use client";

import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

export default function LoginForm() {
  const [fileNo, setFileNo] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({fileNo: Number(fileNo), password, rememberMe }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Login successful");
        window.location.href = "/"; // redirect to dashboard
      } else {
        setMessage("❌ " + data.error);
      }
    } catch {
      setMessage("❌ Login failed");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <TextField
        fullWidth
        label="File No"
        value={fileNo}
        type="number"
        onChange={(e) => setFileNo(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
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
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
      {message && (
        <Typography mt={2} color={message.startsWith("✅") ? "green" : "error"}>
          {message}
        </Typography>
      )}
    </form>
  );
}
