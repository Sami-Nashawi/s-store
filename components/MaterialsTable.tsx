"use client";

import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { apiClientFetch } from "@/lib/apiClientFetch";

type Material = {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  lastUpdate: string;
};

interface MaterialsData {
  rows: Material[];
  total: number;
}

export default function MaterialsTable({ data }: { data: MaterialsData }) {
  const [materials, setMaterials] = useState<Material[]>(data.rows || []);
  const [rowCount, setRowCount] = useState(data.total || 0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const router = useRouter();
  async function updateData(pageNumber = page) {
    setLoading(true);
    try {
      const data: MaterialsData = await apiClientFetch(
        `materials?page=${pageNumber}&pageSize=${pageSize}`,
        {
          credentials: "include",
        }
      );
      setMaterials(data.rows || []);
      setRowCount(data.total || 0);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching events:", err);
      setLoading(false);
    }
  }

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
        height: "calc(100vh - 200px)",
      }}
    >
      <DataGrid
        rows={materials}
        columns={columns}
        getRowId={(row) => row.id}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={async (model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
          await updateData(model.page);
        }}
        // ✅ Navigate to material page when clicking row
        onRowClick={(params) => router.push(`/materials/${params.row.id}`)}
        disableRowSelectionOnClick
        loading={loading}
        sx={{
          border: "none",
          "& .MuiDataGrid-virtualScroller": {
            overflowY: "auto !important",
          },
          cursor: "pointer",
          "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within":
            {
              outline: "none !important",
            },
        }}
      />
    </Box>
  );
}
