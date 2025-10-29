// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getUser } from "@/lib/getUser";

// Schema (no password field required anymore)
const CreateUserSchema = z.object({
  fileNo: z.number().min(1),
  name: z.string().min(1),
  role: z.enum(["MANAGER", "WORKER"]).optional(),
});

export async function GET(req: Request) {
  const user: any = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "0", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);

    const [rows, total] = await Promise.all([
      prisma.user.findMany({
        skip: page * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fileNo: true,
          name: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
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

export async function POST(req: Request) {
  const user: any = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CreateUserSchema.parse(body);

    // Check if fileNo already exists
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

    const user = await prisma.user.create({
      data: {
        fileNo: parsed.fileNo,
        name: parsed.name,
        password: hashedPassword,
        role: parsed.role ?? "WORKER",
      },
    });

    return NextResponse.json({
      id: user.id,
      fileNo: user.fileNo,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      message: `New user "${user.name}" was added successfully!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Invalid request" },
      { status: 400 }
    );
  }
}
