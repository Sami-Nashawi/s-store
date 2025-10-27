"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

type Event = {
  id: number;
  type: string;
  quantity: number;
  createdAt: string;
  user: { name: string | null };
};

type Props = {
  materialId: number;
  events: Event[];
  total: number;
};

export default function MaterialEventsTable({
  materialId,
  events,
  total,
}: Props) {
  const [rows, setRows] = useState<Event[]>(events);
  const [page, setPage] = useState(0); // 0-based index for DataGrid
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(total);

  let firstRender = true;

  useEffect(() => {
    console.log("MaterialEventsTable useEffect dependencies changed:", {
      page,
      pageSize,
      materialId,
    });
    // ✅ Skip only the very first render
    if (firstRender) {
      firstRender = false;
      return;
    }

    let ignore = false;
    async function fetchEvents() {
      console.log("Fetching events for material:", materialId, "page:", page);
      setLoading(true);
      try {
        const res = await fetch(
          `/api/materials/${materialId}?page=${page}&pageSize=${pageSize}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!ignore) {
          setRows(data.events || []);
          setRowCount(data.totalEvents || 0);
        }
      } catch (err) {
        console.error("❌ Error fetching events:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchEvents();
    return () => {
      ignore = true;
    };
  }, [page, pageSize, materialId]);

  const columns: GridColDef[] = [
    { field: "type", headerName: "Event Type", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    {
      field: "user",
      headerName: "User",
      flex: 1,
      valueGetter: (params: any) => params?.name || "-",
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      valueGetter: (params: any) => new Date(params).toLocaleString(),
    },
  ];

  if (!rows.length && !loading) {
    return <Typography>No events yet.</Typography>;
  }

  return (
    <Box sx={{ height: 400, width: "100%", mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Events History
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[20]}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        loading={loading}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
