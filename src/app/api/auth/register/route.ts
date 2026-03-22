import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, referralCode } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let referrer: { id: string; referralCode: string } | null = null;
    const rawCode = typeof referralCode === "string" ? referralCode.trim() : "";
    if (rawCode) {
      referrer =
        (await prisma.user.findUnique({
          where: { referralCode: rawCode },
          select: { id: true, referralCode: true },
        })) ??
        (await prisma.user.findUnique({
          where: { referralCode: rawCode.toUpperCase() },
          select: { id: true, referralCode: true },
        }));
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referralCode: nanoid(8).toUpperCase(),
        /* FK ชี้ไปที่ users.referralCode ไม่ใช่ user id */
        referredBy: referrer?.referralCode ?? null,
      },
    });

    if (referrer) {
      await prisma.user.update({
        where: { id: referrer.id },
        data: { referralCount: { increment: 1 } },
      });

      await prisma.notification.create({
        data: {
          userId: referrer.id,
          type: "REFERRAL",
          title: "มีคนแนะนำใหม่!",
          message: `มีผู้ใช้ใหม่ลงทะเบียนโดยใช้รหัสแนะนำของคุณ`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลงทะเบียน" },
      { status: 500 }
    );
  }
}
