export const dynamic = "force-dynamic"; // ✅ prevent build-time prerender error

import { apiFetch } from "@/lib/apiFetch";
import { Box, Typography } from "@mui/material";
import KPISection from "./components/KPISection";
import LowStockSection from "./components/LowStockSection";
import LatestMaterials from "./components/LatestMaterials";
import DonutChart from "./components/DonutChart";
import BarChartSection from "./components/BarChartSection";

export default async function DashboardPage() {
  let data: any = null;

  try {
    data = await apiFetch("dashboard");
    console.log("Dashboard data fetched:", data);
  } catch (error) {
    console.error("Dashboard fetch error:", error);
  }

  // ✅ Safely handle null or error responses
  if (!data || data?.error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">
          ⚠️ Failed to load dashboard data. Please refresh the page or check
          your connection.
        </Typography>
      </Box>
    );
  }

  const totalMaterials = data.totalMaterials ?? 0;
  const lowStockItems = data.lowStockItems ?? [];
  const recentEvents = data.recentEvents ?? 0;
  const monthlyReceive = data.monthlyReceive ?? [];
  const monthlyWithdraw = data.monthlyWithdraw ?? [];
  const latestMaterials = data.latestMaterials ?? [];

  return (
    <Box
      sx={{
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 4 }, // ✅ padding adjusts for small screens
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        textAlign={{ xs: "center", sm: "left" }} // ✅ better on phones
      >
        📊 S-Store Dashboard
      </Typography>

      {/* ✅ KPI Row */}
      <KPISection
        totalMaterials={totalMaterials}
        lowStockCount={lowStockItems.length}
        recentUpdates={recentEvents}
      />

      {/* ✅ Charts Row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // ✅ stacked on phones
            sm: "repeat(2, 1fr)", // two columns on tablets
            md: "repeat(5, 1fr)", // full layout on desktop
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Donut Chart */}
        <Box sx={{ gridColumn: { xs: "span 1", md: "span 1" } }}>
          <DonutChart low={lowStockItems.length} total={totalMaterials} />
        </Box>

        {/* Monthly Bar Chart */}
        <Box sx={{ gridColumn: { xs: "span 1", sm: "span 1", md: "span 4" } }}>
          <BarChartSection
            monthlyReceive={monthlyReceive}
            monthlyWithdraw={monthlyWithdraw}
          />
        </Box>

        {/* Latest Materials */}
        <Box
          sx={{ gridColumn: { xs: "span 1", md: "span 2" }, height: "100%" }}
        >
          <LatestMaterials materials={latestMaterials} />
        </Box>

        {/* Low Stock */}
        <Box
          sx={{ gridColumn: { xs: "span 1", md: "span 3" }, height: "100%" }}
        >
          <LowStockSection items={lowStockItems} />
        </Box>
      </Box>
    </Box>
  );
}
