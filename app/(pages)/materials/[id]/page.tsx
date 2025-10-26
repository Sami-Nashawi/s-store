import Image from "next/image";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";
import BackButton from "@/components/BackButton";
import MaterialQRSection from "@/components/MaterialQRSection";
import MaterialEventsTable from "@/components/MaterialEventsTable";

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/materials/${id}`,
    {
      cache: "no-store",
    }
  );

  // if (!res.ok) {
  //   if (res.status === 404) notFound();
  //   throw new Error("Failed to fetch material details");
  // }

  const material = await res.json();

  return (
    <Box>
      {/* ✅ Back button */}
      <Box sx={{ display: "flex", columnGap: 2 }}>
        <BackButton />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Material Details
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            {material.photoUrl ? (
              <Image
                src={material.photoUrl}
                alt={material.description}
                width={150}
                height={150}
                style={{ borderRadius: 8, objectFit: "cover" }}
              />
            ) : (
              <Box
                width={150}
                height={150}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px dashed gray"
                borderRadius={2}
                color="gray"
              >
                No Image
              </Box>
            )}

            <Box>
              <Typography variant="h6">{material.description}</Typography>
              <Typography color="text.secondary">
                Quantity: {material.quantity} {material.unit}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* ✅ QR + print section */}
      <MaterialEventsTable events={material.events} />
      <Divider sx={{ my: 4 }} />
      <MaterialQRSection
        id={material.id.toString()}
        description={material.description}
        unit={material.unit}
      />

      {/* ✅ Events Table */}
    </Box>
  );
}
