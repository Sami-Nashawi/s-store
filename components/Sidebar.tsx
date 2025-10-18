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
import UpdateIcon from "@mui/icons-material/Update"; // new icon
import Link from "next/link";
import { usePathname } from "next/navigation";

const drawerWidth = 240;

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Materials", icon: <InventoryIcon />, path: "/materials" },
    { text: "Add Material", icon: <AddIcon />, path: "/add-material" },
    { text: "Update Material", icon: <UpdateIcon />, path: "/update-material" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
  ];

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
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            component={Link}
            href={item.path}
            sx={{
              cursor: "pointer",
              textDecoration: "none",
              backgroundColor: pathname == item.path ? "#1876D2" : "",
              color: pathname == item.path ? "#fff" : "#202020",
              transition: "all .3s ease",
              paddingLeft: "28px",
            }}
            accessKey=""
          >
            <ListItemIcon
              style={{
                color: pathname == item.path ? "#fff" : "#202020",
                transition: "all .3s ease",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
