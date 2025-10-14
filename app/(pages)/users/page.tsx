"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";

export default function UsersPage() {
  const [fileNo, setFileNo] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("abcd@1234"); // default initial password
  const [role, setRole] = useState("WORKER");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileNo: Number(fileNo),
          name,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ User created: ${data.name} (${data.role})`);
        setFileNo("");
        setName("");
        setPassword("abcd@1234");
        setRole("WORKER");
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    }
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        👤 Add User
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 400 }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
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
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Default: abcd@1234"
            fullWidth
          />

          <TextField
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            fullWidth
          >
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="WORKER">Worker</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" color="primary">
            Add User
          </Button>
        </form>

        {message && (
          <Typography mt={2} color={message.startsWith("✅") ? "green" : "error"}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
