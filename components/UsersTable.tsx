"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Modal,
  TextField,
  Stack,
  Typography,
} from "@mui/material";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Modal state
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

  const loadUsers = async () => {
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
  };

  useEffect(() => {
    loadUsers();
  }, [page, pageSize]);

  const handleAddUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error("Failed to add user");

      // Refresh table
      await loadUsers();
      setOpen(false);
      setNewUser({ name: "", email: "", role: "" });
    } catch (err) {
      console.error("❌ Error adding user:", err);
    }
  };

  const columns: GridColDef[] = [
    { field: "fileNo", headerName: "File Number", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
  ];

  return (
    <Box>
      {/* Add User Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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

      {/* Users Table */}
      <Box
        sx={{
          flexGrow: 1,
          height: "calc(100vh - 200px)",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={users}
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

      {/* Add User Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            width: 400,
            mx: "auto",
            mt: "15%",
          }}
        >
          <Typography variant="h6" mb={2}>
            Add New User
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, email: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Role"
              value={newUser.role}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, role: e.target.value }))
              }
              fullWidth
            />
            <Button variant="contained" onClick={handleAddUser}>
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
