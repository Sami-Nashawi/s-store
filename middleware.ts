import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ROLE_PERMISSIONS } from "./shared/roles-permissions";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Not logged in → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role: any = payload.role;

    // No role or invalid → login
    if (!role || !ROLE_PERMISSIONS[role.name]) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const allowedPages = ROLE_PERMISSIONS[role.name];

    // No allowed pages at all → login
    if (!allowedPages || allowedPages.length === 0) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Current path (remove leading slash)
    let path = req.nextUrl.pathname.replace("/", "");
    const normalizedPath = path === "" ? "dashboard" : path;

    // Check if user has permission for current path
    const isAllowed = allowedPages.some((p) => normalizedPath.startsWith(p));

    if (!isAllowed) {
      // Redirect to FIRST allowed page
      const firstAllowed = allowedPages[0];

      if (firstAllowed) {
        return NextResponse.redirect(new URL(`/${firstAllowed}`, req.url));
      }

      // Fallback → login
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Protected routes
export const config = {
  matcher: [
    "/materials/:path*",
    "/addMaterial/:path*",
    "/updateMaterial/:path*",
    "/users/:path*",
    "/",
  ],
};
