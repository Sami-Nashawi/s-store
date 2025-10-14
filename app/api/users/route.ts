// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

const CreateUserSchema = z.object({
  filNo: z.number().min(1),
  name: z.string().min(1),
  password: z.string().min(8),
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
        fileNo:parsed.filNo,
        name: parsed.name,
        password: parsed.password, // In real app, hash the password
        role: parsed.role ?? "WORKER",  
      },
    });
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Invalid request" }, { status: 400 });
  }
}
