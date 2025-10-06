// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["MANAGER", "WORKER"]).optional(),
});

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateUserSchema.parse(body);
    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        role: parsed.role ?? "WORKER",
      },
    });
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Invalid request" }, { status: 400 });
  }
}
