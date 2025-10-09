"use client";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

type Material = {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  lastUpdate: string;
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/materials?page=${page}&pageSize=${pageSize}`);
      const data = await res.json();

      setMaterials(data.rows);
      setRowCount(data.total);
      setLoading(false);
    }
    load();
  }, [page, pageSize]);

  const columns: GridColDef[] = [
    { field: "description", headerName: "Name", flex: 1 },
    { field: "quantity", headerName: "Quantity", width: 130 },
    { field: "unit", headerName: "Unit", width: 120 },
    {
      field: "lastUpdate",
      headerName: "Last Update",
      flex: 1,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
  ];

  return (
    <Box >
 <Typography variant="h5" fontWeight="bold" mb={3}>
        📃 Materials
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <DataGrid
          rows={materials}
          columns={columns}
          getRowId={(row) => row.id}
          paginationMode="server"
          rowCount={rowCount}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          loading={loading}
          sx={{
            height: "calc(100vh - 200px)",
          }}
        />
      </Box>
    </Box>
  );
}
