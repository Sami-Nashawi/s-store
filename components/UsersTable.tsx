"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import AddUserDialog from "./AddUserDialog";

type User = {
  id: string;
  fileNo: number;
  name: string;
  role: "MANAGER" | "WORKER";
  createdAt: string;
};

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [open, setOpen] = useState(false);

  // Fetch users
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users?page=${page}&pageSize=${pageSize}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();

        setUsers(data.rows);
        setRowCount(data.total);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, pageSize]);

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
      {/* Header + Add Button */}
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

      {/* Add User Modal */}
      <AddUserDialog
        open={open}
        onClose={() => setOpen(false)}
        onUserAdded={(newUser) => {
          setUsers((prev) => [newUser, ...prev]);
          setRowCount((prev) => prev + 1);
        }}
      />
    </Box>
  );
}
