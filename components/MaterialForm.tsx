"use client";

import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QRScanner from "@/components/QrScanner";

export default function MaterialForm() {
  const [materialId, setMaterialId] = useState("");
  const [type, setType] = useState("RECEIVE");
  const [quantity, setQuantity] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "manager-user-id",
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
    <Box>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "row", gap: "1.5rem", flexWrap: "wrap" }}
      >
        <TextField
          label="Material ID (scan or enter)"
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          required
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setScannerOpen(true)}>
                  <QrCodeScannerIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
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

        {message && (
          <Typography mt={3} color={message.startsWith("✅") ? "green" : "error"}>
            {message}
          </Typography>
        )}
      </form>

      {/* Fullscreen Scanner Overlay */}
      {scannerOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            flexDirection: "column",
          }}
        >
          <QRScanner
            onScan={(id) => {
              setMaterialId(id);
              setScannerOpen(false);
            }}
          />
          <Button
            onClick={() => setScannerOpen(false)}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
}
