// app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getUser } from "@/lib/getUser";
import { ROLE_PERMISSIONS } from "@/shared/roles-permissions";

export async function POST(req: Request) {
  const user: any = await getUser(req);

  // 🔐 User not logged in
  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  // 🔐 Permission check → needs "updateMaterial"
  const canUpdate =
    ROLE_PERMISSIONS[user.role.name]?.includes("updateMaterial");

  if (!canUpdate) {
    return NextResponse.json(
      { error: "You do not have permission to update materials" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { materialId, type, quantity, note } = body;

  try {
    // ------------------------------------------
    // 🔍 VALIDATION
    // ------------------------------------------
    if (!materialId || isNaN(Number(materialId))) {
      return NextResponse.json(
        { error: "Invalid material ID. Please select a valid material." },
        { status: 400 }
      );
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than zero." },
        { status: 400 }
      );
    }

    if (type !== "RECEIVE" && type !== "WITHDRAW") {
      return NextResponse.json(
        { error: "Invalid event type." },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // 🔍 MATERIAL EXISTS?
    // ------------------------------------------
    const material = await prisma.material.findUnique({
      where: { id: Number(materialId) },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material not found. Please enter a correct Material ID." },
        { status: 404 }
      );
    }

    // ------------------------------------------
    // ❌ Prevent withdrawing more than stock
    // ------------------------------------------
    if (type === "WITHDRAW" && material.quantity < quantity) {
      return NextResponse.json(
        {
          error: `Cannot withdraw ${quantity}. Only ${material.quantity} in stock.`,
        },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // ✅ CREATE EVENT
    // ------------------------------------------
    const event = await prisma.event.create({
      data: {
        type,
        quantity,
        userId: Number(user.id),
        materialId: Number(materialId),
      },
      include: { user: true, material: true },
    });

    // ------------------------------------------
    // 🔄 UPDATE MATERIAL QUANTITY
    // ------------------------------------------
    await prisma.material.update({
      where: { id: Number(materialId) },
      data: {
        quantity: {
          increment: type === "RECEIVE" ? quantity : -quantity,
        },
      },
    });

    return NextResponse.json(
      { ...event, message: "Material updated successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to create event. Please try again." },
      { status: 500 }
    );
  }
}
