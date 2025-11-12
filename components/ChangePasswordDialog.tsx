"use client";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useState } from "react";
import { apiClientFetch } from "@/lib/apiClientFetch";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordDialog({ open, onClose }: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isTooShort = newPassword.length > 0 && newPassword.length < 8;
  const isNotMatching =
    repeatPassword.length > 0 && newPassword !== repeatPassword;

  const isInvalid =
    !newPassword || !repeatPassword || isTooShort || isNotMatching;

  const handleSave = async () => {
    if (isInvalid) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await apiClientFetch("auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (res?.success) {
        setMessage("✅ Your password has been updated successfully.");
        setNewPassword("");
        setRepeatPassword("");
        setTimeout(() => onClose(), 1500);
      } else {
        setError(res?.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setNewPassword("");
    setRepeatPassword("");
    setError(null);
    setMessage(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight="bold">Change Password</DialogTitle>

      <DialogContent>
        <Typography color="text.secondary" mb={2}>
          Please set a strong password. It must contain at least 8 characters.
        </Typography>

        <TextField
          type="password"
          label="New Password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="dense"
          error={isTooShort}
          helperText={
            isTooShort ? "Password must be at least 8 characters." : ""
          }
        />

        <TextField
          type="password"
          label="Repeat New Password"
          fullWidth
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          margin="dense"
          error={isNotMatching}
          helperText={isNotMatching ? "Passwords do not match." : ""}
        />

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
        {message && (
          <Typography color="success.main" mt={2}>
            {message}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isInvalid || loading}
          variant="contained"
        >
          {loading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={18} /> Saving...
            </Box>
          ) : (
            "Save"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
