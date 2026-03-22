import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * โลโก้ค่าเริ่มต้น: ไฟล์ `public/logo.png` → เปิดในเบราว์เซอร์ที่ `/logo.png`
 * (ไม่มี path แบบ @public/ — alias นั้นใช้ใน import โค้ดไม่ได้สำหรับ URL รูป)
 *
 * NEXT_PUBLIC_* ถูกแทรกตอน `next build` — บน Docker/Railway ถ้าไม่ส่งตอน build ค่าว่าง
 * จึง fallback เป็น `/logo.png` ให้โลโก้ใน public ยังขึ้นหลัง deploy
 */
const fromEnv =
  typeof process.env.NEXT_PUBLIC_BRAND_LOGO_URL === "string"
    ? process.env.NEXT_PUBLIC_BRAND_LOGO_URL.trim()
    : "";
const BRAND_LOGO_URL = fromEnv || "/logo.png";

function isAbsoluteHttpUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

interface BrandMarkProps {
  className?: string;
  /** ข้อความ alt สำหรับรูป (ค่าเริ่มต้น: Raycast) */
  alt?: string;
}

/**
 * ไอคอนแบรนด์ใน navbar/footer — รูปจาก public หรือ URL ภายนอก (ตั้งใน NEXT_PUBLIC_BRAND_LOGO_URL)
 */
export function BrandMark({ className, alt = "Raycast" }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 flex items-center justify-center",
        className
      )}
    >
      {isAbsoluteHttpUrl(BRAND_LOGO_URL) ? (
        /* eslint-disable-next-line @next/next/no-img-element -- โดเมนภายนอกไม่ได้ลงใน remotePatterns ทุกกรณี */
        <img
          src={BRAND_LOGO_URL}
          alt={alt}
          className="w-full h-full object-contain p-0.5"
          width={40}
          height={40}
          loading="eager"
          decoding="async"
        />
      ) : (
        <Image
          src={BRAND_LOGO_URL}
          alt={alt}
          width={40}
          height={40}
          className="object-contain p-0.5"
          priority
        />
      )}
    </div>
  );
}
