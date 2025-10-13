import { Box, Typography, Paper } from "@mui/material";
import MaterialForm from "@/components/MaterialForm";

export default function UpdateMaterialPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        🔄 Update Material
      </Typography>

      <Paper sx={{ p: 3 }}>
        {/* Client form */}
        <MaterialForm />
      </Paper>
    </Box>
  );
}
