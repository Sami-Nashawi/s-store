"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";

type Material = {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  lastUpdate: string;
};

export default function MaterialsTable() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // DataGrid pages start at 0
  const [pageSize, setPageSize] = useState(20);

  // Fetch whenever page or pageSize changes (including initial mount)
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/materials?page=${page}&pageSize=${pageSize}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch materials");
        const data = await res.json();

        setMaterials(data.rows);
        setRowCount(data.total);
      } catch (err) {
        console.error("❌ Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
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
    <Box
      sx={{
        flexGrow: 1,
        height: "calc(100vh - 200px)", // Full-page minus header/footer
      }}
    >
      <DataGrid
        rows={materials}
        columns={columns}
        getRowId={(row) => row.id}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          if (model.page !== page) setPage(model.page);
          if (model.pageSize !== pageSize) setPageSize(model.pageSize);
        }}
        loading={loading}
        disableRowSelectionOnClick
        sx={{
          border: "none",
          "& .MuiDataGrid-virtualScroller": {
            overflowY: "auto !important",
          },
        }}
      />
    </Box>
  );
}
