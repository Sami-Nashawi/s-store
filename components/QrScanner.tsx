"use client";
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

export default function QrScanner({
  onScan,
}: {
  onScan: (result: string) => void;
}) {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scanning && scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: 250,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          console.log("QR Code scanned:", decodedText);
          onScan(decodedText);
          setScanning(false);
          scanner.clear();
        },
        (error) => {
          console.warn("QR Scan Error", error);
        }
      );

      return () => {
        scanner.clear().catch(() => {});
      };
    }
  }, [scanning, onScan]);

  return (
    <div>
      {scanning ? (
        <div id="qr-reader" ref={scannerRef}></div>
      ) : (
        <Button
          variant="contained"
          color="primary"
          startIcon={<QrCodeScannerIcon />}
          sx={{
            borderRadius: 2, // same rounding as Save
            px: 2.5,
            py: 1.2,
            fontSize: "0.95rem",
            fontWeight: 500,
            textTransform: "none",
          }}
          onClick={() => setScanning(true)} // keep your same logic here
        >
          Scan QR
        </Button>
      )}
    </div>
  );
}
