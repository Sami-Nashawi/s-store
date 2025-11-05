"use client";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { apiClientFetch } from "@/lib/apiClientFetch";

export const metadata = {
  title: "Add Material",
  description: "A simple MUI + Next.js layout",
};

export default function AddMaterialForm() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("pcs");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const isFormValid = description.trim() !== "" && quantity > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    setData(null);

    const result = await apiClientFetch(`materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        quantity: Number(quantity),
        unit,
      }),
    });

    if (result?.id) {
      setData({
        ...result,
        qrValue: `id=${result.id},description=${result.description}`,
      });
    }

    setLoading(false);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        ➕ Add Material
      </Typography>

      {/* ✅ Print CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printableQR,
          #printableQR * {
            visibility: visible !important;
          }
          #printableQR {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          #printableQR canvas {
            width: 80% !important;
            height: auto !important;
          }
          #printableQR h6 {
            font-size: 40pt;
            margin-top: 2rem;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>

      <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Description */}
            <TextField
              label="Material Description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            {/* Quantity */}
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />

            {/* Unit */}
            <TextField
              select
              label="Unit"
              variant="outlined"
              fullWidth
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <MenuItem value="pcs">pcs</MenuItem>
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="m">m</MenuItem>
              <MenuItem value="ton">ton</MenuItem>
              <MenuItem value="litre">litre</MenuItem>
            </TextField>

            {/* Save Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isFormValid || loading}
              sx={{ height: "45px", px: 3 }}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ✅ Show QR After Saving */}
      {data && (
        <Box textAlign="center" mt={4}>
          <div id="printableQR">
            <QRCodeCanvas
              value={data.qrValue}
              size={400}
              includeMargin={true}
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
              {data.description} ({data.unit})
            </Typography>
          </div>

          <Button
            onClick={handlePrint}
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            className="print-hidden"
          >
            🖨️ Print QR Code
          </Button>
        </Box>
      )}
    </Box>
  );
}
