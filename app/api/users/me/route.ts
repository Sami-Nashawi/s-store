import { getUser } from "@/lib/getUser";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const currentUser: any = await getUser(req);
  if (!currentUser) {
    const res = NextResponse.json(
      { error: "Unauthorized Action" },
      { status: 401 }
    );
    return res;
  }
  return NextResponse.json({ user: currentUser }, { status: 200 });
}
