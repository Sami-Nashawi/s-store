"use client";

import { Card, CardContent, Typography, Box, Chip } from "@mui/material";

export default function LowStockSection({ items }: { items: any[] }) {
  if (!items.length) return null;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <Typography fontWeight="bold" mb={2}>
          Low Stock Materials
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {items.map((m) => (
            <Box
              key={m.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                borderBottom: "1px solid #eee",
              }}
            >
              <Typography>{m.description}</Typography>

              <Chip
                label={`${m.quantity} ${m.unit}`}
                color="error"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
