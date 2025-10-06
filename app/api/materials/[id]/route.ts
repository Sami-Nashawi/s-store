// app/api/materials/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const material = await prisma.material.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: "desc" }, include: { user: true } } },
  });
  if (!material) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(material);
}
