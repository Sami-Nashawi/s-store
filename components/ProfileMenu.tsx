"use client";

import { useState } from "react";
import {
  Avatar,
  Menu,
  Divider,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { User } from "@prisma/client";

export default function ProfileMenu({ user }: { user: User | null }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login"; // redirect to login
  };

  if (!user) return null;

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ p: 0 }}>
        <Avatar alt={user.name}>{user.name?.charAt(0) ?? "U"}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 280,
            borderRadius: 3,
            boxShadow: 6,
            p: 2,
            bgcolor: "background.paper",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableScrollLock={true}
      >
        {/* Profile Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar alt={user.name} sx={{ width: 64, height: 64, mb: 1 }} />
          <Typography fontWeight="bold" variant="subtitle1">
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            File No: {user.fileNo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          fullWidth
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
        >
          Logout
        </Button>
      </Menu>
    </>
  );
}
