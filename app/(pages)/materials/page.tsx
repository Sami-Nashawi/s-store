import { Box, Typography } from "@mui/material";
import MaterialsTable from "@/components/MaterialsTable";

export default async function MaterialsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/materials?page=0&pageSize=20`,
    { cache: "no-store" }
  );
  const data = await res.json();

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        📃 Materials
      </Typography>

      <MaterialsTable
        initialRows={data.rows}
        initialRowCount={data.total}
        initialPage={0}
        initialPageSize={20}
      />
    </Box>
  );
}
