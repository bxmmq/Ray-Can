import { cn } from "@/lib/utils";

/** ใส่ URL รูปโลโก้ใน .env: NEXT_PUBLIC_BRAND_LOGO_URL="/logo.png" หรือลิงก์ภายนอก */
const BRAND_LOGO_URL =
  typeof process.env.NEXT_PUBLIC_BRAND_LOGO_URL === "string"
    ? process.env.NEXT_PUBLIC_BRAND_LOGO_URL.trim()
    : "";

interface BrandMarkProps {
  className?: string;
  /** ข้อความ alt สำหรับรูป (ค่าเริ่มต้น: Raycast) */
  alt?: string;
}

/**
 * ไอคอนแบรนด์ใน navbar/footer — ถ้ามี NEXT_PUBLIC_BRAND_LOGO_URL จะแสดงรูปนั้น
 * ไม่มีค่า env จะใช้ตัวอักษร R บนพื้น gradient เหมือนเดิม
 */
export function BrandMark({ className, alt = "Raycast" }: BrandMarkProps) {
  if (BRAND_LOGO_URL) {
    return (
      <div
        className={cn(
          "w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 flex items-center justify-center",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- URL จากผู้ใช้ (local หรือภายนอก) */}
        <img
          src={BRAND_LOGO_URL}
          alt={alt}
          className="w-full h-full object-cover"
          width={40}
          height={40}
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center",
        className
      )}
    >
      <span className="text-white font-bold text-xl">R</span>
    </div>
  );
}
