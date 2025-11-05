"use client";

import { Card, CardContent, Typography, Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import OutboxIcon from "@mui/icons-material/Outbox";
import InventoryIcon from "@mui/icons-material/Inventory";
import Link from "next/link";

export default function QuickActions() {
  const actions = [
    { label: "Add Material", icon: <AddIcon />, href: "/add-materials" },
    { label: "Receive", icon: <MoveToInboxIcon />, href: "/ update-material" },
    { label: "View Materials", icon: <InventoryIcon />, href: "/materials" },
  ];

  return (
    <Grid container spacing={2} mt={4}>
      {actions.map((a) => (
        <Grid key={a.label}>
          <Link href={a.href}>
            <Card
              sx={{
                borderRadius: 3,
                p: 1,
                cursor: "pointer",
                textAlign: "center",
                transition: "0.2s",
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                "&:hover": {
                  transform: "translateY(-3px)",
                },
              }}
            >
              <CardContent>
                <div style={{ fontSize: 40, marginBottom: 8 }}>{a.icon}</div>
                <Typography fontWeight="bold">{a.label}</Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
