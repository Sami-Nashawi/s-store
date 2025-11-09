"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function DeleteUserDialog({
  open,
  user,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  user: any;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete User</DialogTitle>

      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          Are you sure you want to delete the user ?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
