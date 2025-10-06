"use client";
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrScanner({ onScan }: { onScan: (result: string) => void }) {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scanning && scannerRef.current) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      }, false);

      scanner.render(
        (decodedText) => {
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
        <button onClick={() => setScanning(true)}>📷 Start QR Scan</button>
      )}
    </div>
  );
}
