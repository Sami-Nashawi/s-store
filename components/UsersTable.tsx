"use client";

import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import AddUserDialog from "./AddUserDialog";
import { apiClientFetch } from "@/lib/apiClientFetch";

type User = {
  id: string;
  fileNo: number;
  name: string;
  role: "MANAGER" | "WORKER";
  createdAt: string;
};

interface TableData {
  rows: User[];
  total: number;
}

export default function UsersTable({ data }: { data: TableData }) {
  const [users, setUsers] = useState<User[]>(data.rows);
  const [rowCount, setRowCount] = useState(data.total);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [open, setOpen] = useState(false);

  async function updateData(pageNumber = page) {
    setLoading(true);
    try {
      const data: TableData = await apiClientFetch(
        `users?page=${pageNumber}&pageSize=${pageSize}`,
        { credentials: "include" }
      );
      setUsers(data.rows || []);
      setRowCount(data.total || 0);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  const columns: GridColDef[] = [
    { field: "fileNo", headerName: "File No", width: 120 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "role", headerName: "Role", width: 140 },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, height: "calc(100vh - 200px)" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          👥 Users
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          ➕ Add User
        </Button>
      </Box>

      {/* Table */}
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.id}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={async (model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
          await updateData(model.page);
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

      {/* Add User Modal */}
      <AddUserDialog
        open={open}
        onClose={() => setOpen(false)}
        onUserAdded={(newUser) => {
          if (page === 0) {
            // 🟢 If we are on first page → prepend and remove last if needed
            setUsers((prev) => {
              const updated = [newUser, ...prev];
              return updated.slice(0, pageSize);
            });
          }

          // Always increment total count
          setRowCount((prev) => prev + 1);
        }}
      />
    </Box>
  );
}
