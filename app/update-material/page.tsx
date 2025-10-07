"use client";
import QRScanner from "@/components/QrScanner";
import { useState } from "react";

export default function UpdateMaterialPage() {
  const [materialId, setMaterialId] = useState("");
  const [type, setType] = useState("RECEIVE");
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // in production replace this with auth (not header)
        "x-user-id": "manager-user-id", 
      },
      body: JSON.stringify({ materialId, type, quantity: Number(quantity) }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`✅ ${type} OK → New Quantity: ${data.material.quantity}`);
    } else {
      setMessage(`❌ Error: ${data.error}`);
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Update Material</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          className="border p-2"
          placeholder="Material ID (scan or enter)"
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
        />
        <select
          className="border p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="RECEIVE">Receive</option>
          <option value="WITHDRAW">Withdraw</option>
        </select>
        <QRScanner onScan={(id) => setMaterialId(id)} />
        <input
          type="number"
          className="border p-2"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button className="bg-green-600 text-white px-4 py-2">
          Save
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
