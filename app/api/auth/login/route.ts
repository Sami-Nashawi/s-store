import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"; // put in .env

export async function POST(req: Request) {
  try {
    const { fileNo, password, rememberMe } = await req.json();

    const user = await prisma.user.findUnique({
      where: { fileNo: Number(fileNo) },
      include: { role: true }, // ⬅️ FETCH THE ROLE NAME
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Token expiry: 1h vs 7d if "remember me"
    const expiresIn = rememberMe ? "7d" : "1h";
    const token = jwt.sign(
      {
        ...user,
        password: null,
        userId: user.id,
        fileNo: user.fileNo,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn }
    );

    // Send token in HttpOnly cookie
    const res = NextResponse.json({
      message: "Login successful",
      user: {
        ...user,
        password: null,
        userId: user.id,
        fileNo: user.fileNo,
        name: user.name,
      },
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined, // 7 days or 1h
      path: "/",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Login failed" },
      { status: 400 }
    );
  }
}
