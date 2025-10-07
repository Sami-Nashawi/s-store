"use client";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

type Material = {
  id: string;
  description: string;
  quantity: number;
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

  const columns: GridColDef[] = [
    { field: "description", headerName: "Name", flex: 1 },
    { field: "quantity", headerName: "Quantity", width: 130 },
    {
      field: "lastUpdate",
      headerName: "Last Update",
      flex: 1,
      valueFormatter: (params) =>
        new Date(params).toLocaleString(),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Materials
      </Typography>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={materials}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          loading={loading}
        />
      </div>
    </Box>
  );
}
