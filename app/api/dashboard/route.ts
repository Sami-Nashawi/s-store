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

    // ✅ 3. Latest materials
    const latestMaterials = await prisma.material.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    // ✅ 4. Full 12 months chart for current year
    const now = new Date();
    const currentYear = now.getFullYear();

    const yearStart = new Date(currentYear, 0, 1); // Jan 1
    yearStart.setHours(0, 0, 0, 0);

    // ✅ Fetch all events from this year
    const events = await prisma.event.findMany({
      where: {
        createdAt: { gte: yearStart },
      },
      select: {
        type: true,
        quantity: true,
        createdAt: true,
      },
    });

    // ✅ Initialize 12 slots (Jan → Dec)
    const monthlyReceive = Array(12).fill(0);
    const monthlyWithdraw = Array(12).fill(0);

    // ✅ Fill arrays
    events.forEach((e) => {
      const date = new Date(e.createdAt);
      const monthIndex = date.getMonth(); // 0–11

      if (e.type === "RECEIVE") {
        monthlyReceive[monthIndex] += e.quantity ?? 0;
      } else if (e.type === "WITHDRAW") {
        monthlyWithdraw[monthIndex] += e.quantity ?? 0;
      }
    });

    // ✅ 5. Recent Updates (events this month)
    const monthStart = new Date(currentYear, now.getMonth(), 1);

    const recentEvents = await prisma.event.count({
      where: { createdAt: { gte: monthStart } },
    });
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
      { error: "Failed to load dashboard", details: (err as Error).message },
      { status: 500 }
    );
  }
}
