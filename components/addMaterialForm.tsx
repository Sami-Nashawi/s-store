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
  Avatar,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { apiClientFetch } from "@/lib/apiClientFetch";

export const metadata = {
  title: "Add New Material",
  description: "Add materials with QR code and optional stock alerts",
};

export default function AddMaterialForm() {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);

  // Checkbox toggles visibility
  const [enableMinStock, setEnableMinStock] = useState(false);
  const [minStock, setMinStock] = useState<number | "">("");

  const [unit, setUnit] = useState("pcs");
  const [notes, setNotes] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const isFormValid = description.trim() !== "" && quantity > 0;

  // Handle Photo Upload
  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setPhotoError("");
    setPhotoFile(null);
    setPhotoPreview(null);
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be 5MB or less.");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || loading || photoError) return;

    setLoading(true);
    setData(null);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("quantity", String(quantity));
    formData.append("unit", unit);
    formData.append("notes", notes);

    // Include only when enabled
    if (enableMinStock && minStock !== "") {
      formData.append("minStock", String(minStock));
    }

    if (photoFile) formData.append("photo", photoFile);

    const result = await apiClientFetch(`materials`, {
      method: "POST",
      body: formData,
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
        ➕ Add New Material
      </Typography>

      {/* PRINT CSS */}
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
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              {/* Quantity */}
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />

              {/* Checkbox next to quantity */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enableMinStock}
                    onChange={(e) => {
                      setEnableMinStock(e.target.checked);
                      if (!e.target.checked) setMinStock(""); // reset when disabled
                    }}
                  />
                }
                label="Stock Alert"
                sx={{ width: 140 }} // vertically align with quantity
              />
            </Box>
            {/* Minimum Stock input under Quantity, only if enabled */}
            {enableMinStock && (
              <Tooltip
                title="When quantity reaches this value or lower, material will appear in Low Stock"
                arrow
              >
                <TextField
                  label="Minimum Stock Alert"
                  type="number"
                  fullWidth
                  value={minStock}
                  onChange={(e) =>
                    setMinStock(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  inputProps={{ min: 0 }}
                  sx={{ mt: 1 }}
                />
              </Tooltip>
            )}
            {/* Unit */}
            <TextField
              select
              label="Unit"
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
            {/* Notes */}
            <TextField
              label="Notes (optional)"
              fullWidth
              multiline
              minRows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            {/* Image Upload ------------------------------------------------ */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mt: 1,
              }}
            >
              <Typography fontWeight="bold" color="text.secondary">
                Material Photo (optional)
              </Typography>

              <Box
                sx={{
                  width: "180px",
                  height: "180px",
                  borderRadius: 2,
                  border: photoError ? "2px solid red" : "2px dashed #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  cursor: "pointer",
                  "&:hover": { borderColor: "primary.main" },
                }}
                onClick={() =>
                  document.getElementById("material-photo-input")?.click()
                }
              >
                {photoPreview ? (
                  <Avatar
                    src={photoPreview}
                    variant="rounded"
                    sx={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Typography color="text.secondary">
                    Click to upload photo
                  </Typography>
                )}
              </Box>

              <input
                id="material-photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />

              {photoError && (
                <Typography sx={{ color: "red", fontSize: 13 }}>
                  {photoError}
                </Typography>
              )}
            </Box>
            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid || loading || !!photoError}
              sx={{ height: "45px", px: 3, mt: 2 }}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* QR AFTER SAVE */}
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
