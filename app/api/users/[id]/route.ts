import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const adminUser: any = await getUser(req);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  // ✅ Important: params is a Promise in Next.js type definition
  const { id } = await context.params;
  const userId = Number(id);

  try {
    // ✅ Check if the user has linked events
    // const hasEvents = await prisma.event.findFirst({
    //   where: { userId },
    //   select: { id: true },
    // });

    // if (hasEvents) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         "User cannot be deleted because he has material transactions in the system.",
    //     },
    //     { status: 400 }
    //   );
    // }

    // ✅ Safe delete
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "User deleted successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to delete user" },
      { status: 500 }
    );
  }
}
