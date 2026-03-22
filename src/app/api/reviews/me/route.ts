import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { REVIEW_ELIGIBLE_STATUSES } from "@/lib/review-eligibility";
import { getPrismaUserIdFromSession } from "@/lib/session-user";

/** ไม่แคช — ข้อมูลต่อผู้ใช้ */
export const dynamic = "force-dynamic";

/** คำสั่งซื้อที่มีสิทธิ์รีวิว + รีวิวของแต่ละรอบ (ถ้ามี) — 1 ออเดอร์ = 1 รีวิว */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getPrismaUserIdFromSession(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
        status: { in: REVIEW_ELIGIBLE_STATUSES },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        plan: { select: { name: true } },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
            title: true,
          },
        },
      },
    });

    const eligibleOrders = orders.map((o) => ({
      orderId: o.id,
      planName: o.plan.name,
      createdAt: o.createdAt.toISOString(),
      review: o.review,
    }));

    return NextResponse.json({
      eligibleOrders,
      /** มีอย่างน้อยหนึ่งคำสั่งซื้อที่เข้าเงื่อนไขรีวิว */
      canReview: eligibleOrders.length > 0,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("GET /api/reviews/me:", error);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? detail
            : "โหลดข้อมูลรีวิวไม่สำเร็จ กรุณาลองใหม่",
      },
      { status: 500 }
    );
  }
}
