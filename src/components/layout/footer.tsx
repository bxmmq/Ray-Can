import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";

const footerLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/plans", label: "แพลน" },
  { href: "/dashboard", label: "แดชบอร์ด" },
  { href: "/referral", label: "แนะนำเพื่อน" },
];

const legalLinks = [
  { href: "/privacy", label: "นโยบายความเป็นส่วนตัว" },
  { href: "/terms", label: "ข้อกำหนดการใช้งาน" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BrandMark />
              <span className="text-xl font-bold gradient-text tracking-wider">Raycast</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md">
              แพลตฟอร์มสำหรับซื้อขาย Canva Pro ด้วยราคาที่เข้าถึงได้ พร้อมระบบแนะนำเพื่อนที่คุ้มค่า
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">ลิงก์</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">ข้อกำหนด</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Raycast. สงวนลิขสิทธิ์
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">ชำระเงินด้วย</span>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-lg font-bold">พร้อมเพย์</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
