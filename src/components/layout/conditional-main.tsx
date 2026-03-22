"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * หน้าเว็บหลักมี Navbar fixed → ต้อง pt-16
 * หน้า admin ไม่มี Navbar หลัก (มีแค่ AdminNavbar ภายใน layout) → ไม่ต้อง pt-16 ที่นี่
 */
export function ConditionalMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main className={cn("flex-1", !isAdmin && "pt-16")}>
      {children}
    </main>
  );
}
