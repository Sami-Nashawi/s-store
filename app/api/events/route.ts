// app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getUser } from "@/lib/getUser";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: Request) {
  const user: any = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { materialId, type, quantity, note } = body;
  console.log("Creating event:", body);
  try {
    const event = await prisma.event.create({
      data: {
        type,
        quantity,
        note,
        userId: user?.userId,
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

    return NextResponse.json(event);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
