import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ROLE_PERMISSIONS } from "./shared/roles-permissions";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Your permission list (key = role, value = allowed pages)

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Not logged in → go to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role: any = payload.role as keyof typeof ROLE_PERMISSIONS;
    // If role invalid → logout
    if (!role || !ROLE_PERMISSIONS[role]) {
      // return NextResponse.redirect(new URL("/login", req.url));
    }

    const path = req.nextUrl.pathname.replace("/", ""); // e.g. "/materials" → "materials"

    // Dashboard redirect to home page
    const normalizedPath = path === "" ? "dashboard" : path;

    const allowedPages = ROLE_PERMISSIONS[role.name];

    // Page allowed?
    const isAllowed = allowedPages.some((p) => normalizedPath.startsWith(p));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware to protected routes
export const config = {
  matcher: [
    "/materials/:path*",
    "/addMaterial/:path*",
    "/updateMaterial/:path*",
    "/users/:path*",
    "/",
  ],
};
