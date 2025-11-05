"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DonutChart({
  low,
  total,
}: {
  low: number;
  total: number;
}) {
  const safe = total - low;

  const data = [
    { name: "Safe Stock", value: safe },
    { name: "Low Stock", value: low },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        minWidth: 350,
        flex: 1,
      }}
    >
      <CardContent>
        <Typography fontWeight="bold" mb={1}>
          Stock Condition
        </Typography>

        <Box
          sx={{
            width: "100%",
            height: 260,
          }}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#1976d2" /> {/* healthy */}
                <Cell fill="#d32f2f" /> {/* low stock */}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Typography textAlign="center" color="text.secondary">
          Low stock: {low} / {total}
        </Typography>
      </CardContent>
    </Card>
  );
}
