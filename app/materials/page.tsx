"use client";
import { useEffect, useState } from "react";

type Material = {
  id: string;
  description: string;
  totalQty: number;
  lastUpdate: string;
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/materials");
      const data = await res.json();
      setMaterials(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Materials</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Last Update</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id}>
              <td className="border p-2">{m.description}</td>
              <td className="border p-2">{m.totalQty}</td>
              <td className="border p-2">
                {new Date(m.lastUpdate).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
