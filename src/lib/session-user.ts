import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

/**
 * คืน user id จริงจากตาราง users
 * กันกรณี JWT มี id ไม่ตรงกับ DB (เช่น OAuth / session เก่า) — ใช้อีเมลเป็นทางสำรอง
 */
export async function getPrismaUserIdFromSession(
  session: Session | null
): Promise<string | null> {
  if (!session?.user) return null;

  const rawId =
    typeof session.user.id === "string"
      ? session.user.id.trim()
      : String(session.user.id ?? "").trim();
  if (rawId) {
    const byId = await prisma.user.findUnique({
      where: { id: rawId },
      select: { id: true },
    });
    if (byId) return byId.id;
  }

  const email =
    typeof session.user.email === "string"
      ? session.user.email.trim()
      : String(session.user.email ?? "").trim();
  if (email) {
    const byEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return byEmail?.id ?? null;
  }

  return null;
}
