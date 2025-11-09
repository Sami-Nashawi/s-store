// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getUser } from "@/lib/getUser";

// ✅ Schema for creating a user
const CreateUserSchema = z.object({
  fileNo: z.number().min(1),
  name: z.string().min(1),
  role: z.enum(["MANAGER", "WORKER"]).optional(),
});

export async function GET(req: Request) {
  const currentUser: any = await getUser(req);
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") ?? "0", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);

    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const filters = searchParams.get("filters")
      ? JSON.parse(searchParams.get("filters")!)
      : {};

    const where: any = {};

    const numericFields = ["fileNo"];

    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue;
      const val = String(value).trim();

      // ✅ Numeric fields
      if (numericFields.includes(key)) {
        const numValue = parseInt(val);
        if (!isNaN(numValue)) where[key] = { equals: numValue };
        continue;
      }

      // ✅ Special ENUM handling for "role"
      if (key === "role") {
        const roles = ["MANAGER", "WORKER"];
        const matchedRoles = roles.filter((r) =>
          r.toLowerCase().includes(val.toLowerCase())
        );

        if (matchedRoles.length > 0) {
          where.role = { in: matchedRoles };
        }
        continue;
      }

      // ✅ Regular string "contains" filter for name
      where[key] = { contains: val, mode: "insensitive" };
    }

    const [rows, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: page * pageSize,
        take: pageSize,
        orderBy: { [sortField]: sortOrder },
        select: {
          id: true,
          fileNo: true,
          name: true,
          role: true,
          createdAt: true,
        },
      }),

      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ rows, total });
  } catch (err: any) {
    console.error("❌ Error fetching users:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ✅ POST — Create User
export async function POST(req: Request) {
  const currentUser: any = await getUser(req);
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CreateUserSchema.parse(body);

    // ✅ Check if fileNo already exists
    const existing = await prisma.user.findUnique({
      where: { fileNo: parsed.fileNo },
    });

    if (existing) {
      return NextResponse.json(
        { error: "File number already exists" },
        { status: 400 }
      );
    }

    const defaultPassword = "abcd@1234";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        fileNo: parsed.fileNo,
        name: parsed.name,
        password: hashedPassword,
        role: parsed.role ?? "WORKER",
      },
    });

    return NextResponse.json({
      id: newUser.id,
      fileNo: newUser.fileNo,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt,
      message: `New user "${newUser.name}" was added successfully!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Invalid request" },
      { status: 400 }
    );
  }
}
