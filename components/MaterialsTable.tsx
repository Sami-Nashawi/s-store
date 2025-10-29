"use client";

import { useState, useRef } from "react";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
  GridColumnHeaderParams,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { apiClientFetch } from "@/lib/apiClientFetch";
import debounce from "lodash.debounce";

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
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "lastUpdate", sort: "desc" },
  ]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [activeFilterField, setActiveFilterField] = useState<string>(""); // 👈 store which column opened

  const router = useRouter();
  const initialized = useRef(false); // prevent initial trigger

  async function updateData(
    pageNumber = page,
    currentSort = sortModel,
    currentFilter = filterModel
  ) {
    setLoading(true);
    try {
      const sortField = currentSort[0]?.field || "lastUpdate";
      const sortOrder = currentSort[0]?.sort || "desc";

      // Convert filterModel to simple key-value pairs
      const filters: Record<string, string> = {};
      currentFilter.items.forEach((item) => {
        if (item.value?.toString().trim()) filters[item.field] = item.value;
      });

      const data: MaterialsData = await apiClientFetch(
        `materials?page=${pageNumber}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}&filters=${encodeURIComponent(
          JSON.stringify(filters)
        )}`,
        { credentials: "include" }
      );

      setMaterials(data.rows || []);
      setRowCount(data.total || 0);
    } catch (err) {
      console.error("❌ Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Debounced filter update
  const debouncedFilterUpdate = useRef(
    debounce(async (model: GridFilterModel) => {
      await updateData(0, sortModel, model);
      setPage(0);
    }, 500)
  ).current;

  const columns: GridColDef[] = [
    {
      field: "description",
      headerName: "Name",
      flex: 1,
      filterable: true,
      renderHeader: (params: GridColumnHeaderParams) => {
        return (
          <span
            onClick={() => setActiveFilterField(params.field)}
            style={{ cursor: "pointer" }}
          >
            {params.colDef.headerName}
          </span>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 130,
      filterable: true,
      renderHeader: (params: GridColumnHeaderParams) => {
        return (
          <span
            onClick={() => setActiveFilterField(params.field)}
            style={{ cursor: "pointer" }}
          >
            {params.colDef.headerName}
          </span>
        );
      },
    },
    {
      field: "unit",
      headerName: "Unit",
      width: 120,
      filterable: true,
      renderHeader: (params: GridColumnHeaderParams) => {
        return (
          <span
            onClick={() => setActiveFilterField(params.field)}
            style={{ cursor: "pointer" }}
          >
            {params.colDef.headerName}
          </span>
        );
      },
    },
    {
      field: "lastUpdate",
      headerName: "Last Update",
      flex: 1,
      sortable: true,
      filterable: false,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, height: "calc(100vh - 200px)" }}>
      <DataGrid
        rows={materials}
        columns={columns}
        getRowId={(row) => row.id}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        sortModel={sortModel}
        filterModel={filterModel}
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
          console.log("inside filter model", model);
          // ✅ Prevent initial empty trigger
          if (!initialized.current) {
            initialized.current = true;
            return;
          }

          // ✅ Fix: ensure correct field is active when user opens filter panel
          if (
            model.items.length === 1 &&
            !model.items[0].value &&
            !model.items[0].field
          ) {
            model.items[0].field = activeFilterField || "description";
          }

          // ✅ Check if there’s an actual change in filters
          const hasValue = model.items.some(
            (item) => item.value?.toString().trim() !== ""
          );

          setFilterModel(model);
          if (hasValue || filterModel.items.length > 0) {
            debouncedFilterUpdate(model);
          }
        }}
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
            { outline: "none !important" },
        }}
      />
    </Box>
  );
}
