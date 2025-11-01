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
    <Box sx={{ p: 3, mx: "auto" }}>
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
          gap: 3,
          mt: 3,
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
        }}
      >
        <DonutChart
          low={data.lowStockItems?.length ?? 0}
          total={data.totalMaterials ?? 0}
        />

        <BarChartSection
          monthlyReceive={data.monthlyReceive}
          monthlyWithdraw={data.monthlyWithdraw}
        />

        <LatestMaterials materials={data.latestMaterials ?? []} />
      </Box>

      {/* ✅ Low Stock List */}
      <LowStockSection items={data.lowStockItems ?? []} />

      {/* ✅ Quick Buttons */}
      <QuickActions />
    </Box>
  );
}
