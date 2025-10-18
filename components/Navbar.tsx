import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import ProfileMenu from "./ProfileMenu";
import { User } from "@prisma/client";
import Image from "next/image";
import logo from "@/public/logo-text.png";

export default function Navbar({ user }: { user: User | null }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "primary.main",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo + App Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Image
            src={logo} // place logo in public/logo.png
            alt="S Store Logo"
            priority
            width={150}
          />
        </Box>

        {/* Profile menu */}
        <Box>
          <ProfileMenu user={user} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
