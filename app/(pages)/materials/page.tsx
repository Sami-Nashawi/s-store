import { Box, Typography } from "@mui/material";
import MaterialsTable from "@/components/MaterialsTable";

export default async function MaterialsPage() {

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        📃 Materials
      </Typography>

      <MaterialsTable
      />
    </Box>
  );
}
