"use client";

import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { apiClientFetch } from "@/lib/apiClientFetch";

type Props = {
  open: boolean;
  onClose: () => void;
  onUserAdded: (user: any) => void;
};

export default function AddUserDialog({ open, onClose, onUserAdded }: Props) {
  const [form, setForm] = useState({ fileNo: "", name: "", role: "WORKER" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddUser() {
    setError("");
    setLoading(true);

    try {
      const data = await apiClientFetch(`users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileNo: Number(form.fileNo),
          name: form.name,
          role: form.role,
        }),
        credentials: "include",
      });

      if (!data.id) {
        setError(data.error || "Failed to add user");
        setLoading(false);
        return;
      }

      onUserAdded(data); // pass full response
      handleClose();
    } catch (err) {
      console.error("❌ Error adding user:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    onClose();
    setForm({ fileNo: "", name: "", role: "WORKER" });
    setError("");
    setLoading(false);
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>➕ Add User</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="File No"
          type="number"
          required
          value={form.fileNo}
          onChange={(e) => setForm({ ...form, fileNo: e.target.value })}
          error={!!error}
          helperText={error}
          fullWidth
          sx={{ mt: 1 }}
        />
        <TextField
          label="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          fullWidth
        />
        <TextField
          select
          label="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          fullWidth
        >
          <MenuItem value="WORKER">Worker</MenuItem>
          <MenuItem value="MANAGER">Manager</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions sx={{ padding: "0 25px 25px 0" }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleAddUser}
          variant="contained"
          disabled={!form.fileNo || !form.name || loading}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : null
          }
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
