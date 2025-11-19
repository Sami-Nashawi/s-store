"use client";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@prisma/client";
import { ROLE_PERMISSIONS } from "@/shared/roles-permissions";

const drawerWidth = 240;

// 🚀 NEW Role-based permissions table

export default function Sidebar({
  user,
  open,
  onClose,
}: {
  user: any;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    {
      id: "dashboard",
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
    },
    {
      id: "materials",
      text: "Materials",
      icon: <InventoryIcon />,
      path: "/materials",
    },
    {
      id: "addMaterial",
      text: "Add Material",
      icon: <AddIcon />,
      path: "/add-material",
    },
    {
      id: "updateMaterial",
      text: "Update Material",
      icon: <UpdateIcon />,
      path: "/update-material",
    },
    {
      id: "users",
      text: "Users",
      icon: <PeopleIcon />,
      path: "/users",
    },
  ];

  const isActive = (path: string): boolean => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth, overflowX: "hidden" }}>
      <Toolbar />
      <List>
        {menuItems.map((item) => {
          if (!user) return null;

          const allowed = ROLE_PERMISSIONS[user.role.name]?.includes(item.id);
          if (!allowed) return null;

          return (
            <ListItem
              key={item.id}
              component={Link}
              href={item.path}
              onClick={isMobile ? onClose : undefined}
              sx={{
                cursor: "pointer",
                backgroundColor: isActive(item.path) ? "#1876D2" : "",
                color: isActive(item.path) ? "#fff" : "#202020",
                paddingLeft: "28px",
                transition: "all .3s ease",
                "&:hover": {
                  backgroundColor: isActive(item.path)
                    ? "#1565C0"
                    : "rgba(0,0,0,0.04)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? "#fff" : "#202020",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return isMobile ? (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          bgcolor: "grey.100",
          overflowX: "hidden",
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
}
