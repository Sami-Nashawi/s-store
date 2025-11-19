import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { ROLE_PERMISSIONS } from "@/shared/roles-permissions";

// --------------------------------------------
// GET MATERIAL WITH PAGINATED EVENTS
// --------------------------------------------
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 🔐 Authenticate User
  const user: any = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  // 🔐 Check permissions → any role that has "materials" access
  const canAccess = ROLE_PERMISSIONS[user.role.name]?.includes("materials");
  if (!canAccess) {
    return NextResponse.json(
      { error: "You do not have permission to view materials" },
      { status: 403 }
    );
  }

  try {
    const { id } = await context.params;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "0");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20");

    // Count total for pagination
    const totalEvents = await prisma.event.count({
      where: { materialId: Number(id) },
    });

    // Fetch material + paginated events
    const material = await prisma.material.findUnique({
      where: { id: Number(id) },
      include: {
        events: {
          skip: page * pageSize,
          take: pageSize,
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...material,
      totalEvents,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load material", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// --------------------------------------------
// DELETE MATERIAL
// Only manager or store keeper should delete
// --------------------------------------------
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 🔐 Authenticate User
  const user: any = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  // 🔐 Check delete permission → same as "updateMaterial" (editing rights)
  const canDelete =
    ROLE_PERMISSIONS[user.role.name]?.includes("updateMaterial");
  if (!canDelete) {
    return NextResponse.json(
      { error: "You do not have permission to delete materials" },
      { status: 403 }
    );
  }

  try {
    const { id } = await context.params;

    // Delete events first
    await prisma.event.deleteMany({
      where: { materialId: Number(id) },
    });

    // Delete material
    await prisma.material.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete material", details: (error as Error).message },
      { status: 500 }
    );
  }
}
