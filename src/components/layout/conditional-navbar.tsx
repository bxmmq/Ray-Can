"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";

/** ไม่แสดง Navbar หลักบนหน้า admin — ใช้แค่ AdminNavbar เพื่อไม่ให้เมนูซ้ำ */
export function ConditionalNavbar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return <Navbar />;
}
