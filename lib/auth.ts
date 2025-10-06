// lib/auth.ts
import { prisma } from "./prisma";
// If you have generated types from Prisma, import from the correct path:
// import type { User } from "./prisma"; // Update this path if your User type is exported elsewhere

// Or, if you don't have a User type, define it manually:
export type User = {
  id: string;
  // Add other fields as needed
};
import { NextResponse } from "next/server";

export async function getUserFromRequest(req: Request): Promise<User | null> {
  const userId = req.headers.get("x-user-id");
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export function requireUser(user: User | null) {
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
