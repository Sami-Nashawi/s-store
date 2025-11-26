import LayoutClient from "@/components/LayoutClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import MuiThemeRegistry from "@/providers/MuiThemeRegistry";
import { apiFetch } from "@/lib/apiFetch";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie: any = await cookies();
  const token = cookie.get("token")?.value || null;
  let user: User | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as User;
      const data = await apiFetch("users/me");
      if (data.error) {
        redirect("/login");
      }
      user = { ...decoded, ...data.user };
    } catch {
      redirect("/login");
    }
  }
  return (
    <MuiThemeRegistry>
      <LayoutClient user={user}>{children}</LayoutClient>
    </MuiThemeRegistry>
  );
}
