import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  console.log('hello I am from login',req)
    const { fileNo, password } = await req.json();
    console.log('fileNo and password',fileNo,password)
    const user = await prisma.user.findUnique({ where: { fileNo } });
console.log('user',user)
  try {
    const { fileNo, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { fileNo } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate JWT (you can also use cookies/sessions)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ token, role: user.role });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
