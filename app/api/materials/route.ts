import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getUser } from "@/lib/getUser";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function GET(req: Request) {
  // const user: any = await getUser(req);
  // if (!user) {
  //   return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  // }
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 0);
  const pageSize = Number(searchParams.get("pageSize") || 10);

  const [rows, total] = await Promise.all([
    prisma.material.findMany({
      skip: page * pageSize,
      take: pageSize,
      orderBy: { lastUpdate: "desc" },
    }),
    prisma.material.count(),
  ]);

  return NextResponse.json({ rows, total });
}

// ✅ POST: Add new material

export async function POST(req: Request) {
  const user: any = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  const body = await req.json();
  const { description, quantity, unit, photoUrl } = body;

  try {
    const material = await prisma.material.create({
      data: {
        description,
        quantity,
        unit,
        photoUrl,
        events: {
          create: {
            type: "RECEIVE",
            quantity,
            userId: parseInt(user.userId),
            note: "Initial stock",
          },
        },
      },
      include: { events: true },
    });

    return NextResponse.json(
      { ...material, message: "Material created successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create material" },
      { status: 500 }
    );
  }
}
