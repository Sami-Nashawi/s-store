import Image from "next/image";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";
import BackButton from "@/components/BackButton";
import MaterialQRSection from "@/components/MaterialQRSection";
import MaterialEventsTable from "@/components/MaterialEventsTable";

export default async function MaterialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // Fetch material details including first page of events
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/materials/${id}?page=0&pageSize=20`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch material details for ID ${id}`);
  }

  const material = await res.json();

  const initialEvents = material.events || [];
  const totalEvents = material.totalEvents || initialEvents.length;

  return (
    <Box>
      {/* ✅ Back button */}
      <Box sx={{ display: "flex", columnGap: 2 }}>
        <BackButton />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Material Details
        </Typography>
      </Box>

      {/* ✅ Material Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            gap: 2,
          }}
        >
          {/* Left side — material image + info */}
          <Box display="flex" alignItems="center" gap={3} flex={1}>
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

          {/* Right side — QR section */}
          <Box
            sx={{
              width: 200,
              minWidth: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialQRSection
              id={material.id.toString()}
              description={material.description}
              unit={material.unit}
            />
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* ✅ Events Table with pagination */}
      <MaterialEventsTable
        materialId={Number(id)}
        events={initialEvents}
        total={totalEvents}
      />

      <Divider sx={{ my: 4 }} />
    </Box>
  );
}
