import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const [orders, users] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true, plan: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { orders: true } } },
      }),
    ]);

    if (type === "orders") {
      return NextResponse.json({ orders });
    }

    if (type === "users") {
      return NextResponse.json({ users });
    }

    const [
      totalOrders,
      activeOrders,
      pendingOrders,
      totalUsers,
      totalReferrals,
      orderStatusDistribution,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "ACTIVE" } }),
      prisma.order.count({ where: { status: { in: ["PENDING", "VERIFYING"] } } }),
      prisma.user.count(),
      prisma.referral.count(),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    const activeOrdersData = await prisma.order.findMany({
      where: { status: "ACTIVE" },
      select: { plan: { select: { price: true } } },
    });
    const totalRevenue = activeOrdersData.reduce((sum, o) => sum + (o.plan?.price || 0), 0);

    const recentOrders = orders.slice(0, 10);

    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      const dayOrders = orders.filter(
        (o) => o.status === "ACTIVE" && o.createdAt.toDateString() === date.toDateString()
      );
      return {
        date: date.toLocaleDateString("th-TH", { weekday: "short", day: "numeric" }),
        revenue: dayOrders.reduce((sum, o) => sum + o.plan.price, 0),
      };
    });

    const revenueByPlan = await prisma.plan.findMany({
      include: {
        orders: { where: { status: "ACTIVE" }, select: { id: true } },
      },
    });

    const dailyNewUsers = Array.from({ length: 7 }, async (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
          },
        },
      });
      return {
        date: date.toLocaleDateString("th-TH", { weekday: "short", day: "numeric" }),
        users: count,
      };
    });
    const newUsersData = await Promise.all(dailyNewUsers);

    return NextResponse.json({
      stats: {
        totalOrders,
        activeOrders,
        pendingOrders,
        totalRevenue,
        totalUsers,
        totalReferrals,
      },
      recentOrders,
      chartData,
      orderStatusDistribution: orderStatusDistribution.map((s) => ({
        name: s.status,
        value: s._count,
      })),
      revenueByPlan: revenueByPlan.map((p) => ({
        name: p.name,
        revenue: p.orders.length * p.price,
      })),
      dailyNewUsers: newUsersData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
