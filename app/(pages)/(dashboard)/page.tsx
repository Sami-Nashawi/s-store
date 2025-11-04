import { apiFetch } from "@/lib/apiFetch";
import { Box, Typography } from "@mui/material";

import KPISection from "./components/KPISection";
import LowStockSection from "./components/LowStockSection";
import LatestMaterials from "./components/LatestMaterials";
import QuickActions from "./components/QuickActions";
import DonutChart from "./components/DonutChart";
import BarChartSection from "./components/BarChartSection";

export default async function DashboardPage() {
  const data = await apiFetch("dashboard");

  if (data.error) {
    return (
      <Box p={3}>
        <Typography color="error">Failed to load dashboard.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={2}>
        📊 S-Store Dashboard
      </Typography>

      {/* ✅ KPI Row */}
      <KPISection
        totalMaterials={data.totalMaterials ?? 0}
        lowStockCount={data.lowStockItems?.length ?? 0}
        recentUpdates={data.recentEvents ?? 0}
      />

      {/* ✅ Charts Row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* ✅ Row 1 - Left: Stock Condition (1 column) */}
        <Box sx={{ gridColumn: "span 1" }}>
          <DonutChart
            low={data.lowStockItems.length}
            total={data.totalMaterials}
          />
        </Box>

        {/* ✅ Row 1 - Right: Monthly Chart (4 columns) */}
        <Box sx={{ gridColumn: "span 4" }}>
          <BarChartSection
            monthlyReceive={data.monthlyReceive}
            monthlyWithdraw={data.monthlyWithdraw}
          />
        </Box>

        {/* ✅ Row 2 - Latest Materials (2 columns) */}
        <Box sx={{ gridColumn: "span 2" }}>
          <LatestMaterials materials={data.latestMaterials} />
        </Box>

        {/* ✅ Row 2 - Low Stock List (3 columns) */}
        <Box sx={{ gridColumn: "span 3" }}>
          <LowStockSection items={data.lowStockItems ?? []} />
        </Box>
      </Box>

      {/* ✅ Low Stock List */}

      {/* ✅ Quick Buttons */}
      <QuickActions />
    </Box>
  );
}
