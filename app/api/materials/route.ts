// app/api/materials/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

const CreateMaterialSchema = z.object({
  description: z.string().min(1),
  photoUrl: z.string().url().optional(),
  initialQty: z.number().int().nonnegative().optional(),
});

export async function GET() {
  const materials = await prisma.material.findMany({ orderBy: { lastUpdate: "desc" } });
  return NextResponse.json(materials);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateMaterialSchema.parse(body);

    const sku = "MAT-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    // Create material, and if initialQty > 0 create a RECEIVE event in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const material = await tx.material.create({
        data: {
          description: parsed.description,
          sku,
          photoUrl: parsed.photoUrl ?? null,
          totalQty: parsed.initialQty ?? 0,
        },
      });

      if (parsed.initialQty && parsed.initialQty > 0) {
        await tx.event.create({
          data: {
            type: "RECEIVE",
            qty: parsed.initialQty,
            material: {
              connect: { id: material.id }
            },
          },
        });
      }

      return material;
    });

    return NextResponse.json(result);
  } catch (err: any) {
    const msg = err?.message ?? "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
