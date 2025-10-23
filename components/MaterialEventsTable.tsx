"use client";

import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

type Event = {
  id: number;
  type: string;
  quantity: number;
  createdAt: string;
  user: { name: string | null };
};

export default function MaterialEventsTable({ events }: { events: Event[] }) {
  if (!events.length) {
    return <Typography>No events yet.</Typography>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Events History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Event Type</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell sx={{ textTransform: "capitalize" }}>
                {event.type}
              </TableCell>
              <TableCell>{event.quantity}</TableCell>
              <TableCell>{event.user?.name || "—"}</TableCell>
              <TableCell>
                {new Date(event.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
