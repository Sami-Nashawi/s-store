// app/api/materials/[id]/route.ts
import { getToken } from "./getToken";
import { prisma } from "@/lib/prisma";

export async function getUser(req: Request) {
  try {
    const token = getToken(req);
    if (!token) return null;
    const user = await prisma?.user.findUnique({
      where: { id: Number(token?.userId) },
      include: { role: true }, // ⬅️ FETCH THE ROLE NAME
    });
    return user;
  } catch (error) {
    return null;
  }
}
