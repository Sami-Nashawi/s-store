import { NextResponse } from "next/server";

export function checkUser(user: any, req: Request) {
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
