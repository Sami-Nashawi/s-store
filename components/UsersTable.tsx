"use client";

import { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridFilterModel,
  getGridStringOperators,
} from "@mui/x-data-grid";
import { Box, Button, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import AddUserDialog from "./AddUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import { apiClientFetch } from "@/lib/apiClientFetch";
import { ROLE_OPTIONS } from "@/shared/roles-permissions";

type User = {
  id: string;
  fileNo: number;
  name: string;
  role: { id: number; name: string };
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

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "createdAt", sort: "desc" },
  ]);

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  // ✅ Dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ✅ Only "contains" operator for all string columns
  const containsOnlyOperator = [
    getGridStringOperators().find((op) => op.value === "contains")!,
  ];

  // ✅ Fetch Users with pagination, sorting & filtering
  async function updateData(
    pageNumber = page,
    currentSort = sortModel,
    currentFilter = filterModel
  ) {
    setLoading(true);

    try {
      const sortField = currentSort[0]?.field || "createdAt";
      const sortOrder = currentSort[0]?.sort || "desc";

      const filters: Record<string, string> = {};
      currentFilter.items.forEach((item) => {
        if (item.value?.toString().trim()) filters[item.field] = item.value;
      });

      const data: TableData = await apiClientFetch(
        `users?page=${pageNumber}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}&filters=${encodeURIComponent(
          JSON.stringify(filters)
        )}`,
        { credentials: "include" }
      );

      setUsers(data.rows);
      setRowCount(data.total);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Delete User
  async function handleDelete() {
    if (!deleteUser) return;

    setDeleteLoading(true);

    const res = await apiClientFetch(`users/${deleteUser.id}`, {
      method: "DELETE",
    });

    setDeleteLoading(false);

    if (res?.error) {
      alert(res.error);
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    setRowCount((prev) => prev - 1);
    setDeleteUser(null);
  }

  // ✅ Table Columns with filters
  const columns: GridColDef[] = [
    {
      field: "fileNo",
      headerName: "File No",
      width: 120,
      filterOperators: containsOnlyOperator,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      filterOperators: containsOnlyOperator,
    },
    {
      field: "role",
      headerName: "Role",
      width: 140,
      filterOperators: containsOnlyOperator,
      valueFormatter: (params: { id: number; name: string }) =>
        ROLE_OPTIONS[params.id - 1].label || params.name,
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      sortable: true,
      filterable: false,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => setDeleteUser(params.row)}
          color="error"
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
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
          onClick={() => setOpenAdd(true)}
          sx={{ mb: 2 }}
        >
          ➕ Add User
        </Button>
      </Box>

      {/* Table */}
      <DataGrid
        filterDebounceMs={500}
        rows={users}
        columns={columns}
        getRowId={(row) => row.id}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        sortModel={sortModel}
        filterModel={filterModel}
        loading={loading}
        onPaginationModelChange={async (model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
          await updateData(model.page, sortModel, filterModel);
        }}
        onSortModelChange={async (model) => {
          setSortModel(model);
          await updateData(0, model, filterModel);
          setPage(0);
        }}
        onFilterModelChange={async (model) => {
          setFilterModel(model);

          const hasValue = model.items.some((i) => !!i.value);

          if (hasValue || filterModel.items.length > 0) {
            await updateData(0, sortModel, model);
            setPage(0);
          }
        }}
        disableRowSelectionOnClick
        sx={{
          border: "none",
          "& .MuiDataGrid-virtualScroller": {
            overflowY: "auto !important",
          },
        }}
      />

      {/* Add User */}
      <AddUserDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onUserAdded={(newUser) => {
          console.log("New user added:", newUser);
          if (page === 0) {
            setUsers((prev) => [newUser, ...prev].slice(0, pageSize));
          }
          setRowCount((prev) => prev + 1);
        }}
      />

      {/* Delete User */}
      <DeleteUserDialog
        open={!!deleteUser}
        user={deleteUser}
        loading={deleteLoading}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
