import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
  process.env.NEXT_PUBLIC_BASE_URL || "",
  "http://localhost:3000",
  "https://your-production-domain.com",
];

export function cors(req: NextRequest) {
  const origin = req.headers.get("origin");
  // ✅ Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    const res = new NextResponse(null, { status: 204 });
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  }

  // ❌ Not allowed
  return new NextResponse("CORS Not Allowed", { status: 403 });
}
