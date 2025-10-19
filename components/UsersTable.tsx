"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

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
  const [page, setPage] = useState(0); // DataGrid pages start at 0
  const [pageSize, setPageSize] = useState(20);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fileNo: "",
    name: "",
    role: "WORKER",
  });

  // Fetch whenever page or pageSize changes (including initial mount)
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

  // Add User
  async function handleAddUser() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileNo: Number(form.fileNo),
          name: form.name,
          role: form.role,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to add user");
      const newUser = await res.json();

      // Optimistic update
      setUsers((prev) => [newUser, ...prev]);
      setRowCount((prev) => prev + 1);

      setOpen(false);
      setForm({ fileNo: "", name: "", role: "WORKER" });
    } catch (err) {
      console.error("❌ Error adding user:", err);
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
    <Box
      sx={{
        flexGrow: 1,
        height: "calc(100vh - 200px)",
      }}
    >
      {/* Add User Button */}
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
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>➕ Add User</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="File No"
            type="number"
            required
            value={form.fileNo}
            onChange={(e) => setForm({ ...form, fileNo: e.target.value })}
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            fullWidth
          >
            <MenuItem value="WORKER">Worker</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ padding: "0 25px 25px 0" }}>
          <Button
            onClick={() => {
              setOpen(false);
              setForm({ fileNo: "", name: "", role: "WORKER" });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            disabled={!form.fileNo || !form.name}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
