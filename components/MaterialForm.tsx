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
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import QRScanner from "@/components/QrScanner";
import { apiClientFetch } from "@/lib/apiClientFetch";

export default function MaterialForm() {
  const [materialId, setMaterialId] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");
  const [type, setType] = useState("RECEIVE");
  const [quantity, setQuantity] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = materialId.trim() !== "" && quantity > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setMessage("");
    setLoading(true);

    const data = await apiClientFetch(`events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "manager-user-id",
      },
      body: JSON.stringify({
        materialId,
        type,
        quantity: Number(quantity),
      }),
    });

    if (data?.error) {
      setMessage(`❌ ${data.error}`);
    } else if (data?.id) {
      setMessage("✅ Material updated successfully");
      setQuantity(0);
      setMaterialId("");
      setMaterialDescription("");
    }

    setLoading(false);
  }

  return (
    <Box>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* Material ID */}
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

        {/* ✅ Improved Material Description Card */}
        {materialDescription && (
          <Card
            elevation={1}
            sx={{
              width: "100%",
              borderRadius: 2,
              border: "1px solid #dce3f1",
              backgroundColor: "#f9fbff",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#2a3b55", fontWeight: 600 }}
                >
                  Material Description
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#495670",
                    mt: 0.3,
                    wordWrap: "break-word",
                  }}
                >
                  {materialDescription}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Action */}
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

        {/* Quantity */}
        <TextField
          type="number"
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          fullWidth
        />

        {/* Save Button */}
        <Button
          type="submit"
          variant="contained"
          size="medium"
          disabled={!isFormValid || loading}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : null
          }
          sx={{
            textTransform: "none",
            height: "45px",
            px: 3,
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>

      {/* QR Scanner Overlay */}
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
            onScan={(text) => {
              if (!text) return;

              // format: id=1,description=upvc pipe
              const parts = text.split(",");
              const id = parts
                .find((p) => p.startsWith("id="))
                ?.replace("id=", "");
              const desc = parts
                .find((p) => p.startsWith("description="))
                ?.replace("description=", "");

              if (id) setMaterialId(id.trim());
              if (desc) setMaterialDescription(desc.trim());

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
