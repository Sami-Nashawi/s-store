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
} from "@mui/material";

export default function AddMaterialPage() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("pcs");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setData(null);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/materials`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          quantity: Number(quantity),
          unit,
        }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      setData(data);
      console.log("Material added:", data.id);
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
      <Box sx={{}}>
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
            #printableQR p {
              font-size: 2rem;
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
              sx={{ display: "flex", flexDirection: "row", gap: 2 }}
            >
              <TextField
                label="Material Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <TextField
                label="Quantity"
                type="number"
                variant="outlined"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />

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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {data && (
          <Box textAlign="center" mt={4}>
            <div id="printableQR">
              <QRCodeCanvas
                value={String(data.id)}
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
    </Box>
  );
}
