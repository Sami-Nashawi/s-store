import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "primary.main" }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          🏗️ S Store
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
