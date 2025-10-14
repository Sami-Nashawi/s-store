"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [fileNo, setFileNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileNo, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      // Redirect to dashboard (or materials)
      router.push("/materials");
    } catch (err) {
      setError("Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="File Number"
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

        <Button type="submit" variant="contained" size="large" fullWidth>
          Login
        </Button>

        {error && (
          <Typography color="error" textAlign="center" mt={1}>
            {error}
          </Typography>
        )}
      </Box>
    </form>
  );
}
