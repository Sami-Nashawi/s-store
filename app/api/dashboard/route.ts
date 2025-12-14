import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import { ROLE_PERMISSIONS } from "@/shared/roles-permissions";

export async function GET(req: Request) {
  const user: any = await getUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized Action" }, { status: 401 });
  }

  const canAccess = ROLE_PERMISSIONS[user.role.name]?.includes("dashboard");
  if (!canAccess) {
    return NextResponse.json(
      { error: "You do not have permission to view the dashboard" },
      { status: 403 }
    );
  }

  try {
    // ✅ 1. Total materials
    const totalMaterials = await prisma.material.count();

    // ✅ 2. Low stock items (minStock based)
    const lowStockItems = await prisma.$queryRaw<any[]>`
      SELECT *
      FROM "Material"
      WHERE "minStock" IS NOT NULL
      AND "quantity" <= "minStock"
      ORDER BY "quantity" ASC
      LIMIT 10
    `;

    // ✅ 3. Latest materials
    const latestMaterials = await prisma.material.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    // ✅ 4. Monthly chart
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    const events = await prisma.event.findMany({
      where: { createdAt: { gte: yearStart } },
      select: {
        type: true,
        quantity: true,
        createdAt: true,
      },
    });

    const monthlyReceive = Array(12).fill(0);
    const monthlyWithdraw = Array(12).fill(0);

    events.forEach((e) => {
      const month = new Date(e.createdAt).getMonth();
      if (e.type === "RECEIVE") monthlyReceive[month] += e.quantity;
      if (e.type === "WITHDRAW") monthlyWithdraw[month] += e.quantity;
    });

    // ✅ 5. Recent events
    const monthStart = new Date(currentYear, now.getMonth(), 1);
    const recentEvents = await prisma.event.count({
      where: { createdAt: { gte: monthStart } },
    });
    console.log("low stock items", lowStockItems);
    return NextResponse.json({
      totalMaterials,
      lowStockItems,
      latestMaterials,
      recentEvents,
      monthlyReceive,
      monthlyWithdraw,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to load dashboard",
        details: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
