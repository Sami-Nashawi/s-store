import { Paper } from "@mui/material";

export default function SectionCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        width: "100%",
        background: "white",
      }}
    >
      {children}
    </Paper>
  );
}
