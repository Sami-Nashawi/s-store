import LayoutClient from "@/components/LayoutClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export const metadata = {
  title: "My App",
  description: "A simple MUI + Next.js layout",
};
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
      user = decoded;
    } catch {
      user = null;
    }
  }
  // if (!user) redirect('/login');
  return (
    <html lang="en">
      <body>
        <LayoutClient user={user}>{children}</LayoutClient>
      </body>
    </html>
  );
}
