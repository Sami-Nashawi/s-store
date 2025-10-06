"use client";
import { useState } from "react";

export default function AddMaterialPage() {
  const [description, setDescription] = useState("");
  const [initialQty, setInitialQty] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, quantity: Number(initialQty) }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`✅ Created: ${data.description} (Qty: ${data.totalQty})`);
    } else {
      setMessage(`❌ Error: ${data.error}`);
    }
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-md mx-auto">
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
          value={initialQty}
          onChange={(e) => setInitialQty(Number(e.target.value))}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
