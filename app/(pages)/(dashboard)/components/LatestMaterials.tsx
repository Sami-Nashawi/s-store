"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";

export default function LatestMaterials({ materials }: { materials: any[] }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        flex: 1,
        minWidth: "350px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <CardContent>
        <Typography fontWeight="bold" mb={1}>
          Latest Materials Added
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {materials.map((m) => (
            <Box
              key={m.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1,
                borderBottom: "1px solid #eee",
              }}
            >
              <Typography>{m.description}</Typography>

              <Typography color="text.secondary" fontSize={14}>
                {m.unit}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
