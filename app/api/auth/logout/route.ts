import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "" });

  // Clear cookie
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0), // Expire immediately
    path: "/",
  });

  return res;
}
