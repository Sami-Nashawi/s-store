"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarChartSection({
  monthlyReceive,
  monthlyWithdraw,
}: {
  monthlyReceive: number[];
  monthlyWithdraw: number[];
}) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const data = months.map((m, i) => ({
    name: m,
    Receive: monthlyReceive[i] || 0,
    Withdraw: monthlyWithdraw[i] || 0,
  }));

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <CardContent>
        <Typography fontWeight="bold" mb={1}>
          Monthly Receive / Withdraw
        </Typography>

        <Box sx={{ width: "100%", height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Receive" fill="#4CAF50" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Withdraw" fill="#d32f2f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
