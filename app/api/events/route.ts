// app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";

const EventSchema = z.object({
  materialId: z.string().min(1),
  type: z.enum(["RECEIVE", "WITHDRAW"]),
  qty: z.number().int().positive(),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = EventSchema.parse(body);

    // get user (optional) from header
    const user = await getUserFromRequest(req);

    const result = await prisma.$transaction(async (tx: { material: { findUnique: (arg0: { where: { id: string; }; }) => any; update: (arg0: { where: { id: string; }; data: { totalQty: any; }; }) => any; }; event: { create: (arg0: { data: { type: "RECEIVE" | "WITHDRAW"; qty: number; note: string | null; userId: any; materialId: string; }; }) => any; }; }) => {
      const material = await tx.material.findUnique({ where: { id: parsed.materialId } });
      if (!material) throw new Error("Material not found");

      let newQty = material.totalQty;
      if (parsed.type === "RECEIVE") newQty += parsed.qty;
      else newQty -= parsed.qty;

      if (newQty < 0) throw new Error("Insufficient quantity to withdraw");

      const ev = await tx.event.create({
        data: {
          type: parsed.type,
          qty: parsed.qty,
          note: parsed.note ?? null,
          userId: user?.id ?? null,
          materialId: parsed.materialId,
        },
      });

      const updated = await tx.material.update({
        where: { id: parsed.materialId },
        data: { totalQty: newQty },
      });

      return { event: ev, material: updated };
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Invalid request" }, { status: 400 });
  }
}
