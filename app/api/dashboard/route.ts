import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_THRESHOLD = 50;

export async function GET() {
  try {
    // ✅ 1. Total materials
    const totalMaterials = await prisma.material.count();

    // ✅ 2. Low stock
    const lowStockItems = await prisma.material.findMany({
      where: { quantity: { lt: LOW_STOCK_THRESHOLD } },
      orderBy: { quantity: "asc" },
      take: 10,
    });

    // ✅ 3. Latest materials (keep)
    const latestMaterials = await prisma.material.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    // ✅ 4. Monthly receive/withdraw chart
    const windowStart = new Date();
    windowStart.setMonth(windowStart.getMonth() - 5);
    windowStart.setDate(1);
    windowStart.setHours(0, 0, 0, 0);

    const receiveEvents = await prisma.event.findMany({
      where: { type: "RECEIVE", createdAt: { gte: windowStart } },
      select: { quantity: true, createdAt: true },
    });

    const withdrawEvents = await prisma.event.findMany({
      where: { type: "WITHDRAW", createdAt: { gte: windowStart } },
      select: { quantity: true, createdAt: true },
    });

    const receiveArr = Array(6).fill(0);
    const withdrawArr = Array(6).fill(0);

    const startYear = windowStart.getFullYear();
    const startMonth = windowStart.getMonth();

    const monthIndex = (d: Date) =>
      (d.getFullYear() - startYear) * 12 + (d.getMonth() - startMonth);

    receiveEvents.forEach((e) => {
      const idx = monthIndex(new Date(e.createdAt));
      if (idx >= 0 && idx < 6) receiveArr[idx] += e.quantity ?? 0;
    });

    withdrawEvents.forEach((e) => {
      const idx = monthIndex(new Date(e.createdAt));
      if (idx >= 0 && idx < 6) withdrawArr[idx] += e.quantity ?? 0;
    });

    // ✅ NEW: 5. Recent Updates (all events in this month)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const recentEvents = await prisma.event.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    });
    console.log("month start", monthStart, "recent events", recentEvents);
    return NextResponse.json({
      totalMaterials,
      lowStockItems,
      latestMaterials,
      recentEvents, // ✅ NEW
      monthlyReceive: receiveArr,
      monthlyWithdraw: withdrawArr,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load dashboard", details: (err as Error).message },
      { status: 500 }
    );
  }
}
