import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateBodySchema = z.object({
  name: z.string().min(1).optional(),
  days: z.coerce.number().int().min(1).optional(),
  price: z.coerce.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

/** GET single plan — public if active; admin can read any */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth();
    const plan = await prisma.plan.findUnique({ where: { id } });

    if (!plan) {
      return NextResponse.json({ error: "ไม่พบแพลน" }, { status: 404 });
    }

    if (!plan.isActive && session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "ไม่พบแพลน" }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("GET /api/plans/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const json = await request.json();
    const parsed = updateBodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้อง", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, days, price } = parsed.data;
    const data: { name?: string; days?: number; price?: number } = {};
    if (name !== undefined) data.name = name;
    if (days !== undefined) data.days = days;
    if (price !== undefined) data.price = price;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "ไม่มีข้อมูลที่จะอัปเดต" }, { status: 400 });
    }

    const plan = await prisma.plan.update({
      where: { id },
      data,
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("PUT /api/plans/[id]:", error);
    return NextResponse.json({ error: "อัปเดตแพลนไม่สำเร็จ" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const json = await request.json();
    const parsed = updateBodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้อง", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("PATCH /api/plans/[id]:", error);
    return NextResponse.json({ error: "อัปเดตแพลนไม่สำเร็จ" }, { status: 500 });
  }
}

/**
 * ลบแพลน: ถ้าไม่มีออเดอร์อ้างอิง → ลบจาก DB จริง
 * ถ้ามีออเดอร์แล้ว → ปิดใช้งาน (soft) เพื่อไม่ให้ FK พัง
 */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    const orderCount = await prisma.order.count({ where: { planId: id } });

    if (orderCount === 0) {
      await prisma.plan.delete({ where: { id } });
      return NextResponse.json({ ok: true, mode: "deleted" as const });
    }

    const plan = await prisma.plan.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ ok: true, mode: "archived" as const, plan });
  } catch (error) {
    console.error("DELETE /api/plans/[id]:", error);
    return NextResponse.json({ error: "ลบแพลนไม่สำเร็จ" }, { status: 500 });
  }
}
