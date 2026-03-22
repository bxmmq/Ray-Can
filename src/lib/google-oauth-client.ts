import { toast } from "@/stores/toast-store";

/**
 * Google บล็อก OAuth จาก embedded WebView / in-app browser (403 disallowed_useragent)
 * ตรวจจับกรณีที่พบบ่อย: LINE, Facebook, Instagram, TikTok, Android WebView ฯลฯ
 */
export function isGoogleOauthRestrictedEnvironment(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";

  if (/Line\//i.test(ua)) return true;
  if (/FBAN|FBAV|FB_IAB|FBIOS|FBSV/i.test(ua)) return true;
  if (/Instagram/i.test(ua)) return true;
  if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return true;
  if (/Snapchat/i.test(ua)) return true;
  if (/LinkedInApp/i.test(ua)) return true;
  if (/Twitter/i.test(ua) && /Mobile/i.test(ua)) return true;
  // Android System WebView (ไม่ใช่ Chrome แท็บเต็ม)
  if (/Android/i.test(ua) && /; wv\)/i.test(ua)) return true;

  return false;
}

/** คัดลอก URL ปัจจุบัน — ให้ผู้ใช้วางใน Safari/Chrome */
export async function copyPageUrlForExternalBrowser(): Promise<void> {
  if (typeof window === "undefined") return;
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    toast.success("คัดลอกลิงก์แล้ว", "เปิด Safari หรือ Chrome แล้ววางที่แถบที่อยู่ จากนั้นลองล็อกอิน Google อีกครั้ง", 6000);
  } catch {
    toast.info("เปิดในเบราว์เซอร์ภายนอก", `คัดลอกด้วยตนเอง: ${url}`, 8000);
  }
}

/**
 * @returns true ถ้าให้ดำเนินการ signIn ต่อได้, false ถ้าบล็อกแล้วแจ้งผู้ใช้แล้ว
 */
export function assertCanUseGoogleOauth(): boolean {
  if (!isGoogleOauthRestrictedEnvironment()) return true;

  toast.warning(
    "ล็อกอิน Google ใช้ไม่ได้ในเบราว์เซอร์นี้",
    "Google บล็อกการเข้าสู่ระบบจากแอปภายใน (ข้อผิดพลาด 403 disallowed_useragent) — กดปุ่ม «คัดลอกลิงก์» ด้านล่าง หรือเมนู ⋯ แล้วเลือก «เปิดใน Safari / Chrome / เบราว์เซอร์» แล้วลองอีกครั้ง",
    16000
  );
  return false;
}
