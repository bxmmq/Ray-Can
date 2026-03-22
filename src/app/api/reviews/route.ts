import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { REVIEW_ELIGIBLE_STATUSES } from "@/lib/review-eligibility";
import { getPrismaUserIdFromSession } from "@/lib/session-user";

/** รายการรีวิวสาธารณะ */
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/reviews:", error);
    return NextResponse.json({ error: "โหลดรีวิวไม่สำเร็จ" }, { status: 500 });
  }
}

function validateBody(body: {
  rating?: unknown;
  comment?: unknown;
  title?: unknown;
}): { rating: number; comment: string; title: string | null } | NextResponse {
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "ให้คะแนน 1–5 ดาว" }, { status: 400 });
  }

  const comment =
    typeof body.comment === "string" ? body.comment.trim() : "";
  if (comment.length < 10) {
    return NextResponse.json({ error: "เขียนรีวิวอย่างน้อย 10 ตัวอักษร" }, { status: 400 });
  }
  if (comment.length > 2000) {
    return NextResponse.json({ error: "รีวิวยาวเกิน 2000 ตัวอักษร" }, { status: 400 });
  }

  let title: string | null = null;
  if (body.title != null && String(body.title).trim() !== "") {
    const t = String(body.title).trim();
    if (t.length > 80) {
      return NextResponse.json({ error: "ชื่อบทบาท/อาชีพยาวเกิน 80 ตัวอักษร" }, { status: 400 });
    }
    title = t;
  }

  return { rating, comment, title };
}

function parseOrderId(body: { orderId?: unknown }): string | NextResponse {
  const id = typeof body.orderId === "string" ? body.orderId.trim() : "";
  if (!id) {
    return NextResponse.json(
      { error: "กรุณาเลือกคำสั่งซื้อที่ต้องการรีวิว" },
      { status: 400 }
    );
  }
  return id;
}

/** สร้างรีวิวสำหรับคำสั่งซื้อหนึ่งรายการ (ล็อกอิน + ออเดอร์ VERIFYING / ACTIVE / EXPIRED + ยังไม่เคยรีวิวรอบนี้) */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const userId = await getPrismaUserIdFromSession(session);
    if (!userId) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const body = await req.json();
    const orderIdRes = parseOrderId(body);
    if (orderIdRes instanceof NextResponse) return orderIdRes;
    const orderId = orderIdRes;

    const parsed = validateBody(body);
    if (parsed instanceof NextResponse) return parsed;
    const { rating, comment, title } = parsed;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: { in: REVIEW_ELIGIBLE_STATUSES },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          error:
            "ไม่พบคำสั่งซื้อนี้ หรือยังไม่มีสิทธิ์รีวิว (ต้องเป็นสถานะ รอตรวจสอบ / ใช้งานอยู่ / ครบระยะเวลา)",
        },
        { status: 403 }
      );
    }

    const existing = await prisma.review.findUnique({
      where: { orderId },
    });
    if (existing) {
      return NextResponse.json(
        { error: "คำสั่งซื้อนี้มีรีวิวแล้ว ใช้การแก้ไขแทน" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId,
        orderId,
        rating,
        comment,
        title,
      },
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("POST /api/reviews:", error);
    return NextResponse.json({ error: "บันทึกรีวิวไม่สำเร็จ" }, { status: 500 });
  }
}

/** แก้ไขรีวิวของคำสั่งซื้อหนึ่งรายการ (ของตัวเอง) */
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const userId = await getPrismaUserIdFromSession(session);
    if (!userId) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const body = await req.json();
    const orderIdRes = parseOrderId(body);
    if (orderIdRes instanceof NextResponse) return orderIdRes;
    const orderId = orderIdRes;

    const parsed = validateBody(body);
    if (parsed instanceof NextResponse) return parsed;
    const { rating, comment, title } = parsed;

    const existing = await prisma.review.findFirst({
      where: { orderId, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "ยังไม่มีรีวิวสำหรับคำสั่งซื้อนี้" }, { status: 404 });
    }

    const review = await prisma.review.update({
      where: { orderId },
      data: { rating, comment, title },
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("PATCH /api/reviews:", error);
    return NextResponse.json({ error: "อัปเดตรีวิวไม่สำเร็จ" }, { status: 500 });
  }
}
