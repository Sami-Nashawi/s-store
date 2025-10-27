"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Box, Button } from "@mui/material";

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: 2,
        borderLeft: "1px solid #e0e0e0",
        textAlign: "center",
      }}
    >
      {/* ✅ Only show the QR code inside the card */}
      <div id="printableQR">
        <QRCodeCanvas
          value={id}
          size={200} // crisp size on screen
          includeMargin={true}
          level="H" // higher error correction = sharper print
        />
      </div>

      <Button
        onClick={handlePrint}
        variant="contained"
        color="success"
        size="small"
        sx={{ mt: 2 }}
        className="print-hidden"
      >
        🖨️ Print QR
      </Button>

      {/* ✅ High-quality print version */}
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
            width: 22cm !important; /* High-quality QR size */
            height: 22cm !important;
          }
          /* Description and unit displayed only when printing */
          #printableQR::after {
            content: "${description.replace(
              /"/g,
              '\\"'
            )} (${unit})"; /* Escaped for safety */
            display: block;
            font-size: 40pt;
            margin-top: 1.5cm;
            text-align: center;
            font-weight: bold;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
    </Box>
  );
}
