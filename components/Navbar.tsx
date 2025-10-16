import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import ProfileMenu from "./ProfileMenu";
import { User } from "@prisma/client";
import Image from "next/image";

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
        <div>
          {/* <Image src={"logo.svg"} width={40} height={40} alt="logo" /> */}
          <Typography variant="h6" noWrap>
            S Store
          </Typography>
        </div>

        <Box>
          {/* ✅ Pass user info to client profile menu */}
          <ProfileMenu user={user} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
