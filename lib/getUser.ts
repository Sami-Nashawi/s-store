// app/api/materials/[id]/route.ts
import { getToken } from "./getToken";

export async function getUser(req: Request) {
  const token = getToken(req);
  if (!token) return null;
  const user = await prisma?.user.findUnique({
    where: { id: Number(token?.userId) },
  });

  return user;
}
