import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getUser } from "@/lib/getUser";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const sortField = searchParams.get("sortField") || "id";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const filters = searchParams.get("filters")
    ? JSON.parse(searchParams.get("filters")!)
    : {};

  const where: any = {};

  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue;

    // 👇 You can manually define which fields are numeric
    const numericFields = ["quantity", "unitPrice", "id"];

    if (numericFields.includes(key)) {
      const numberValue = parseFloat(value as string);
      if (!isNaN(numberValue)) {
        where[key] = { equals: numberValue }; // use equals for numbers
      }
    } else {
      // For string fields, we can safely use contains
      where[key] = { contains: value, mode: "insensitive" };
    }
  }

  try {
    const [rows, total] = await Promise.all([
      prisma.material.findMany({
        where,
        skip: page * pageSize,
        take: pageSize,
        orderBy: { [sortField]: sortOrder },
      }),
      prisma.material.count({ where }),
    ]);

    return NextResponse.json({ rows, total });
  } catch (error) {
    console.error("❌ Prisma Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
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
            userId: parseInt(user.id),
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
