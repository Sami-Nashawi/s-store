import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const url = new URL(req.url);
    console.log("Page", url.searchParams.get("page"));
    // ✅ Default: 20 per page
    const page = parseInt(url.searchParams.get("page") || "0");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20");

    // ✅ Fetch total count first (for pagination)
    const totalEvents = await prisma.event.count({
      where: { materialId: Number(id) },
    });

    // ✅ Fetch material with paginated events
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
        { message: "Material not found" },
        { status: 404 }
      );
    }

    // ✅ Return clean JSON response
    return NextResponse.json({
      ...material,
      totalEvents,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch material", error: (error as Error).message },
      { status: 500 }
    );
  }
}
