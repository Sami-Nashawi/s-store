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
    const [initialQuantity, setInitialQuantity] = useState(0);
    const [unit, setUnit] = useState("pcs");
    const [loading, setLoading] = useState(false);
    const [materialId, setMaterialId] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setLoading(true);
      setMaterialId(null);

      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          quantity: Number(initialQuantity),
          unit,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMaterialId(data.id);
      }
      setLoading(false);
    }

    function handlePrint() {
      window.print();
    }

    return (
      <Box
        sx={{
          p: 3,
          maxWidth: 500,
          mx: "auto",
        }}
      >
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
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Add New Material
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
                label="Initial Quantity"
                type="number"
                variant="outlined"
                fullWidth
                value={initialQuantity}
                onChange={(e) => setInitialQuantity(Number(e.target.value))}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {materialId && (
          <Box textAlign="center" mt={4}>
            <div id="printableQR">
              <QRCodeCanvas value={materialId} size={400} includeMargin={true} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {description} ({unit})
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
