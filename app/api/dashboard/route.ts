import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_THRESHOLD = 50;

export async function GET() {
  try {
    // ✅ 1. Total materials (always a number)
    const totalMaterials = (await prisma.material.count()) ?? 0;

    // ✅ 2. Low stock items (always array)
    const lowStockItems =
      (await prisma.material.findMany({
        where: { quantity: { lt: LOW_STOCK_THRESHOLD } },
        orderBy: { quantity: "asc" },
        take: 10,
      })) ?? [];

    // ✅ 3. Latest materials (always array)
    const latestMaterials =
      (await prisma.material.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
      })) ?? [];

    // ✅ 4. Monthly chart (always returns 12 slots)
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    yearStart.setHours(0, 0, 0, 0);

    const events =
      (await prisma.event.findMany({
        where: { createdAt: { gte: yearStart } },
        select: {
          type: true,
          quantity: true,
          createdAt: true,
        },
      })) ?? [];

    const monthlyReceive = Array(12).fill(0);
    const monthlyWithdraw = Array(12).fill(0);

    events.forEach((e) => {
      if (!e || !e.createdAt) return; // ✅ protection
      const monthIndex = new Date(e.createdAt).getMonth();
      const qty = e.quantity ?? 0;

      if (e.type === "RECEIVE") monthlyReceive[monthIndex] += qty;
      if (e.type === "WITHDRAW") monthlyWithdraw[monthIndex] += qty;
    });

    // ✅ 5. Recent updates (always a number)
    const monthStart = new Date(currentYear, now.getMonth(), 1);
    const recentEvents =
      (await prisma.event.count({
        where: { createdAt: { gte: monthStart } },
      })) ?? 0;

    // ✅ Always return fully safe structured data
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
