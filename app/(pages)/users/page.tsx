import { Box, Typography } from "@mui/material";
import UsersTable from "@/components/UsersTable";
import { apiFetch } from "@/lib/apiFetch";

export default async function UsersPage() {
  const data = await apiFetch(`users?page=0&pageSize=20`, {
    credentials: "include",
  });
  return (
    <Box>
      <UsersTable data={data} />
    </Box>
  );
}
