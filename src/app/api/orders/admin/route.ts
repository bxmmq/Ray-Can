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

    if (type === "orders") {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true, plan: true },
      });
      return NextResponse.json({ orders });
    }

    if (type === "users") {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { orders: true } } },
      });
      return NextResponse.json({ users });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { user: true, plan: true },
    });

    if (status === "ACTIVE") {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + order.plan.days);

      await prisma.order.update({
        where: { id },
        data: { startDate, endDate },
      });

      await prisma.notification.create({
        data: {
          userId: order.userId,
          type: "ORDER_APPROVED",
          title: "คำสั่งซื้อได้รับการอนุมัติ!",
          message: `Canva Pro ${order.plan.name} ของคุณพร้อมใช้งานแล้ว`,
        },
      });

      const referral = await prisma.referral.findUnique({
        where: { orderId: id },
      });

      if (referral && referral.status === "PENDING") {
        await prisma.referral.update({
          where: { id: referral.id },
          data: { status: "COMPLETED", reward: 50 },
        });

        await prisma.user.update({
          where: { id: referral.referrerId },
          data: { referralCount: { increment: 1 } },
        });

        await prisma.notification.create({
          data: {
            userId: referral.referrerId,
            type: "REFERRAL_REWARD",
            title: "ได้รับรางวัลแนะนำ!",
            message: `คุณได้รับรางวัล 50 บาทจากการแนะนำเพื่อน`,
          },
        });
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
