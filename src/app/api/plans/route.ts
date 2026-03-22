import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createBodySchema = z.object({
  name: z.string().min(1),
  days: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0),
  isActive: z.boolean().optional().default(true),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    // ร้านค้า: เห็นเฉพาะแพลนที่เปิด
    // แอดมิน: ค่าเริ่มต้นเห็นเฉพาะแพลนที่เปิด (กดลบแล้วหายจากรายการ)
    //         ใส่ ?includeInactive=true เพื่อดูแพลนที่ปิด/เก็บถาวร
    const plans = await prisma.plan.findMany({
      where:
        isAdmin && includeInactive
          ? undefined
          : { isActive: true },
      orderBy: { price: "asc" },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = createBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้อง", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.create({
      data: parsed.data,
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("POST /api/plans:", error);
    return NextResponse.json({ error: "สร้างแพลนไม่สำเร็จ" }, { status: 500 });
  }
}
