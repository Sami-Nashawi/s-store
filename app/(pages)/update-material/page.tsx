"use client";
import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import QRScanner from "@/components/QrScanner";

export default function UpdateMaterialPage() {
  const [materialId, setMaterialId] = useState("");
  const [type, setType] = useState("RECEIVE");
  const [quantity, setQuantity] = useState<number>(0);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "manager-user-id", // fake user for now
      },
      body: JSON.stringify({ materialId, type, quantity: Number(quantity) }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`✅ ${type} OK → New Quantity: ${data.material.quantity}`);
      setQuantity(0);
      setMaterialId("");
    } else {
      setMessage(`❌ Error: ${data.error}`);
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        🔄 Update Material
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <TextField
            label="Material ID (scan or enter)"
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
            required
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Action</InputLabel>
            <Select
              value={type}
              label="Action"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="RECEIVE">📥 Receive</MenuItem>
              <MenuItem value="WITHDRAW">📤 Withdraw</MenuItem>
            </Select>
          </FormControl>

          <QRScanner onScan={(id) => setMaterialId(id)} />

          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            fullWidth
          />

          <Button type="submit" variant="contained" color="primary" size="large">
            Save
          </Button>
        </form>

        {message && (
          <Typography mt={3} color={message.startsWith("✅") ? "green" : "error"}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
