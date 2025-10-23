"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Box, Typography, Button } from "@mui/material";

export default function MaterialQRSection({
  id,
  description,
  unit,
}: {
  id: string;
  description: string;
  unit: string;
}) {
  function handlePrint() {
    window.print();
  }

  return (
    <Box textAlign="center" mt={4}>
      {/* Print-specific styling */}
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

      <div id="printableQR">
        <QRCodeCanvas value={id} size={400} includeMargin={true} />
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
  );
}
