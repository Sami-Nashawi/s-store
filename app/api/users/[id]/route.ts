import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const adminUser: any = await getUser(req);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  const userId = params.id;

  try {
    // ✅ Check if user has related events
    const hasEvents = await prisma.event.findFirst({
      where: { userId: Number(userId) },
      select: { id: true },
    });

    if (hasEvents) {
      return NextResponse.json(
        {
          error:
            "User cannot be deleted because he has material transactions in the system.",
        },
        { status: 400 }
      );
    }

    // ✅ Safe delete
    await prisma.user.delete({
      where: { id: Number(userId) },
    });

    return NextResponse.json({ message: "User deleted successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to delete user" },
      { status: 500 }
    );
  }
}
