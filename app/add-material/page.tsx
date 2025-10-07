"use client";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function AddMaterialPage() {
  const [description, setDescription] = useState("");
  const [initialQuantity, setInitialQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [materialId, setMaterialId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMaterialId(null);

    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, quantity: Number(initialQuantity) }),
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
    <div className="p-4 max-w-md mx-auto">
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

      <h1 className="text-xl font-bold mb-4">Add New Material</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          className="border p-2"
          placeholder="Material description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          className="border p-2"
          placeholder="Initial quantity"
          value={initialQuantity}
          onChange={(e) => setInitialQuantity(Number(e.target.value))}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      {materialId && (
        <div className="mt-6 text-center">
          <div id="printableQR">
            <QRCodeCanvas value={materialId} size={400} includeMargin={true} />
            <p className="font-semibold">{description}</p>
          </div>

          {/* Print button - hidden on print */}
          <div className="mt-3 print-hidden">
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-4 py-2"
            >
              🖨️ Print QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
