import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import MaterialQRSection from "@/components/MaterialQRSection";
import MaterialEventsTable from "@/components/MaterialEventsTable";
import DeleteMaterialDialog from "@/components/DeleteMaterialDialog";
import { apiFetch } from "@/lib/apiFetch";

export default async function MaterialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const material = await apiFetch(`materials/${id}`, {
    cache: "no-store",
  });

  if (material.error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Material not found.</Typography>
      </Box>
    );
  }

  const initialEvents = material.events || [];
  const totalEvents = material.totalEvents || initialEvents.length;

  return (
    <Box>
      {/* Header Buttons */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          {/* Back Button (filled style) */}
          <Link href="/materials">
            <Button
              variant="contained"
              color="primary"
              sx={{
                minWidth: 45,
                width: 45,
                height: 45,
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.4)",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              <ArrowBack />
            </Button>
          </Link>

          <Typography variant="h4" fontWeight="bold">
            Material Details
          </Typography>
        </Box>

        {/* Delete Button (client component) */}
        <DeleteMaterialDialog id={id} />
      </Box>

      {/* Material Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            gap: 2,
          }}
        >
          {/* Left side — image & info */}
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

          {/* Right side — QR */}
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

      <MaterialEventsTable
        materialId={Number(id)}
        events={initialEvents}
        total={totalEvents}
      />

      <Divider sx={{ my: 4 }} />
    </Box>
  );
}
