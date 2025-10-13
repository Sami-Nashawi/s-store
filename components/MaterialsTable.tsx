"use client";

import { useState, useEffect, useRef } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";

type Material = {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  lastUpdate: string;
};

export default function MaterialsTable({
  initialRows,
  initialRowCount,
  initialPage,
  initialPageSize,
}: {
  initialRows: Material[];
  initialRowCount: number;
  initialPage: number;
  initialPageSize: number;
}) {
  const [materials, setMaterials] = useState(initialRows);
  const [rowCount, setRowCount] = useState(initialRowCount);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Track if it's the very first render
  const firstLoad = useRef(true);

  useEffect(() => {
    // Skip the fetch on *first render only*, not based on page number
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const res = await fetch( `${process.env.NEXT_PUBLIC_BASE_URL}/api/materials?page=${page}&pageSize=${pageSize}`);
        const data = await res.json();
        setMaterials(data.rows);
        setRowCount(data.total);
      } catch (err) {
        console.error("Failed to fetch materials:", err);
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
      valueFormatter: (params) =>
        new Date(params).toLocaleString(),
    },
  ];

  return (
   <Box
  sx={{
    flexGrow: 1,
    height: "calc(100vh - 200px)",
    overflow: "hidden", // ✅ prevents scrollbar flicker
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
        overflowY: "auto !important", // ✅ no vertical scrollbar flicker
      },
    }}
  />
</Box>

  );
}
