import { Box, Typography } from "@mui/material";
import UsersTable from "@/components/UsersTable";
import { apiFetch } from "@/lib/apiFetch";

export const metadata = {
  title: "Users",
  description: "Users list for showing the details of the users in the system",
};
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
