"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { GlassButton } from "@/components/ui/glass-button";
import { Avatar } from "@/components/ui/avatar";
import { BrandMark } from "@/components/layout/brand-mark";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/plans", label: "แพลน" },
  { href: "/dashboard", label: "แดชบอร์ด" },
  { href: "/referral", label: "แนะนำเพื่อน" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark />
            <span className="text-xl font-bold gradient-text tracking-wider">Raycast</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300 hover:text-violet-400",
                  pathname === link.href ? "text-violet-400" : "text-gray-300"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Avatar
                    src={session.user?.image}
                    fallback={session.user?.name || session.user?.email || "U"}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-gray-300">{session.user?.name}</span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 glass-card p-2"
                    >
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        แดชบอร์ด
                      </Link>
                      {session.user?.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          จัดการระบบ
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        ออกจากระบบ
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <GlassButton variant="ghost" size="sm">เข้าสู่ระบบ</GlassButton>
                </Link>
                <Link href="/register">
                  <GlassButton size="sm">ลงทะเบียน</GlassButton>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            className="md:hidden p-3 -mr-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* เมนูมือถือ: เต็มพื้นที่ใต้แถบหัว + พื้นหลังทึบ + backdrop — ไม่ทับเนื้อหาแบบโปร่งใส */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-hidden
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 z-[90] bg-black/70 backdrop-blur-md md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="เมนูนำทาง"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="fixed left-0 right-0 top-16 bottom-0 z-[95] flex flex-col md:hidden bg-[#0a0a0a] border-t border-white/10 shadow-[0_8px_48px_rgba(0,0,0,0.85)]"
            >
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-6">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center min-h-[48px] px-4 rounded-xl text-base font-medium transition-colors active:scale-[0.99]",
                        pathname === link.href
                          ? "text-white bg-violet-500/25 border border-violet-500/40"
                          : "text-gray-200 hover:bg-white/10 border border-transparent"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="shrink-0 border-t border-white/10 bg-[#0a0a0a]/95 px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-3">
                {session ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block">
                      <GlassButton variant="ghost" className="w-full min-h-[48px]">
                        แดชบอร์ด
                      </GlassButton>
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block">
                        <GlassButton variant="ghost" className="w-full min-h-[48px]">
                          จัดการระบบ
                        </GlassButton>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut();
                      }}
                      className="w-full min-h-[48px] rounded-xl text-base font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20"
                    >
                      ออกจากระบบ
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block">
                      <GlassButton variant="outline" className="w-full min-h-[48px]">
                        เข้าสู่ระบบ
                      </GlassButton>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="block">
                      <GlassButton className="w-full min-h-[48px]">
                        ลงทะเบียน
                      </GlassButton>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
