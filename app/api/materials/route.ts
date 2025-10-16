import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function getUserFromRequest(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
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
