import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await the params
  const material = await prisma.material.findUnique({
    where: { id: Number(id) },
    include: {
      events: {
        include: { user: true },
      },
    },
  });

  if (!material) {
    return new Response(JSON.stringify({ message: "Material not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(material), { status: 200 });
}
