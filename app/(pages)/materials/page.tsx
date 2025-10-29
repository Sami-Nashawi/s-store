import { Box, Typography } from "@mui/material";
import MaterialsTable from "@/components/MaterialsTable";
import { apiFetch } from "@/lib/apiFetch";

export default async function MaterialsPage() {
  const data = await apiFetch(
    `materials?page=0&pageSize=20&sortField=lastUpdate&sortOrder=desc&`,
    {
      credentials: "include",
    }
  );

  // const data = await res.json();
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        📃 Materials
      </Typography>

      <MaterialsTable data={data} />
    </Box>
  );
}
