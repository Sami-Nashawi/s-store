"use client";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@prisma/client";

const drawerWidth = 240;

export default function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
      role: ["MANAGER"],
    },
    {
      text: "Materials",
      icon: <InventoryIcon />,
      path: "/materials",
      role: ["MANAGER"],
    },
    {
      text: "Add Material",
      icon: <AddIcon />,
      path: "/add-material",
      role: ["MANAGER"],
    },
    {
      text: "Update Material",
      icon: <UpdateIcon />,
      path: "/update-material",
      role: ["WORKER", "MANAGER"],
    },
    { text: "Users", icon: <PeopleIcon />, path: "/users", role: ["MANAGER"] },
  ];

  // ✅ Helper function for route highlighting logic
  const isActive = (path: string): boolean => {
    if (path === "/") return pathname === "/"; // dashboard exact
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "grey.100",
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map(
          (item, index) =>
            user &&
            item.role.includes(user.role) && (
              <ListItem
                key={index}
                component={Link}
                href={item.path}
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  backgroundColor: isActive(item.path) ? "#1876D2" : "",
                  color: isActive(item.path) ? "#fff" : "#202020",
                  transition: "all .3s ease",
                  paddingLeft: "28px",
                  "&:hover": {
                    backgroundColor: isActive(item.path)
                      ? "#1565C0"
                      : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? "#fff" : "#202020",
                    transition: "all .3s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )
        )}
      </List>
    </Drawer>
  );
}
