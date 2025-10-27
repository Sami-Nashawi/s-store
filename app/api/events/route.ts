// app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req: Request) {
  const user: any = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }
  const body = await req.json();
  const { materialId, type, quantity, note } = body;
  try {
    const event = await prisma.event.create({
      data: {
        type,
        quantity,
        note,
        userId: user?.id,
        materialId: Number(materialId),
      },
      include: { user: true, material: true },
    });
    // Update material quantity
    await prisma.material.update({
      where: { id: Number(materialId) },
      data: {
        quantity: {
          increment: type === "RECEIVE" ? quantity : -quantity,
        },
      },
    });
    return NextResponse.json(
      { ...event, message: "Material Updated Successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
