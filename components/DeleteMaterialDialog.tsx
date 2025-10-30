"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { apiClientFetch } from "@/lib/apiClientFetch";

export default function DeleteMaterialDialog({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const data = await apiClientFetch(`materials/${id}`, {
        method: "DELETE",
      });

      if (data.error) return;

      router.push("/materials");
    } catch (err) {
      console.error("❌ Delete error:", err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  function handleClose() {
    if (!loading) setOpen(false);
  }

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => setOpen(true)}
        sx={{
          minWidth: 45,
          width: 45,
          height: 45,
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(244, 67, 54, 0.4)",
          "&:hover": { backgroundColor: "#d32f2f" },
        }}
      >
        <Delete />
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth disableScrollLock>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          🗑️ Delete Material
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          <Typography>
            Are you sure you want to delete this material? This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ padding: "0 25px 25px 0" }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
