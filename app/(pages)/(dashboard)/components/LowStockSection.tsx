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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { apiClientFetch } from "@/lib/apiClientFetch";
import { useState } from "react";

export default function LowStockSection({ items }: { items: any[] }) {
  const [list, setList] = useState(items);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  if (!list.length) return null;

  async function muteAlert(materialId: number) {
    setDialogLoading(true);

    try {
      await apiClientFetch("materials", {
        method: "PATCH",
        body: JSON.stringify({ materialId }),
        headers: { "Content-Type": "application/json" },
      });

      // ✅ Remove item locally
      setList((prev) => prev.filter((m) => m.id !== materialId));
    } finally {
      setDialogLoading(false);
      setConfirmId(null);
    }
  }

  return (
    <>
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
            {list.map((m) => (
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
                <Typography sx={{ flex: 1, fontWeight: 500 }}>
                  {m.description}
                </Typography>

                <Chip
                  label={`${m.quantity} ${m.unit}`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />

                <Tooltip title="Mute stock alert" arrow>
                  <IconButton
                    size="small"
                    onClick={() => setConfirmId(m.id)}
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        color: "text.primary",
                        backgroundColor: "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <NotificationsOffOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* ✅ Confirmation Dialog */}
      <Dialog
        open={confirmId !== null}
        onClose={() => !dialogLoading && setConfirmId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Mute Stock Alert</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This material will no longer appear in the low stock alerts. You can
            not enable alerts again.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmId(null)} disabled={dialogLoading}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => muteAlert(confirmId!)}
            disabled={dialogLoading}
            startIcon={dialogLoading ? <CircularProgress size={18} /> : null}
          >
            {dialogLoading ? "Muting..." : "Mute Alert"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
