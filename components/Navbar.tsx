"use client";
import { AppBar, Box, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ProfileMenu from "./ProfileMenu";
import { User } from "@prisma/client";
import Image from "next/image";
import logo from "@/public/logo-text.png";
import { useTheme, useMediaQuery } from "@mui/material";

export default function Navbar({
  user,
  onMenuClick,
}: {
  user: User | null;
  onMenuClick?: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "primary.main",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left side: menu icon (mobile) + logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Image
            src={logo}
            alt="S Store Logo"
            priority
            width={isMobile ? 110 : 140}
            style={{ height: "auto" }}
          />
        </Box>

        {/* Right side: Profile menu */}
        <Box>
          <ProfileMenu user={user} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
