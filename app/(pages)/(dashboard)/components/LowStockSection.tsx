"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { apiClientFetch } from "@/lib/apiClientFetch";
import { useState } from "react";

export default function LowStockSection({ items }: { items: any[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  if (!items.length) return null;

  async function ignoreAlert(materialId: number) {
    setLoadingId(materialId);

    try {
      await apiClientFetch("materials", {
        method: "PATCH",
        body: JSON.stringify({ materialId }),
        headers: { "Content-Type": "application/json" },
      });

      // simple refresh (or lift state later)
      window.location.reload();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        height: "100%",
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
                alignItems: "center",
                gap: 1.5,
                p: 1,
                borderRadius: 1,
                transition: "background 0.2s",
                "&:hover": { backgroundColor: "#fafafa" },
              }}
            >
              {/* Material name */}
              <Typography sx={{ flex: 1, fontWeight: 500 }}>
                {m.description}
              </Typography>

              {/* Quantity */}
              <Chip
                label={`${m.quantity} ${m.unit}`}
                color="error"
                size="small"
                sx={{ fontWeight: "bold" }}
              />

              {/* Ignore Button */}
              <Tooltip title="Ignore stock alert" arrow>
                <span>
                  <IconButton
                    size="small"
                    onClick={() => ignoreAlert(m.id)}
                    disabled={loadingId === m.id}
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        color: "text.primary",
                        backgroundColor: "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    {loadingId === m.id ? (
                      <CircularProgress size={18} />
                    ) : (
                      <NotificationsOffOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
