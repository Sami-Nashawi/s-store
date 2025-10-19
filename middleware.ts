import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  try {
    // Example role check
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (
      (req.nextUrl.pathname.startsWith("/materials") ||
        req.nextUrl.pathname.startsWith("/users") ||
        req.nextUrl.pathname.startsWith("/add-material") ||
        req.nextUrl.pathname === "/") &&
      payload.role !== "MANAGER"
    ) {
      return NextResponse.redirect(new URL("/update-material", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Protect specific routes
export const config = {
  matcher: [
    "/materials/:path*",
    "/add-material/:path*",
    "/users/:path*",
    "/update-material/:path*",
    "/",
  ],
};
