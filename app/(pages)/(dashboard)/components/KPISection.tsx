"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import UpdateIcon from "@mui/icons-material/Update";

export default function KPISection({
  totalMaterials,
  lowStockCount,
  recentUpdates,
}: {
  totalMaterials: number;
  lowStockCount: number;
  recentUpdates: number;
}) {
  const items = [
    {
      label: "Total Materials",
      value: totalMaterials,
      icon: <InventoryIcon fontSize="large" />,
    },
    {
      label: "Low Stock Materials",
      value: lowStockCount,
      icon: <WarningIcon fontSize="large" />,
    },
    {
      label: "Recent Updates",
      value: recentUpdates,
      icon: <UpdateIcon fontSize="large" />,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 3,
      }}
    >
      {items.map((item) => (
        <Card
          key={item.label}
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            flex: 1,
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {item.icon}
            <Box>
              <Typography fontSize={28} fontWeight="bold">
                {item.value}
              </Typography>
              <Typography color="text.secondary">{item.label}</Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
