import { prisma } from "@/lib/prisma";
import Image from "next/image";

interface MaterialDetailPageProps {
  params: { id: string };
}

export default async function MaterialDetailPage({
  params,
}: MaterialDetailPageProps) {
  const { id } = params;

  // Fetch material directly from the DB (server-side)
  const material = await prisma.material.findUnique({
    where: { id: Number(id) },
    include: {
      events: {
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
    },
  });

  if (!material) {
    return <div className="p-6 text-red-500">❌ Material not found</div>;
  }

  const lastEvent = material.events[0];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{material.description}</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>
            <span className="font-semibold">Quantity:</span> {material.quantity}
          </p>
          <p>
            <span className="font-semibold">Unit:</span> {material.unit}
          </p>
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(material.createdAt).toLocaleString()}
          </p>
          {lastEvent && (
            <p>
              <span className="font-semibold">Last Updated By:</span>{" "}
              {lastEvent.user?.name || "Unknown"} (
              {new Date(lastEvent.createdAt).toLocaleString()})
            </p>
          )}
        </div>
        {material.photoUrl && (
          <div className="relative w-64 h-64">
            <Image
              src={material.photoUrl}
              alt={material.description}
              fill
              className="object-cover rounded-lg shadow"
            />
          </div>
        )}
      </div>
    </div>
  );
}
